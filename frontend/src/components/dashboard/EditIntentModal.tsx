import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Pencil, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Intent {
  id: string;
  name?: string;
  recipient: string;
  amount: number;
  token: string;
  frequency: string;
  safetyBuffer: number;
}

interface EditIntentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intent: Intent | null;
  onSave: (updatedIntent: Intent) => void;
}

export function EditIntentModal({ open, onOpenChange, intent, onSave }: EditIntentModalProps) {
  const [editForm, setEditForm] = useState<Intent>(
    intent || {
      id: "",
      name: "",
      recipient: "",
      amount: 0,
      token: "USDC",
      frequency: "Monthly",
      safetyBuffer: 0,
    }
  );

  // Update form when intent changes
  useState(() => {
    if (intent) {
      setEditForm(intent);
    }
  });

  const handleSave = () => {
    if (!editForm.recipient || editForm.amount <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSave(editForm);
    onOpenChange(false);
    toast.success("Intent updated successfully!");
  };

  if (!intent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Edit Intent
          </DialogTitle>
          <DialogDescription>
            Modify your payment intent details below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Intent Name (Optional)</Label>
            <Input
              id="edit-name"
              value={editForm.name || ""}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="e.g., Monthly Rent, Netflix Subscription"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-recipient">Recipient Address</Label>
            <Input
              id="edit-recipient"
              value={editForm.recipient}
              onChange={(e) => setEditForm({ ...editForm, recipient: e.target.value })}
              placeholder="0x..."
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-token">Token</Label>
              <Select value={editForm.token} onValueChange={(value) => setEditForm({ ...editForm, token: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="CRO">CRO</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-frequency">Frequency</Label>
            <Select value={editForm.frequency} onValueChange={(value) => setEditForm({ ...editForm, frequency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Safety Buffer</Label>
              <span className="text-sm font-mono text-muted-foreground">{editForm.safetyBuffer} {editForm.token}</span>
            </div>
            <Slider
              value={[editForm.safetyBuffer]}
              onValueChange={(value) => setEditForm({ ...editForm, safetyBuffer: value[0] })}
              max={1000}
              min={0}
              step={10}
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            <CheckCircle2 className="w-4 h-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
