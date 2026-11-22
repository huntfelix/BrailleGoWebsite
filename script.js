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

// Hero strip: emboss "BrailleGo!" in Braille, then turn each cell into its letter
// in the same spot, and back again – on a loop.
// data-text has one character per Braille cell; a space means the cell has no
// letter of its own (the capital signs), so it just fades out.
(function () {
  var el = document.getElementById('emboss');
  if (!el) return;
  var cells = Array.from(el.dataset.braille || '');
  var letters = Array.from(el.dataset.text || '');
  var STEP = 55;

  cells.forEach(function (ch, i) {
    var slot = document.createElement('span');
    slot.className = 'slot';
    slot.style.setProperty('--i', i);
    var start = i * 2;
    // left column (dots 1-3) first, then the right (4-6) – like the printer
    slot.appendChild(makeCell(ch, function (n) { return 100 + (start + (n > 3 ? 1 : 0)) * STEP; }));
    var letter = document.createElement('span');
    letter.className = 'letter';
    letter.textContent = (letters[i] || '').trim();
    if (!letter.textContent) slot.classList.add('blank');
    slot.appendChild(letter);
    el.appendChild(slot);
  });

  // In text mode each slot narrows to its own letter, so the word closes up
  // into "BrailleGo!". Measure the letters, and lock the strip to the Braille width.
  function measure() {
    el.style.width = '';
    el.querySelectorAll('.slot').forEach(function (slot) {
      var l = slot.querySelector('.letter');
      slot.style.setProperty('--lw', l.textContent ? l.offsetWidth + 'px' : '0px');
    });
    if (!el.classList.contains('as-text')) el.style.width = el.offsetWidth + 'px';
  }
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var SHOW_BRAILLE = 3800, SHOW_TEXT = 2800;
  var asText = false;
  function flip() {
    asText = !asText;
    el.classList.toggle('as-text', asText);
    setTimeout(flip, asText ? SHOW_TEXT : SHOW_BRAILLE);
  }
  setTimeout(flip, SHOW_BRAILLE);
})();

// Build reel: duplicate the photos so the scroll loops seamlessly.
(function () {
  var track = document.querySelector('.reel-track');
  if (!track) return;
  Array.from(track.children).forEach(function (fig) {
    var copy = fig.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach(function (img) { img.alt = ''; });
    track.appendChild(copy);
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
    // Keep each word's cells together so words don't break across lines.
    var word = null;
    cells.forEach(function (c, i) {
      if (c.space) { word = null; return; }
      if (!word) {
        word = document.createElement('span');
        word.className = 'tword';
        out.appendChild(word);
      }
      var wrap = document.createElement('span');
      wrap.className = 'tcell';
      {
        wrap.appendChild(makeCell(c.b));
        var lab = document.createElement('small');
        lab.textContent = c.label;
        wrap.appendChild(lab);
        count++;
        dots += (c.b.codePointAt(0) - 0x2800).toString(2).split('1').length - 1;
        if (animateLast && i === cells.length - 1) wrap.classList.add('pop');
      }
      word.appendChild(wrap);
    });
    document.getElementById('stat-cells').textContent = count;
    document.getElementById('stat-cols').textContent = count * 2;
    document.getElementById('stat-dots').textContent = dots;
    out.setAttribute('aria-label', count + ' Braille cells for “' + input.value + '”');
  }

  input.addEventListener('input', function () { render(true); });
  render(false);
})();

// Header: logo starts large and shrinks once the page is scrolled
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  function update() { nav.classList.toggle('scrolled', window.scrollY > 40); }
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// Main menu: drop-downs on wide screens, one menu button on phones
(function () {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var toggle = nav.querySelector('.menu-toggle');
  var groups = Array.from(nav.querySelectorAll('.dd'));

  function closeAll(except) {
    groups.forEach(function (g) {
      if (g === except) return;
      g.classList.remove('open');
      g.querySelector('.dd-btn').setAttribute('aria-expanded', 'false');
    });
  }
  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  groups.forEach(function (g) {
    var btn = g.querySelector('.dd-btn');
    btn.addEventListener('click', function () {
      var open = !g.classList.contains('open');
      closeAll(g);
      g.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  if (toggle) toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('menu-open')); });

  // Close after choosing a link, clicking elsewhere, or pressing Escape
  nav.querySelectorAll('.dd-list a').forEach(function (a) {
    a.addEventListener('click', function () { closeAll(); setMenu(false); });
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) { closeAll(); setMenu(false); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openBtn = nav.querySelector('.dd.open .dd-btn');
    closeAll(); 
    if (nav.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
    else if (openBtn) openBtn.focus();
  });
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

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contributor stories page: list the stories in stories.json, newest first.
(function () {
  var list = document.getElementById('story-list');
  if (!list) return;
  var empty = document.getElementById('story-empty');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function formatDate(iso) {
    var d = new Date(iso + 'T12:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  fetch('stories.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; })
    .then(function (stories) {
      stories = (Array.isArray(stories) ? stories : []).filter(function (s) { return s && s.title; });
      stories.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      if (!stories.length) { if (empty) empty.hidden = false; return; }

      stories.forEach(function (s) {
        var card = el('article', 'story');
        var photos = Array.isArray(s.photos) ? s.photos : [];
        if (photos.length) {
          var gallery = el('div', 'story-photos' + (photos.length > 1 ? ' multi' : ''));
          photos.slice(0, 4).forEach(function (p) {
            var img = document.createElement('img');
            img.src = p.src; img.alt = p.alt || ''; img.loading = 'lazy';
            gallery.appendChild(img);
          });
          card.appendChild(gallery);
        }
        var body = el('div', 'story-body');
        var meta = el('p', 'story-meta');
        meta.textContent = [s.author, s.location, s.date ? formatDate(s.date) : ''].filter(Boolean).join(' · ');
        if (Array.isArray(s.tags) && s.tags.length) {
          var tags = el('ul', 'story-tags');
          s.tags.forEach(function (t) { tags.appendChild(el('li', '', t)); });
          body.appendChild(tags);
        }
        body.appendChild(el('h3', '', s.title));
        body.appendChild(meta);
        (Array.isArray(s.body) ? s.body : [s.body || s.summary || '']).forEach(function (para) {
          if (para) body.appendChild(el('p', '', para));
        });
        if (s.link && /^https:\/\//.test(s.link)) {
          var a = el('a', 'story-link', s.linkText || 'Read more');
          a.href = s.link; a.rel = 'noopener';
          body.appendChild(a);
        }
        card.appendChild(body);
        list.appendChild(card);
      });
    });
})();
