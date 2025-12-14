# SafeNet Shield Chrome Extension

A Chrome browser extension that protects users from harmful online behavior by detecting hate speech, grooming, threats, and explicit images.

## Features

- **Text Analysis**: Automatically scans messages on web pages for harmful content (hate speech, grooming, threats)
- **Image Analysis**: Detects explicit images and automatically blurs them
- **Warning Popups**: Shows warnings when harmful content is detected
- **Backend Integration**: Connects to SafeNet Guardian API for analysis
- **User Authentication**: Secure login/registration system
- **Real-time Protection**: Continuously monitors page content

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension` folder
5. The extension icon should appear in your toolbar

## Setup

1. Make sure the SafeNet Guardian backend API is running on `http://localhost:4000`
2. Click the extension icon in your toolbar
3. Register a new account or login with existing credentials
4. Enable protection using the toggle switch

## How It Works

### Content Script
- Runs on all web pages
- Scans text content every 3 seconds
- Monitors images for explicit content
- Highlights harmful messages
- Blurs explicit images automatically

### Background Script
- Handles API communication
- Manages authentication tokens
- Processes analysis requests

### Popup Interface
- User authentication
- Extension settings
- Statistics display
- Enable/disable protection

## Permissions

The extension requires minimal permissions:
- `storage`: Store user preferences and auth tokens
- `activeTab`: Access current tab content
- `scripting`: Inject content scripts
- `host_permissions`: Access backend API and web pages

## API Endpoints Used

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/text/analyze` - Text content analysis
- `POST /api/image/analyze` - Image content analysis
- `POST /api/alerts` - Create alerts

## Icons

You need to create icon files in the `icons/` directory:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can use any shield or security-themed icon. For a quick solution, you can:
1. Use an online icon generator
2. Create simple PNG files with a shield emoji (🛡️) or security symbol
3. Use a design tool to create professional icons

## Development

To modify the extension:
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Security Notes

- Authentication tokens are stored securely in Chrome's local storage
- Only necessary permissions are requested
- All API calls use HTTPS when available
- Content scripts run in isolated contexts

## Troubleshooting

**Extension not working:**
- Check if backend API is running
- Verify you're logged in through the popup
- Check browser console for errors

**Images not being blurred:**
- Ensure "Auto-blur explicit images" is enabled in settings
- Check if images are loaded from allowed domains

**Messages not being scanned:**
- Verify protection is enabled (toggle switch)
- Check if page content matches supported selectors
- Some dynamic sites may require additional selectors

## License

Part of the SafeNet Guardian project.

