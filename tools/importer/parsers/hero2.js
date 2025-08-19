/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as required by the example
  const headerRow = ['Hero'];

  // 1. Extract the background image (if any)
  let bgImgUrl = '';
  // Check for .parallax-inner background image style
  const parallaxInner = element.querySelector('.parallax-inner');
  if (parallaxInner && parallaxInner.style.backgroundImage) {
    const bg = parallaxInner.style.backgroundImage;
    if (bg && bg.startsWith('url(')) {
      bgImgUrl = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    }
  }
  // If not found, check for faded background style var
  if (!bgImgUrl) {
    const faded = element.querySelector('.fullwidth-faded');
    if (faded) {
      let fadedBg = faded.style.getPropertyValue('--awb-background-image') || '';
      if (fadedBg) {
        fadedBg = fadedBg.replace(/^url\(/, '').replace(/\)$/, '');
        bgImgUrl = fadedBg;
      }
    }
  }

  // Create an img element for background image if URL exists
  let bgImgElem = null;
  if (bgImgUrl) {
    bgImgElem = document.createElement('img');
    bgImgElem.src = bgImgUrl;
    bgImgElem.alt = '';
    // Do not set width or height inline; let CSS handle it
  }

  // 2. Compose second row: background image (optional)
  // If there is a background image, use it; otherwise, empty string
  const secondRowCell = bgImgElem ? bgImgElem : '';

  // 3. Compose third row: headline, subheadline, CTA (all optional)
  // For this specific example, only the CTA button exists in the source HTML
  let thirdRowContent = [];
  // Extract CTA button from the 3rd column
  const ctaCol = element.querySelector('.fusion-builder-column-8');
  if (ctaCol) {
    const ctaBtn = ctaCol.querySelector('a');
    if (ctaBtn) {
      thirdRowContent.push(ctaBtn);
    }
  }
  // If no CTA button, row should be empty
  if (thirdRowContent.length === 0) {
    thirdRowContent = [''];
  }

  // Construct table rows as per the block definition (exactly 1 column)
  const cells = [
    headerRow,
    [secondRowCell],
    [thirdRowContent.length === 1 ? thirdRowContent[0] : thirdRowContent]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
