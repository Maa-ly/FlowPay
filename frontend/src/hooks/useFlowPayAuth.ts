import { useAccount, useSignMessage } from "wagmi";
import { useState, useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface User {
  id: string;
  walletAddress: string;
  telegramId?: string;
  email?: string;
  createdAt: string;
  lastActive: string;
}

export function useFlowPayAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("flowpay_token");
    const savedUser = localStorage.getItem("flowpay_user");

    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Auto-authenticate when wallet connects (only if no valid token exists)
  useEffect(() => {
    // Only authenticate if wallet is connected, we have an address, and no token exists
    if (
      isConnected &&
      address &&
      !authToken &&
      !localStorage.getItem("flowpay_token")
    ) {
      authenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  // Clear auth when wallet disconnects
  useEffect(() => {
    if (!isConnected && authToken) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const authenticate = async () => {
    if (!address || !isConnected) {
      setError("Wallet not connected");
      return;
    }

    try {
      setIsAuthenticating(true);
      setError(null);

      // Step 1: Get nonce
      const nonceRes = await fetch(
        `${API_URL}/auth/nonce?walletAddress=${address}`,
      );

      if (!nonceRes.ok) {
        throw new Error("Failed to get nonce");
      }

      const { nonce } = await nonceRes.json();

      // Step 2: Sign message
      const message = `Sign this message to authenticate with FlowPay.\n\nNonce: ${nonce}`;
      const signature = await signMessageAsync({
        message,
        account: address as `0x${string}`,
      });

      // Step 3: Login
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          signature,
          message,
        }),
      });

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.message || "Authentication failed");
      }

      const { accessToken, user: userData } = await loginRes.json();

      // Step 4: Store token and user
      setAuthToken(accessToken);
      setUser(userData);
      localStorage.setItem("flowpay_token", accessToken);
      localStorage.setItem("flowpay_user", JSON.stringify(userData));

      console.log("✅ Authentication successful:", userData);
    } catch (err) {
      const error = err as Error;
      console.error("Authentication failed:", error);
      setError(error.message || "Authentication failed");
      setAuthToken(null);
      setUser(null);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem("flowpay_token");
    localStorage.removeItem("flowpay_user");
  };

  return {
    authToken,
    user,
    isAuthenticating,
    isAuthenticated: !!authToken && !!user,
    error,
    authenticate,
    logout,
  };
}
