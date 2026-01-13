import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Mail, CheckCircle2 } from "lucide-react";
import { BiMobileVibration } from "react-icons/bi";
import { LiaTelegramPlane } from "react-icons/lia";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationPreferences {
  inApp: boolean;
  email: {
    enabled: boolean;
    address: string;
    frequency: "instant" | "daily" | "weekly";
  };
  telegram: {
    enabled: boolean;
    username: string;
  };
  events: {
    intentExecuted: boolean;
    intentDelayed: boolean;
    intentCreated: boolean;
    lowBalance: boolean;
    gasAlert: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  inApp: true,
  email: {
    enabled: false,
    address: "",
    frequency: "instant",
  },
  telegram: {
    enabled: false,
    username: "",
  },
  events: {
    intentExecuted: true,
    intentDelayed: true,
    intentCreated: true,
    lowBalance: true,
    gasAlert: false,
  },
};

interface NotificationPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationPreferencesModal = ({ open, onOpenChange }: NotificationPreferencesModalProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  const handleSave = () => {
    // TODO: Save to backend
    toast.success("Preferences Saved", {
      description: "Your notification preferences have been updated successfully.",
    });
    onOpenChange(false);
  };

  const updatePreference = (path: string[], value: any) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev };
      let current: any = newPrefs;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newPrefs;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Customize how and when you receive notifications about your payment intents
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* In-App Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BiMobileVibration className="w-5 h-5 text-primary" />
                <div>
                  <Label className="text-base">In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications in the app notification center
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.inApp}
                onCheckedChange={(checked) => updatePreference(["inApp"], checked)}
              />
            </div>
          </div>

          {/* Email Notifications */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.email.enabled}
                onCheckedChange={(checked) => updatePreference(["email", "enabled"], checked)}
              />
            </div>

            {preferences.email.enabled && (
              <div className="pl-8 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={preferences.email.address}
                    onChange={(e) => updatePreference(["email", "address"], e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <Select
                    value={preferences.email.frequency}
                    onValueChange={(value) => updatePreference(["email", "frequency"], value)}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant (as they happen)</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Telegram Notifications */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LiaTelegramPlane className="w-6 h-6 text-primary" />
                <div>
                  <Label className="text-base">Telegram Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via Telegram bot
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.telegram.enabled}
                onCheckedChange={(checked) => updatePreference(["telegram", "enabled"], checked)}
              />
            </div>

            {preferences.telegram.enabled && (
              <div className="pl-8 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram Username</Label>
                  <div className="flex gap-2">
                    <Input
                      id="telegram"
                      placeholder="@yourusername"
                      value={preferences.telegram.username}
                      onChange={(e) => updatePreference(["telegram", "username"], e.target.value)}
                    />
                    <Button variant="outline" size="default">
                      Connect
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Connect your Telegram account via @flowpay_bot
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Event Types */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <Label className="text-base">Notification Events</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose which events trigger notifications
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <Label className="font-normal">Intent Executed</Label>
                </div>
                <Switch
                  checked={preferences.events.intentExecuted}
                  onCheckedChange={(checked) => updatePreference(["events", "intentExecuted"], checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-warning" />
                  <Label className="font-normal">Intent Delayed</Label>
                </div>
                <Switch
                  checked={preferences.events.intentDelayed}
                  onCheckedChange={(checked) => updatePreference(["events", "intentDelayed"], checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <Label className="font-normal">Intent Created</Label>
                </div>
                <Switch
                  checked={preferences.events.intentCreated}
                  onCheckedChange={(checked) => updatePreference(["events", "intentCreated"], checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-destructive" />
                  <Label className="font-normal">Low Balance Warning</Label>
                </div>
                <Switch
                  checked={preferences.events.lowBalance}
                  onCheckedChange={(checked) => updatePreference(["events", "lowBalance"], checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-normal">Gas Price Alerts</Label>
                </div>
                <Switch
                  checked={preferences.events.gasAlert}
                  onCheckedChange={(checked) => updatePreference(["events", "gasAlert"], checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPreferencesModal;
