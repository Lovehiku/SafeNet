# 🚀 SafeNet Shield - Quick Start Guide

## Step-by-Step: How to Use Your Extension

### ✅ Step 1: Make Sure Backend is Running

Before using the extension, start your SafeNet Guardian backend:

```bash
cd SafeNet/backend
npm start
```

The API should be running on `http://localhost:4000`

### ✅ Step 2: Login to Extension

1. **Click the SafeNet Shield icon** (🛡️) in your Chrome toolbar
2. You'll see a login form
3. **Two options:**

   **Option A: Login (if you have an account)**
   - Enter your email
   - Enter your password
   - Click "Login"

   **Option B: Register (if you're new)**
   - Click the "Register" tab
   - Enter your name
   - Enter your email
   - Enter your password
   - Click "Register"

4. After successful login, you'll see the main dashboard

### ✅ Step 3: Enable Protection

1. In the extension popup, make sure **"Protection Enabled"** toggle is **ON** (green)
2. Status should show **"Active"** with a green dot

### ✅ Step 4: Test It Out!

Now visit any website with user content:

**Try these sites:**
- Social media (Facebook, Twitter, Instagram)
- Forums (Reddit, etc.)
- Chat platforms (Discord, Slack)
- Any site with comments or messages

**What happens:**
- The extension automatically scans text and images
- Harmful content gets highlighted or blurred
- Warning popups appear when threats are detected

### ✅ Step 5: View Your Results

**In the Extension:**
- Click the extension icon to see:
  - Messages scanned count
  - Images scanned count
  - Threats blocked count

**In Your Dashboard:**
- Go to your SafeNet Guardian web app
- Navigate to **Alert Center**
- See all threats detected by the extension

## 🎯 What You'll See

### When Text is Detected as Harmful:
- Red border around the message
- Warning popup appears
- Alert created in dashboard

### When Image is Detected as Explicit:
- Image is automatically blurred
- Click image to see warning
- Choose to view or keep blurred

## ⚙️ Customize Settings

Click the extension icon → Settings section:

- **Auto-blur explicit images**: ON/OFF
- **Show warning popups**: ON/OFF  
- **Create alerts for threats**: ON/OFF

## 🔍 Example Usage

1. **Visit a social media site**
2. **Scroll through posts/comments**
3. **Extension automatically scans** (every 3 seconds)
4. **If harmful content found:**
   - Text: Red border + warning
   - Image: Blurred + warning
5. **Check Alert Center** in dashboard for details

## ❓ Common Questions

**Q: Do I need to do anything after enabling?**
A: No! It works automatically in the background.

**Q: Will it slow down my browsing?**
A: No, scanning happens asynchronously and doesn't block pages.

**Q: Can I disable it on specific sites?**
A: Yes, toggle "Protection Enabled" OFF when needed.

**Q: Where do I see what was blocked?**
A: Check the Alert Center in your SafeNet dashboard.

**Q: Does it work on all websites?**
A: Yes, it works on any website with user-generated content.

## 🆘 Troubleshooting

**Extension not working?**
- Check if backend is running (`http://localhost:4000`)
- Make sure you're logged in
- Verify "Protection Enabled" is ON

**No warnings appearing?**
- Content might be safe (that's good!)
- Check settings to ensure warnings are enabled
- Try visiting a site with known harmful content

**Can't login?**
- Verify backend API is accessible
- Check email/password
- Try registering a new account

---

**That's it! You're now protected. The extension works automatically to keep you safe online.** 🛡️

