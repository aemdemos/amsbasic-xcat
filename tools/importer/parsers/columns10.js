/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns in the footer
  const blockFooterInner = element.querySelector('#block-footerinner');
  if (!blockFooterInner) return;

  const leftCol = blockFooterInner.querySelector('#block-footerleft');
  const rightCol = blockFooterInner.querySelector('#block-footerright');

  // Compose the left column content
  const leftContent = [];
  if (leftCol) {
    // Add logo block
    const logo = leftCol.querySelector('#block-footerlogo');
    if (logo) leftContent.push(logo);
    // Add social icons block
    const social = leftCol.querySelector('#block-socialicons');
    if (social) leftContent.push(social);
    // Add copyright block
    const copyright = leftCol.querySelector('#block-copyright');
    if (copyright) leftContent.push(copyright);
  }

  // Compose the right column content (main navigation)
  const rightContent = [];
  if (rightCol) {
    const nav = rightCol.querySelector('nav');
    if (nav) rightContent.push(nav);
  }

  // Header must match example exactly
  const headerRow = ['Columns (columns10)'];

  // Second row: two columns (left and right)
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
