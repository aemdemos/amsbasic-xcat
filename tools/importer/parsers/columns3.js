/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Block name header: must match exactly
  const headerRow = ['Columns (columns3)'];

  // 2. Get the banner-2-col paragraph (main block)
  const banner2Col = element.querySelector('.paragraph--type--banner-2-col');
  if (!banner2Col) return;

  // 3. Attempt to get left column (title)
  const leftContent = banner2Col.querySelector('.field--name-field-col-title-');
  // If missing, fallback to empty element
  const leftCell = leftContent || document.createElement('div');

  // 4. Attempt to get right column (icon and text)
  const iconField = banner2Col.querySelector('.field--name-field-col-icon');
  const rightTextField = banner2Col.querySelector('.field--name-field-col-2');
  const rightCellItems = [];

  // Icon: look for <a> containing <img>, reference the element directly
  if (iconField) {
    const iconLink = iconField.querySelector('a');
    if (iconLink) rightCellItems.push(iconLink);
  }
  // Text: reference the existing field
  if (rightTextField) {
    rightCellItems.push(rightTextField);
  }
  // If no content, fallback to empty element
  const rightCell = rightCellItems.length ? rightCellItems : [document.createElement('div')];

  // 5. Create table structure: header row, content row (two columns)
  const cells = [headerRow, [leftCell, rightCell]];

  // 6. Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
