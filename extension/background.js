// Background service worker for SafeNet Shield
const API_BASE_URL = "http://localhost:4000/api";

// Store authentication token
chrome.runtime.onInstalled.addListener(() => {
  console.log("SafeNet Shield installed");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeText") {
    analyzeText(request.text, request.createAlert)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }

  if (request.action === "analyzeImage") {
    analyzeImage(request.imageUrl, request.createAlert)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === "createAlert") {
    createAlert(request.alertData)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === "getAuthToken") {
    chrome.storage.local.get(["authToken"], (result) => {
      sendResponse({ token: result.authToken || null });
    });
    return true;
  }

  if (request.action === "setAuthToken") {
    chrome.storage.local.set({ authToken: request.token }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Get authentication token
async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["authToken"], (result) => {
      resolve(result.authToken || null);
    });
  });
}

// Analyze text for harmful content
async function analyzeText(text, createAlert = true) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated. Please login in the extension popup.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/text/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: text,
        createAlert: createAlert,
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Failed to analyze text");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to SafeNet backend. Please ensure the backend server is running on http://localhost:4000");
    }
    throw error;
  }
}

// Analyze image for explicit content
async function analyzeImage(imageUrl, createAlert = true) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated. Please login in the extension popup.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/image/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl: imageUrl,
        createAlert: createAlert,
        notes: "Detected by SafeNet Shield extension",
      }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Failed to analyze image");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to SafeNet backend. Please ensure the backend server is running on http://localhost:4000");
    }
    throw error;
  }
}

// Create alert
async function createAlert(alertData) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Not authenticated. Please login in the extension popup.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alertData),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Failed to create alert");
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to SafeNet backend. Please ensure the backend server is running on http://localhost:4000");
    }
    throw error;
  }
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Login failed" }));
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    if (data.token) {
      await chrome.storage.local.set({ authToken: data.token });
    }
    return data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to SafeNet backend. Please ensure the backend server is running on http://localhost:4000");
    }
    throw error;
  }
}

// Register function
async function register(email, password, name) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Registration failed" }));
      throw new Error(error.message || "Registration failed");
    }

    const data = await response.json();
    if (data.token) {
      await chrome.storage.local.set({ authToken: data.token });
    }
    return data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.message === "Failed to fetch" || error.name === "TypeError") {
      throw new Error("Cannot connect to SafeNet backend. Please ensure the backend server is running on http://localhost:4000");
    }
    throw error;
  }
}

// Export functions for popup
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.onMessage.addListener(async (request) => {
      if (request.action === "login") {
        try {
          const result = await login(request.email, request.password);
          port.postMessage({ success: true, data: result });
        } catch (error) {
          port.postMessage({ success: false, error: error.message });
        }
      } else if (request.action === "register") {
        try {
          const result = await register(
            request.email,
            request.password,
            request.name
          );
          port.postMessage({ success: true, data: result });
        } catch (error) {
          port.postMessage({ success: false, error: error.message });
        }
      } else if (request.action === "logout") {
        await chrome.storage.local.remove(["authToken"]);
        port.postMessage({ success: true });
      }
    });
  }
});
