/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as specified
  const headerRow = ['Columns (columns11)'];
  
  // Get the immediate child columns of the block
  const columns = Array.from(element.querySelectorAll(':scope > div.elementor-container > div.elementor-column'));
  
  // Edge case: If no columns found, do nothing
  if (columns.length === 0) return;
  
  // For each column, get the main content element for the cell
  const contentCells = columns.map((col) => {
    // Find the deepest .elementor-widget-wrap inside this column
    let widgetWrap = col.querySelector('.elementor-widget-wrap');
    let cellContent = null;
    // Sometimes there is an inner section with another widgetWrap
    if (widgetWrap) {
      const innerSection = widgetWrap.querySelector('section.elementor-inner-section');
      if (innerSection) {
        const innerWidgetWrap = innerSection.querySelector('.elementor-widget-wrap');
        if (innerWidgetWrap) {
          cellContent = innerWidgetWrap;
        } else {
          cellContent = innerSection;
        }
      } else {
        cellContent = widgetWrap;
      }
    } else {
      cellContent = col;
    }
    return cellContent;
  });

  // Compose the table rows: header, then single row of columns
  const rows = [headerRow, contentCells];

  // Create and replace with table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(blockTable);
}
