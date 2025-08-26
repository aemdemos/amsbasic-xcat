/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block's row
  const row = element.querySelector('[data-cmp-is="columns"] .row');
  if (!row) return;

  // Get all immediate column divs (col)
  const columnDivs = Array.from(row.children).filter(c => c.classList.contains('col'));
  if (!columnDivs.length) return;

  // For each column, gather all direct content for that column
  const columnsContent = columnDivs.map(col => {
    // Check for an .aem-Grid wrapper inside the column, use its children if present
    let contentParent = col;
    const grid = col.querySelector(':scope > .aem-Grid');
    if (grid) {
      contentParent = grid;
    }
    // Gather all direct children from the contentParent
    const frag = document.createDocumentFragment();
    Array.from(contentParent.children).forEach(child => {
      // If element contains (or is) an iframe (but not img), create a link to its src
      if (child.tagName === 'DIV' || child.tagName === 'SECTION') {
        const iframe = child.querySelector('iframe');
        if (iframe && iframe.src) {
          const a = document.createElement('a');
          a.href = iframe.src;
          a.textContent = iframe.src;
          frag.append(a);
          return;
        }
      }
      frag.append(child);
    });
    // Return a single element, or array if multiple
    return frag.childNodes.length === 1 ? frag.firstChild : Array.from(frag.childNodes);
  });

  // Table header must match the example exactly
  const headerRow = ['Columns (columns3)'];
  const cells = [headerRow, columnsContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
