/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block table
  const headerRow = ['Columns (columns174)'];

  // Defensive: Get the main grid columns container
  const columnsContainer = element.querySelector('.ra-grid-columns');
  if (!columnsContainer) return;

  // Get the two main column divs (left and right)
  const columnDivs = columnsContainer.querySelectorAll(':scope > .ra-grid-col-4, :scope > .ra-grid-col-2');
  if (columnDivs.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columnDivs[0];
  // The left column should contain:
  // 1. "Sign up for our latest insights" CTA (mobile)
  // 2. "Just Published" heading
  // 3. Article thumbnail card
  const leftCta = leftCol.querySelector('.trigger-register');
  const justPublished = leftCol.querySelector('.font-whitney-semibold');
  const thumbnail = leftCol.querySelector('.ra-component-thumbnail');

  // Compose left column cell
  const leftCellContent = [];
  if (leftCta) leftCellContent.push(leftCta);
  if (justPublished) leftCellContent.push(justPublished);
  if (thumbnail) leftCellContent.push(thumbnail);

  // --- RIGHT COLUMN ---
  const rightCol = columnDivs[1];
  // 1. Desktop "Sign up" CTA (at the top)
  const rightCta = rightCol.querySelector('.trigger-register');
  // 2. Asset Allocation Interactive banner (with image and details)
  let aaiBanner = null;
  const containers = rightCol.querySelectorAll('.ra-component-container');
  for (const cont of containers) {
    const bannerLink = cont.querySelector('a[data-ltype="aai-banner"]');
    if (bannerLink) {
      aaiBanner = bannerLink;
      break;
    }
  }
  // 3. All content inside the banner (including headings, text, button)
  let bannerDetails = [];
  if (aaiBanner) {
    // Find all relevant content blocks inside the banner
    // Get the section inside the banner
    const bannerSection = aaiBanner.querySelector('.ra-component-section');
    if (bannerSection) {
      bannerDetails = Array.from(bannerSection.children);
    }
  }

  // Compose right column cell
  const rightCellContent = [];
  if (rightCta) rightCellContent.push(rightCta);
  if (aaiBanner) rightCellContent.push(aaiBanner);
  if (bannerDetails.length) rightCellContent.push(...bannerDetails);

  // Build the table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(blockTable);
}
