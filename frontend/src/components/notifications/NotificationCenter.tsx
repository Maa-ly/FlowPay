import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotificationPreferencesModal from "./NotificationPreferencesModal";
import {
  useFlowPayAPI,
  Notification as APINotification,
} from "@/hooks/useFlowPayAPI";
import { useFlowPayAuth } from "@/hooks/useFlowPayAuth";
import { formatDateShort } from "@/lib/utils";

export interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "error";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  intentId?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<APINotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { listNotifications, markAsRead, getUnreadCount } = useFlowPayAPI();
  const { isAuthenticated } = useFlowPayAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await listNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const { count } = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Call the mark all as read endpoint
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/read-all`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("flowpay_token")}`,
          },
        },
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = (id: string) => {
    // For now, just remove from local state
    // TODO: Add delete endpoint in backend
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (notification: APINotification) => {
    handleMarkAsRead(notification.id);

    // Extract intentId from notification data if available
    const intentId = notification.data?.intentId;

    if (intentId) {
      setIsOpen(false);
      navigate(`/intent/${intentId}`);
    } else {
      toast.info(notification.title, {
        description: notification.message,
      });
    }
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    setShowPreferences(true);
  };

  const getNotificationType = (
    type: string,
  ): "success" | "warning" | "info" | "error" => {
    switch (type) {
      case "EXECUTION_SUCCESS":
      case "INTENT_CREATED":
        return "success";
      case "EXECUTION_DELAYED":
        return "warning";
      case "EXECUTION_FAILED":
        return "error";
      default:
        return "info";
    }
  };

  const getIcon = (type: string) => {
    const notifType = getNotificationType(type);
    switch (notifType) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "info":
        return <Clock className="w-4 h-4 text-primary" />;
    }
  };

  const formatTimestamp = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "1d ago";
    return formatDateShort(isoDate);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-96 max-h-[500px] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-2 py-2">
            <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-8 text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSettingsClick}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <DropdownMenuSeparator />

          {loading ? (
            <div className="py-8 text-center">
              <Clock className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2 animate-spin" />
              <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative px-2 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.sentAt)}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Preferences Modal */}
      <NotificationPreferencesModal
        open={showPreferences}
        onOpenChange={setShowPreferences}
      />
    </>
  );
};

export default NotificationCenter;
