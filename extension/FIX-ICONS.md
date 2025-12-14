# Fix Extension Icon Loading Error

If you're getting the error "Could not load icon 'icons/icon16.png'", follow these steps:

## Solution 1: Use the Extension from Source (Recommended)

1. **Don't use the downloaded ZIP** - Load directly from the source folder:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Navigate to: `SafeNet/extension` folder (the original source folder)
   - Select the folder

The icons are already in the source folder, so this will work immediately.

## Solution 2: If Using Downloaded ZIP

If you downloaded the ZIP from the backend:

1. **Re-download the extension** from the Extension Info page
   - The ZIP now includes the proper icons
   - Extract the ZIP to a new folder
   - Load the extracted folder in Chrome

2. **Or manually add icons**:
   - Open `create-icons.html` in your browser
   - Click "Generate Icons"
   - Download each icon (icon16.png, icon48.png, icon128.png)
   - Copy them to the `icons/` folder in your extracted extension

## Solution 3: Regenerate Icons

If icons are missing or corrupted:

```bash
cd SafeNet/extension
node create-proper-icons.cjs
```

This will create proper 16x16, 48x48, and 128x128 PNG icons.

## Verify Icons Exist

Check that these files exist:
- `icons/icon16.png`
- `icons/icon48.png`
- `icons/icon128.png`

All should be valid PNG files (not empty or corrupted).

## Still Having Issues?

1. Make sure you're loading the **folder** that contains `manifest.json`
2. Check that the `icons/` folder is in the same directory as `manifest.json`
3. Verify the icon files are actual PNG images (not text files)
4. Try reloading the extension after adding icons

