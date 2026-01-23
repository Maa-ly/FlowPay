import { useFlowPayAuth } from "./useFlowPayAuth";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export interface Intent {
  id: string;
  userId: string;
  name: string;
  description?: string;
  recipient: string;
  amount: string;
  token: string;
  tokenAddress: string;
  frequency: string;
  status: string;
  safetyBuffer: string;
  maxGasPrice?: string;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  nextExecution?: string;
  lastExecution?: string;
  executionCount: number;
  failureCount: number;
  isOffRamp: boolean;
  offRampDetails?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  executions?: Execution[];
}

export interface Execution {
  id: string;
  intentId: string;
  txHash?: string;
  status: string;
  amount: string;
  gasUsed?: string;
  gasPrice?: string;
  errorMessage?: string;
  delayReason?: string;
  blockNumber?: string;
  executedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  sentAt: string;
}

export interface CreateIntentDto {
  name: string;
  description?: string;
  recipient: string;
  amount: number;
  token: string;
  tokenAddress: string;
  frequency: string;
  safetyBuffer: number;
  maxGasPrice?: number;
  timeWindowStart?: string;
  timeWindowEnd?: string;
  isOffRamp?: boolean;
  offRampDetails?: Record<string, unknown>;
}

export function useFlowPayAPI() {
  const { authToken } = useFlowPayAuth();

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(
        error.message || `Request failed with status ${response.status}`,
      );
    }

    return response.json();
  };

  // Intent operations
  const createIntent = async (data: CreateIntentDto): Promise<Intent> => {
    return makeRequest("/intents", {
      method: "POST",
      body: JSON.stringify(data),
    });
  };

  const listIntents = async (): Promise<Intent[]> => {
    return makeRequest("/intents");
  };

  const getIntent = async (id: string): Promise<Intent> => {
    return makeRequest(`/intents/${id}`);
  };

  const pauseIntent = async (id: string): Promise<Intent> => {
    return makeRequest(`/intents/${id}/pause`, {
      method: "PATCH",
    });
  };

  const resumeIntent = async (id: string): Promise<Intent> => {
    return makeRequest(`/intents/${id}/resume`, {
      method: "PATCH",
    });
  };

  const deleteIntent = async (id: string): Promise<Intent> => {
    return makeRequest(`/intents/${id}`, {
      method: "DELETE",
    });
  };

  const updateIntent = async (
    id: string,
    data: Partial<CreateIntentDto>,
  ): Promise<Intent> => {
    return makeRequest(`/intents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  };

  // Notification operations
  const listNotifications = async (): Promise<Notification[]> => {
    return makeRequest("/notifications");
  };

  const getUnreadCount = async (): Promise<{ count: number }> => {
    return makeRequest("/notifications/unread-count");
  };

  const markAsRead = async (id: string): Promise<Notification> => {
    return makeRequest(`/notifications/${id}/read`, {
      method: "PATCH",
    });
  };

  // User operations
  const getUserProfile = async () => {
    return makeRequest("/users/profile");
  };

  return {
    createIntent,
    listIntents,
    getIntent,
    pauseIntent,
    resumeIntent,
    deleteIntent,
    updateIntent,
    listNotifications,
    getUnreadCount,
    markAsRead,
    getUserProfile,
  };
}
