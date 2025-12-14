# Debugging SafeNet Shield Extension

## How to Check if Extension is Working

### Step 1: Open Browser Console

1. **Press F12** (or right-click → Inspect)
2. Go to the **Console** tab
3. Look for messages starting with `[SafeNet]`

### Step 2: Check for These Messages

**Good signs:**
- `[SafeNet] Content script loaded and initialized`
- `[SafeNet] Initializing extension...`
- `[SafeNet] Extension enabled: true`
- `[SafeNet] User authenticated: true`
- `[SafeNet] Scanned X new text elements`
- `[SafeNet] Analyzing text: ...`

**Bad signs:**
- `[SafeNet] User not authenticated` → **You need to login**
- `[SafeNet] Extension enabled: false` → **Enable protection in popup**
- `[SafeNet] Analysis error: Not authenticated` → **Login required**
- `[SafeNet] No response from background script` → **Backend might be down**

### Step 3: Test Authentication

1. Click the extension icon
2. Check if you're logged in
3. If not, login or register
4. Verify status shows "Active"

### Step 4: Test Backend Connection

1. Open browser console (F12)
2. Type this in console:
```javascript
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Expected:** `{status: "ok", service: "SafeNet Guardian API"}`

**If error:** Backend is not running or not accessible

### Step 5: Test Text Analysis

1. Visit any website with text content
2. Open console (F12)
3. Look for: `[SafeNet] Analyzing text: ...`
4. Check response: `[SafeNet] Analysis response: ...`

**If you see errors:**
- `Not authenticated` → Login to extension
- `Network error` → Backend not running
- `Failed to analyze text` → Check backend logs

### Step 6: Test Image Analysis

1. Visit a page with images
2. Open console (F12)
3. Look for: `[SafeNet] Analyzing image: ...`
4. Check response: `[SafeNet] Image analysis response: ...`

## Common Issues & Fixes

### Issue: "Not authenticated" errors

**Fix:**
1. Click extension icon
2. Login with your account
3. Verify status shows "Active"
4. Refresh the page

### Issue: No scanning happening

**Check:**
1. Extension enabled? (Toggle in popup)
2. User logged in? (Check popup)
3. Backend running? (Test with health check)
4. Console errors? (Check F12 console)

### Issue: Content not being detected

**Possible causes:**
1. Selectors don't match the site's HTML structure
2. Content loads dynamically after scan
3. Content is too short (< 5 characters)

**Fix:**
- Wait a few seconds for dynamic content
- Check console for scanning messages
- Try different websites

### Issue: Images not blurring

**Check:**
1. Image size > 100x100 pixels? (Small icons are skipped)
2. "Auto-blur explicit images" enabled?
3. Image loaded? (Check `img.complete` in console)
4. Analysis response shows risk?

## Manual Testing

### Test Text Detection

1. Open a page with comments/messages
2. Open console (F12)
3. Type this to manually test:
```javascript
// Find a text element
const testElement = document.querySelector('p, div, span');
if (testElement) {
  const text = testElement.textContent;
  console.log('Testing text:', text);
  // The extension should scan it automatically
}
```

### Test Image Detection

1. Open a page with images
2. Open console (F12)
3. Check if images are being scanned:
```javascript
const images = document.querySelectorAll('img');
console.log('Total images:', images.length);
images.forEach(img => {
  console.log('Image:', img.src, 'Size:', img.naturalWidth, 'x', img.naturalHeight);
});
```

## Enable Verbose Logging

The extension now logs everything to console. Check:
- `[SafeNet]` prefix for all extension messages
- Error messages show what went wrong
- Response data shows analysis results

## Still Not Working?

1. **Check backend logs** - Look for API errors
2. **Check network tab** - See if API calls are being made
3. **Reload extension** - Go to `chrome://extensions/` and click reload
4. **Check manifest** - Verify content script is injected
5. **Try different site** - Some sites block extensions

## Quick Diagnostic

Run this in browser console on any page:

```javascript
// Check if content script is loaded
console.log('SafeNet loaded:', typeof chrome !== 'undefined' && chrome.runtime);

// Check extension status
chrome.storage.local.get(['extensionEnabled', 'authToken'], (result) => {
  console.log('Extension enabled:', result.extensionEnabled);
  console.log('Has auth token:', !!result.authToken);
});

// Test backend
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(data => console.log('Backend status:', data))
  .catch(err => console.error('Backend error:', err));
```

