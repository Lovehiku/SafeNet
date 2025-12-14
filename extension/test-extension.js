// Quick test script - paste this in browser console to test extension
// ⚠️ IMPORTANT: Run this on YouTube/Google Images page, NOT in your React app!
// Open console (F12) on the web page and paste this entire script

console.log("=== SafeNet Shield Diagnostic Test ===");
console.log("Current page:", window.location.href);

// Test 1: Check if extension is loaded
console.log("\n1. Checking if extension is loaded...");
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log("✓ Extension API available");
  chrome.runtime.sendMessage({action: "getAuthToken"}, (response) => {
    console.log("Auth token check:", response);
  });
} else {
  console.log("✗ Extension API not available - extension may not be loaded");
}

// Test 2: Check storage
console.log("\n2. Checking extension storage...");
chrome.storage.local.get(['extensionEnabled', 'authToken', 'messagesScanned'], (result) => {
  console.log("Extension enabled:", result.extensionEnabled);
  console.log("Has auth token:", !!result.authToken);
  console.log("Messages scanned:", result.messagesScanned || 0);
  
  if (!result.authToken) {
    console.error("✗ NOT AUTHENTICATED - Please login to extension!");
  }
  if (result.extensionEnabled === false) {
    console.error("✗ EXTENSION DISABLED - Enable in popup!");
  }
});

// Test 3: Check backend
console.log("\n3. Testing backend connection...");
fetch('http://localhost:4000/api/health')
  .then(r => r.json())
  .then(data => {
    console.log("✓ Backend is running:", data);
  })
  .catch(err => {
    console.error("✗ Backend not accessible:", err.message);
    console.error("   Make sure backend is running: cd SafeNet/backend && npm start");
  });

// Test 4: Test text analysis
console.log("\n4. Testing text analysis...");
const testText = "I will hurt you You deserve to die";
chrome.runtime.sendMessage({
  action: "analyzeText",
  text: testText,
  createAlert: false
}, (response) => {
  if (chrome.runtime.lastError) {
    console.error("✗ Error:", chrome.runtime.lastError.message);
  } else {
    console.log("Analysis response:", response);
    if (response && response.success) {
      console.log("✓ Text analysis working!");
      console.log("Risk level:", response.data?.overallRisk);
    } else {
      console.error("✗ Analysis failed:", response?.error);
    }
  }
});

// Test 5: Check for SafeNet elements on page
console.log("\n5. Checking for SafeNet elements...");
const safenetElements = document.querySelectorAll('[data-safenet-flagged], [data-safenet-blurred]');
console.log("Flagged elements:", safenetElements.length);

// Test 6: Check if content script is running
console.log("\n6. Checking content script...");
const scriptCheck = document.querySelector('script[data-safenet]');
if (!scriptCheck) {
  console.log("ℹ Content script should be running (check console for [SafeNet] messages)");
}

console.log("\n=== Test Complete ===");
console.log("Check the messages above for any ✗ errors");

