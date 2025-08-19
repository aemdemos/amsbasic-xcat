/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the inner content block with columns
  const panel = element.querySelector('[id^="panel-"]');
  if (!panel) return;

  // Get all immediate child columns
  const colDivs = Array.from(panel.querySelectorAll(':scope > div'));

  // Build the header row exactly as specified
  const headerRow = ['Columns (columns5)'];

  // For each column, reference the whole div so all formatting/content is preserved
  const contentRow = colDivs.map(div => div);

  // Build the table: 1 header row, 1 content row, N columns (cells)
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
