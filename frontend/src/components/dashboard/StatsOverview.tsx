import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import { Intent } from "@/hooks/useFlowPayAPI";
import { useMemo } from "react";

interface StatsOverviewProps {
  intents: Intent[];
}

const StatsOverview = ({ intents }: StatsOverviewProps) => {
  const stats = useMemo(() => {
    const activeIntents = intents.filter((i) => i.status === "ACTIVE");
    const pausedIntents = intents.filter((i) => i.status === "PAUSED");

    // Calculate total balance from safety buffers
    const totalBalance = intents.reduce(
      (sum, intent) => sum + parseFloat(intent.safetyBuffer || "0"),
      0,
    );

    // Calculate executed this month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const executedThisMonth = intents.reduce((sum, intent) => {
      if (intent.lastExecution) {
        const lastExecDate = new Date(intent.lastExecution);
        if (lastExecDate >= firstDayOfMonth) {
          return sum + intent.executionCount;
        }
      }
      return sum;
    }, 0);

    // Calculate total amount executed this month
    const totalExecutedAmount = intents.reduce((sum, intent) => {
      if (intent.lastExecution) {
        const lastExecDate = new Date(intent.lastExecution);
        if (lastExecDate >= firstDayOfMonth && intent.executionCount > 0) {
          return sum + parseFloat(intent.amount) * intent.executionCount;
        }
      }
      return sum;
    }, 0);

    return [
      {
        label: "Total Balance",
        value: totalBalance.toFixed(2),
        unit: "USDC",
        change: `${intents.length} intents`,
        positive: true,
        icon: <Wallet className="w-5 h-5" />,
      },
      {
        label: "Active Intents",
        value: activeIntents.length.toString(),
        unit: "intents",
        change:
          pausedIntents.length > 0
            ? `${pausedIntents.length} paused`
            : "All active",
        positive: activeIntents.length > 0,
        icon: <TrendingUp className="w-5 h-5" />,
      },
      {
        label: "Executed This Month",
        value: executedThisMonth.toString(),
        unit: "payments",
        change:
          totalExecutedAmount > 0
            ? `${totalExecutedAmount.toFixed(0)} USDC`
            : "No executions",
        positive: executedThisMonth > 0,
        icon: <ArrowUpRight className="w-5 h-5" />,
      },
      {
        label: "Pending",
        value: pausedIntents.length.toString(),
        unit: "intents",
        change: pausedIntents.length > 0 ? "Paused" : "None",
        positive: pausedIntents.length === 0,
        icon: <Clock className="w-5 h-5" />,
      },
    ];
  }, [intents]);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-border/50 hover:border-primary/30 transition-colors"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
                {stat.icon}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-display text-2xl font-bold">
              {stat.value}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {stat.unit}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
