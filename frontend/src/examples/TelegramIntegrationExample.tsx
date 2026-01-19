/**
 * Example: Using Telegram Features in CreateIntentForm
 * 
 * This file demonstrates how to integrate Telegram-specific features
 * into your FlowPay components.
 */

import { useTelegram } from '@/contexts/TelegramContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function CreateIntentFormExample() {
  const {
    user,              // Telegram user data
    isInTelegram,      // true if running in Telegram
    theme,             // 'light' | 'dark'
    showAlert,         // Show native Telegram alert
    showConfirm,       // Show native Telegram confirm dialog
    hapticFeedback,    // Trigger haptic feedback
    showMainButton,    // Show Telegram's main button
    hideMainButton,    // Hide Telegram's main button
  } = useTelegram();

  const [formData, setFormData] = useState({
    amount: '',
    recipient: '',
  });

  // Example 1: Show Telegram's main button on mount
  useEffect(() => {
    if (isInTelegram) {
      showMainButton('Create Intent', handleSubmit);
      
      // Cleanup: hide button when component unmounts
      return () => {
        hideMainButton();
      };
    }
  }, [isInTelegram]);

  // Example 2: Handle form submission with Telegram feedback
  const handleSubmit = async () => {
    // Haptic feedback on button press (Telegram only)
    if (isInTelegram) {
      hapticFeedback('impact', 'medium');
    }

    try {
      // Your API call here
      await createIntent(formData);
      
      // Success feedback
      if (isInTelegram) {
        hapticFeedback('notification', 'success');
        showAlert('Intent created successfully!');
      } else {
        toast.success('Intent created!');
      }
    } catch (error) {
      // Error feedback
      if (isInTelegram) {
        hapticFeedback('notification', 'error');
        showAlert('Failed to create intent. Please try again.');
      } else {
        toast.error('Failed to create intent');
      }
    }
  };

  // Example 3: Confirm dialog before dangerous action
  const handleDelete = () => {
    if (isInTelegram) {
      showConfirm(
        'Are you sure you want to delete this intent?',
        (confirmed) => {
          if (confirmed) {
            hapticFeedback('impact', 'heavy');
            // Delete logic here
          }
        }
      );
    } else {
      if (confirm('Are you sure?')) {
        // Delete logic here
      }
    }
  };

  // Example 4: Conditional rendering based on Telegram
  return (
    <div className="p-4">
      {/* Show Telegram user info if in Telegram */}
      {isInTelegram && user && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">
            👋 Hi, <strong>{user.first_name}</strong>!
            {user.is_premium && ' ⭐'}
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Create Payment Intent</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => {
                // Selection feedback on input change
                if (isInTelegram) {
                  hapticFeedback('selection');
                }
                setFormData({ ...formData, amount: e.target.value });
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Recipient</label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => {
                if (isInTelegram) {
                  hapticFeedback('selection');
                }
                setFormData({ ...formData, recipient: e.target.value });
              }}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Hide submit button if in Telegram (using Main Button instead) */}
          {!isInTelegram && (
            <Button type="submit" className="w-full">
              Create Intent
            </Button>
          )}

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="w-full"
          >
            Delete Intent
          </Button>
        </div>
      </form>

      {/* Example 5: Theme-aware styling */}
      <div
        className="mt-4 p-3 rounded"
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
          color: theme === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        <p className="text-sm">
          {isInTelegram 
            ? `Running in Telegram (${theme} mode)` 
            : 'Running in browser'}
        </p>
      </div>
    </div>
  );
}

// Mock function (replace with your actual API call)
async function createIntent(data: any) {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
