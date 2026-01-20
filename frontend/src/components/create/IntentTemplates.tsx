import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Calendar, Gift, Zap, ArrowRight, Clock, Shield, Coins } from "lucide-react";
import { PaymentIntent } from "@/components/dashboard/IntentCard";

export interface IntentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "subscription" | "rent" | "allowance" | "recurring";
  popularityScore: number;
  defaultValues: Partial<PaymentIntent>;
}

export const intentTemplates: IntentTemplate[] = [
  {
    id: "rent",
    name: "Monthly Rent Payment",
    description: "Automate your monthly rent with safety buffers to ensure you never miss a payment",
    icon: <Home className="w-5 h-5" />,
    category: "rent",
    popularityScore: 95,
    defaultValues: {
      amount: 1000,
      token: "USDC",
      frequency: "Monthly",
      safetyBuffer: 300,
      status: "ready",
    },
  },
  {
    id: "subscription",
    name: "Subscription Service",
    description: "Set up recurring payments for subscriptions like Netflix, Spotify, or cloud services",
    icon: <Calendar className="w-5 h-5" />,
    category: "subscription",
    popularityScore: 88,
    defaultValues: {
      amount: 15,
      token: "USDC",
      frequency: "Monthly",
      safetyBuffer: 50,
      status: "ready",
    },
  },
  {
    id: "allowance",
    name: "Weekly Allowance",
    description: "Automatically send weekly allowances to family members when your balance is sufficient",
    icon: <Gift className="w-5 h-5" />,
    category: "allowance",
    popularityScore: 72,
    defaultValues: {
      amount: 50,
      token: "USDC",
      frequency: "Weekly",
      safetyBuffer: 200,
      status: "ready",
    },
  },
  {
    id: "utility",
    name: "Utility Bill Payment",
    description: "Pay your electricity, water, or internet bills automatically every month",
    icon: <Zap className="w-5 h-5" />,
    category: "recurring",
    popularityScore: 81,
    defaultValues: {
      amount: 100,
      token: "USDC",
      frequency: "Monthly",
      safetyBuffer: 150,
      status: "ready",
    },
  },
  {
    id: "savings",
    name: "Auto-Savings Transfer",
    description: "Automatically transfer a portion of your funds to savings every week",
    icon: <Coins className="w-5 h-5" />,
    category: "recurring",
    popularityScore: 68,
    defaultValues: {
      amount: 100,
      token: "USDC",
      frequency: "Weekly",
      safetyBuffer: 500,
      status: "ready",
    },
  },
  {
    id: "payroll",
    name: "Contractor Payment",
    description: "Schedule automatic payments to contractors or freelancers bi-weekly",
    icon: <Clock className="w-5 h-5" />,
    category: "recurring",
    popularityScore: 65,
    defaultValues: {
      amount: 500,
      token: "USDC",
      frequency: "Bi-weekly",
      safetyBuffer: 1000,
      status: "ready",
    },
  },
];

interface IntentTemplatesProps {
  onSelectTemplate: (template: IntentTemplate) => void;
}

const IntentTemplates = ({ onSelectTemplate }: IntentTemplatesProps) => {
  const getCategoryColor = (category: IntentTemplate["category"]) => {
    switch (category) {
      case "rent":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "subscription":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "allowance":
        return "bg-pink-500/10 text-pink-600 border-pink-500/20";
      case "recurring":
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  const formatCategoryLabel = (category: IntentTemplate["category"]) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display text-3xl font-bold mb-3">
          Start with a <span className="gradient-text">Template</span>
        </h2>
        <p className="text-muted-foreground">
          Choose from our pre-built templates to create common payment intents in seconds
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {intentTemplates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-elevated transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer relative overflow-hidden"
            onClick={() => onSelectTemplate(template)}
          >
            {/* Popularity indicator */}
            {template.popularityScore >= 80 && (
              <div className="absolute top-3 right-3">
                <Badge variant="default" className="bg-primary/90">
                  Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
                  <Badge variant="outline" className={getCategoryColor(template.category)}>
                    {formatCategoryLabel(template.category)}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Default Amount:</span>
                  <span className="font-mono font-medium">
                    {template.defaultValues.amount} {template.defaultValues.token}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Frequency:</span>
                  <span className="font-medium">{template.defaultValues.frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Safety Buffer:
                  </span>
                  <span className="font-mono font-medium">
                    {template.defaultValues.safetyBuffer} {template.defaultValues.token}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Use Template
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground mb-4">
          Don't see what you need? Create a custom intent from scratch
        </p>
        {/* <Button variant="ghost" className="hover:text-primary">
          Browse Community Templates
          <ArrowRight className="w-4 h-4" />
        </Button> */}
      </div>
    </div>
  );
};

export default IntentTemplates;
