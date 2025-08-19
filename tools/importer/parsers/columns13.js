/* global WebImporter */
export default function parse(element, { document }) {
  // Header row matching example
  const headerRow = ['Columns (columns13)'];

  // Find the items container
  const itemsContainer = element.querySelector('.jet-listing-grid__items');
  const itemElements = itemsContainer ? itemsContainer.querySelectorAll('.jet-listing-grid__item') : [];

  // Defensive: If nothing found, don't replace
  if (!itemElements.length) return;

  // Each testimonial column
  const columnsRow = Array.from(itemElements).map((item) => {
    // Find the widget wrap - contains both text and image
    // We want to preserve both as a single block, matching structure
    // Take the .elementor-widget-wrap inside the .elementor-column
    const widgetWrap = item.querySelector('.elementor-widget-wrap');

    // Defensive: If not found, fallback to section or item itself
    if (widgetWrap) {
      return widgetWrap;
    }
    const section = item.querySelector('section');
    if (section) {
      return section;
    }
    return item;
  });

  // Table array
  const cells = [headerRow, columnsRow];

  // Create and replace table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
