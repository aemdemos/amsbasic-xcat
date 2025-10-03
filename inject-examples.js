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
    // Update the flex-direction of the div(s) containing an aside element to 'column'
  
    // Get all aside elements and their parent divs
    const asideElements = document.querySelectorAll('aside');
    const asideParentDivs = Array.from(asideElements)
      .map(aside => aside.parentElement)
      // Filter out the divs that are not display: flex
      .filter(parent => parent && parent.tagName.toLowerCase() === 'div')
      .filter(parent => window.getComputedStyle(parent).display === 'flex');
  
    // Set the flex-direction of the parent divs to column
    asideParentDivs.forEach((parent) => {
      parent.style.flexDirection = 'column';
  
      const asideEl = parent.querySelector('aside');
      if (asideEl) {
        asideEl.style.width = '100%';
        asideEl.classList.add('blu-det-container');
      }
    });
  
    // Apply the container class to hero blocks, which are being classified as default content
    const hero = document.querySelector('main>section>main>div>section:first-of-type.my-10');
    if (hero) {
      hero.classList.add('blu-det-container');
    }
  
    // Find any iframe videos
    const videoIframes = document.querySelectorAll('iframe[src*="fast.wistia.net"], iframe[src*="youtube.com/embed"]');
    videoIframes.forEach((iframe) => {
      const sectionAncestor = iframe.closest('section');
  
      if (sectionAncestor) {
        sectionAncestor.classList.add('blu-det-container');
      }
    });
  
    // Handle blockquotes
    const blockquotes = document.querySelectorAll('main blockquote');
    blockquotes.forEach((bq) => bq.closest('section')?.classList?.add('blu-det-container'));
    // Set the opacity of the parent div of each blockquote to 1
    blockquotes.forEach((bq) => {
      const div = bq.closest('div');
      if (div) {
        div.style.opacity = 1;
      }
    });
  })();