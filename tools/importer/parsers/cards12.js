/* global WebImporter */
export default function parse(element, { document }) {
  // Block header exactly as specified
  const headerRow = ['Cards (cards12)'];

  // Get all top columns that represent cards
  const columns = element.querySelectorAll(':scope > div.elementor-container > div.elementor-column');
  const rows = [headerRow];

  columns.forEach((column) => {
    // Find the inner section for each card
    const innerSection = column.querySelector(':scope > .elementor-widget-wrap section.elementor-inner-section');
    if (innerSection) {
      // Get the image element (first image in card)
      const img = innerSection.querySelector('img');
      // Get possible text content (if present)
      // This layout only has images (logos), so there is no text; handle gracefully
      let textCell = '';
      // If there are widget containers with text or heading, get them (future-proofing for variations)
      // For this particular HTML, there are only images
      rows.push([img ? img : '', textCell]);
    }
  });

  // Create and replace the block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
