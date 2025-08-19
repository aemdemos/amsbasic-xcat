/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .fusion-fullwidth that contains the 4 columns for the columns5 block
  const columnsFullwidth = Array.from(element.querySelectorAll('.fusion-fullwidth')).find(fw => {
    const row = fw.querySelector(':scope > .fusion-builder-row');
    if (!row) return false;
    const cols = row.querySelectorAll(':scope > .fusion-layout-column');
    return cols.length === 4;
  });
  if (!columnsFullwidth) return;

  // Get the 4 columns
  const cols = columnsFullwidth.querySelectorAll(':scope > .fusion-builder-row > .fusion-layout-column');
  const rowCells = Array.from(cols).map(col => {
    // Find the .fusion-column-wrapper in this column, which contains all display content
    const wrapper = col.querySelector('.fusion-column-wrapper');
    if (!wrapper) return '';
    // Collect all children of the wrapper except empty text nodes
    const children = Array.from(wrapper.childNodes).filter(node => {
      // Keep all element nodes, and text nodes with actual (non-whitespace) content
      return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
    });
    // If multiple elements, return as array; else just the single element
    if (children.length === 1) {
      return children[0];
    } else if (children.length > 1) {
      return children;
    } else {
      return '';
    }
  });

  // Compose table rows
  const cells = [
    ['Columns (columns5)'], // header matches exactly
    rowCells
  ];

  // Create table and replace original block
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  columnsFullwidth.replaceWith(blockTable);
}
