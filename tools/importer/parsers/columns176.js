/* global WebImporter */
export default function parse(element, { document }) {
  // Collect ALL menu columns, including hidden ones (e.g., Advisors)
  const menuColumns = Array.from(
    element.querySelectorAll('.ra-footer__menus > .menus__column')
  );

  // Collect social icons (as a column)
  let socialCell = null;
  const social = element.querySelector('.ra-footer__social');
  if (social) {
    socialCell = social;
  }

  // Compose columns: all menu columns, then social icons if present
  const columns = [...menuColumns, ...(socialCell ? [socialCell] : [])];

  // Table header: must match block name exactly
  const headerRow = ['Columns (columns176)'];

  // Table rows: header, then columns
  const rows = [
    headerRow,
    columns
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
