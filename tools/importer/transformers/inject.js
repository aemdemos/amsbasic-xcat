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
    // Try to find and click the specific accept button from the DOM structure
    let buttonClicked = false;
    
    // Target the specific cookie dialog accept button
    const acceptButton = document.querySelector('#cookieDialog .disclaimer-accept-button');
    
    if (acceptButton && acceptButton.offsetParent !== null) {
      console.log('Cookie banner: Clicking accept button');
      acceptButton.click();
      buttonClicked = true;
    }
    
    if (buttonClicked) {
      console.log('Cookie banner: Successfully clicked accept button');
      
      // Hide the cookie dialog if it's still visible
      const cookieDialog = document.querySelector('#cookieDialog');
      if (cookieDialog && cookieDialog.offsetParent !== null) {
        cookieDialog.style.display = 'none';
        console.log('Cookie banner: Hiding cookie dialog');
      }
      
    } else {
      console.log('Cookie banner: No accept button found');
    }
    
    return buttonClicked;
  }
  
  // Try to accept cookie banner immediately
  acceptCookieBanner();
  
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