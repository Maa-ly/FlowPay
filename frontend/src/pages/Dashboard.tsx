import Header from "@/components/layout/Header";
import StatsOverview from "@/components/dashboard/StatsOverview";
import IntentCard, { PaymentIntent } from "@/components/dashboard/IntentCard";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockIntents: PaymentIntent[] = [
  {
    id: "1",
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
    recipient: "0xdef0...1234",
    amount: 25,
    token: "CRO",
    frequency: "Bi-weekly",
    safetyBuffer: 100,
    status: "paused",
  },
];

type FilterOption = "all" | "ready" | "delayed" | "executed" | "paused";

const Dashboard = () => {
  const [filter, setFilter] = useState<FilterOption>("all");

  const filteredIntents = filter === "all" 
    ? mockIntents 
    : mockIntents.filter(intent => intent.status === filter);

  const filterLabels: Record<FilterOption, string> = {
    all: "All Intents",
    ready: "Ready",
    delayed: "Delayed",
    executed: "Executed",
    paused: "Paused",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage your payment intents</p>
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
          <StatsOverview />
        </div>

        {/* Intents Grid */}
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">
              {filter === "all" ? "Active Intents" : `${filterLabels[filter]} Intents`}
              <span className="text-muted-foreground text-base font-normal ml-2">
                ({filteredIntents.length})
              </span>
            </h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default">
                  <Filter className="w-4 h-4" />
                  {filterLabels[filter]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
                  <DropdownMenuRadioItem value="all">All Intents</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="ready">Ready</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="delayed">Delayed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="executed">Executed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="paused">Paused</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {filteredIntents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntents.map((intent) => (
                <IntentCard key={intent.id} intent={intent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-xl border border-border">
              <p className="text-muted-foreground">No intents found with this filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;