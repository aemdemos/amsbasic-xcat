/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be a single column with exact text
  const headerRow = ['Columns (columns8)'];

  // Find the main footer content (the main structure inside the element)
  const mainFooter = element.querySelector('.global-footer');
  if (!mainFooter) return;

  // The .wrapper contains the "row"s (top and bottom)
  const wrapper = mainFooter.querySelector('.wrapper');
  if (!wrapper) return;
  const rows = wrapper.querySelectorAll(':scope > .row');
  if (!rows || rows.length === 0) return;

  // Helper to get all child nodes (incl. text) and return as array, skipping whitespace-only text nodes
  function getCellContent(el) {
    const contents = [];
    el.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
      contents.push(node);
    });
    if (contents.length === 0) return document.createElement('div');
    if (contents.length === 1) return contents[0];
    return contents;
  }

  // Top row columns
  const topRow = rows[0];
  const topCols = Array.from(topRow.querySelectorAll(':scope > .col'));
  const topCells = topCols.map(getCellContent);

  // Bottom row columns (optional)
  let bottomCells = null;
  if (rows.length > 1) {
    const bottomRow = rows[1];
    const bottomCols = Array.from(bottomRow.querySelectorAll(':scope > .col'));
    bottomCells = bottomCols.map(getCellContent);
  }

  // Ensure bottomCells row matches length of topCells row (for a proper columns block)
  const cells = [headerRow, topCells];
  if (bottomCells) {
    const colCount = topCells.length;
    const filledBottom = [];
    for (let i = 0; i < colCount; i++) {
      filledBottom.push(bottomCells[i] || document.createElement('div'));
    }
    cells.push(filledBottom);
  }

  // Use createTable, which expects first row as header (even if single cell)
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
