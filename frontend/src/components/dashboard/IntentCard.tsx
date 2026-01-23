import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Eye,
  Edit,
  Trash2,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

export interface PaymentIntent {
  id: string;
  name?: string;
  recipient: string;
  amount: number;
  token: string;
  frequency: string;
  safetyBuffer: number;
  status: "ready" | "delayed" | "executed" | "paused" | "active" | "cancelled";
  nextExecution?: string;
  reason?: string;
}

interface IntentCardProps {
  intent: PaymentIntent;
  onEdit?: (intent: PaymentIntent) => void;
  onDelete?: (intent: PaymentIntent) => void;
  onPauseResume?: (intentId: string, currentStatus: string) => void;
}

const statusConfig = {
  ready: {
    label: "Ready",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
  active: {
    label: "Active",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-success/10 text-success border-success/20",
  },
  delayed: {
    label: "Delayed",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  executed: {
    label: "Executed",
    icon: <ArrowUpRight className="w-3.5 h-3.5" />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  paused: {
    label: "Paused",
    icon: <Pause className="w-3.5 h-3.5" />,
    className: "bg-muted text-muted-foreground border-border",
  },
  cancelled: {
    label: "Cancelled",
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const IntentCard = ({
  intent,
  onEdit,
  onDelete,
  onPauseResume,
}: IntentCardProps) => {
  const [intentStatus, setIntentStatus] = useState(intent.status);
  const status = statusConfig[intentStatus] || statusConfig.ready;
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/intent/${intent.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit({ ...intent, status: intentStatus });
    }
  };

  const handlePauseResume = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onPauseResume) {
      onPauseResume(intent.id, intentStatus);
      // Update local state optimistically
      const newStatus =
        intentStatus === "paused" || intentStatus === "cancelled"
          ? "active"
          : "paused";
      setIntentStatus(newStatus as any);
    } else {
      // Fallback to local state update only
      const newStatus = intentStatus === "paused" ? "ready" : "paused";
      setIntentStatus(newStatus);

      toast.success(
        newStatus === "paused" ? "Intent Paused" : "Intent Resumed",
        {
          description:
            newStatus === "paused"
              ? "This intent will not execute until resumed."
              : "This intent is now active and will execute when conditions are met.",
        },
      );
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete({ ...intent, status: intentStatus });
    }
  };

  return (
    <Card
      className="group hover:shadow-elevated transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer hover:scale-[1.02] hover:-translate-y-1"
      onClick={handleView}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform self-start">
            <span className="font-mono text-base font-semibold text-primary">
              {intent.token}
            </span>
          </div>
          <div>
            {intent.name && (
              <p className="font-semibold text-base text-foreground mb-0.5">
                {intent.name}
              </p>
            )}
            <p
              className={`font-semibold ${intent.name ? "text-sm" : "text-lg"}`}
            >
              {intent.amount} {intent.token}
            </p>
            <p className="text-sm text-muted-foreground font-mono truncate max-w-[160px]">
              {intent.recipient}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleView} className="cursor-pointer">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit Intent
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlePauseResume}
              className="cursor-pointer"
            >
              {intentStatus === "paused" ? (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Resume Intent
                </>
              ) : (
                <>
                  <PauseCircle className="w-4 h-4 mr-2" />
                  Pause Intent
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Intent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`${status.className} flex items-center gap-1.5`}
          >
            {status.icon}
            {status.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {intent.frequency}
          </span>
        </div>

        {intent.reason && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">{intent.reason}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Safety Buffer:</span>
            <span className="font-mono font-medium text-foreground">
              {intent.safetyBuffer} {intent.token}
            </span>
          </div>
          {intent.nextExecution && (
            <span className="text-xs text-muted-foreground">
              Next: {intent.nextExecution}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntentCard;
