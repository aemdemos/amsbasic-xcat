/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get a video link from iframe (if exists)
  function createVideoLink(iframe) {
    if (!iframe) return null;
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.title || 'Watch Video';
    return a;
  }

  // Get only unique slides (by paragraph id if possible)
  const slides = Array.from(element.querySelectorAll('.slick__slide'));
  const seen = new Set();
  const uniqueSlides = [];
  slides.forEach(slide => {
    let para = slide.querySelector('[class*="paragraph--type--slide"]');
    let pid = null;
    if (para) {
      const match = para.className.match(/paragraph--id--(\d+)/);
      if (match) pid = match[1];
    }
    if (pid) {
      if (!seen.has(pid)) {
        seen.add(pid);
        uniqueSlides.push(slide);
      }
    } else {
      uniqueSlides.push(slide);
    }
  });

  // Prepare table rows
  const rows = [['Carousel']]; // header row matches example

  uniqueSlides.forEach(slide => {
    const block = slide.querySelector('[class*="paragraph--type--slide"]') || slide;
    // First cell: logo image if present, otherwise first img
    let img = block.querySelector('.field--name-field-logo img');
    if (!img) img = block.querySelector('img');
    const firstCell = img || '';

    // Second cell: all textual content plus video link
    const cellContent = [];
    // All child elements of testimonial field, preserving structure
    const testimonialField = block.querySelector('.field--name-field-testimonial');
    if (testimonialField) {
      Array.from(testimonialField.childNodes).forEach(child => {
        if (child.nodeType === 1 || (child.nodeType === 3 && child.textContent.trim())) {
          cellContent.push(child);
        }
      });
    }
    // Add video link from iframe (if present and not already present as content)
    const iframe = block.querySelector('iframe');
    if (iframe) {
      // Add <br> if there's content already
      if (cellContent.length > 0) cellContent.push(document.createElement('br'));
      cellContent.push(createVideoLink(iframe));
    }
    rows.push([firstCell, cellContent.length ? cellContent : '']);
  });

  // Build the table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
