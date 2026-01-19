# 🤖 How to Configure Mini App in BotFather

## ✅ You're Seeing This Because...

The Mini App integration **is already coded** in your bot, but BotFather doesn't know about it yet. Let's fix that!

---

## 🎯 Step-by-Step Configuration

### Method 1: Menu Button (Recommended) ⭐

This adds a permanent button next to the message input in your bot chat.

#### Steps:

1. **Open Telegram** and search for `@BotFather`
2. **Send:** `/mybots`
3. **Select:** `@flowpayment_bot`
4. **Tap:** "Bot Settings"
5. **Tap:** "Menu Button"
6. **Tap:** "Configure Menu Button"
7. **Send URL:** `https://flowpayment.vercel.app`
8. **Send Button Text:** `Open FlowPay 🚀`

#### Result:

Users will see a ☰ menu button that opens your Web App!

---

### Method 2: Create Main Mini App (Alternative)

This creates a dedicated Mini App entry.

#### Steps:

1. **Open @BotFather**
2. **Send:** `/newapp`
3. **Select:** `@flowpayment_bot`

4. **Title:** (Send this)
   ```
   FlowPay
   ```

5. **Description:** (Send this)
   ```
   Automate crypto payments on Cronos blockchain. Create scheduled payments, recurring subscriptions, and AI-powered conditions.
   ```

6. **Photo:** Upload a 640x360 screenshot of your app
   - Take screenshot of https://flowpayment.vercel.app
   - Crop to 640x360
   - Upload

7. **Demo GIF** (Optional): Skip for now (send `/empty`)

8. **Web App URL:**
   ```
   https://flowpayment.vercel.app
   ```

9. **Short Name:** (Send this)
   ```
   flowpay
   ```

10. **Done!** BotFather confirms creation

#### Set as Main App:

1. `/mybots` → Select bot
2. "Bot Settings" → "Mini Apps"
3. Tap your newly created app
4. "Set as Main Mini App"

---

## 🔍 Current Status Check

### What You See Now:

Looking at your third screenshot:
- ❌ Menu Button: **Disabled**
- ❌ Main App: **Disabled**

### What You Need:

At least ONE of these:
- ✅ Menu Button: **Enabled** (Easier, recommended)
- ✅ Main App: **Set** (More features, optional)

---

## 🧪 Test After Configuration

### Test Menu Button:

1. Open `@flowpayment_bot` in Telegram
2. Look at the bottom of the chat
3. You should see: `☰ Open FlowPay 🚀` button
4. Tap it → Web App opens!

### Test Inline Buttons:

1. Send `/start` to the bot
2. Tap "🚀 Open FlowPay App" button
3. Should open: https://flowpayment.vercel.app

### Verify Web App Loads:

1. Web App should:
   - ✅ Load inside Telegram
   - ✅ Match Telegram theme (dark/light)
   - ✅ Show your Telegram name
   - ✅ Show "Dashboard" and "Create Intent" options

---

## 🛠️ Troubleshooting

### "Menu Button option not showing"

**Cause:** Outdated Telegram client
**Fix:** Update Telegram to latest version

### "Web App won't load"

**Cause:** Wrong URL or network issue
**Fix:** 
1. Verify URL: `https://flowpayment.vercel.app`
2. Open in browser to confirm it works
3. Reconfigure in BotFather

### "Can't find /newapp command"

**Cause:** Feature might not be available in all regions yet
**Fix:** Use Menu Button method instead (Method 1)

### "Screenshot size wrong"

**Fix:** Use online tool to resize
- Go to: https://imageresizer.com
- Upload screenshot
- Resize to 640x360
- Download and send to BotFather

---

## 📸 Creating Screenshots for Mini App

### Quick Method:

1. **Open Web App:** https://flowpayment.vercel.app
2. **Open DevTools:** Right-click → Inspect
3. **Toggle Device Toolbar:** Click phone icon (or Cmd+Shift+M)
4. **Select Device:** iPhone 14 Pro
5. **Take Screenshot:** 
   - Mac: Cmd+Shift+4
   - Windows: Snipping Tool

6. **Crop to 640x360**
7. **Upload to BotFather**

### Example Screenshot Ideas:

- Dashboard view with stats
- Create Intent form
- Transaction history
- Welcome/landing page

---

## ✅ Recommended Configuration

For the **best user experience**, do BOTH:

### 1. Set Menu Button
```
URL: https://flowpayment.vercel.app
Text: Open FlowPay 🚀
```

### 2. Configure Bot Info (from your first screenshot)

**About (160 char max):**
```
FlowPay - Automate payments on Cronos blockchain. Send crypto on schedule, split bills, and manage recurring payments seamlessly.
```

**Description (512 char max):**
```
💰 Welcome to FlowPay!

Automate your crypto payments on Cronos blockchain:
• Create payment intents with custom schedules
• Split payments among multiple recipients
• Set up recurring subscriptions
• Track all your transactions

Commands:
/start - Get started
/create - Create new payment intent
/dashboard - View your intents
/help - Get support

Tap the menu button to open FlowPay App! 🚀
```

---

## 🎨 Optional: Customize Mini App Settings

After setting up Main App (Method 2), you can:

### Add Keyboard Button (Alternative to Menu)

1. In bot code, add inline keyboard:
```typescript
.webApp('Open App', 'https://flowpayment.vercel.app')
```

Already done in your keyboards.ts! ✅

### Share Direct Link

Users can also open directly:
```
https://t.me/flowpayment_bot/flowpay
```
(Only works after setting Main App)

---

## 🔄 Summary

Your bot **already has Web App buttons coded**:
- ✅ "🚀 Open FlowPay App" (in /start)
- ✅ "📝 Create via Web App" (in /create)
- ✅ "📊 Open Full Dashboard" (in /dashboard)

What's missing:
- ❌ Menu Button not configured in BotFather
- ❌ Main App not created

**Next Steps:**
1. Configure Menu Button (2 minutes)
2. Fill in bot About & Description
3. Test by opening @flowpayment_bot
4. Tap menu button → Should open Web App!

---

## 📞 Quick Commands for BotFather

Copy and paste these into @BotFather:

### Configure Menu Button:
```
/mybots
→ Select @flowpayment_bot
→ Bot Settings
→ Menu Button
→ Configure Menu Button
→ Send: https://flowpayment.vercel.app
→ Send: Open FlowPay 🚀
```

### Set Bot Info:
```
/mybots
→ Select @flowpayment_bot
→ Edit Bot
→ Edit Description
→ Paste description from above
```

---

## 🎉 After Configuration

Once done, your users will:

1. **Open @flowpayment_bot**
2. **See menu button** (☰ Open FlowPay 🚀)
3. **Tap button** → Web App opens
4. **Use full interface** inside Telegram!

Your bot will look professional and complete! ✨

---

**Need help?** The buttons are already working in your code, just need BotFather configuration! 🚀
