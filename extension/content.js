// Content script for SafeNet Shield
// Monitors page content for harmful messages and images

(function () {
  "use strict";

  const SCAN_INTERVAL = 3000; // Scan every 3 seconds
  const MIN_TEXT_LENGTH = 5; // Minimum text length to analyze
  const SCANNED_ELEMENTS = new WeakSet(); // Track scanned elements
  const BLURRED_IMAGES = new WeakSet(); // Track blurred images

  let isEnabled = true;
  let scanInterval = null;

  // Initialize extension
  function init() {
    console.log("[SafeNet] Initializing extension...");
    
    // Check if extension is enabled
    chrome.storage.local.get(["extensionEnabled", "authToken"], (result) => {
      isEnabled = result.extensionEnabled !== false;
      const hasAuth = !!result.authToken;
      
      console.log("[SafeNet] Extension enabled:", isEnabled);
      console.log("[SafeNet] User authenticated:", hasAuth);
      
      if (!hasAuth) {
        console.warn("[SafeNet] User not authenticated - extension will not work");
        showErrorNotification("Please login to SafeNet Shield extension to enable protection");
      }
      
      if (isEnabled) {
        startScanning();
      } else {
        console.log("[SafeNet] Extension is disabled");
      }
    });

    // Listen for enable/disable messages
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "toggleExtension") {
        isEnabled = request.enabled;
        if (isEnabled) {
          startScanning();
        } else {
          stopScanning();
        }
        sendResponse({ success: true });
      }
    });

    // Monitor new content added to the page
    observeDOM();
  }

  // Start scanning for harmful content
  function startScanning() {
    if (scanInterval) return;

    scanInterval = setInterval(() => {
      if (isEnabled) {
        scanMessages();
        scanImages();
      }
    }, SCAN_INTERVAL);

    // Initial scan
    setTimeout(() => {
      scanMessages();
      scanImages();
    }, 1000);
  }

  // Stop scanning
  function stopScanning() {
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
  }

  // Scan for text messages
  function scanMessages() {
    // Common selectors for message containers - expanded list
    // YouTube specific selectors added
    const messageSelectors = [
      // YouTube
      '#content-text', // YouTube comment text
      'yt-formatted-string#content-text', // YouTube formatted comment
      '#comment-content', // YouTube comment content
      'ytd-comment-renderer #content-text', // YouTube comment renderer
      // General
      '[data-testid*="message"]',
      '[class*="message"]',
      '[class*="chat"]',
      '[class*="comment"]',
      '[class*="post"]',
      '[class*="tweet"]',
      '[class*="status"]',
      'div[role="textbox"]',
      'div[role="article"]',
      "article",
      ".message-text",
      ".chat-message",
      ".comment-text",
      // More specific
      "p", // Paragraphs
      "span", // Spans with text
      "div", // Divs with text content
      "[data-text]", // Elements with data-text attribute
    ];

    let foundCount = 0;
    messageSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          if (!SCANNED_ELEMENTS.has(element) && element.textContent) {
            const text = element.textContent.trim();
            // Filter out very short or likely non-content text
            // But be more lenient - scan more content
            if (text.length >= MIN_TEXT_LENGTH && 
                text.length < 50000 && // Increased limit
                !text.match(/^\d+$/) && // Skip pure numbers
                element.offsetHeight > 0 && // Only visible elements
                element.offsetWidth > 0 &&
                // Skip elements that are likely page structure
                !element.closest('head') &&
                !element.closest('script') &&
                !element.closest('style') &&
                !element.closest('noscript')) {
              SCANNED_ELEMENTS.add(element);
              foundCount++;
              // Analyze immediately
              analyzeTextContent(text, element);
            }
          }
        });
      } catch (e) {
        // Ignore selector errors
        console.warn("[SafeNet] Selector error:", selector, e);
      }
    });
    
    if (foundCount > 0) {
      console.log(`[SafeNet] Scanned ${foundCount} new text elements`);
    }
  }

  // Analyze text content
  async function analyzeTextContent(text, element) {
    try {
      // Update stats
      chrome.storage.local.get(["messagesScanned"], (result) => {
        chrome.storage.local.set({
          messagesScanned: (result.messagesScanned || 0) + 1,
        });
      });

      console.log("[SafeNet] Analyzing text:", text.substring(0, 50) + "...");

      const response = await chrome.runtime.sendMessage({
        action: "analyzeText",
        text: text,
        createAlert: true,
      });

      console.log("[SafeNet] Analysis response:", response);

      if (!response) {
        console.error("[SafeNet] No response from background script");
        return;
      }

      if (response.error) {
        console.error("[SafeNet] Analysis error:", response.error);
        // Show error to user
        if (response.error.includes("Not authenticated")) {
          showErrorNotification("Please login to the extension to enable protection");
        } else {
          showErrorNotification("Analysis failed: " + response.error);
        }
        return;
      }

      if (response && response.success && response.data) {
        const risk = response.data.overallRisk;
        console.log("[SafeNet] Risk level:", risk, "for text:", text.substring(0, 30));
        
        if (risk && risk !== "low" && risk !== "clean") {
          console.log("[SafeNet] Harmful content detected! Risk:", risk);
          showWarning(element, "harmful message", risk);
          highlightHarmfulElement(element);

          // Update threats blocked
          chrome.storage.local.get(["threatsBlocked"], (result) => {
            chrome.storage.local.set({
              threatsBlocked: (result.threatsBlocked || 0) + 1,
            });
          });
        } else {
          console.log("[SafeNet] Content is safe (risk:", risk + ")");
        }
      }
    } catch (error) {
      console.error("[SafeNet] Error analyzing text:", error);
      showErrorNotification("Error analyzing content: " + error.message);
    }
  }

  // Scan for images
  function scanImages() {
    // Get all images including those in Google Images
    const images = document.querySelectorAll("img[src], img[srcset], img[data-src]");
    let scannedCount = 0;
    
    images.forEach((img) => {
      if (!BLURRED_IMAGES.has(img)) {
        // Get actual image source (handle lazy loading)
        const imgSrc = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
        
        if (imgSrc && !imgSrc.startsWith("data:") && !imgSrc.includes('googleusercontent.com/icon')) {
          // Check image dimensions (handle cases where naturalWidth might be 0 initially)
          const width = img.naturalWidth || img.width || img.offsetWidth;
          const height = img.naturalHeight || img.height || img.offsetHeight;
          
          // Skip very small images (likely icons) but be more lenient
          if (width > 50 && height > 50) {
            BLURRED_IMAGES.add(img);
            scannedCount++;
            
            // Wait for image to load if needed
            if (img.complete && img.naturalWidth > 0) {
              analyzeImageContent(img);
            } else {
              // Wait for image to load
              img.addEventListener('load', () => {
                analyzeImageContent(img);
              }, { once: true });
            }
          }
        }
      }
    });
    
    if (scannedCount > 0) {
      console.log(`[SafeNet] Found ${scannedCount} new images to scan`);
    }
  }

  // Analyze image content
  async function analyzeImageContent(imgElement) {
    try {
      // Update stats
      chrome.storage.local.get(["imagesScanned"], (result) => {
        chrome.storage.local.set({
          imagesScanned: (result.imagesScanned || 0) + 1,
        });
      });

      console.log("[SafeNet] Analyzing image:", imgElement.src.substring(0, 50));

      const response = await chrome.runtime.sendMessage({
        action: "analyzeImage",
        imageUrl: imgElement.src,
        createAlert: true,
      });

      console.log("[SafeNet] Image analysis response:", response);

      if (!response) {
        console.error("[SafeNet] No response from background script for image");
        return;
      }

      if (response.error) {
        console.error("[SafeNet] Image analysis error:", response.error);
        if (response.error.includes("Not authenticated")) {
          showErrorNotification("Please login to the extension to enable image protection");
        }
        return;
      }

      if (response && response.success && response.data) {
        const risk = response.data.overallRisk;
        const nsfw = response.data.nsfw;

        console.log("[SafeNet] Image risk:", risk, "NSFW:", nsfw?.label);

        // Blur if NSFW or high risk
        if (
          (risk && (risk === "high" || risk === "medium")) ||
          (nsfw && nsfw.label && nsfw.label !== "clean")
        ) {
          console.log("[SafeNet] Blurring explicit image");
          blurImage(imgElement);
          showWarning(imgElement, "explicit image", risk);

          // Update threats blocked
          chrome.storage.local.get(["threatsBlocked"], (result) => {
            chrome.storage.local.set({
              threatsBlocked: (result.threatsBlocked || 0) + 1,
            });
          });
        } else {
          console.log("[SafeNet] Image is safe");
        }
      }
    } catch (error) {
      console.error("[SafeNet] Error analyzing image:", error);
      showErrorNotification("Error analyzing image: " + error.message);
    }
  }

  // Blur an image
  function blurImage(imgElement) {
    imgElement.style.filter = "blur(20px)";
    imgElement.style.transition = "filter 0.3s";
    imgElement.setAttribute("data-safenet-blurred", "true");

    // Add click handler to temporarily unblur (with warning)
    imgElement.addEventListener(
      "click",
      function unblurHandler(e) {
        e.preventDefault();
        e.stopPropagation();

        const warning = document.createElement("div");
        warning.className = "safenet-image-warning";
        warning.innerHTML = `
        <div class="safenet-warning-content">
          <strong>⚠️ Warning: Explicit Content</strong>
          <p>This image was flagged as potentially explicit. Are you sure you want to view it?</p>
          <button class="safenet-view-btn">View Anyway</button>
          <button class="safenet-cancel-btn">Cancel</button>
        </div>
      `;

        document.body.appendChild(warning);

        warning
          .querySelector(".safenet-view-btn")
          .addEventListener("click", () => {
            imgElement.style.filter = "none";
            warning.remove();
            imgElement.removeEventListener("click", unblurHandler);
          });

        warning
          .querySelector(".safenet-cancel-btn")
          .addEventListener("click", () => {
            warning.remove();
          });
      },
      { once: false }
    );
  }

  // Highlight harmful element
  function highlightHarmfulElement(element) {
    element.style.border = "2px solid #ff4444";
    element.style.borderRadius = "4px";
    element.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
    element.setAttribute("data-safenet-flagged", "true");
  }

  // Show error notification
  function showErrorNotification(message) {
    const notification = document.createElement("div");
    notification.className = "safenet-error-notification";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff4444;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 100000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      max-width: 300px;
      animation: safenet-slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Show warning popup
  function showWarning(element, type, risk) {
    const warningId = `safenet-warning-${Date.now()}`;
    const warning = document.createElement("div");
    warning.id = warningId;
    warning.className = "safenet-warning-popup";
    warning.innerHTML = `
      <div class="safenet-warning-header">
        <span class="safenet-warning-icon">⚠️</span>
        <span class="safenet-warning-title">Harmful Content Detected</span>
        <button class="safenet-warning-close">&times;</button>
      </div>
      <div class="safenet-warning-body">
        <p>A ${type} with <strong>${risk}</strong> risk level was detected on this page.</p>
        <p class="safenet-warning-note">SafeNet Shield has flagged this content for your safety.</p>
      </div>
    `;

    document.body.appendChild(warning);

    // Position near the element
    const rect = element.getBoundingClientRect();
    warning.style.top = `${rect.top + window.scrollY}px`;
    warning.style.left = `${rect.left + window.scrollX}px`;

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.getElementById(warningId)) {
        document.getElementById(warningId).remove();
      }
    }, 5000);

    // Close button
    warning
      .querySelector(".safenet-warning-close")
      .addEventListener("click", () => {
        warning.remove();
      });
  }

  // Observe DOM changes for dynamically added content
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            // Check for new messages
            if (
              node.textContent &&
              node.textContent.trim().length >= MIN_TEXT_LENGTH
            ) {
              const text = node.textContent.trim();
              if (!SCANNED_ELEMENTS.has(node)) {
                SCANNED_ELEMENTS.add(node);
                analyzeTextContent(text, node);
              }
            }

            // Check for new images
            if (
              node.tagName === "IMG" &&
              node.src &&
              !node.src.startsWith("data:")
            ) {
              if (node.naturalWidth > 100 && node.naturalHeight > 100) {
                if (!BLURRED_IMAGES.has(node)) {
                  BLURRED_IMAGES.add(node);
                  analyzeImageContent(node);
                }
              }
            }

            // Check child images
            const images =
              node.querySelectorAll && node.querySelectorAll("img");
            if (images) {
              images.forEach((img) => {
                if (
                  img.src &&
                  !img.src.startsWith("data:") &&
                  !BLURRED_IMAGES.has(img)
                ) {
                  if (img.naturalWidth > 100 && img.naturalHeight > 100) {
                    BLURRED_IMAGES.add(img);
                    analyzeImageContent(img);
                  }
                }
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Debug: Log initialization
  console.log("[SafeNet] Content script loaded and initialized");
  console.log("[SafeNet] Current URL:", window.location.href);
})();
