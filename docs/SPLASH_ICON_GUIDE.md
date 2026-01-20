# 🎨 Splash Icon Upload Guide

## 📍 Where is the File?

**Location:** `/flowpay-splash-icon.svg` (project root)

**Full Path:** `/Users/user/Project/FlowPay/flowpay-splash-icon.svg`

---

## ✅ Icon Specifications

- **Format:** SVG with single `<path>` element ✅
- **Canvas Size:** 512x512 ✅
- **Color:** #22c55e (FlowPay green) ✅
- **BotFather Compatible:** Yes ✅

---

## 📤 How to Upload to BotFather

### Method 1: Via Telegram Desktop/Web

1. **Open @BotFather** in Telegram
2. **Send:** `/mybots`
3. **Select:** `@flowpayment_bot`
4. **Tap:** "Edit Bot"
5. **Tap:** "Mini Apps"
6. **Select:** Your Mini App (or create one if needed)
7. **Tap:** "Set Splash Icon"
8. **Upload:** `/flowpay-splash-icon.svg` from project root
9. **Done!** BotFather confirms upload

### Method 2: Via Telegram Mobile

1. **Transfer file to phone:**
   - Send to yourself in Saved Messages, OR
   - Upload to cloud (Google Drive, iCloud), OR
   - AirDrop (iOS/Mac)

2. **In Telegram:**
   - Open @BotFather
   - Follow same steps as Method 1
   - Select file from phone storage

---

## 🐛 If Upload Fails

### Error: "Unable to extract contents of SVG"

This means BotFather can't parse the SVG (even though it's correct).

**Fix: Convert to PNG**

1. **Online Tool:**
   - Visit: https://svgtopng.com
   - Upload: `flowpay-splash-icon.svg`
   - Size: 512x512
   - Download PNG

2. **Command Line (if you have ImageMagick):**
   ```bash
   convert flowpay-splash-icon.svg -resize 512x512 flowpay-splash-icon.png
   ```

3. **Upload PNG** to BotFather instead

### Error: "File too large"

SVG is tiny (< 5KB), so this shouldn't happen. If it does:
- Make sure you're uploading the correct file
- Try PNG conversion method above

---

## 🎨 What the Icon Looks Like

The splash icon shows:
- Circular FlowPay logo
- Green gradient background (#22c55e)
- Clean, modern design
- Matches app branding

**Preview:** Open `/flowpay-splash-icon.svg` in browser to see

---

## 📱 Where Users See This Icon

The splash icon appears:
- When Mini App is loading
- Center of screen with spinner
- Before full app loads
- During transitions

**Example:**
```
[Loading screen]
    🌊
  [Spinner]
 FlowPay
```

---

## ✅ After Upload

**BotFather confirms:**
- "Splash icon updated"
- Icon shows in Mini App settings
- Visible when users open app

**Test:**
1. Close and reopen @flowpayment_bot
2. Tap menu button
3. Should see splash icon while loading

---

## 🔄 Update Icon Later

To change splash icon:
1. Same process as upload
2. @BotFather → Edit Bot → Mini Apps
3. Upload new file
4. Replaces old icon

---

## 🎯 Quick Checklist

- [ ] Found `/flowpay-splash-icon.svg` in project root
- [ ] Opened @BotFather in Telegram
- [ ] Navigated to Mini Apps settings
- [ ] Uploaded splash icon
- [ ] Received confirmation
- [ ] Tested by opening bot

---

## 📞 Need the File?

**Path:** `/Users/user/Project/FlowPay/flowpay-splash-icon.svg`

**Or regenerate:**
```bash
# View the file
cat flowpay-splash-icon.svg

# It should start with:
# <svg width="512" height="512"...
```

---

**Total Time:** 2 minutes
**Difficulty:** Easy
**Impact:** Professional loading screen! ✨
