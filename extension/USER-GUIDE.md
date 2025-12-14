# SafeNet Shield Extension - User Guide

## 🎉 Congratulations! Your Extension is Loaded

Now that the extension is installed, here's how to use it to protect yourself from harmful online content.

## 📋 What the Extension Does

SafeNet Shield automatically:

- **Scans text messages** on web pages for harmful content (hate speech, grooming, threats)
- **Detects explicit images** and automatically blurs them
- **Shows warnings** when harmful content is detected
- **Creates alerts** in your SafeNet Guardian dashboard
- **Protects you in real-time** as you browse the web

## 🚀 Getting Started

### Step 1: Login to Your Account

1. **Click the SafeNet Shield icon** in your Chrome toolbar (🛡️)
2. You'll see a login/register form
3. **If you have an account:**
   - Enter your email and password
   - Click "Login"
4. **If you're new:**
   - Click the "Register" tab
   - Enter your name, email, and password
   - Click "Register"

> **Note:** Make sure your SafeNet Guardian backend is running on `http://localhost:4000` for the extension to work.

### Step 2: Enable Protection

1. After logging in, you'll see the main extension popup
2. **Toggle "Protection Enabled"** to ON (it should be ON by default)
3. The status indicator should show "Active" (green dot)

### Step 3: Configure Settings

In the extension popup, you can adjust:

- **Auto-blur explicit images**: Automatically blurs NSFW images (recommended: ON)
- **Show warning popups**: Displays warnings when threats are detected (recommended: ON)
- **Create alerts for threats**: Sends alerts to your dashboard (recommended: ON)

## 💡 How to Use It

### Automatic Protection

Once enabled, the extension works automatically:

1. **Visit any website** (social media, forums, chat sites, etc.)
2. The extension **automatically scans**:
   - Text content in messages, comments, posts
   - Images on the page
3. When harmful content is detected:
   - **Text**: Highlighted with a red border
   - **Images**: Automatically blurred
   - **Warning popup**: Appears near the content

### Viewing Statistics

Click the extension icon to see:

- **Messages Scanned**: Total text content analyzed
- **Images Scanned**: Total images checked
- **Threats Blocked**: Number of harmful items detected

### Viewing Blurred Images

If an image is blurred:

1. **Click on the blurred image**
2. A warning dialog appears
3. Choose:
   - **"View Anyway"**: Unblurs the image (use with caution)
   - **"Cancel"**: Keeps it blurred

### Checking Alerts

All detected threats are sent to your SafeNet Guardian dashboard:

1. Go to your SafeNet web app
2. Navigate to **Alert Center**
3. View all alerts created by the extension

## 🔧 Settings Explained

### Protection Enabled

- **ON**: Extension actively scans and protects
- **OFF**: Extension is disabled (no scanning)

### Auto-blur Explicit Images

- **ON**: Images flagged as explicit are automatically blurred
- **OFF**: Images are analyzed but not blurred

### Show Warning Popups

- **ON**: Warning messages appear when threats are detected
- **OFF**: Threats are detected but no popups shown

### Create Alerts for Threats

- **ON**: Detected threats are saved to your dashboard
- **OFF**: Threats are detected but not saved

## 🌐 Where It Works

The extension works on:

- ✅ Social media platforms (Facebook, Twitter, Instagram, etc.)
- ✅ Messaging platforms (Discord, Slack, etc.)
- ✅ Forums and discussion boards
- ✅ Chat applications
- ✅ Any website with user-generated content

## 📊 Understanding the Results

### Risk Levels

When content is analyzed, you'll see risk levels:

- **Low/Clean**: Safe content, no action needed
- **Medium**: Potentially harmful, review recommended
- **High**: Harmful content detected, action recommended

### What Gets Flagged

- **Hate Speech**: Discriminatory or offensive language
- **Grooming**: Predatory behavior patterns
- **Threats**: Violent or threatening language
- **Explicit Images**: NSFW or inappropriate visual content

## 🛠️ Troubleshooting

### Extension Not Working?

1. **Check if you're logged in**

   - Click the extension icon
   - If you see login form, you need to login first

2. **Verify backend is running**

   - Make sure SafeNet Guardian API is running on `http://localhost:4000`
   - Check backend logs for errors

3. **Check protection is enabled**

   - Extension popup should show "Active" status
   - Toggle should be ON

4. **Check browser console**
   - Press F12 to open developer tools
   - Look for errors in the Console tab

### No Warnings Appearing?

- Content might be safe (low risk)
- Check if "Show warning popups" is enabled
- Some sites may need specific selectors (contact support)

### Images Not Blurring?

- Check if "Auto-blur explicit images" is enabled
- Very small images (icons) are skipped
- Some images may load after initial scan

### Can't Login?

- Verify backend API is accessible
- Check your email and password
- Try registering a new account
- Check browser console for API errors

## 🔒 Privacy & Security

- **Local Storage**: Your auth token is stored securely in Chrome's local storage
- **API Communication**: All requests are authenticated and encrypted
- **Content Scanning**: Only harmful content triggers alerts
- **No Data Collection**: The extension doesn't collect personal browsing data

## 📱 Best Practices

1. **Keep it enabled**: Leave protection ON for continuous safety
2. **Review alerts**: Regularly check your Alert Center dashboard
3. **Report issues**: If you see false positives, report them
4. **Stay updated**: Keep the extension updated for best protection

## 🆘 Need Help?

- Check the **Alert Center** in your dashboard for detected threats
- Review **Settings** to customize protection levels
- Contact support through the SafeNet Guardian web app

## 🎯 Quick Reference

| Action          | How To                                   |
| --------------- | ---------------------------------------- |
| Enable/Disable  | Click extension icon → Toggle switch     |
| View Stats      | Click extension icon → See statistics    |
| Login           | Click extension icon → Enter credentials |
| View Alerts     | Go to SafeNet dashboard → Alert Center   |
| Unblur Image    | Click blurred image → "View Anyway"      |
| Change Settings | Click extension icon → Settings section  |

---

**Stay Safe Online with SafeNet Shield! 🛡️**
