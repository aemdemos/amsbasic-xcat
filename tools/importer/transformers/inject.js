/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
(() => {
  // Automatically accept cookie consent banners to ensure clean inventory generation
  
  function acceptCookieBanner() {
    console.log('Cookie banner: Starting acceptance process');
    
    // Check if cookie dialog exists
    const cookieDialog = document.querySelector('#cookieDialog');
    if (cookieDialog) {
      console.log('Cookie banner: Found cookieDialog element');
      
      // Method 1: Try to set cookies directly to bypass the dialog
      try {
        // Set common cookie consent cookies
        document.cookie = "cookieConsent=accepted; path=/; max-age=31536000";
        document.cookie = "cookie-consent=true; path=/; max-age=31536000";
        document.cookie = "cookies-accepted=1; path=/; max-age=31536000";
        console.log('Cookie banner: Set consent cookies directly');
      } catch (error) {
        console.log('Cookie banner: Could not set cookies:', error);
      }
      
      // Method 2: Direct DOM removal (following the examples pattern)
      console.log('Cookie banner: Removing dialog directly from DOM');
      cookieDialog.remove();
      
      // Method 3: Also try to remove any backdrop/overlay
      const overlays = document.querySelectorAll('.modal-backdrop, .overlay, [class*="backdrop"], [class*="overlay"]');
      overlays.forEach(overlay => {
        overlay.remove();
        console.log('Cookie banner: Removed overlay element');
      });
      
      // Method 4: Reset body styles that might be affected by modal
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.classList.remove('modal-open', 'no-scroll');
      
      console.log('Cookie banner: Successfully removed cookie dialog');
      return true;
      
    } else {
      console.log('Cookie banner: No cookieDialog found');
      return false;
    }
  }
  
  // Try to accept cookie banner immediately
  acceptCookieBanner();
  
  // Wait 3 seconds for the dialog to fully load, then try again
  setTimeout(() => {
    console.log('Cookie banner: Trying after 3 second delay');
    acceptCookieBanner();
  }, 3000);
  
  // Set up a mutation observer to catch dynamically loaded cookie banners
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Check if the cookieDialog was added
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            if (node.id === 'cookieDialog' || node.querySelector('#cookieDialog')) {
              shouldCheck = true;
            }
          }
        });
      }
    });
    
    if (shouldCheck) {
      console.log('Cookie banner: New content detected, checking for cookie banners');
      acceptCookieBanner();
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  
  })();