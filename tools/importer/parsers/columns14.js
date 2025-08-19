/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table Header: use exactly the block name as in the instructions
  const headerRow = ['Columns (columns14)'];

  // 2. Find all immediate columns (elementor-column) inside the section
  // These are the direct children of .elementor-container
  const container = element.querySelector(':scope > .elementor-container');
  if (!container) {
    // Defensive: fallback to replacing with an empty block if structure is not matched
    const block = WebImporter.DOMUtils.createTable([headerRow, ['']], document);
    element.replaceWith(block);
    return;
  }
  const columns = Array.from(container.querySelectorAll(':scope > .elementor-column'));
  if (columns.length === 0) {
    // Defensive: fallback to empty block
    const block = WebImporter.DOMUtils.createTable([headerRow, ['']], document);
    element.replaceWith(block);
    return;
  }

  // 3. For each column, collect all icon-list widgets (should be one per column)
  const cellContents = columns.map(col => {
    // Find all .elementor-widget-icon-list widgets in this column
    const iconLists = Array.from(col.querySelectorAll('.elementor-widget-icon-list'));
    // For each, reference the .elementor-widget-container (which wraps the ul)
    const containers = iconLists.map(list => {
      const container = list.querySelector('.elementor-widget-container');
      return container;
    }).filter(Boolean); // filter out nulls
    // If multiple icon-list widgets, combine their containers
    if (containers.length === 0) {
      // If no container found, fallback to empty string
      return '';
    } else if (containers.length === 1) {
      return containers[0];
    } else {
      // If more than one icon-list widget, combine all containers into array
      return containers;
    }
  });

  // 4. Compose the table: header row + content row
  const cells = [headerRow, cellContents];

  // 5. Create block table and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
