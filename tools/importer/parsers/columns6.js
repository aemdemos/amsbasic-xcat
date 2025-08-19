/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header MUST match the example exactly
  const headerRow = ['Columns (columns6)'];
  // 2. Find the columns container
  const colsContainer = element.querySelector('.fusion-columns');
  if (!colsContainer) return;
  // 3. Get all immediate fusion-column children (3 columns)
  const columns = Array.from(colsContainer.children).filter(
    el => el.classList.contains('fusion-column') || el.classList.contains('fusion-column-last')
  );
  // 4. For each column, collate all direct section children into a single wrapper if more than one
  const contentRow = columns.map(col => {
    // Get all direct section children
    const sections = Array.from(col.querySelectorAll(':scope > section'));
    // Edge case: column could be empty
    if (sections.length === 0) {
      return '';
    }
    if (sections.length === 1) {
      return sections[0];
    }
    // More than one section: wrap in a div for the column cell
    const div = document.createElement('div');
    sections.forEach(sec => div.appendChild(sec));
    return div;
  });
  // 5. Compose the table rows as per the Columns block spec
  const cells = [headerRow, contentRow];
  // 6. Create the table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
