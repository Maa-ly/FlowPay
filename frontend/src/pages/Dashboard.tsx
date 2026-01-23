import Header from "@/components/layout/Header";
import StatsOverview from "@/components/dashboard/StatsOverview";
import IntentCard, { PaymentIntent } from "@/components/dashboard/IntentCard";
import DeleteIntentModal from "@/components/dashboard/DeleteIntentModal";
import { EditIntentModal } from "@/components/dashboard/EditIntentModal";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SlidersHorizontal, Target, History } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFlowPayAuth } from "@/hooks/useFlowPayAuth";
import { useFlowPayAPI, Intent } from "@/hooks/useFlowPayAPI";
import {
  IntentCardSkeleton,
  SpinnerLoader,
} from "@/components/ui/skeleton-loader";
import { formatDateShort } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterOption = "all" | "ACTIVE" | "PAUSED" | "CANCELLED";

const Dashboard = () => {
  const { isConnected } = useAccount();
  const { isAuthenticated, isAuthenticating } = useFlowPayAuth();
  const { listIntents, pauseIntent, resumeIntent, deleteIntent, updateIntent } =
    useFlowPayAPI();

  const [filter, setFilter] = useState<FilterOption>("all");
  const [intents, setIntents] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [intentToEdit, setIntentToEdit] = useState<PaymentIntent | null>(null);
  const [intentToDelete, setIntentToDelete] = useState<PaymentIntent | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load intents from API
  useEffect(() => {
    if (isAuthenticated) {
      loadIntents();
    } else if (!isAuthenticating) {
      // If not authenticated and not authenticating, set loading to false
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAuthenticating]);

  const loadIntents = async () => {
    try {
      setLoading(true);
      const data = await listIntents();
      setIntents(data);
    } catch (error) {
      const err = error as Error;
      console.error("Failed to load intents:", err);
      toast.error("Failed to load intents", {
        description:
          err.message ||
          "Please check if the backend server is running on http://localhost:3000",
      });
      setIntents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Redirect to home if not connected
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  // Show loading state while authenticating
  if (!isAuthenticated && isAuthenticating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <SpinnerLoader />
          <p className="text-muted-foreground mt-4">
            Authenticating with backend...
          </p>
        </div>
      </div>
    );
  }

  // Map API intent to PaymentIntent format
  const mapIntentToPaymentIntent = (intent: Intent): PaymentIntent => {
    return {
      id: intent.id,
      name: intent.name,
      recipient: intent.recipient,
      amount: parseFloat(intent.amount),
      token: intent.token,
      frequency: intent.frequency,
      safetyBuffer: parseFloat(intent.safetyBuffer),
      status: intent.status.toLowerCase() as
        | "ready"
        | "delayed"
        | "executed"
        | "paused",
      nextExecution: intent.nextExecution
        ? formatDateShort(intent.nextExecution)
        : undefined,
      reason:
        intent.executions?.length && intent.executions[0].delayReason
          ? intent.executions[0].delayReason
          : undefined,
    };
  };

  const filteredIntents =
    filter === "all"
      ? intents.map(mapIntentToPaymentIntent)
      : intents
          .filter((intent) => intent.status === filter)
          .map(mapIntentToPaymentIntent);

  const handleEdit = (intent: PaymentIntent) => {
    setIntentToEdit(intent);
    setIsEditModalOpen(true);
  };

  const handleDelete = (intent: PaymentIntent) => {
    setIntentToDelete(intent);
    setIsDeleteModalOpen(true);
  };

  const handleEditSave = async (updatedIntent: PaymentIntent) => {
    try {
      // Call the update API with the modified intent data
      await updateIntent(updatedIntent.id, {
        name: updatedIntent.name,
        recipient: updatedIntent.recipient,
        amount: updatedIntent.amount,
        token: updatedIntent.token,
        frequency: updatedIntent.frequency.toUpperCase(),
        safetyBuffer: updatedIntent.safetyBuffer,
      });

      await loadIntents(); // Reload the list
      setIsEditModalOpen(false);
      toast.success("Intent Updated", {
        description: "Your payment intent has been successfully updated.",
      });
    } catch (error) {
      const err = error as Error;
      console.error("Failed to update intent:", err);
      toast.error("Failed to update intent", {
        description: err.message || "Please try again later.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (intentToDelete) {
      try {
        await deleteIntent(intentToDelete.id);
        await loadIntents(); // Reload the list
        setIsDeleteModalOpen(false);
        toast.success("Intent Deleted", {
          description: "The payment intent has been permanently deleted.",
        });
      } catch (error) {
        const err = error as Error;
        console.error("Failed to delete intent:", err);
        toast.error("Failed to delete intent", {
          description: err.message || "Please try again later.",
        });
      }
    }
  };

  const handlePauseResume = async (intentId: string, currentStatus: string) => {
    try {
      if (currentStatus.toUpperCase() === "ACTIVE") {
        await pauseIntent(intentId);
        toast.success("Intent Paused", {
          description: "The payment intent has been paused.",
        });
      } else if (currentStatus.toUpperCase() === "PAUSED") {
        await resumeIntent(intentId);
        toast.success("Intent Resumed", {
          description: "The payment intent has been resumed.",
        });
      }
      await loadIntents(); // Reload the list
    } catch (error) {
      console.error("Failed to update intent:", error);
      toast.error("Failed to update intent", {
        description: error.message || "Please try again later.",
      });
    }
  };

  const filterLabels: Record<FilterOption, string> = {
    all: "All Intents",
    ACTIVE: "Active",
    PAUSED: "Paused",
    CANCELLED: "Cancelled",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor and manage your payment intents
            </p>
          </div>
          <Link to="/create">
            <Button variant="gradient" size="default">
              <Plus className="w-4 h-4" />
              New Intent
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsOverview intents={intents} />
        </div>

        {/* Tabs for Intents and History */}
        <Tabs defaultValue="intents" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="intents" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Active Intents
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Active Intents Tab */}
          <TabsContent value="intents" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <h2 className="font-display text-xl font-semibold">
                  {filter === "all"
                    ? "Active Intents"
                    : `${filterLabels[filter]} Intents`}
                  <span className="text-muted-foreground text-base font-normal ml-2">
                    ({filteredIntents.length})
                  </span>
                </h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="default">
                      <SlidersHorizontal className="w-4 h-4" />
                      {filterLabels[filter]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={filter}
                      onValueChange={(value) =>
                        setFilter(value as FilterOption)
                      }
                    >
                      <DropdownMenuRadioItem value="all">
                        All Intents
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ready">
                        Ready
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="delayed">
                        Delayed
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="executed">
                        Executed
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="paused">
                        Paused
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <IntentCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredIntents.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIntents.map((intent) => (
                    <IntentCard
                      key={intent.id}
                      intent={intent}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPauseResume={handlePauseResume}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
                  <p className="text-muted-foreground">
                    {isAuthenticated
                      ? "No intents found. Create your first intent to get started!"
                      : "Connect your wallet to view your intents."}
                  </p>
                  {isAuthenticated && (
                    <Link to="/create">
                      <Button variant="gradient" className="mt-4">
                        <Plus className="w-4 h-4" />
                        Create Intent
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="history" className="mt-0">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Modal */}
      {intentToEdit && (
        <EditIntentModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          intent={intentToEdit}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {intentToDelete && (
        <DeleteIntentModal
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onDelete={handleDeleteConfirm}
          intentData={{
            name: intentToDelete.name,
            amount: intentToDelete.amount,
            token: intentToDelete.token,
            recipient: intentToDelete.recipient,
            frequency: intentToDelete.frequency,
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
