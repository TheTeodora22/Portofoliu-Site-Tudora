document.addEventListener("DOMContentLoaded", () => {
  const lightbox   = document.getElementById("lightbox");
  const lightboxImg= document.getElementById("lightbox-img");
  const closeBtn   = lightbox?.querySelector(".close");
  const nextBtn    = lightbox?.querySelector(".next");
  const prevBtn    = lightbox?.querySelector(".prev");
  const backdrop   = lightbox?.querySelector(".backdrop");

  const itemsNodes = document.querySelectorAll(".gallery-item img");
  const items = Array.from(itemsNodes);

  if (!lightbox || !lightboxImg || items.length === 0) return; // nimic de făcut

  let index = 0;
  let bodyOverflowBefore = "";

  function bodyNoScroll(on) {
    if (on) {
      bodyOverflowBefore = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = bodyOverflowBefore || "";
    }
  }

  function imgUrlAt(i) {
    // preferă currentSrc (respectă srcset), fallback pe src
    const el = items[i];
    return el.currentSrc || el.src;
  }

  function openAt(i) {
    index = (i + items.length) % items.length;
    lightboxImg.src = imgUrlAt(index);
    lightbox.classList.remove("hidden");
    bodyNoScroll(true);
  }

  function close() {
    lightbox.classList.add("hidden");
    bodyNoScroll(false);
  }

  // Deschidere pe click pe .gallery-item (overlay-ul ::after este în container)
  document.querySelectorAll(".gallery-item").forEach((item, i) => {
    item.addEventListener("click", () => openAt(i));
  });

  // Închidere pe backdrop / X
  backdrop?.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);

  // Navigare
  nextBtn?.addEventListener("click", e => { e.stopPropagation(); openAt(index + 1); });
  prevBtn?.addEventListener("click", e => { e.stopPropagation(); openAt(index - 1); });

  // Click pe imagine = nimic
  lightboxImg.addEventListener("click", e => e.stopPropagation());

  // Tastatură
  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape")      close();
    if (e.key === "ArrowRight")  openAt(index + 1);
    if (e.key === "ArrowLeft")   openAt(index - 1);
  });

  // Swipe pe mobil (simplu)
  let touchStartX = null;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, {passive: true});

  lightbox.addEventListener("touchend", (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    // prag mic pt. swipe
    if (Math.abs(dx) > 40) {
      if (dx < 0) openAt(index + 1); else openAt(index - 1);
    }
    touchStartX = null;
  });
});