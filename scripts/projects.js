(function () {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Creează tooltip-ul o singură dată
  const tip = document.createElement('div');
  tip.className = 'img-tooltip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  // Helper: setează conținutul tooltip-ului
  function setTip(el) {
    const title = el.dataset.title || el.getAttribute('aria-label') || 'Detalii';
    const meta  = el.dataset.meta  || '';
    tip.innerHTML = `<span class="t-title">${title}</span><span class="t-meta">${meta}</span>`;
  }

  // Helper: poziționează în jurul cursorului, fără să iasă din ecran
function positionTip(clientX, clientY) {
  const pad = 10;        // padding la marginea ecranului
  const cursor = 14;     // distanță minimă față de cursor
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // dimensiunea actuală a tooltip-ului
  const rect = tip.getBoundingClientRect();

  // helper: verifică dacă încape complet în viewport
  const fits = (left, top) =>
    left >= pad &&
    top  >= pad &&
    left + rect.width  <= vw - pad &&
    top  + rect.height <= vh - pad;

  // candidați (în ordinea preferată)
  const candidates = [
    // RIGHT of cursor
    { left: clientX + cursor, top: clientY - rect.height / 2 },
    // LEFT of cursor
    { left: clientX - rect.width - cursor, top: clientY - rect.height / 2 },
    // BOTTOM of cursor
    { left: clientX - rect.width / 2, top: clientY + cursor },
    // TOP of cursor
    { left: clientX - rect.width / 2, top: clientY - rect.height - cursor },
  ];

  // alege prima poziție care încape complet
  let chosen = candidates.find(p => fits(p.left, p.top));

  // dacă nu încape niciuna, alege prima (dreapta) și "clamp"-uiește în ecran
  if (!chosen) {
    chosen = candidates[0];
    chosen.left = Math.min(Math.max(chosen.left, pad), vw - rect.width - pad);
    chosen.top  = Math.min(Math.max(chosen.top,  pad), vh - rect.height - pad);
  }

  // aplică poziția
  tip.style.left = `${Math.round(chosen.left)}px`;
  tip.style.top  = `${Math.round(chosen.top)}px`;
}



  // Desktop: hover
  function onEnter(e) {
    const tile = e.currentTarget;
    setTip(tile);
    tip.classList.add('show');
  }
  function onMove(e) {
    positionTip(e.clientX, e.clientY);
  }
  function onLeave() {
    tip.classList.remove('show');
  }

  // Touch: primul tap arată tooltipul, al doilea urmează linkul
  let touchArmed = null;
  function onTouchStart(e) {
    const tile = e.currentTarget;
    if (touchArmed === tile) {
      // al doilea tap → navighează normal
      return;
    }
    e.preventDefault(); // blochează navigarea la primul tap
    touchArmed = tile;
    setTip(tile);
    // poziționează tooltipul la centrul tile-ului
    const r = tile.getBoundingClientRect();
    positionTip(r.left + r.width/2, r.top + r.height/2);
    tip.classList.add('show');

    // dezarmează după o perioadă sau la tap în afară
    clearTimeout(onTouchStart._t);
    onTouchStart._t = setTimeout(() => { tip.classList.remove('show'); touchArmed = null; }, 2000);
  }
  document.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.tile')) {
      tip.classList.remove('show');
      touchArmed = null;
    }
  }, { passive: true });

  // Atașează evenimentele la toate tile-urile
  const tiles = grid.querySelectorAll('.tile');
  tiles.forEach(tile => {
    // accesibilitate bază
    if (!tile.getAttribute('aria-label') && tile.dataset.title) {
      tile.setAttribute('aria-label', tile.dataset.title);
    }

    tile.addEventListener('mouseenter', onEnter);
    tile.addEventListener('mousemove', onMove);
    tile.addEventListener('mouseleave', onLeave);

    tile.addEventListener('touchstart', onTouchStart, { passive: false });
  });

  // Curăță tooltipul la scroll/resize (poziție se recalculă la mișcare)
  window.addEventListener('scroll', () => tip.classList.remove('show'), { passive: true });
})();

(() => {
  const grid = document.querySelector('.gallery');
  if (!grid) return;

  // Creează tooltip 1x
  const tip = document.createElement('div');
  tip.className = 'img-tooltip';
  tip.setAttribute('role', 'tooltip');
  document.body.appendChild(tip);

  // Setează conținut tooltip
  const setTip = (el) => {
    const title = el.dataset.title || el.getAttribute('aria-label') || 'Detalii';
    const meta  = el.dataset.meta  || '';
    tip.innerHTML = `<span class="t-title">${title}</span> <span class="t-meta">${meta}</span>`;
  };

  // Poziționează tooltip (smart, fără să iasă din ecran)
  function positionTip(x, y) {
    const pad = 10, vw = innerWidth, vh = innerHeight;
    const r = tip.getBoundingClientRect();

    // încearcă dreapta, apoi stânga, apoi jos/sus
    const candidates = [
      { left: x + 14, top: y - r.height/2 },
      { left: x - r.width - 14, top: y - r.height/2 },
      { left: x - r.width/2, top: y + 14 },
      { left: x - r.width/2, top: y - r.height - 14 },
    ];

    let p = candidates.find(p =>
      p.left >= pad && p.top >= pad &&
      p.left + r.width <= vw - pad &&
      p.top + r.height <= vh - pad
    ) || candidates[0];

    // clamp în ecran
    p.left = Math.min(Math.max(p.left, pad), vw - r.width - pad);
    p.top  = Math.min(Math.max(p.top , pad), vh - r.height - pad);

    tip.style.left = `${Math.round(p.left)}px`;
    tip.style.top  = `${Math.round(p.top)}px`;
  }

  // Stare pentru tap dublu (tap-preview → tap-open)
  let armedTile = null;
  let armTimer = null;
  const ARM_MS = 2000;

  const tiles = grid.querySelectorAll('.tile');

  // Mouse (hover) – opțional, rămâne neschimbat
  tiles.forEach(tile => {
    tile.addEventListener('mouseenter', e => {
      if (window.matchMedia('(hover: hover)').matches) {
        setTip(tile);
        tip.classList.add('show');
      }
    });
    tile.addEventListener('mousemove', e => {
      if (tip.classList.contains('show') && e.pointerType !== 'touch') {
        positionTip(e.clientX, e.clientY);
      }
    });
    tile.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        tip.classList.remove('show');
      }
    });
  });

  // Touch/pen: prima atingere arată tooltip, a doua deschide linkul
  tiles.forEach(tile => {
    // Folosim pointerdown pentru a acoperi touch + pen
    tile.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return; // lăsăm hover-ul normal pe desktop

      if (armedTile === tile) {
        // a doua atingere -> navighează
        tip.classList.remove('show');
        clearTimeout(armTimer);
        armedTile = null;
        // navighează manual (respectă target/href)
        const href = tile.getAttribute('href');
        if (href) window.location.assign(href);
        return;
      }

      // prima atingere -> previzualizare
      e.preventDefault(); // blochează navigarea implicită la primul tap
      armedTile = tile;
      clearTimeout(armTimer);

      setTip(tile);
      // poziționează tooltip în centrul tile-ului
      const r = tile.getBoundingClientRect();
      positionTip(r.left + r.width/2, r.top + r.height/2);
      tip.classList.add('show');

      // dezarmează după timeout
      armTimer = setTimeout(() => {
        tip.classList.remove('show');
        armedTile = null;
      }, ARM_MS);
    });
  });

  // Tap în afara gridului -> ascunde/rezetare
  document.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.tile')) {
      tip.classList.remove('show');
      armedTile = null;
      clearTimeout(armTimer);
    }
  });

  // La scroll/resize/escape -> ascunde tooltip
  window.addEventListener('scroll', () => tip.classList.remove('show'), { passive: true });
  window.addEventListener('resize', () => tip.classList.remove('show'));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      tip.classList.remove('show');
      armedTile = null;
      clearTimeout(armTimer);
    }
  });
})();

