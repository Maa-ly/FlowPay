# FlowPay Smart Contracts 🔐

Intent-Driven Agentic Payments on Cronos EVM

## 📋 Overview

Smart contracts for FlowPay - an intent-driven, agentic on-chain payments application built on Cronos EVM using x402 programmatic payment flows. These contracts store payment intents, enforce execution rules, and integrate with the x402 facilitator for programmatic settlements.

## 🏗️ Project Structure

```
contract/
├── src/
│   └── intent.sol          # Main payment intent contract
├── test/
│   └── intent.t.sol        # Contract tests
├── script/                 # Deployment scripts
├── foundry.toml            # Foundry configuration
└── README.md
```

## 🛠️ Tech Stack

- **Solidity** - Smart contract language
- **Foundry** - Development framework
  - `forge` - Build, test, deploy
  - `cast` - Interact with contracts
  - `anvil` - Local EVM node
- **Cronos EVM** - Deployment target
- **x402 Protocol** - Programmatic payment settlement

## 🚀 Getting Started

### Prerequisites

1. **Install Foundry:**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. **Verify Installation:**
```bash
forge --version
cast --version
anvil --version
```

### Installation

```bash
# Clone and navigate to contract directory
cd contract

# Install dependencies
forge install
```

## 🧪 Testing

### Run All Tests

```bash
forge test
```

### Run Tests with Verbosity

```bash
# -v    Show test results
# -vv   Show console.log output
# -vvv  Show stack traces
# -vvvv Show setup traces
# -vvvvv Show everything
forge test -vvv
```

### Run Specific Test

```bash
forge test --match-test testIntentCreation
```

### Run Tests with Gas Report

```bash
forge test --gas-report
```

### Coverage Report

```bash
forge coverage
```

## 🔨 Building

```bash
# Compile contracts
forge build

# Clean and rebuild
forge clean && forge build
```

## 🌍 Deployment

### Deploy to Cronos Testnet

1. **Set Environment Variables:**

Create `.env` file:
```bash
PRIVATE_KEY=your_private_key_here
CRONOS_TESTNET_RPC=https://evm-t3.cronos.org
CRONOSSCAN_API_KEY=your_cronosscan_api_key
```

2. **Load Environment:**
```bash
source .env
```

3. **Deploy Contract:**
```bash
forge create --rpc-url $CRONOS_TESTNET_RPC \
  --private-key $PRIVATE_KEY \
  src/intent.sol:IntentContract \
  --verify --etherscan-api-key $CRONOSSCAN_API_KEY
```

4. **Save Contract Address:**
```bash
# Output will show: Deployed to: 0x...
# Save this address for frontend integration
```

### Deploy to Cronos Mainnet

1. **Get Mainnet CRO:**
   - Buy CRO on exchange
   - Withdraw to your wallet address

2. **Update Environment:**
```bash
CRONOS_MAINNET_RPC=https://evm.cronos.org
```

3. **Deploy:**
```bash
forge create --rpc-url $CRONOS_MAINNET_RPC \
  --private-key $PRIVATE_KEY \
  src/intent.sol:IntentContract \
  --verify --etherscan-api-key $CRONOSSCAN_API_KEY
```

### Using Deployment Script

Create `script/Deploy.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/intent.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        IntentContract intent = new IntentContract();
        console.log("IntentContract deployed to:", address(intent));

        vm.stopBroadcast();
    }
}
```

Deploy with script:
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $CRONOS_TESTNET_RPC \
  --broadcast \
  --verify
```

## 🔍 Verification

### Verify Manually

```bash
forge verify-contract \
  --chain-id 338 \
  --compiler-version v0.8.20 \
  0xYourContractAddress \
  src/intent.sol:IntentContract \
  --etherscan-api-key $CRONOSSCAN_API_KEY
```

### Check Verification Status

Visit:
- **Testnet:** https://testnet.cronoscan.com/address/YOUR_CONTRACT_ADDRESS
- **Mainnet:** https://cronoscan.com/address/YOUR_CONTRACT_ADDRESS

## 🔧 Interacting with Deployed Contracts

### Using Cast

```bash
# Read from contract
cast call 0xYOUR_CONTRACT_ADDRESS \
  "getIntent(uint256)" 1 \
  --rpc-url $CRONOS_TESTNET_RPC

# Write to contract
cast send 0xYOUR_CONTRACT_ADDRESS \
  "createIntent(address,uint256,uint256)" \
  0xRecipientAddress 1000000000000000000 86400 \
  --private-key $PRIVATE_KEY \
  --rpc-url $CRONOS_TESTNET_RPC
```

### Using Foundry Console

```bash
# Start Anvil (local testnet)
anvil

# In another terminal
forge script script/Interact.s.sol --fork-url http://localhost:8545 --broadcast
```

## 📊 Gas Optimization

### Test Gas Usage

```bash
forge test --gas-report
```

### Optimize Compilation

Update `foundry.toml`:
```toml
[profile.default]
optimizer = true
optimizer_runs = 200

[profile.production]
optimizer = true
optimizer_runs = 1000000
```

Build with optimization:
```bash
forge build --use production
```

## 🔐 Security

### Run Slither Analysis

```bash
pip install slither-analyzer
slither src/intent.sol
```

### Run Mythril

```bash
pip install mythril
myth analyze src/intent.sol
```

### Best Practices

- ✅ Always test on testnet first
- ✅ Verify contracts on explorer
- ✅ Use `.env` for private keys (never commit!)
- ✅ Run security analyzers before mainnet
- ✅ Implement access control
- ✅ Add emergency pause functionality
- ✅ Test all edge cases
- ✅ Document all functions

## 📖 Contract Documentation

### IntentContract

Main contract for storing and managing payment intents.

**Key Functions:**

```solidity
// Create a new payment intent
function createIntent(
    address recipient,
    uint256 amount,
    uint256 frequency
) external returns (uint256 intentId);

// Execute an intent (called by agent)
function executeIntent(uint256 intentId) external;

// Cancel an intent
function cancelIntent(uint256 intentId) external;

// Get intent details
function getIntent(uint256 intentId) external view returns (Intent memory);
```

**Events:**

```solidity
event IntentCreated(uint256 indexed intentId, address indexed creator, address indexed recipient);
event IntentExecuted(uint256 indexed intentId, uint256 timestamp);
event IntentCancelled(uint256 indexed intentId);
```

## 🌐 Network Information

### Cronos Testnet

- **Chain ID:** 338
- **RPC URL:** https://evm-t3.cronos.org
- **Explorer:** https://testnet.cronoscan.com
- **Faucet:** https://cronos.org/faucet
- **Symbol:** TCRO

### Cronos Mainnet

- **Chain ID:** 25
- **RPC URL:** https://evm.cronos.org
- **Explorer:** https://cronoscan.com
- **Symbol:** CRO

## 📚 Resources

### Foundry Documentation
- [Foundry Book](https://book.getfoundry.sh/)
- [Forge Commands](https://book.getfoundry.sh/reference/forge/)
- [Cast Commands](https://book.getfoundry.sh/reference/cast/)

### Cronos Documentation
- [Cronos Docs](https://docs.cronos.org)
- [Smart Contract Development](https://docs.cronos.org/for-dapp-developers/smart-contracts)
- [x402 Protocol](https://docs.cronos.org/cronos-x402-facilitator)

### Security Tools
- [Slither](https://github.com/crytic/slither)
- [Mythril](https://github.com/ConsenSys/mythril)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

## 🎯 Project Alignment

### Main Track: Agent-Triggered On-Chain Actions

FlowPay demonstrates:
- **Intent → Agent → Settlement Flow**
- **Adaptive Decision-Making** (not rigid automation)
- **x402 Integration** for programmatic payments
- **Consumer-Facing Use Cases** (rent, subscriptions, allowances)
- **Transparency** in agent reasoning

### Key Features

1. **Intent Creation**
   - Users define payment intents with constraints
   - High-level financial expressions

2. **Agentic Decision Layer**
   - Lightweight agent evaluates conditions
   - Checks balance thresholds and safety buffers

3. **Conditional Execution**
   - Payments delayed if constraints violated
   - Adaptive to user's financial context

4. **x402 Settlement**
   - Approved payments via x402 flows
   - No repeated user signatures

5. **Explainability**
   - UI shows agent decision state
   - Clear reasoning for actions

### MVP Demo Flow

1. User creates intent: "Pay 100 USDC rent monthly, keep 300 USDC buffer"
2. Agent monitors wallet state
3. Decision: Delay if balance too low
4. Execution: Trigger x402 settlement when safe
5. On-chain confirmation on Cronos

---

**Built for Cronos Hackathon** 🚀
