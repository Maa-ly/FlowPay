import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ExternalLink,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistance } from "date-fns";
import { useFlowPayAPI } from "@/hooks/useFlowPayAPI";
import { useFlowPayAuth } from "@/hooks/useFlowPayAuth";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SpinnerLoader } from "@/components/ui/skeleton-loader";
import { formatDateShort } from "@/lib/utils";

export interface Transaction {
  id: string;
  intentId: string;
  intentName: string;
  recipient: string;
  amount: string;
  token: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  timestamp: string;
  txHash?: string;
  gasUsed?: string;
  errorMessage?: string;
}

const TransactionHistory = () => {
  const { listIntents } = useFlowPayAPI();
  const { isAuthenticated } = useFlowPayAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const intents = await listIntents();

      // Extract all executions from all intents
      const allExecutions: Transaction[] = [];
      intents.forEach((intent) => {
        if (intent.executions && intent.executions.length > 0) {
          intent.executions.forEach((exec) => {
            allExecutions.push({
              id: exec.id,
              intentId: intent.id,
              intentName: intent.name || `${intent.token} Payment`,
              recipient: intent.recipient,
              amount: exec.amount,
              token: intent.token,
              status: exec.status as "SUCCESS" | "FAILED" | "PENDING",
              timestamp: exec.executedAt,
              txHash: exec.txHash,
              gasUsed: exec.gasUsed,
              errorMessage: exec.errorMessage,
            });
          });
        }
      });

      // Sort by timestamp descending (most recent first)
      allExecutions.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setTransactions(allExecutions);
    } catch (error) {
      const err = error as Error;
      console.error("Failed to load transactions:", err);
      toast.error("Failed to load transaction history", {
        description: err.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge
            variant="default"
            className="bg-success/10 text-success hover:bg-success/20 border-success/20"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge
            variant="destructive"
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  // Calculate stats from real transactions
  const successfulTransactions = transactions.filter(
    (tx) => tx.status === "SUCCESS",
  );

  const totalVolume = successfulTransactions
    .reduce((acc, tx) => acc + parseFloat(tx.amount || "0"), 0)
    .toFixed(2);

  const totalGasSpent = successfulTransactions
    .filter((tx) => tx.gasUsed)
    .reduce((acc, tx) => acc + parseFloat(tx.gasUsed || "0"), 0)
    .toFixed(4);

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "FAILED":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <SpinnerLoader />
          <p className="text-muted-foreground mt-4">
            Loading transaction history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl">{transactions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Volume</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {totalVolume}
              <span className="text-sm font-normal text-muted-foreground">
                USDC
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gas Spent</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {totalGasSpent}
              <span className="text-sm font-normal text-muted-foreground">
                CRO
              </span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            View your payment intent execution history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No transaction history yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Transactions will appear here once your intents execute
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getStatusIcon(tx.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{tx.intentName}</p>
                        {getStatusBadge(tx.status)}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        To: {tx.recipient.slice(0, 6)}...
                        {tx.recipient.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateShort(tx.timestamp)}
                      </p>
                      {tx.status === "FAILED" && tx.errorMessage && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {tx.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {parseFloat(tx.amount).toFixed(2)} {tx.token}
                      </p>
                      {tx.gasUsed && (
                        <p className="text-xs text-muted-foreground">
                          Gas: {parseFloat(tx.gasUsed).toFixed(4)} CRO
                        </p>
                      )}
                    </div>
                    {tx.txHash && tx.status === "SUCCESS" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            `https://polygonscan.com/tx/${tx.txHash}`,
                            "_blank",
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
