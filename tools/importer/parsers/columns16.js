/* global WebImporter */
export default function parse(element, { document }) {
  // Get all columns in the block (direct children of .elementor-container)
  const container = element.querySelector(':scope > .elementor-container');
  if (!container) return;
  const columns = Array.from(container.children).filter(child => child.classList.contains('elementor-column'));

  // Helper to get all visible widgets (ignore hidden ones)
  function getVisibleWidgetContainers(column) {
    const wrap = column.querySelector(':scope > .elementor-widget-wrap');
    if (!wrap) return [];
    // Only include widgets NOT hidden on any device
    return Array.from(wrap.children)
      .filter(el => el.classList.contains('elementor-element') && !Array.from(el.classList).some(cls => cls.startsWith('elementor-hidden-')))
      .map(widget => widget.querySelector(':scope > .elementor-widget-container'))
      .filter(Boolean);
  }

  // Compose each column's contents
  const cells = columns.map((col, idx) => {
    const visibleWidgets = getVisibleWidgetContainers(col);

    // Special case for the last column (Card Brand Rules + logos)
    if (idx === columns.length - 1) {
      // Find the "Card Brand Rules" text content
      let header = null;
      visibleWidgets.forEach(el => {
        if (el.textContent.trim().toLowerCase().includes('card brand rules')) header = el;
      });
      // Find any images (logo links)
      const imgs = Array.from(col.querySelectorAll(':scope img')).map(img => {
        // Use the parent <a> if present
        const a = img.closest('a');
        return a ? a : img;
      });
      // Compose content: header + logos
      const frag = document.createDocumentFragment();
      if (header) frag.appendChild(header);
      if (imgs.length > 0) {
        const imgRow = document.createElement('div');
        imgs.forEach(img => imgRow.appendChild(img));
        frag.appendChild(imgRow);
      }
      return frag.childNodes.length === 1 ? frag.firstChild : frag;
    }
    // For other columns: just group all visible widgets
    if (visibleWidgets.length === 1) return visibleWidgets[0];
    if (visibleWidgets.length > 1) {
      const frag = document.createDocumentFragment();
      visibleWidgets.forEach(el => frag.appendChild(el));
      return frag.childNodes.length === 1 ? frag.firstChild : frag;
    }
    // fallback: column itself
    return col;
  });

  // Compose the table: header and content row
  const headerRow = ['Columns (columns16)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    cells
  ], document);
  element.replaceWith(table);
}
