/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns177)'];

  // Defensive: find the main content container
  // Structure: .ra-footer__bottom > ... > .ra-footer__bottom-content
  const content = element.querySelector('.ra-footer__bottom-content');
  if (!content) return;

  // Find copyright and links
  const copyright = content.querySelector('.ra-footer__copyright');
  const linksContainer = content.querySelector('.ra-footer__links ul');

  // Defensive: ensure both exist
  if (!copyright || !linksContainer) return;

  // Column 1: copyright text (reference the actual element)
  // Column 2: links (as a fragment of referenced anchor elements)
  const links = Array.from(linksContainer.querySelectorAll('li'))
    .map(li => {
      // Use the anchor directly if present
      const a = li.querySelector('a');
      return a ? a : li;
    });
  // Wrap links in a fragment
  const linksFragment = document.createDocumentFragment();
  links.forEach((link, idx) => {
    linksFragment.append(link);
    // Add space between links except after the last one
    if (idx < links.length - 1) {
      linksFragment.append(' ');
    }
  });

  const row = [copyright, linksFragment];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  element.replaceWith(table);
}
