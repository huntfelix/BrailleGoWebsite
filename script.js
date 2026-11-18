// Mark that JS is running (enables the animations)
document.documentElement.classList.add('js');

// Grid order for a cell: row by row, left column then right.
// Unicode braille: bit 0 = dot 1 ... bit 5 = dot 6.
var LAYOUT = [1, 4, 2, 5, 3, 6];

function makeCell(ch, delayFor) {
  var bits = ch.codePointAt(0) - 0x2800;
  var cell = document.createElement('span');
  cell.className = 'cell';
  LAYOUT.forEach(function (n) {
    var dot = document.createElement('span');
    var on = (bits >> (n - 1)) & 1;
    dot.className = 'dot ' + (on ? 'on' : 'off');
    if (delayFor) dot.style.setProperty('--d', delayFor(n) + 'ms');
    cell.appendChild(dot);
  });
  return cell;
}

// Hero strip: emboss left column then right, cell by cell – like the printer.
(function () {
  var el = document.getElementById('emboss');
  if (!el) return;
  var column = 0;
  Array.from(el.dataset.braille || '').forEach(function (ch) {
    var start = column;
    el.appendChild(makeCell(ch, function (n) { return 300 + (start + (n > 3 ? 1 : 0)) * 110; }));
    column += 2;
  });
})();

// "See your words in Braille" – uncontracted (Grade 1) UEB.
(function () {
  var input = document.getElementById('try-input');
  var out = document.getElementById('try-cells');
  if (!input || !out) return;

  var LETTERS = {
    a:'⠁', b:'⠃', c:'⠉', d:'⠙', e:'⠑', f:'⠋', g:'⠛', h:'⠓', i:'⠊', j:'⠚',
    k:'⠅', l:'⠇', m:'⠍', n:'⠝', o:'⠕', p:'⠏', q:'⠟', r:'⠗', s:'⠎', t:'⠞',
    u:'⠥', v:'⠧', w:'⠺', x:'⠭', y:'⠽', z:'⠵'
  };
  var DIGITS = { '1':'⠁','2':'⠃','3':'⠉','4':'⠙','5':'⠑','6':'⠋','7':'⠛','8':'⠓','9':'⠊','0':'⠚' };
  var PUNCT = { ',':'⠂', ';':'⠆', ':':'⠒', '.':'⠲', '!':'⠖', '?':'⠦', "'":'⠄', '’':'⠄', '-':'⠤' };
  var CAP = '⠠', NUM = '⠼';

  // Returns a list of {braille, label}
  function translate(text) {
    var cells = [];
    var inNumber = false;
    // A word in all capitals gets one capital-word sign (⠠⠠) instead of ⠠ per letter.
    text = text.replace(/\S+/g, function (word) {
      var letters = word.replace(/[^A-Za-z]/g, '');
      if (letters.length > 1 && letters === letters.toUpperCase()) return '\u0001' + word.toLowerCase();
      return word;
    });
    Array.from(text).forEach(function (ch) {
      if (ch === '\u0001') { cells.push({ b: CAP, label: '⇧' }, { b: CAP, label: '⇧' }); return; }
      if (ch === ' ') { cells.push({ space: true }); inNumber = false; return; }
      if (DIGITS[ch]) {
        if (!inNumber) { cells.push({ b: NUM, label: '#' }); inNumber = true; }
        cells.push({ b: DIGITS[ch], label: ch });
        return;
      }
      inNumber = false;
      var lower = ch.toLowerCase();
      if (LETTERS[lower]) {
        if (ch !== lower) cells.push({ b: CAP, label: '⇧' });
        cells.push({ b: LETTERS[lower], label: lower });
      } else if (PUNCT[ch]) {
        cells.push({ b: PUNCT[ch], label: ch });
      }
    });
    return cells;
  }

  function render(animateLast) {
    var cells = translate(input.value);
    out.textContent = '';
    var count = 0, dots = 0;
    cells.forEach(function (c, i) {
      var wrap = document.createElement('span');
      wrap.className = 'tcell' + (c.space ? ' space' : '');
      if (!c.space) {
        wrap.appendChild(makeCell(c.b));
        var lab = document.createElement('small');
        lab.textContent = c.label;
        wrap.appendChild(lab);
        count++;
        dots += (c.b.codePointAt(0) - 0x2800).toString(2).split('1').length - 1;
        if (animateLast && i === cells.length - 1) wrap.classList.add('pop');
      }
      out.appendChild(wrap);
    });
    document.getElementById('stat-cells').textContent = count;
    document.getElementById('stat-cols').textContent = count * 2;
    document.getElementById('stat-dots').textContent = dots;
    out.setAttribute('aria-label', count + ' Braille cells for “' + input.value + '”');
  }

  input.addEventListener('input', function () { render(true); });
  render(false);
})();

// Show the organisation's name if a logo file is missing
document.querySelectorAll('img[data-fallback]').forEach(function (img) {
  function swap() {
    var span = document.createElement('span');
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
