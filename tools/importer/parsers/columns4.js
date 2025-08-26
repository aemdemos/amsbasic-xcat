/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns block root (data-cmp-is="columns") within the input element
  const columns = element.querySelector('[data-cmp-is="columns"]');
  if (!columns) return;

  // Find the .row element which contains the columns
  const row = columns.querySelector('.row');
  if (!row) return;

  // The content is deeply nested: left content is the accordion, right content is the image
  // Drill down to .col.col-12 > .aem-Grid > .accordionlarge and .col.col-12 > .aem-Grid > .card__bottom
  const col12 = row.querySelector('.col.col-12');
  if (!col12) return;

  const grid = col12.querySelector('.aem-Grid');
  if (!grid) return;

  // The left content (accordion)
  let leftContent = grid.querySelector('.accordionlarge');
  // The right content (image)
  let rightContent = grid.querySelector('.card__bottom');

  // Fallbacks: if not found, use empty divs to preserve columns structure
  if (!leftContent) {
    leftContent = document.createElement('div');
  }
  if (!rightContent) {
    rightContent = document.createElement('div');
  }

  // Table header should exactly match the block name and variant
  const headerRow = ['Columns (columns4)'];
  // Content row: two columns (left and right contents)
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
