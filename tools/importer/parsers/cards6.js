/* global WebImporter */
export default function parse(element, { document }) {
  // Table header exactly as specified
  const headerRow = ['Cards (cards6)'];

  // Cards are the immediate child divs (each with id starting with panel-)
  const panels = element.querySelectorAll(':scope > div');
  const rows = [];

  panels.forEach(panel => {
    // Image (first cell)
    let imgEl = null;
    const imgField = panel.querySelector('.field--name-field-image');
    if (imgField) {
      imgEl = imgField.querySelector('img');
    }

    // Text content (second cell)
    const textContent = [];
    // Heading (if present)
    const headingField = panel.querySelector('.field--name-field-heading-img-text');
    if (headingField && headingField.childNodes.length > 0) {
      // Keep structure from source (usually a <p>, might contain <span>)
      textContent.push(headingField);
    }
    // Body (if present)
    const bodyField = panel.querySelector('.field--name-field-body');
    if (bodyField && bodyField.childNodes.length > 0) {
      textContent.push(bodyField);
    }
    // If no textContent, ensure at least empty string so table isn't empty
    rows.push([
      imgEl || '',
      textContent.length ? textContent : ''
    ]);
  });

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
