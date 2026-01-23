import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteIntentModal from "@/components/dashboard/DeleteIntentModal";
import { EditIntentModal } from "@/components/dashboard/EditIntentModal";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Calendar,
  Shield,
  Wallet,
  History,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PaymentIntent } from "@/components/dashboard/IntentCard";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useFlowPayAuth } from "@/hooks/useFlowPayAuth";
import { useFlowPayAPI, Intent } from "@/hooks/useFlowPayAPI";
import { SpinnerLoader } from "@/components/ui/skeleton-loader";
import { formatDate, formatDateShort } from "@/lib/utils";

const IntentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useFlowPayAuth();
  const { getIntent, pauseIntent, resumeIntent, deleteIntent, updateIntent } =
    useFlowPayAPI();

  const [intentData, setIntentData] = useState<Intent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadIntent = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const intent = await getIntent(id);
      setIntentData(intent);
    } catch (error) {
      const err = error as Error;
      toast.error("Failed to Load Intent", {
        description: err.message || "Could not load intent details",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      loadIntent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <SpinnerLoader />
            <p className="text-muted-foreground mt-4">Loading intent...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!intentData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Intent Not Found</h1>
            <Link to="/dashboard">
              <Button variant="gradient">Back to Dashboard</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = {
    ACTIVE: {
      label: "Active",
      icon: <CheckCircle2 className="w-4 h-4" />,
      className: "bg-success/10 text-success border-success/20",
      description:
        "This intent is active and will execute when conditions are met.",
    },
    PAUSED: {
      label: "Paused",
      icon: <Pause className="w-4 h-4" />,
      className: "bg-muted text-muted-foreground border-border",
      description: "Intent is currently paused by user.",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-destructive/10 text-destructive border-destructive/20",
      description: "This intent has been cancelled and will not execute.",
    },
  };

  const status =
    statusConfig[intentData.status as keyof typeof statusConfig] ||
    statusConfig.ACTIVE;

  const handlePauseResume = async () => {
    if (!intentData) return;

    try {
      if (intentData.status === "PAUSED") {
        await resumeIntent(intentData.id);
        toast.success("Intent Resumed", {
          description:
            "This intent is now active and will execute when conditions are met.",
        });
      } else {
        await pauseIntent(intentData.id);
        toast.success("Intent Paused", {
          description: "This intent will not execute until resumed.",
        });
      }
      await loadIntent(); // Reload to get updated status
    } catch (error) {
      const err = error as Error;
      toast.error("Action Failed", {
        description: err.message || "Could not update intent status",
      });
    }
  };

  const handleDelete = async () => {
    if (!intentData) return;

    try {
      await deleteIntent(intentData.id);
      setIsDeleteModalOpen(false);
      toast.success("Intent Deleted", {
        description: "The payment intent has been permanently deleted.",
      });
      navigate("/dashboard");
    } catch (error) {
      const err = error as Error;
      toast.error("Delete Failed", {
        description: err.message || "Could not delete intent",
      });
    }
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

      await loadIntent(); // Reload the intent
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 hover:scale-105 transition-transform"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center self-start">
              <span className="font-mono text-2xl font-bold text-primary">
                {intentData.token}
              </span>
            </div>
            <div>
              {intentData.name && (
                <p className="text-lg font-semibold text-foreground mb-1">
                  {intentData.name}
                </p>
              )}
              <h1
                className={`font-display font-bold ${intentData.name ? "text-2xl mb-1" : "text-3xl mb-1"}`}
              >
                {intentData.amount} {intentData.token}
              </h1>
              <p className="text-muted-foreground font-mono">
                {intentData.recipient}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`${status.className} flex items-center gap-1.5 text-base px-4 py-2`}
            >
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card
              className="animate-fade-in hover:shadow-elevated transition-shadow"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Status Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {status.description}
                </p>
                {intentData.status === "PAUSED" && intentData.description && (
                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <p className="text-sm text-warning">
                      {intentData.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card
              className="animate-fade-in hover:shadow-elevated transition-shadow"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {intentData.executions && intentData.executions.length > 0 ? (
                  <div className="space-y-3">
                    {intentData.executions.map((execution) => (
                      <div
                        key={execution.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${execution.status === "SUCCESS" ? "bg-success" : execution.status === "FAILED" ? "bg-destructive" : "bg-warning"}`}
                          />
                          <div>
                            <p className="font-medium text-sm">
                              {execution.status}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDateShort(execution.executedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm">
                            {execution.status === "SUCCESS"
                              ? `${intentData.amount} ${intentData.token}`
                              : "-"}
                          </p>
                          {execution.txHash && (
                            <a
                              href={`https://polygonscan.com/tx/${execution.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline font-mono"
                            >
                              {execution.txHash.slice(0, 6)}...
                              {execution.txHash.slice(-4)}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No executions yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Details */}
            <Card
              className="animate-fade-in hover:shadow-elevated transition-shadow"
              style={{ animationDelay: "0.15s" }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Frequency</span>
                  </div>
                  <span className="font-medium">{intentData.frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Safety Buffer</span>
                  </div>
                  <span className="font-mono font-medium">
                    {intentData.safetyBuffer} {intentData.token}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">Token</span>
                  </div>
                  <span className="font-medium">{intentData.token}</span>
                </div>
                {intentData.nextExecution && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Next Execution</span>
                    </div>
                    <span className="font-medium">
                      {formatDate(intentData.nextExecution)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card
              className="animate-fade-in hover:shadow-elevated transition-shadow"
              style={{ animationDelay: "0.25s" }}
            >
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant={
                    intentData.status === "PAUSED" ? "gradient" : "outline"
                  }
                  className="w-full hover:scale-105 transition-transform"
                  onClick={handlePauseResume}
                >
                  {intentData.status === "PAUSED" ? (
                    <>
                      <Play className="w-4 h-4" />
                      Resume Intent
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause Intent
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:scale-105 transition-transform"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Pencil className="w-4 h-4" />
                  Edit Intent
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:bg-destructive/10 hover:scale-105 transition-transform"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Intent
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteIntentModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDelete={handleDelete}
        intentData={{
          name: intentData.name,
          amount: parseFloat(intentData.amount),
          token: intentData.token,
          recipient: intentData.recipient,
          frequency: intentData.frequency,
        }}
      />

      {/* Edit Modal */}
      <EditIntentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        intent={{
          id: intentData.id,
          name: intentData.name,
          recipient: intentData.recipient,
          amount: parseFloat(intentData.amount),
          token: intentData.token,
          frequency: intentData.frequency,
          safetyBuffer: parseFloat(intentData.safetyBuffer),
        }}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default IntentDetails;
