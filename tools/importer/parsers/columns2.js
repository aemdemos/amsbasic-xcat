/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: block name, exactly as specified
  const headerRow = ['Columns (columns2)'];

  // Defensive: look for 50/50 wrapper
  const wrapper = element.querySelector('.it-50-50-wrapper');
  if (!wrapper) return;

  // Find the left column image/svg
  const left = wrapper.querySelector('.field--name-field-image');
  // Find the right column text content
  const right = wrapper.querySelector('.text-side-wrapper');

  // Defensive: If either column is missing, fall back to entire wrapper in that cell
  const col1 = left || document.createElement('div');
  if (!left) col1.innerHTML = '';
  const col2 = right || document.createElement('div');
  if (!right) col2.innerHTML = '';

  // The second row must have as many columns as there are pieces of content (here, 2)
  const secondRow = [col1, col2];

  // Table structure: header row + content row
  const cells = [headerRow, secondRow];

  // Create the block table using the provided helper
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element in-place
  element.replaceWith(block);
}
