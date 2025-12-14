# How to Test SafeNet Shield Extension

## ⚠️ Important: Check the RIGHT Console!

The extension runs on **web pages** (YouTube, Google Images, etc.), NOT in your React app!

## Step-by-Step Testing

### Step 1: Open a Test Page

1. **Open a NEW tab** in Chrome
2. Go to **YouTube** (or Google Images)
3. **NOT** your SafeNet React app - that's a different thing!

### Step 2: Open Console on THAT Page

1. **On the YouTube/Google Images page**, press **F12**
2. Go to **Console** tab
3. This is where you'll see `[SafeNet]` messages

### Step 3: What You Should See

**If extension is working, you'll see:**
```
[SafeNet] Content script loaded and initialized
[SafeNet] Current URL: https://www.youtube.com/...
[SafeNet] Initializing extension...
[SafeNet] Extension enabled: true
[SafeNet] User authenticated: true
[SafeNet] Scanned 5 new text elements
[SafeNet] Analyzing text: I will hurt you...
```

**If you see NOTHING:**
- Extension might not be loaded
- Content script might not be running
- Check next steps

### Step 4: Quick Test

**On YouTube page, in console, type:**
```javascript
console.log('Testing...');
chrome.storage.local.get(['authToken', 'extensionEnabled'], (result) => {
  console.log('Auth:', !!result.authToken);
  console.log('Enabled:', result.extensionEnabled);
});
```

**Should show:**
- `Auth: true` (if logged in)
- `Enabled: true` (if enabled)

## Common Mistakes

### ❌ Wrong: Checking console in React app
- Your React app console shows React warnings
- Extension doesn't run there!

### ✅ Right: Checking console on YouTube/Google Images
- Extension runs on web pages
- Check console THERE

## Quick Diagnostic

**On YouTube page (NOT your React app):**

1. Press **F12**
2. Go to **Console** tab
3. Type this:
```javascript
// Test 1: Check if extension API exists
console.log('Chrome API:', typeof chrome !== 'undefined');

// Test 2: Check auth
chrome.storage.local.get(['authToken'], (r) => {
  console.log('Logged in:', !!r.authToken);
});

// Test 3: Check backend
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))
  .catch(e => console.error('Backend error:', e));
```

## Still Not Working?

1. **Make sure you're on YouTube/Google Images** (not your React app)
2. **Check console on THAT page** (F12 on that page)
3. **Look for [SafeNet] messages**
4. **If no messages, reload extension:**
   - Go to `chrome://extensions/`
   - Find SafeNet Shield
   - Click Reload
   - Refresh the YouTube/Google page
   - Check console again

