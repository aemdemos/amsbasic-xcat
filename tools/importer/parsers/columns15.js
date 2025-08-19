/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: single cell (single column), matching the block name exactly
  const headerRow = ['Columns (columns15)'];

  // 2. Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // 3. Extract content from each column
  function collectColumnContent(col) {
    // Get all .elementor-widget-container inside this column, or fallback to inner content
    const widgets = col.querySelectorAll('.elementor-widget-container');
    if (widgets.length) {
      return Array.from(widgets);
    } else {
      return [col];
    }
  }

  const leftCell = collectColumnContent(columns[0]);
  const rightCell = collectColumnContent(columns[1]);

  // 4. Add links for non-image iframes in the right column
  columns[1].querySelectorAll('iframe[src]').forEach((iframe) => {
    const src = iframe.getAttribute('src');
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.textContent = src;
      link.target = '_blank';
      rightCell.push(link);
    }
  });

  // 5. Compose table: header row (single cell), second row with two columns
  const cells = [
    headerRow,
    [leftCell, rightCell]
  ];

  // 6. Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
