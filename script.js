// Mark that JS is running (enables the emboss animation)
document.documentElement.classList.add('js');

// Draw the braille strip in the hero.
// Unicode braille: bit 0 = dot 1 ... bit 5 = dot 6.
// Dots 1-2-3 are the left column, 4-5-6 the right – the order the printer embosses them.
(function () {
  const el = document.getElementById('emboss');
  if (!el) return;
  const text = el.dataset.braille || '';
  // grid order: row by row, left then right
  const layout = [1, 4, 2, 5, 3, 6];
  let column = 0;
  const STEP = 110; // ms between columns

  for (const ch of text) {
    const bits = ch.codePointAt(0) - 0x2800;
    const cell = document.createElement('span');
    cell.className = 'cell';
    for (const n of layout) {
      const dot = document.createElement('span');
      const on = (bits >> (n - 1)) & 1;
      dot.className = 'dot ' + (on ? 'on' : 'off');
      // left column (1-3) embosses first, then the right column (4-6)
      const col = column + (n > 3 ? 1 : 0);
      dot.style.setProperty('--d', (300 + col * STEP) + 'ms');
      cell.appendChild(dot);
    }
    el.appendChild(cell);
    column += 2;
  }
})();

// Show the organisation's name if a logo file hasn't been added yet
document.querySelectorAll('img[data-fallback]').forEach(function (img) {
  function swap() {
    const span = document.createElement('span');
    span.className = 'logo-fallback';
    span.textContent = img.dataset.fallback;
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', img.alt);
    img.replaceWith(span);
  }
  if (img.complete && img.naturalWidth === 0) swap();
  else img.addEventListener('error', swap);
});

document.getElementById('year').textContent = new Date().getFullYear();
