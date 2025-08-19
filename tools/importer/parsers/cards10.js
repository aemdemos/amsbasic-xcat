/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Compose card text content preserving semantic meaning
  function composeTextContent(cardWrap) {
    const frag = document.createElement('div');
    // Title: <h3><strong>...</strong></h3>
    const title = cardWrap.querySelector('.elementor-widget-text-editor .elementor-widget-container h3');
    if (title) frag.appendChild(title);
    // Subheading: <h5><strong>...</strong></h5>
    const subheading = cardWrap.querySelector('.elementor-widget-text-editor .elementor-widget-container h5');
    if (subheading) frag.appendChild(subheading);
    // Description:
    const description = cardWrap.querySelector('.box-description .elementor-widget-container p, .box-description .elementor-widget-container div, .box-description .elementor-widget-container span');
    if (description) frag.appendChild(description);
    // Button (Call to Action)
    const button = cardWrap.querySelector('.elementor-widget-button .elementor-widget-container a.elementor-button');
    if (button) frag.appendChild(button);
    return frag;
  }

  // Table header, per spec
  const rows = [['Cards (cards10)']];

  // Find all populated columns with card content
  const columns = element.querySelectorAll(':scope > .elementor-container > .elementor-column');
  columns.forEach(col => {
    const widgetWrap = col.querySelector('.elementor-widget-wrap.elementor-element-populated');
    if (!widgetWrap) return;
    const cardSections = widgetWrap.querySelectorAll('section.elementor-inner-section');
    cardSections.forEach(section => {
      // Each inner-section might have multiple card columns, but in this HTML, each card is its own inner-section
      const cardCols = section.querySelectorAll(':scope > .elementor-container > .elementor-column');
      cardCols.forEach(cardCol => {
        const cardWrap = cardCol.querySelector('.elementor-widget-wrap');
        if (!cardWrap) return;
        // Image (first cell)
        const img = cardWrap.querySelector('.elementor-widget-image .elementor-widget-container img');
        // Text content (second cell)
        const textContent = composeTextContent(cardWrap);
        // Only add if we have at least image and some text
        if (img && textContent.childNodes.length) {
          rows.push([img, textContent]);
        }
      });
    });
  });

  // Create block table, replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
