/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns173)'];

  // Defensive: Find the columns container
  // The source HTML structure is: ra-grid-root > ra-grid-columns > 4 x ra-grid-col-1
  const gridRoot = element.querySelector('.ra-grid-root');
  if (!gridRoot) return;
  const columnsContainer = gridRoot.querySelector('.ra-grid-columns');
  if (!columnsContainer) return;

  // Get all direct column children
  const columnEls = Array.from(columnsContainer.children).filter(
    (col) => col.classList.contains('ra-grid-col-1')
  );

  // Each column contains a .ra-component-text > a (with headings and body text)
  // We'll reference the anchor element directly for each column
  const columns = columnEls.map((col) => {
    const textBlock = col.querySelector('.ra-component-text');
    if (!textBlock) return '';
    const anchor = textBlock.querySelector('a');
    // Defensive: If anchor missing, use textBlock
    return anchor || textBlock;
  });

  // Build the table rows
  const cells = [
    headerRow,
    columns
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
