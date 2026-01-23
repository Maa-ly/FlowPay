import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Info, Shield, Wallet, Sparkles } from "lucide-react";
import { toast } from "sonner";
import AdvancedConstraintsForm, {
  AdvancedConstraints,
} from "./AdvancedConstraintsForm";
import { IntentTemplate } from "./IntentTemplates";
import { useFlowPayAPI } from "@/hooks/useFlowPayAPI";

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" },
];

const tokens = [
  { value: "USDC", label: "USDC" },
  { value: "USDT", label: "USDT" },
  { value: "CRO", label: "CRO" },
  { value: "ETH", label: "ETH" },
];

interface CreateIntentFormProps {
  selectedTemplate?: IntentTemplate | null;
}

const CreateIntentForm = ({ selectedTemplate }: CreateIntentFormProps) => {
  const navigate = useNavigate();
  const { createIntent } = useFlowPayAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [intentName, setIntentName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [frequency, setFrequency] = useState("monthly");
  const [safetyBuffer, setSafetyBuffer] = useState([300]);
  const [constraints, setConstraints] = useState<AdvancedConstraints>({
    timeWindow: { enabled: false, startHour: 9, endHour: 17 },
    gasPriceLimit: { enabled: false, maxGwei: 50 },
    conditions: {
      logic: "AND",
      balanceCheck: true,
      timeCheck: false,
      gasCheck: false,
    },
  });

  // Pre-fill form when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      setIntentName(selectedTemplate.name || "");
      setAmount(selectedTemplate.defaultValues.amount?.toString() || "");
      setToken(selectedTemplate.defaultValues.token || "USDC");
      setFrequency(
        selectedTemplate.defaultValues.frequency?.toLowerCase() || "monthly",
      );
      setSafetyBuffer([selectedTemplate.defaultValues.safetyBuffer || 300]);
      toast.success("Template Loaded", {
        description: `${selectedTemplate.name} template applied successfully`,
      });
    }
  }, [selectedTemplate]);

  const TOKEN_ADDRESSES: Record<string, string> = {
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!recipient || !amount) {
      toast.error("Missing Required Fields", {
        description: "Please provide recipient address and amount",
      });
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      toast.error("Invalid Address", {
        description: "Please provide a valid Ethereum address",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createIntent({
        name: intentName || `${frequency} payment of ${amount} ${token}`,
        recipient,
        amount: parseFloat(amount),
        token,
        tokenAddress: TOKEN_ADDRESSES[token],
        frequency: frequency.toUpperCase() as "DAILY" | "WEEKLY" | "MONTHLY",
        safetyBuffer: safetyBuffer[0],
        maxGasPrice: constraints.gasPriceLimit.enabled
          ? constraints.gasPriceLimit.maxGwei * 1e9
          : undefined,
        timeWindowStart: constraints.timeWindow.enabled
          ? `${constraints.timeWindow.startHour.toString().padStart(2, "0")}:00`
          : undefined,
        timeWindowEnd: constraints.timeWindow.enabled
          ? `${constraints.timeWindow.endHour.toString().padStart(2, "0")}:00`
          : undefined,
      });

      toast.success("Intent Created!", {
        description: `${intentName || "Payment intent"} for ${amount} ${token} has been created successfully.`,
      });

      // Navigate to dashboard after successful creation
      navigate("/dashboard");
    } catch (error) {
      const err = error as Error;
      console.error("Failed to create intent:", err);
      toast.error("Failed to Create Intent", {
        description:
          err.message ||
          "Please check if the backend server is running on http://localhost:3000",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {selectedTemplate && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">
                  Using Template: {selectedTemplate.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTemplate.description}
                </p>
              </div>
              <Badge variant="outline" className="bg-background">
                {selectedTemplate.category.charAt(0).toUpperCase() +
                  selectedTemplate.category.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-2xl mx-auto border-border/50 shadow-card">
        <CardHeader className="text-center pb-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="font-display text-2xl">
            Create Payment Intent
          </CardTitle>
          <CardDescription>
            Define your payment constraints and let the agent handle execution
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Intent Name */}
            <div className="space-y-2">
              <Label htmlFor="intentName">Intent Name (Optional)</Label>
              <Input
                id="intentName"
                placeholder="e.g., Monthly Rent, Netflix Subscription"
                value={intentName}
                onChange={(e) => setIntentName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Give your intent a memorable name to easily track it
              </p>
            </div>

            {/* Recipient */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono"
              />
            </div>

            {/* Amount & Token */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="100.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Token</Label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label>Payment Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Safety Buffer */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Safety Buffer</Label>
                  <div className="relative group">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg text-xs w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      Minimum balance to maintain after payment execution
                    </div>
                  </div>
                </div>
                <span className="font-mono font-semibold text-primary">
                  {safetyBuffer[0]} {token}
                </span>
              </div>
              <Slider
                value={safetyBuffer}
                onValueChange={setSafetyBuffer}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 {token}</span>
                <span>1000 {token}</span>
              </div>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="w-4 h-4 text-primary" />
                Intent Summary
              </div>
              <p className="text-sm text-muted-foreground">
                Pay{" "}
                <span className="font-semibold text-foreground">
                  {amount || "0"} {token}
                </span>{" "}
                to{" "}
                <span className="font-mono text-foreground">
                  {recipient || "recipient"}
                </span>{" "}
                <span className="font-semibold text-foreground">
                  {frequency}
                </span>
                , keeping at least{" "}
                <span className="font-semibold text-foreground">
                  {safetyBuffer[0]} {token}
                </span>{" "}
                in wallet.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Intent..." : "Create Intent"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Advanced Constraints */}
      <div className="max-w-2xl mx-auto">
        <AdvancedConstraintsForm
          constraints={constraints}
          onConstraintsChange={setConstraints}
        />
      </div>
    </div>
  );
};

export default CreateIntentForm;
