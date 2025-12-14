// Popup script for SafeNet Shield

let port = null;

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  setupEventListeners();
  loadSettings();
  loadStats();
});

// Check authentication status
async function checkAuthStatus() {
  const token = await chrome.storage.local.get(['authToken']);
  const user = await chrome.storage.local.get(['userInfo']);
  
  if (token.authToken) {
    showMainSection(user.userInfo);
  } else {
    showAuthSection();
  }
}

// Show auth section
function showAuthSection() {
  document.getElementById('authSection').style.display = 'block';
  document.getElementById('mainSection').style.display = 'none';
  updateStatusIndicator(false);
}

// Show main section
function showMainSection(userInfo) {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('mainSection').style.display = 'block';
  updateStatusIndicator(true);
  
  if (userInfo) {
    document.getElementById('userName').textContent = userInfo.name || 'User';
    document.getElementById('userEmail').textContent = userInfo.email || '';
  }
}

// Update status indicator
function updateStatusIndicator(active) {
  const dot = document.querySelector('.status-dot');
  const text = document.querySelector('.status-text');
  
  if (active) {
    dot.classList.remove('inactive');
    text.textContent = 'Active';
  } else {
    dot.classList.add('inactive');
    text.textContent = 'Inactive';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  // Login form
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin();
  });

  // Register form
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleRegister();
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await handleLogout();
  });

  // Extension toggle
  document.getElementById('extensionToggle').addEventListener('change', (e) => {
    toggleExtension(e.target.checked);
  });

  // Settings
  document.getElementById('autoBlurImages').addEventListener('change', saveSettings);
  document.getElementById('showWarnings').addEventListener('change', saveSettings);
  document.getElementById('createAlerts').addEventListener('change', saveSettings);
}

// Switch tabs
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `${tab}Tab`);
  });
}

// Handle login
async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  showMessage('Logging in...', 'info');

  try {
    // Connect to background script
    if (!port) {
      port = chrome.runtime.connect({ name: 'popup' });
    }

    port.postMessage({
      action: 'login',
      email: email,
      password: password
    });

    port.onMessage.addListener((response) => {
      if (response.success) {
        chrome.storage.local.set({ userInfo: response.data.user });
        showMessage('Login successful!', 'success');
        setTimeout(() => {
          checkAuthStatus();
        }, 1000);
      } else {
        showMessage(response.error || 'Login failed', 'error');
      }
    });
  } catch (error) {
    showMessage('Login failed: ' + error.message, 'error');
  }
}

// Handle register
async function handleRegister() {
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  showMessage('Registering...', 'info');

  try {
    if (!port) {
      port = chrome.runtime.connect({ name: 'popup' });
    }

    port.postMessage({
      action: 'register',
      name: name,
      email: email,
      password: password
    });

    port.onMessage.addListener((response) => {
      if (response.success) {
        chrome.storage.local.set({ userInfo: response.data.user });
        showMessage('Registration successful!', 'success');
        setTimeout(() => {
          checkAuthStatus();
        }, 1000);
      } else {
        showMessage(response.error || 'Registration failed', 'error');
      }
    });
  } catch (error) {
    showMessage('Registration failed: ' + error.message, 'error');
  }
}

// Handle logout
async function handleLogout() {
  try {
    if (port) {
      port.postMessage({ action: 'logout' });
    }
    await chrome.storage.local.remove(['authToken', 'userInfo']);
    showMessage('Logged out successfully', 'success');
    setTimeout(() => {
      checkAuthStatus();
    }, 1000);
  } catch (error) {
    showMessage('Logout failed: ' + error.message, 'error');
  }
}

// Toggle extension
async function toggleExtension(enabled) {
  await chrome.storage.local.set({ extensionEnabled: enabled });
  
  // Notify content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'toggleExtension',
        enabled: enabled
      });
    }
  });

  updateStatusIndicator(enabled);
  showMessage(enabled ? 'Protection enabled' : 'Protection disabled', 'info');
}

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.local.get([
    'extensionEnabled',
    'autoBlurImages',
    'showWarnings',
    'createAlerts'
  ]);

  document.getElementById('extensionToggle').checked = settings.extensionEnabled !== false;
  document.getElementById('autoBlurImages').checked = settings.autoBlurImages !== false;
  document.getElementById('showWarnings').checked = settings.showWarnings !== false;
  document.getElementById('createAlerts').checked = settings.createAlerts !== false;
}

// Save settings
async function saveSettings() {
  const settings = {
    autoBlurImages: document.getElementById('autoBlurImages').checked,
    showWarnings: document.getElementById('showWarnings').checked,
    createAlerts: document.getElementById('createAlerts').checked
  };

  await chrome.storage.local.set(settings);
  showMessage('Settings saved', 'success');
}

// Load stats
async function loadStats() {
  const stats = await chrome.storage.local.get([
    'messagesScanned',
    'imagesScanned',
    'threatsBlocked'
  ]);

  document.getElementById('messagesScanned').textContent = stats.messagesScanned || 0;
  document.getElementById('imagesScanned').textContent = stats.imagesScanned || 0;
  document.getElementById('threatsBlocked').textContent = stats.threatsBlocked || 0;
}

// Show message
function showMessage(text, type = 'info') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type} show`;
  
  setTimeout(() => {
    messageEl.classList.remove('show');
  }, 3000);
}

// Listen for stats updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    loadStats();
  }
});

