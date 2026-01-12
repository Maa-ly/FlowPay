import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ArrowUpRight, Clock, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Balance",
    value: "2,450.00",
    unit: "USDC",
    change: "+12.5%",
    positive: true,
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    label: "Active Intents",
    value: "4",
    unit: "intents",
    change: "+2",
    positive: true,
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Executed This Month",
    value: "12",
    unit: "payments",
    change: "850 USDC",
    positive: true,
    icon: <ArrowUpRight className="w-5 h-5" />,
  },
  {
    label: "Pending",
    value: "2",
    unit: "intents",
    change: "Delayed",
    positive: false,
    icon: <Clock className="w-5 h-5" />,
  },
];

const StatsOverview = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary">
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.positive 
                  ? "bg-success/10 text-success" 
                  : "bg-warning/10 text-warning"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-display text-2xl font-bold">
              {stat.value} <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
