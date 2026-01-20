import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteIntentModal from "@/components/dashboard/DeleteIntentModal";
import { EditIntentModal } from "@/components/dashboard/EditIntentModal";
import { ArrowLeft, ArrowUpRight, Clock, CheckCircle2, AlertCircle, Pause, Play, Calendar, Shield, Wallet, History, Pencil, Trash2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { PaymentIntent } from "@/components/dashboard/IntentCard";
import { useState } from "react";
import { toast } from "sonner";

const mockIntents: PaymentIntent[] = [
  {
    id: "1",
    name: "Weekly Groceries",
    recipient: "0x1234...5678",
    amount: 100,
    token: "USDC",
    frequency: "Monthly",
    safetyBuffer: 300,
    status: "ready",
    nextExecution: "Jan 15, 2026",
  },
  {
    id: "2",
    name: "Weekly Allowance",
    recipient: "0xabcd...efgh",
    amount: 50,
    token: "USDC",
    frequency: "Weekly",
    safetyBuffer: 200,
    status: "delayed",
    reason: "Current balance (180 USDC) minus payment would fall below safety buffer (200 USDC)",
  },
  {
    id: "3",
    name: "Monthly Rent",
    recipient: "0x9876...5432",
    amount: 500,
    token: "USDC",
    frequency: "Monthly",
    safetyBuffer: 500,
    status: "executed",
    nextExecution: "Feb 1, 2026",
  },
  {
    id: "4",
    name: "Contractor Payment",
    recipient: "0xdef0...1234",
    amount: 25,
    token: "CRO",
    frequency: "Bi-weekly",
    safetyBuffer: 100,
    status: "paused",
  },
];

const mockHistory = [
  { date: "Jan 1, 2026", action: "Executed", amount: "100 USDC", txHash: "0xabc...123" },
  { date: "Dec 1, 2025", action: "Executed", amount: "100 USDC", txHash: "0xdef...456" },
  { date: "Nov 1, 2025", action: "Delayed", amount: "-", txHash: "-" },
  { date: "Oct 1, 2025", action: "Executed", amount: "100 USDC", txHash: "0xghi...789" },
];

const IntentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intentData, setIntentData] = useState(() => mockIntents.find((i) => i.id === id));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    ready: {
      label: "Ready",
      icon: <CheckCircle2 className="w-4 h-4" />,
      className: "bg-success/10 text-success border-success/20",
      description: "This intent is ready to execute when conditions are met.",
    },
    delayed: {
      label: "Delayed",
      icon: <Clock className="w-4 h-4" />,
      className: "bg-warning/10 text-warning border-warning/20",
      description: "Execution delayed due to unmet constraints.",
    },
    executed: {
      label: "Executed",
      icon: <ArrowUpRight className="w-4 h-4" />,
      className: "bg-primary/10 text-primary border-primary/20",
      description: "Last payment was successfully executed.",
    },
    paused: {
      label: "Paused",
      icon: <Pause className="w-4 h-4" />,
      className: "bg-muted text-muted-foreground border-border",
      description: "Intent is currently paused by user.",
    },
  };

  const status = statusConfig[intentData.status];

  const handlePauseResume = () => {
    const newStatus = intentData.status === "paused" ? "ready" : "paused";
    setIntentData({ ...intentData, status: newStatus });
    toast.success(
      newStatus === "paused" ? "Intent Paused" : "Intent Resumed",
      {
        description: newStatus === "paused" 
          ? "This intent will not execute until resumed." 
          : "This intent is now active and will execute when conditions are met.",
      }
    );
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    toast.success("Intent Deleted", {
      description: "The payment intent has been permanently deleted.",
    });
    navigate("/dashboard");
  };

  const handleEditSave = (updatedIntent: PaymentIntent) => {
    setIntentData(updatedIntent);
    toast.success("Intent Updated", {
      description: "Your payment intent has been successfully updated.",
    });
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
              <span className="font-mono text-2xl font-bold text-primary">{intentData.token}</span>
            </div>
            <div>
              {intentData.name && (
                <p className="text-lg font-semibold text-foreground mb-1">{intentData.name}</p>
              )}
              <h1 className={`font-display font-bold ${intentData.name ? 'text-2xl mb-1' : 'text-3xl mb-1'}`}>
                {intentData.amount} {intentData.token}
              </h1>
              <p className="text-muted-foreground font-mono">{intentData.recipient}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${status.className} flex items-center gap-1.5 text-base px-4 py-2`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <Card className="animate-fade-in hover:shadow-elevated transition-shadow" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Status Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{status.description}</p>
                {intentData.reason && (
                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <p className="text-sm text-warning">{intentData.reason}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction History */}
            <Card className="animate-fade-in hover:shadow-elevated transition-shadow" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHistory.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${item.action === 'Executed' ? 'bg-success' : 'bg-warning'}`} />
                        <div>
                          <p className="font-medium text-sm">{item.action}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">{item.amount}</p>
                        {item.txHash !== "-" && (
                          <p className="text-xs text-muted-foreground font-mono">{item.txHash}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Details */}
            <Card className="animate-fade-in hover:shadow-elevated transition-shadow" style={{ animationDelay: '0.15s' }}>
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
                  <span className="font-mono font-medium">{intentData.safetyBuffer} {intentData.token}</span>
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
                    <span className="font-medium">{intentData.nextExecution}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="animate-fade-in hover:shadow-elevated transition-shadow" style={{ animationDelay: '0.25s' }}>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant={intentData.status === "paused" ? "gradient" : "outline"} 
                  className="w-full hover:scale-105 transition-transform"
                  onClick={handlePauseResume}
                >
                  {intentData.status === "paused" ? (
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
          amount: intentData.amount,
          token: intentData.token,
          recipient: intentData.recipient,
          frequency: intentData.frequency,
        }}
      />

      {/* Edit Modal */}
      <EditIntentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        intent={intentData}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default IntentDetails;