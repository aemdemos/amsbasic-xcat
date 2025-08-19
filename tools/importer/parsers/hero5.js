/* global WebImporter */
export default function parse(element, { document }) {
  // HEADER ROW: Must match example: 'Hero'
  const headerRow = ['Hero'];

  // SECOND ROW: background image (none in this HTML, since it's CSS background or decorative)
  const backgroundRow = [''];

  // THIRD ROW: Capture all visible content in order (headings, subheadings, CTA), keeping structure.
  // The content is inside .elementor-widget-wrap > div > .elementor-widget-container
  const widgetWrap = element.querySelector('.elementor-widget-wrap');
  let sectionContent = [];
  if (widgetWrap) {
    // Get all direct widget children in order
    const widgets = widgetWrap.querySelectorAll(':scope > div');
    widgets.forEach((widget, i) => {
      const container = widget.querySelector(':scope > .elementor-widget-container');
      if (container && container.textContent.trim()) {
        sectionContent.push(container);
        // Add a <br> except after the last one for clarity (like in the markdown example)
        if (i < widgets.length - 1) {
          sectionContent.push(document.createElement('br'));
        }
      }
    });
  }
  // If for some reason nothing was found, ensure at least an empty cell (as in some Hero examples)
  if (sectionContent.length === 0) {
    sectionContent = [''];
  }

  // Compose table structure (1 col, 3 rows)
  const cells = [
    headerRow,
    backgroundRow,
    [sectionContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
