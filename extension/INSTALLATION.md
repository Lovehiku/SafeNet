# SafeNet Shield Extension - Installation Guide

## Quick Start

### Step 1: Generate Icons

Before loading the extension, you need to create icon files:

**Option A: Using the Icon Generator**
1. Open `create-icons.html` in your browser
2. Click "Generate Icons"
3. Right-click each canvas and save as:
   - `icons/icon16.png`
   - `icons/icon48.png`
   - `icons/icon128.png`

**Option B: Manual Creation**
Create three PNG files in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any shield or security-themed icon. Online tools like:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/
- Any image editor (GIMP, Photoshop, etc.)

### Step 2: Start Backend API

Make sure the SafeNet Guardian backend is running:

```bash
cd SafeNet/backend
npm install
npm start
```

The API should be running on `http://localhost:4000`

### Step 3: Load Extension in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `SafeNet/extension` folder
6. The extension should now appear in your extensions list

### Step 4: Configure Extension

1. Click the SafeNet Shield icon in your Chrome toolbar
2. Click **Register** tab to create a new account, or **Login** if you have one
3. Fill in your credentials and submit
4. Once logged in, ensure the **Protection Enabled** toggle is ON
5. Configure settings as needed:
   - Auto-blur explicit images
   - Show warning popups
   - Create alerts for threats

### Step 5: Test the Extension

1. Visit any website with user-generated content (social media, forums, etc.)
2. The extension will automatically scan:
   - Text messages for harmful content
   - Images for explicit content
3. When harmful content is detected:
   - Text will be highlighted with a red border
   - Images will be blurred
   - Warning popups will appear

## Folder Structure

```
extension/
├── manifest.json          # Extension manifest (v3)
├── background.js          # Service worker for API calls
├── content.js            # Content script for page scanning
├── content.css           # Styles for warnings and blur effects
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup logic
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── create-icons.html     # Icon generator tool
├── README.md             # Documentation
└── INSTALLATION.md       # This file
```

## Troubleshooting

### Extension Not Loading
- **Error: "Manifest file is missing or unreadable"**
  - Make sure you selected the correct `extension` folder
  - Verify `manifest.json` exists and is valid JSON

- **Error: "Icons not found"**
  - Create the icon files in the `icons/` folder
  - Use the `create-icons.html` tool or create them manually

### Extension Not Working
- **No scanning happening**
  - Check if you're logged in (click extension icon)
  - Verify "Protection Enabled" toggle is ON
  - Check browser console for errors (F12)

- **API errors**
  - Ensure backend is running on `http://localhost:4000`
  - Check backend logs for errors
  - Verify your login credentials

- **Images not blurring**
  - Check "Auto-blur explicit images" setting
  - Some images may be too small to analyze
  - Check if image URLs are accessible

### Performance Issues
- The extension scans every 3 seconds by default
- If pages are slow, you can disable the extension on specific sites
- Large pages with many images may take longer to scan

## Development

To modify and test the extension:

1. Make your changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon (🔄) on the SafeNet Shield card
4. Test your changes

**Note:** After changing `manifest.json`, you may need to reload the extension completely.

## Security Notes

- Authentication tokens are stored in Chrome's local storage
- Only necessary permissions are requested
- Content scripts run in isolated contexts
- All API communication uses the backend authentication system

## Support

For issues or questions:
1. Check the browser console (F12) for errors
2. Check the backend logs
3. Verify all files are in the correct locations
4. Ensure backend API is accessible

## Next Steps

After installation:
1. Test on various websites
2. Monitor the statistics in the popup
3. Review alerts in the backend dashboard
4. Adjust settings based on your needs

