#!/usr/bin/env node

/**
 * FlowPay Backend API Test Suite
 * Tests all endpoints to verify functionality
 *
 * Usage: node test-api.js
 */

const ethers = require("ethers");

const BASE_URL = "http://localhost:3000/api";
const TEST_WALLET = new ethers.Wallet(
  "0xe6ed9b087196346d3bd9c8b129f1d1af1bd4829e10a0c65dedded82701744736",
);
const USER_WALLET_ADDRESS = "0x525d7CD035a76BCA5Ad7f9B1EB534fB565974ee6"; // User's actual wallet

let testResults = {
  passed: 0,
  failed: 0,
  tests: [],
};

let authToken = null;
let userId = null;
let testIntentId = null;

// Helper functions
async function makeRequest(method, endpoint, data = null, useAuth = false) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
  };

  if (useAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const text = await response.text();

  let responseData;
  try {
    responseData = JSON.parse(text);
  } catch (e) {
    responseData = text;
  }

  return {
    status: response.status,
    ok: response.ok,
    data: responseData,
  };
}

function logTest(name, passed, details = "") {
  const status = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} - ${name}`);
  if (details) {
    console.log(`   ${details}`);
  }

  testResults.tests.push({ name, passed, details });
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

function logSection(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60) + "\n");
}

// Test suites
async function testAuthEndpoints() {
  logSection("Testing Authentication Endpoints");

  try {
    // Test 1: Get nonce for wallet
    console.log("Test 1: GET /auth/nonce - Get nonce for wallet");
    const nonceResponse = await makeRequest(
      "GET",
      `/auth/nonce?walletAddress=${TEST_WALLET.address}`,
    );

    if (nonceResponse.ok && nonceResponse.data.nonce) {
      logTest("Get Nonce", true, `Nonce: ${nonceResponse.data.nonce}`);

      // Test 2: Sign message and login
      console.log("\nTest 2: POST /auth/login - Sign and login");
      const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonceResponse.data.nonce}`;
      const signature = await TEST_WALLET.signMessage(message);

      const loginResponse = await makeRequest("POST", "/auth/login", {
        walletAddress: TEST_WALLET.address,
        signature: signature,
        message: message,
      });

      if (loginResponse.ok && loginResponse.data.accessToken) {
        authToken = loginResponse.data.accessToken;
        userId = loginResponse.data.user.id;
        logTest("Wallet Login", true, `Token obtained, User ID: ${userId}`);
      } else {
        logTest("Wallet Login", false, JSON.stringify(loginResponse.data));
      }
    } else {
      logTest("Get Nonce", false, JSON.stringify(nonceResponse.data));
    }
  } catch (error) {
    logTest("Auth Tests", false, error.message);
  }
}

async function testUsersEndpoints() {
  logSection("Testing Users Endpoints");

  if (!authToken) {
    logTest("Users Tests", false, "No auth token - skipping");
    return;
  }

  try {
    // Test 1: Get user profile
    console.log("Test 1: GET /users/profile - Get user profile");
    const profileResponse = await makeRequest(
      "GET",
      "/users/profile",
      null,
      true,
    );

    if (profileResponse.ok && profileResponse.data.walletAddress) {
      logTest("Get User Profile", true, `User ID: ${profileResponse.data.id}`);
    } else {
      logTest("Get User Profile", false, JSON.stringify(profileResponse.data));
    }
  } catch (error) {
    logTest("Users Tests", false, error.message);
  }
}

async function testIntentsEndpoints() {
  logSection("Testing Intents Endpoints");

  if (!authToken) {
    logTest("Intents Tests", false, "No auth token - skipping");
    return;
  }

  try {
    // Test 1: Create intent
    console.log("Test 1: POST /intents - Create new intent");
    const createResponse = await makeRequest(
      "POST",
      "/intents",
      {
        name: "Test Payment Intent",
        description: "Automated test intent",
        recipient: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5",
        amount: 10.5,
        token: "USDC",
        tokenAddress: "0xc01efAaF7C5C61bEbFAeb358E1161b537b8bC0e0",
        frequency: "DAILY",
        safetyBuffer: 5.0,
        maxGasPrice: 100000000000,
        timeWindowStart: "09:00",
        timeWindowEnd: "17:00",
      },
      true,
    );

    if (createResponse.ok && createResponse.data.id) {
      testIntentId = createResponse.data.id;
      logTest("Create Intent", true, `Intent ID: ${testIntentId}`);
    } else {
      logTest("Create Intent", false, JSON.stringify(createResponse.data));
    }

    // Test 2: List user intents
    if (testIntentId) {
      console.log("\nTest 2: GET /intents - List user intents");
      const listResponse = await makeRequest("GET", "/intents", null, true);

      if (listResponse.ok && Array.isArray(listResponse.data)) {
        logTest(
          "List Intents",
          true,
          `Found ${listResponse.data.length} intents`,
        );
      } else {
        logTest("List Intents", false, JSON.stringify(listResponse.data));
      }

      // Test 3: Get specific intent
      console.log("\nTest 3: GET /intents/:id - Get intent details");
      const getResponse = await makeRequest(
        "GET",
        `/intents/${testIntentId}`,
        null,
        true,
      );

      if (getResponse.ok && getResponse.data.id === testIntentId) {
        logTest("Get Intent Details", true, `Name: ${getResponse.data.name}`);
      } else {
        logTest("Get Intent Details", false, JSON.stringify(getResponse.data));
      }

      // Test 4: Pause intent
      console.log("\nTest 4: PATCH /intents/:id/pause - Pause intent");
      const pauseResponse = await makeRequest(
        "PATCH",
        `/intents/${testIntentId}/pause`,
        null,
        true,
      );

      if (pauseResponse.ok && pauseResponse.data.status === "PAUSED") {
        logTest("Pause Intent", true, `Status: ${pauseResponse.data.status}`);
      } else {
        logTest("Pause Intent", false, JSON.stringify(pauseResponse.data));
      }

      // Test 5: Resume intent
      console.log("\nTest 5: PATCH /intents/:id/resume - Resume intent");
      const resumeResponse = await makeRequest(
        "PATCH",
        `/intents/${testIntentId}/resume`,
        null,
        true,
      );

      if (resumeResponse.ok && resumeResponse.data.status === "ACTIVE") {
        logTest("Resume Intent", true, `Status: ${resumeResponse.data.status}`);
      } else {
        logTest("Resume Intent", false, JSON.stringify(resumeResponse.data));
      }

      // Test 6: Delete intent
      console.log("\nTest 6: DELETE /intents/:id - Delete intent");
      const deleteResponse = await makeRequest(
        "DELETE",
        `/intents/${testIntentId}`,
        null,
        true,
      );

      if (deleteResponse.ok) {
        logTest("Delete Intent", true, "Intent deleted successfully");
        testIntentId = null;
      } else {
        logTest("Delete Intent", false, JSON.stringify(deleteResponse.data));
      }
    }
  } catch (error) {
    logTest("Intents Tests", false, error.message);
  }
}

async function testNotificationsEndpoints() {
  logSection("Testing Notifications Endpoints");

  if (!authToken) {
    logTest("Notifications Tests", false, "No auth token - skipping");
    return;
  }

  try {
    // Test 1: List notifications
    console.log("Test 1: GET /notifications - List notifications");
    const listResponse = await makeRequest("GET", "/notifications", null, true);

    if (listResponse.ok && Array.isArray(listResponse.data)) {
      logTest(
        "List Notifications",
        true,
        `Found ${listResponse.data.length} notifications`,
      );
    } else {
      logTest("List Notifications", false, JSON.stringify(listResponse.data));
    }

    // Test 2: Get unread count
    console.log("\nTest 2: GET /notifications/unread-count - Get unread count");
    const countResponse = await makeRequest(
      "GET",
      "/notifications/unread-count",
      null,
      true,
    );

    if (countResponse.ok && typeof countResponse.data.count === "number") {
      logTest("Get Unread Count", true, `Unread: ${countResponse.data.count}`);
    } else {
      logTest("Get Unread Count", false, JSON.stringify(countResponse.data));
    }
  } catch (error) {
    logTest("Notifications Tests", false, error.message);
  }
}

async function testTelegramEndpoints() {
  logSection("Testing Telegram Endpoints");

  try {
    // Test webhook endpoint (should respond even without signature)
    console.log("Test 1: POST /telegram/webhook - Test webhook endpoint");
    const webhookResponse = await makeRequest("POST", "/telegram/webhook", {
      message: {
        chat: { id: 123456789 },
        text: "/start",
      },
    });

    // Webhook might reject invalid signature, but endpoint should exist
    if (
      webhookResponse.status === 200 ||
      webhookResponse.status === 201 ||
      webhookResponse.status === 403 ||
      webhookResponse.status === 400
    ) {
      logTest(
        "Telegram Webhook",
        true,
        `Endpoint accessible (Status: ${webhookResponse.status})`,
      );
    } else {
      logTest(
        "Telegram Webhook",
        false,
        `Unexpected status: ${webhookResponse.status}`,
      );
    }
  } catch (error) {
    logTest("Telegram Tests", false, error.message);
  }
}

async function testChimoneyEndpoints() {
  logSection("Testing Chimoney Endpoints");

  try {
    // Test webhook endpoint
    console.log("Test 1: POST /chimoney/webhook - Test webhook endpoint");
    const webhookResponse = await makeRequest("POST", "/chimoney/webhook", {
      event: "payout.completed",
      data: { id: "test" },
    });

    // Webhook might reject invalid signature, but endpoint should exist
    if (
      webhookResponse.status === 200 ||
      webhookResponse.status === 201 ||
      webhookResponse.status === 403 ||
      webhookResponse.status === 400
    ) {
      logTest(
        "Chimoney Webhook",
        true,
        `Endpoint accessible (Status: ${webhookResponse.status})`,
      );
    } else {
      logTest(
        "Chimoney Webhook",
        false,
        `Unexpected status: ${webhookResponse.status}`,
      );
    }
  } catch (error) {
    logTest("Chimoney Tests", false, error.message);
  }
}

async function printSummary() {
  logSection("Test Summary");

  const total = testResults.passed + testResults.failed;
  const passRate = ((testResults.passed / total) * 100).toFixed(1);

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${passRate}%\n`);

  if (testResults.failed > 0) {
    console.log("Failed Tests:");
    testResults.tests
      .filter((t) => !t.passed)
      .forEach((t) => console.log(`  - ${t.name}: ${t.details}`));
  }

  console.log("\n" + "=".repeat(60));

  if (testResults.failed === 0) {
    console.log("🎉 All tests passed! Backend is ready for implementation.");
  } else {
    console.log("⚠️  Some tests failed. Please check the errors above.");
  }

  console.log("=".repeat(60) + "\n");
}

// Main test runner
async function runAllTests() {
  console.log("\n" + "█".repeat(60));
  console.log("  FlowPay Backend API Test Suite");
  console.log("  Testing: " + BASE_URL);
  console.log("  Test Wallet: " + TEST_WALLET.address);
  console.log("█".repeat(60) + "\n");

  try {
    await testAuthEndpoints();
    await testUsersEndpoints();
    await testIntentsEndpoints();
    await testNotificationsEndpoints();
    await testTelegramEndpoints();
    await testChimoneyEndpoints();
    await printSummary();
  } catch (error) {
    console.error("\n❌ Test suite error:", error.message);
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(console.error);
