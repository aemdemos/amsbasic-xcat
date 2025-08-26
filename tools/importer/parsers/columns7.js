/* global WebImporter */
export default function parse(element, { document }) {
  // Find all columns blocks inside the element
  const columnsBlocks = Array.from(element.querySelectorAll('div[data-cmp-is="columns"]'));
  columnsBlocks.forEach((columnsBlock) => {
    // Find the .row holding the columns
    let row = columnsBlock.querySelector(':scope > .wrapper > .row');
    let colCells = [];
    if (row) {
      // Each immediate child .col is a cell
      const cols = Array.from(row.querySelectorAll(':scope > .col'));
      if (cols.length) {
        colCells = cols.map((col) => {
          // Gather all direct children of the col (including both text and elements)
          // Reference the actual existing elements from the document (NO CLONING)
          const nodes = [];
          Array.from(col.childNodes).forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE ||
              (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0)
            ) {
              nodes.push(node);
            }
          });
          if (nodes.length === 1) {
            return nodes[0];
          } else if (nodes.length > 1) {
            return nodes;
          } else {
            return '';
          }
        });
      } else {
        // If row exists but has no .col children, insert one empty cell
        colCells = [''];
      }
    } else {
      // If no row exists at all in this columns block, insert one empty cell
      colCells = [''];
    }
    const headerRow = ['Columns (columns7)'];
    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      colCells
    ], document);
    // Replace the columns block with the table
    columnsBlock.replaceWith(table);
  });
}
