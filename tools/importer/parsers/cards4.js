/* global WebImporter */
export default function parse(element, { document }) {
  // Get optional intro (above cards)
  const panel = element.querySelector('.paragraph--type--small-icon-tiles');
  let introCell = null;
  if (panel) {
    const title = panel.querySelector('.field--name-field-blurb-title');
    const desc = panel.querySelector('.field--name-field-blurb');
    if (title || desc) {
      const introFrag = document.createDocumentFragment();
      if (title && title.textContent.trim()) {
        const heading = document.createElement('strong');
        heading.textContent = title.textContent.trim();
        introFrag.appendChild(heading);
      }
      if (desc) {
        // If desc contains structured HTML, retain it
        Array.from(desc.childNodes).forEach(node => introFrag.appendChild(node.cloneNode(true)));
      }
      introCell = [introFrag];
    }
  }
  // Cards container
  const cardsContainer = element.querySelector('.field--name-field-icon-tiles');
  if (!cardsContainer) return;
  const cardItems = Array.from(cardsContainer.querySelectorAll(':scope > .field__item'));

  // Table header row
  const rows = [['Cards (cards4)']];

  // If there is intro content, place in a full-width row below the header
  if (introCell) {
    rows.push(introCell);
  }

  // For each card, extract image, title, CTA
  cardItems.forEach((item) => {
    // Image: .field--name-thumbnail img
    const img = item.querySelector('.field--name-thumbnail img');
    // Title: .field--name-field-icon-label
    let titleText = '';
    const labelField = item.querySelector('.field--name-field-icon-label');
    if (labelField) {
      const labelLink = labelField.querySelector('a');
      titleText = labelLink ? labelLink.textContent.trim() : labelField.textContent.trim();
    }
    // CTA: .field--name-field-icon-link (link text)
    let ctaLink = null;
    const ctaField = item.querySelector('.field--name-field-icon-link');
    if (ctaField) {
      ctaLink = ctaField.querySelector('a');
    }
    // Compose text cell
    const textCell = [];
    if (titleText) {
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      textCell.push(heading);
    }
    if (ctaLink) {
      textCell.push(document.createElement('br'));
      textCell.push(ctaLink);
    }
    rows.push([
      img,
      textCell
    ]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
