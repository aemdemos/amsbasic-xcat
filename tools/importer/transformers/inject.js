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
    let buttonClicked = false;
    
    // Check if cookie dialog exists
    const cookieDialog = document.querySelector('#cookieDialog');
    if (cookieDialog) {
      console.log('Cookie banner: Found cookieDialog element');
      
      // Try multiple selectors for the accept button
      const acceptSelectors = [
        '#cookieDialog .disclaimer-accept-button',
        '.disclaimer-accept-button',
        '#cookieDialog .dialog-ok',
        '#cookieDialog a[data-ltype="cscookie"]:contains("Accept")',
        '#cookieDialog a:contains("Accept")'
      ];
      
      for (const selector of acceptSelectors) {
        let acceptButton;
        
        // Handle :contains pseudo-selector manually
        if (selector.includes(':contains("Accept")')) {
          const baseSelector = selector.replace(':contains("Accept")', '');
          const elements = document.querySelectorAll(baseSelector);
          acceptButton = Array.from(elements).find(el => 
            el.textContent && el.textContent.trim().toLowerCase().includes('accept')
          );
        } else {
          acceptButton = document.querySelector(selector);
        }
        
        if (acceptButton) {
          console.log(`Cookie banner: Found accept button with selector: ${selector}`);
          console.log(`Cookie banner: Button text: "${acceptButton.textContent?.trim()}"`);
          console.log(`Cookie banner: Button href: "${acceptButton.href}"`);
          
          // Try multiple click methods to ensure it works
          try {
            // Method 1: Regular click
            acceptButton.click();
            console.log('Cookie banner: Executed regular click');
            
            // Method 2: Mouse event
            acceptButton.dispatchEvent(new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            }));
            console.log('Cookie banner: Dispatched mouse event');
            
            // Method 3: Focus and trigger
            acceptButton.focus();
            acceptButton.dispatchEvent(new Event('focus'));
            acceptButton.dispatchEvent(new Event('mousedown'));
            acceptButton.dispatchEvent(new Event('mouseup'));
            console.log('Cookie banner: Triggered focus and mouse events');
            
            // Method 4: If it's a link with href="javascript:void(0)", try to trigger it
            if (acceptButton.tagName === 'A' && acceptButton.href && acceptButton.href.includes('javascript:')) {
              // Try to execute the onclick handler if it exists
              if (acceptButton.onclick) {
                acceptButton.onclick();
                console.log('Cookie banner: Executed onclick handler');
              }
            }
            
            buttonClicked = true;
            console.log('Cookie banner: Successfully processed accept button');
            
          } catch (error) {
            console.log('Cookie banner: Error clicking button:', error);
          }
          
          break;
        }
      }
      
      // Only hide if we couldn't click the accept button
      if (!buttonClicked && cookieDialog.offsetParent !== null) {
        console.log('Cookie banner: Failed to click accept, trying to hide dialog');
        cookieDialog.style.display = 'none !important';
      }
      
    } else {
      console.log('Cookie banner: No cookieDialog found');
    }
    
    return buttonClicked;
  }
  
  // Try to accept cookie banner immediately and repeatedly
  acceptCookieBanner();
  
  // Also try multiple times to ensure it's handled before screenshots
  for (let i = 0; i < 5; i++) {
    if (document.querySelector('#cookieDialog')) {
      acceptCookieBanner();
    }
  }
  
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