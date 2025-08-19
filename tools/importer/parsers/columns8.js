/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row, must match the markdown example
  const headerRow = ['Columns (columns8)'];

  // Get top-level columns (should be 3 for this block)
  const topColumns = Array.from(element.querySelectorAll(':scope > .elementor-container > .elementor-column'));

  // For each column, extract the counter and label
  const columnsContent = topColumns.map((col) => {
    // Find the first inner section for each column
    const innerSection = col.querySelector(':scope > .elementor-widget-wrap > section');
    if (!innerSection) return document.createElement('div'); // fallback empty div
    // Each inner section has two columns: counter and description
    const innerColumns = Array.from(innerSection.querySelectorAll(':scope > .elementor-container > .elementor-column'));
    let counterContent = null;
    let labelContent = null;
    innerColumns.forEach((innerCol) => {
      const counterWidget = innerCol.querySelector('.elementor-widget-counter');
      if (counterWidget && !counterContent) {
        const counterContainer = counterWidget.querySelector('.elementor-widget-container');
        if (counterContainer) counterContent = counterContainer;
      }
      const labelWidget = innerCol.querySelector('.elementor-widget-text-editor');
      if (labelWidget && !labelContent) {
        const labelContainer = labelWidget.querySelector('.elementor-widget-container');
        if (labelContainer) labelContent = labelContainer;
      }
    });
    // Compose a single div with counter and label for the cell
    const cell = document.createElement('div');
    if (counterContent) cell.appendChild(counterContent);
    if (labelContent) cell.appendChild(labelContent);
    return cell;
  });

  // Compose table cells for Columns (columns8) block
  const cells = [
    headerRow,
    columnsContent,
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
