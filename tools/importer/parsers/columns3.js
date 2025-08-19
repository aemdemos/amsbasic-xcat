/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate columns for this inner section
  const columns = element.querySelectorAll(':scope > div > div');
  const numCols = columns.length || 1;

  // Table header row: always a single cell, even if multiple columns in data row
  const headerRow = ['Columns (columns3)'];

  // Second row: each column's content as a cell, referencing direct widget blocks from .elementor-widget-wrap
  const cells = [];
  columns.forEach((col) => {
    const wrap = col.querySelector('.elementor-widget-wrap');
    if (wrap) {
      // Use all widgets inside as the cell content, or [] if empty
      const widgets = Array.from(wrap.children);
      cells.push(widgets.length ? widgets : []);
    } else {
      cells.push([]);
    }
  });
  // Defensive: pad to at least two columns, if expected by layout
  while (cells.length < numCols) {
    cells.push([]);
  }
  // Build table rows: header (single cell), then actual columns row
  const tableData = [headerRow, cells];
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
