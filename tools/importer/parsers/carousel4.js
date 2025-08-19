/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel block header
  const cells = [['Carousel']];

  // Find the slides container
  const slidesContainer = element.querySelector('rs-slides');
  if (!slidesContainer) return;

  // Get all slides (each <rs-slide>)
  const slides = slidesContainer.querySelectorAll('rs-slide');

  slides.forEach((slide) => {
    // --- IMAGE ---
    let imageUrl = '';
    let imageElem = null;
    const bgWrap = slide.querySelector('rs-sbg');
    if (bgWrap) {
      imageUrl = bgWrap.getAttribute('data-lazyload') || bgWrap.getAttribute('data-src-rs-ref') || '';
    }
    if (imageUrl) {
      imageElem = document.createElement('img');
      imageElem.src = imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl;
      // Alt text - use slide title or blank
      imageElem.alt = slide.getAttribute('data-title') || '';
      // Optionally width/height
      const w = slide.getAttribute('data-owidth');
      const h = slide.getAttribute('data-oheight');
      if (w && h) {
        imageElem.width = Number(w);
        imageElem.height = Number(h);
      }
    }

    // --- TEXT CONTENT ---
    // Find all <rs-layer-wrap>s in the slide
    const layerWraps = slide.querySelectorAll('rs-layer-wrap');
    const contentElems = [];
    layerWraps.forEach((wrap) => {
      // Check if text or button
      const layer = wrap.querySelector('.rs-layer');
      if (!layer) return;
      if (layer.tagName === 'A') {
        // Button
        const link = document.createElement('a');
        link.href = layer.getAttribute('href');
        link.textContent = layer.textContent.trim();
        link.target = layer.getAttribute('target') || '_self';
        link.className = 'button';
        contentElems.push(link);
      } else {
        // Text
        // Heuristic: heading for font-weight >=700 or font-size >=40
        const style = layer.getAttribute('style') || '';
        const fontWeight = style.match(/font-weight:\s*(\d+)/);
        const fontSize = style.match(/font-size:\s*(\d+)px/);
        let heading = false;
        if ((fontWeight && Number(fontWeight[1]) >= 700) || (fontSize && Number(fontSize[1]) >= 40)) {
          heading = true;
        }
        if (heading) {
          const h2 = document.createElement('h2');
          h2.innerHTML = layer.innerHTML.trim();
          contentElems.push(h2);
        } else {
          const p = document.createElement('p');
          p.innerHTML = layer.innerHTML.trim();
          contentElems.push(p);
        }
      }
    });
    // Only include cell if contentElems not empty
    cells.push([
      imageElem || '',
      contentElems.length ? contentElems : ''
    ]);
  });

  // Create and replace block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}