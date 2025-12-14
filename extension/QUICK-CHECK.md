# Quick Check: Is Extension Working?

## ⚠️ You're Looking at the Wrong Console!

Those React Router warnings are from your **SafeNet React app**, not from the extension!

## ✅ Correct Way to Test

### 1. Open YouTube in a NEW Tab

1. Open Chrome
2. Go to **youtube.com** (NOT your React app)
3. Find a video with comments

### 2. Open Console on YouTube Page

1. **On the YouTube page**, press **F12**
2. Click **Console** tab
3. Look for messages starting with `[SafeNet]`

### 3. What You Should See

**If working:**
```
[SafeNet] Content script loaded and initialized
[SafeNet] Current URL: https://www.youtube.com/...
[SafeNet] Extension enabled: true
[SafeNet] User authenticated: true
[SafeNet] Scanned 10 new text elements
[SafeNet] Analyzing text: I will hurt you...
```

**If NOT working:**
- No `[SafeNet]` messages at all
- Or error messages

## Quick Test Command

**On YouTube page, in console, paste:**

```javascript
// Quick check
console.log('=== Extension Check ===');
console.log('Page:', window.location.href);
chrome.storage.local.get(['authToken', 'extensionEnabled'], (r) => {
  console.log('Logged in:', !!r.authToken);
  console.log('Enabled:', r.extensionEnabled);
  if (!r.authToken) {
    console.error('❌ NOT LOGGED IN - Click extension icon and login!');
  }
  if (r.extensionEnabled === false) {
    console.error('❌ EXTENSION DISABLED - Enable in popup!');
  }
});
```

## Checklist

- [ ] Opened YouTube (not React app)
- [ ] Pressed F12 on YouTube page
- [ ] Looking at Console tab
- [ ] See `[SafeNet]` messages?
- [ ] Logged into extension?
- [ ] Backend running?

## Still See Nothing?

1. **Reload extension:**
   - Go to `chrome://extensions/`
   - Find SafeNet Shield
   - Click **Reload** (circular arrow)
   
2. **Refresh YouTube page**

3. **Check console again**

4. **Make sure you're logged in:**
   - Click extension icon
   - Verify you're logged in
   - Status should show "Active"

