import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Info, Shield, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const CreateIntentForm = () => {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [frequency, setFrequency] = useState("monthly");
  const [safetyBuffer, setSafetyBuffer] = useState([300]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Intent Created!",
      description: `Payment intent for ${amount} ${token} has been created successfully.`,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-border/50 shadow-card">
      <CardHeader className="text-center pb-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
          <Wallet className="w-7 h-7 text-primary-foreground" />
        </div>
        <CardTitle className="font-display text-2xl">Create Payment Intent</CardTitle>
        <CardDescription>Define your payment constraints and let the agent handle execution</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <span className="font-mono font-semibold text-primary">{safetyBuffer[0]} {token}</span>
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
              Pay <span className="font-semibold text-foreground">{amount || "0"} {token}</span> to{" "}
              <span className="font-mono text-foreground">{recipient || "recipient"}</span>{" "}
              <span className="font-semibold text-foreground">{frequency}</span>, keeping at least{" "}
              <span className="font-semibold text-foreground">{safetyBuffer[0]} {token}</span> in wallet.
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" variant="gradient" size="lg" className="w-full">
            Create Intent
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateIntentForm;
