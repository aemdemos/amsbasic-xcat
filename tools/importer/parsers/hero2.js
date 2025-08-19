/* global WebImporter */
export default function parse(element, { document }) {
  // Block table: 1 column, 3 rows; header is 'Hero'
  const headerRow = ['Hero'];

  // There is no image in the provided HTML for the background row
  const backgroundRow = [''];

  // Gather all relevant content from the element (headings, paragraphs)
  // We want to reference actual elements from the DOM, preserving hierarchy and formatting.
  const contentElements = [];
  // We'll select all headings and paragraphs in reading order from the section
  element.querySelectorAll(':scope h1, :scope h2, :scope h3, :scope h4, :scope h5, :scope h6, :scope p').forEach((el) => {
    if (el.textContent.trim()) {
      contentElements.push(el);
    }
  });
  // If no heading/paragraph was found, fallback to any text content
  let contentCell = '';
  if (contentElements.length > 0) {
    contentCell = contentElements;
  } else {
    const txt = element.textContent.trim();
    contentCell = txt ? txt : '';
  }

  const contentRow = [contentCell];

  const cells = [
    headerRow,
    backgroundRow,
    contentRow
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
