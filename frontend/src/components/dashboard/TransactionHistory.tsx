import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Clock, TrendingUp } from "lucide-react";
import { formatDistance } from "date-fns";

export interface Transaction {
  id: string;
  intentId: string;
  intentName: string;
  recipient: string;
  amount: number;
  token: string;
  status: "completed" | "pending" | "failed";
  timestamp: Date;
  txHash?: string;
  gasUsed?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    intentId: "3",
    intentName: "Monthly Rent",
    recipient: "0x9876...5432",
    amount: 500,
    token: "USDC",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 2), // 2 days ago
    txHash: "0xabc123...def456",
    gasUsed: "0.05",
  },
  {
    id: "tx2",
    intentId: "1",
    intentName: "Weekly Groceries",
    recipient: "0x1234...5678",
    amount: 100,
    token: "USDC",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 30), // 30 days ago
    txHash: "0xdef789...abc123",
    gasUsed: "0.03",
  },
  {
    id: "tx3",
    intentId: "2",
    intentName: "Weekly Allowance",
    recipient: "0xabcd...efgh",
    amount: 50,
    token: "USDC",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 7), // 7 days ago
    txHash: "0x123abc...789def",
    gasUsed: "0.04",
  },
  {
    id: "tx4",
    intentId: "4",
    intentName: "Contractor Payment",
    recipient: "0xdef0...1234",
    amount: 25,
    token: "CRO",
    status: "completed",
    timestamp: new Date(Date.now() - 86400000 * 14), // 14 days ago
    txHash: "0x456def...123abc",
    gasUsed: "0.02",
  },
];

const TransactionHistory = () => {
  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
    }
  };

  const totalVolume = mockTransactions
    .filter(tx => tx.status === "completed")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalGasSpent = mockTransactions
    .filter(tx => tx.gasUsed)
    .reduce((acc, tx) => acc + parseFloat(tx.gasUsed || "0"), 0)
    .toFixed(2);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-3xl">{mockTransactions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Volume</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {totalVolume}
              <span className="text-sm font-normal text-muted-foreground">USDC</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gas Spent</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {totalGasSpent}
              <span className="text-sm font-normal text-muted-foreground">CRO</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>View your payment intent execution history</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No transaction history yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Transactions will appear here once your intents execute
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{tx.intentName}</p>
                        {getStatusBadge(tx.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        To: {tx.recipient}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistance(tx.timestamp, new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {tx.amount} {tx.token}
                      </p>
                      {tx.gasUsed && (
                        <p className="text-xs text-muted-foreground">
                          Gas: {tx.gasUsed} CRO
                        </p>
                      )}
                    </div>
                    {tx.txHash && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://explorer.cronos.org/tx/${tx.txHash}`, '_blank')}
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
