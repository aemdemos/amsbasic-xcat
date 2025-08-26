/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the main .layout-container__content
  let mainContent = element.querySelector('.layout-container__content');
  if (!mainContent) mainContent = element;

  // 2. Find the top-level row with columns
  let columnsRow = null;
  if (mainContent.querySelector('.wrapper > .row')) {
    columnsRow = mainContent.querySelector('.wrapper > .row');
  } else if (mainContent.querySelector('.row')) {
    columnsRow = mainContent.querySelector('.row');
  }

  // 3. Get the immediate .col children (columns)
  let columns = [];
  if (columnsRow) {
    columns = Array.from(columnsRow.children).filter((col) => col.classList.contains('col'));
  } else {
    // Fallback: treat immediate children as columns
    columns = Array.from(mainContent.children);
  }

  // 4. For each column, extract the main content inside, referencing the correct element
  const contentRow = columns.map((col) => {
    // If there's an .aem-Grid directly under the col, use all its children as content
    const aemGrid = col.querySelector(':scope > .aem-Grid');
    if (aemGrid) {
      // If only one child, use that, else group all children in a div
      const gridChildren = Array.from(aemGrid.children);
      if (gridChildren.length === 1) {
        return gridChildren[0];
      } else {
        const wrapper = document.createElement('div');
        gridChildren.forEach(child => wrapper.appendChild(child));
        return wrapper;
      }
    } else {
      // Otherwise, use the col directly
      return col;
    }
  });

  // 5. Build the table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns5)'],
    contentRow,
  ], document);

  // 6. Replace the original element
  element.replaceWith(table);
}
