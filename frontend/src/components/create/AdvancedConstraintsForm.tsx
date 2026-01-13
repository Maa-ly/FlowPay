import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Fuel, Zap, Info } from "lucide-react";
import { useState } from "react";

export interface AdvancedConstraints {
  timeWindow: {
    enabled: boolean;
    startHour: number;
    endHour: number;
  };
  gasPriceLimit: {
    enabled: boolean;
    maxGwei: number;
  };
  conditions: {
    logic: "AND" | "OR";
    balanceCheck: boolean;
    timeCheck: boolean;
    gasCheck: boolean;
  };
}

interface AdvancedConstraintsFormProps {
  constraints: AdvancedConstraints;
  onConstraintsChange: (constraints: AdvancedConstraints) => void;
}

const AdvancedConstraintsForm = ({ constraints, onConstraintsChange }: AdvancedConstraintsFormProps) => {
  const handleTimeWindowToggle = (enabled: boolean) => {
    onConstraintsChange({
      ...constraints,
      timeWindow: { ...constraints.timeWindow, enabled },
    });
  };

  const handleTimeChange = (type: "start" | "end", value: number) => {
    onConstraintsChange({
      ...constraints,
      timeWindow: {
        ...constraints.timeWindow,
        [type === "start" ? "startHour" : "endHour"]: value,
      },
    });
  };

  const handleGasPriceToggle = (enabled: boolean) => {
    onConstraintsChange({
      ...constraints,
      gasPriceLimit: { ...constraints.gasPriceLimit, enabled },
    });
  };

  const handleGasPriceChange = (value: number[]) => {
    onConstraintsChange({
      ...constraints,
      gasPriceLimit: { ...constraints.gasPriceLimit, maxGwei: value[0] },
    });
  };

  const handleLogicChange = (logic: "AND" | "OR") => {
    onConstraintsChange({
      ...constraints,
      conditions: { ...constraints.conditions, logic },
    });
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const activeConstraintsCount = [
    constraints.conditions.balanceCheck,
    constraints.timeWindow.enabled,
    constraints.gasPriceLimit.enabled,
  ].filter(Boolean).length;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Advanced Constraints
              <Badge variant="outline" className="ml-2">
                {activeConstraintsCount} Active
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Fine-tune when and how your payment intent executes
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Time Window Constraint */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <Label htmlFor="time-window" className="font-medium">
                Time Window
              </Label>
            </div>
            <Switch
              id="time-window"
              checked={constraints.timeWindow.enabled}
              onCheckedChange={handleTimeWindowToggle}
            />
          </div>

          {constraints.timeWindow.enabled && (
            <div className="pl-6 space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Only execute payments during specific hours
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Start Time</Label>
                  <Select
                    value={constraints.timeWindow.startHour.toString()}
                    onValueChange={(value) => handleTimeChange("start", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {formatHour(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">End Time</Label>
                  <Select
                    value={constraints.timeWindow.endHour.toString()}
                    onValueChange={(value) => handleTimeChange("end", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {formatHour(i)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-xs">
                <Info className="w-3 h-3 text-primary" />
                <span>
                  Payments will only execute between {formatHour(constraints.timeWindow.startHour)} and{" "}
                  {formatHour(constraints.timeWindow.endHour)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Gas Price Limit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-primary" />
              <Label htmlFor="gas-limit" className="font-medium">
                Gas Price Limit
              </Label>
            </div>
            <Switch
              id="gas-limit"
              checked={constraints.gasPriceLimit.enabled}
              onCheckedChange={handleGasPriceToggle}
            />
          </div>

          {constraints.gasPriceLimit.enabled && (
            <div className="pl-6 space-y-3 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Only execute when gas price is below threshold
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Maximum Gas Price</Label>
                  <span className="font-mono text-sm font-medium">
                    {constraints.gasPriceLimit.maxGwei} Gwei
                  </span>
                </div>
                <Slider
                  value={[constraints.gasPriceLimit.maxGwei]}
                  onValueChange={handleGasPriceChange}
                  min={1}
                  max={200}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Cheap (1 Gwei)</span>
                  <span>Expensive (200 Gwei)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 text-xs">
                <Info className="w-3 h-3 text-primary" />
                <span>
                  Transactions will wait for gas prices below {constraints.gasPriceLimit.maxGwei} Gwei
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Condition Logic */}
        <div className="space-y-4">
          <Label className="font-medium">Condition Logic</Label>
          <div className="flex gap-3">
            <button
              onClick={() => handleLogicChange("AND")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                constraints.conditions.logic === "AND"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-semibold mb-1">ALL (AND)</div>
              <div className="text-xs text-muted-foreground">
                All constraints must be met
              </div>
            </button>
            <button
              onClick={() => handleLogicChange("OR")}
              className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                constraints.conditions.logic === "OR"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="font-semibold mb-1">ANY (OR)</div>
              <div className="text-xs text-muted-foreground">
                Any constraint can trigger execution
              </div>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Execution Summary
          </h4>
          <p className="text-xs text-muted-foreground">
            {constraints.conditions.logic === "AND" ? (
              <>
                This intent will execute <strong>only when all</strong> active constraints are satisfied:
                balance check
                {constraints.timeWindow.enabled && ", time window"}
                {constraints.gasPriceLimit.enabled && ", gas price limit"}
              </>
            ) : (
              <>
                This intent will execute when <strong>any</strong> active constraint is satisfied:
                balance check
                {constraints.timeWindow.enabled && " OR time window"}
                {constraints.gasPriceLimit.enabled && " OR gas price limit"}
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedConstraintsForm;
