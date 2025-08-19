/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct child panels (each column)
  const panels = Array.from(element.querySelectorAll(':scope > div'));
  const headerRow = ['Columns (columns7)'];

  // Each column should have: icon, heading, body (in that order, together)
  const columns = panels.map(panel => {
    const items = [];
    const icon = panel.querySelector('.field--name-thumbnail svg');
    if (icon) items.push(icon);
    const h3 = panel.querySelector('h3');
    if (h3) items.push(h3);
    const body = panel.querySelector('.field--name-field-body-copy');
    if (body) items.push(body);
    // All together as a single cell (as an array)
    return items;
  });

  // Only build table if there are valid columns
  if (columns.length > 0) {
    const tableArr = [headerRow, columns];
    const block = WebImporter.DOMUtils.createTable(tableArr, document);
    element.replaceWith(block);
  }
}
