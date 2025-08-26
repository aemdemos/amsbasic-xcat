/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel slider container
  // The main slide wrapper is .swiper-wrapper inside the .page-slider or .pageslider
  let slider = element.querySelector('.pageslider .swiper-wrapper, .page-slider .swiper-wrapper, .swiper-wrapper');
  if (!slider) return; // No slides found

  // Get all direct .swiper-slide children
  const slides = Array.from(slider.querySelectorAll(':scope > .swiper-slide'));
  if (!slides.length) return;

  // To avoid duplicated slides (due to Swiper.js loop), filter to unique data-swiper-slide-index values
  const seen = new Set();
  const uniqueSlides = slides.filter(slide => {
    const idx = slide.getAttribute('data-swiper-slide-index');
    if (seen.has(idx)) return false;
    seen.add(idx);
    return true;
  });

  // Table header row
  const rows = [['Carousel']];

  uniqueSlides.forEach(slide => {
    // IMAGE CELL: usually in .layout-container__background > img
    let img = slide.querySelector('.layout-container__background img');
    if (!img) img = slide.querySelector('img'); // fallback
    // TEXT CELL: usually .page-slider__text
    let textCell = slide.querySelector('.page-slider__text');
    if (!textCell) {
      // fallback: try to get all text-like elements in slide (h1, h2, p, a)
      const contents = Array.from(slide.querySelectorAll('h1, h2, h3, p, a')).filter(e => e.textContent.trim() !== '');
      if (contents.length) {
        // group in a div
        const tempDiv = document.createElement('div');
        contents.forEach(el => tempDiv.appendChild(el));
        textCell = tempDiv;
      }
    }
    rows.push([
      img || '',
      textCell || ''
    ]);
  });

  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
