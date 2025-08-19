/* global WebImporter */
export default function parse(element, { document }) {
  // Find the column wrapper and nav
  const column = element.querySelector('.fusion-layout-column');
  if (!column) return;
  const nav = column.querySelector('nav');
  if (!nav) return;

  // Find the main menu list
  const menu = nav.querySelector('ul.fusion-menu');
  if (!menu) return;
  const lis = Array.from(menu.children).filter(el => el.tagName === 'LI');

  // Gather the first three menu items for the columns
  // If fewer than three, fill with empty string
  const columns = [
    lis[0] || '',
    lis[1] || '',
    lis[2] || '',
  ];

  // Table structure: header row, content row with 3 columns
  const cells = [
    ['Columns (columns3)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
