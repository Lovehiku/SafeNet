# Troubleshooting: Extension Not Working

## Quick Diagnostic Steps

### Step 1: Run Diagnostic Test

1. **Open the page** where extension should work (YouTube, Google Images, etc.)
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Copy and paste** the entire contents of `test-extension.js` into the console
5. **Press Enter**
6. **Check the output** - look for ✗ errors

### Step 2: Check Authentication

**In Console, type:**
```javascript
chrome.storage.local.get(['authToken', 'extensionEnabled'], console.log);
```

**Should show:**
- `authToken: "your-token-here"` (not null/undefined)
- `extensionEnabled: true` (not false)

**If not authenticated:**
1. Click SafeNet Shield icon
2. Login or Register
3. Verify status shows "Active"
4. Refresh the page

### Step 3: Check Backend

**In Console, type:**
```javascript
fetch('http://localhost:4000/api/health').then(r => r.json()).then(console.log).catch(console.error);
```

**Should return:** `{status: "ok", service: "SafeNet Guardian API"}`

**If error:**
```bash
cd SafeNet/backend
npm start
```

### Step 4: Check Content Script

**Look in Console for:**
- `[SafeNet] Content script loaded and initialized`
- `[SafeNet] Scanned X new text elements`
- `[SafeNet] Analyzing text: ...`

**If you don't see these:**
1. Go to `chrome://extensions/`
2. Find SafeNet Shield
3. Click **Reload** (circular arrow icon)
4. Refresh the page
5. Check console again

### Step 5: Test Manual Analysis

**In Console, type:**
```javascript
chrome.runtime.sendMessage({
  action: "analyzeText",
  text: "I will hurt you You deserve to die",
  createAlert: false
}, (response) => {
  console.log("Response:", response);
  if (response && response.success) {
    console.log("Risk:", response.data?.overallRisk);
  } else {
    console.error("Error:", response?.error);
  }
});
```

**Should return:** Analysis result with risk level

## Common Issues

### Issue: "Not authenticated" in console

**Fix:**
1. Click extension icon
2. Login with your account
3. Verify "Active" status
4. Refresh page

### Issue: Backend connection failed

**Fix:**
1. Open terminal
2. `cd SafeNet/backend`
3. `npm start`
4. Wait for "Server running on port 4000"
5. Refresh page

### Issue: No [SafeNet] messages in console

**Fix:**
1. Go to `chrome://extensions/`
2. Find SafeNet Shield
3. Click **Reload**
4. Refresh the page
5. Check console again

### Issue: Content not being scanned

**Possible causes:**
1. Content loads dynamically (wait a few seconds)
2. Selectors don't match the site
3. Content is too short (< 5 characters)

**Fix:**
- Wait 5-10 seconds after page loads
- Scroll to trigger new content
- Check console for scanning messages

### Issue: Images not blurring

**Check:**
1. Image size > 50x50 pixels? (very small images skipped)
2. "Auto-blur explicit images" enabled in settings?
3. Check console for image analysis messages

**Test manually:**
```javascript
// Find an image
const img = document.querySelector('img');
console.log('Image src:', img.src);
console.log('Image size:', img.naturalWidth, 'x', img.naturalHeight);

// Check if it's in the scanned set
// (This won't work directly, but check console for [SafeNet] Analyzing image messages)
```

### Issue: Hateful comments not flagged

**Check:**
1. Is comment visible on page? (extension only scans visible content)
2. Check console for `[SafeNet] Analyzing text: ...` messages
3. Check if analysis response shows risk level

**Test:**
```javascript
// Find the comment element
const comment = document.querySelector('#content-text'); // YouTube
console.log('Comment text:', comment?.textContent);

// Check if it was scanned
// Look in console for analysis messages
```

## YouTube Specific

YouTube comments use specific selectors. The extension now includes:
- `#content-text` - Main comment text
- `yt-formatted-string#content-text` - Formatted comment
- `ytd-comment-renderer #content-text` - Comment renderer

**If still not working:**
1. Wait for comments to load
2. Scroll down to load more comments
3. Check console for scanning messages

## Google Images Specific

Google Images uses lazy loading. The extension now:
- Checks `data-src` and `data-lazy-src` attributes
- Waits for images to load
- Scans images as they appear

**If still not working:**
1. Scroll down to load more images
2. Wait a few seconds
3. Check console for image analysis messages

## Still Not Working?

1. **Check all console errors** - Look for red error messages
2. **Check Network tab** - See if API calls are being made
3. **Reload extension** - `chrome://extensions/` → Reload
4. **Restart browser** - Sometimes helps
5. **Check backend logs** - Look for API errors

## Get Help

If still not working, provide:
1. Console output (copy all [SafeNet] messages)
2. Error messages (if any)
3. Which website you're testing on
4. Whether you're logged in
5. Whether backend is running

