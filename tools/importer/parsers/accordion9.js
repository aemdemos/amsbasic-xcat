/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly matches the example: 'Accordion'
  const headerRow = ['Accordion'];
  const rows = [headerRow];

  // Each immediate child .field__item is an accordion entry
  const items = element.querySelectorAll(':scope > .field__item');
  items.forEach((item) => {
    // Extract the question (title cell)
    const question = item.querySelector('.field--name-field-question');
    // Extract the answer (content cell)
    const answer = item.querySelector('.field--name-field-answer');

    // Edge case: If either question or answer missing, skip this row
    if (!question || !answer) return;

    // Use the existing elements directly for table cells
    rows.push([question, answer]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
