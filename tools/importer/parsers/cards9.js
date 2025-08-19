/* global WebImporter */
export default function parse(element, { document }) {
  // Table header EXACTLY as in example
  const headerRow = ['Cards (cards9)'];

  // Get all card columns (ignore empty ones)
  const allColumns = Array.from(element.querySelectorAll(':scope > div > div'));
  const rows = [];
  allColumns.forEach(col => {
    // Only process if there's content
    const wrap = col.querySelector(':scope > .elementor-widget-wrap');
    if (!wrap) return;
    // Cards are inside an inner section
    const section = wrap.querySelector(':scope > section');
    if (!section) return;
    const innerCol = section.querySelector(':scope > div > div');
    if (!innerCol) return;
    const innerWrap = innerCol.querySelector(':scope > .elementor-widget-wrap');
    if (!innerWrap) return;

    // First cell: image (mandatory)
    let imageEl = innerWrap.querySelector('.elementor-widget-image img');

    // Second cell: everything else (title/heading, subtitle, description, CTA)
    const textParts = [];
    // Heading (h2/h3 with strong)
    const heading = innerWrap.querySelector('.elementor-widget-text-editor .elementor-widget-container h2, .elementor-widget-text-editor .elementor-widget-container h3');
    if (heading) textParts.push(heading);
    // Subheading (h5)
    const subheading = innerWrap.querySelector('.elementor-widget-text-editor .elementor-widget-container h5');
    if (subheading) textParts.push(subheading);
    // Description (p in box-description)
    const description = innerWrap.querySelector('.box-description .elementor-widget-container p');
    if (description) textParts.push(description);
    // CTA button (a)
    const button = innerWrap.querySelector('.elementor-widget-button .elementor-widget-container a');
    if (button) textParts.push(button);

    // Only add row if we have image and some text
    if (imageEl && textParts.length) {
      rows.push([imageEl, textParts]);
    }
  });

  // Edge case: if no cards found, fallback gracefully
  if (rows.length === 0) {
    element.replaceWith(document.createTextNode(''));
    return;
  }

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
