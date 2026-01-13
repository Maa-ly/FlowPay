import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteIntentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  intentData: {
    name?: string;
    amount: number;
    token: string;
    recipient: string;
    frequency: string;
  };
}

const DeleteIntentModal = ({ isOpen, onOpenChange, onDelete, intentData }: DeleteIntentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Intent
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment intent? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 rounded-lg bg-muted/50 border border-border">
          {intentData.name && (
            <p className="font-semibold text-base mb-1">{intentData.name}</p>
          )}
          <p className="font-medium">{intentData.amount} {intentData.token}</p>
          <p className="text-sm text-muted-foreground font-mono">{intentData.recipient}</p>
          <p className="text-sm text-muted-foreground">{intentData.frequency}</p>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
            Delete Intent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIntentModal;
