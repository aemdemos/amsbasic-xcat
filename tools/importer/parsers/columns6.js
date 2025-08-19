/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns (immediate children are the .elementor-column entries)
  const columns = Array.from(element.querySelectorAll(':scope > div > div'));

  // Helper: For each column, grab the heading and the list
  function getColumnContent(col) {
    // Heading: Find the first h4 (or strong inside h4)
    let heading = null;
    const textWidget = col.querySelector('.elementor-widget-text-editor');
    if (textWidget) {
      heading = textWidget.querySelector('h4');
      if (!heading) {
        // fallback: look for strong or b
        const strong = textWidget.querySelector('strong, b');
        if (strong) {
          const h4 = document.createElement('h4');
          h4.appendChild(strong);
          heading = h4;
        }
      }
    }
    // List: the icon list ul
    let list = null;
    const iconListWidget = col.querySelector('.elementor-widget-icon-list');
    if (iconListWidget) {
      list = iconListWidget.querySelector('ul');
    }
    // Compose container referencing the actual elements
    const container = document.createElement('div');
    if (heading) container.appendChild(heading);
    if (list) container.appendChild(list);
    return container.childNodes.length === 1 ? container.firstChild : container;
  }

  // Compose the block header row and columns
  const headerRow = ['Columns (columns6)'];
  const contentRow = columns.map(getColumnContent);

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
