document.addEventListener("DOMContentLoaded", () => {
  const imgs = Array.from(document.querySelectorAll(".gallery-item img"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector("#lightbox .close");
  const prevBtn = document.querySelector("#lightbox .prev");
  const nextBtn = document.querySelector("#lightbox .next");

  let current = 0;

  function showImage(index) {
    if (index < 0) index = imgs.length - 1;
    if (index >= imgs.length) index = 0;
    current = index;
    lightboxImg.src = imgs[current].src;
    lightbox.classList.remove("hidden");
  }

  imgs.forEach((img, i) => {
    img.addEventListener("click", () => showImage(i));
  });

  closeBtn.addEventListener("click", () => lightbox.classList.add("hidden"));
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) lightbox.classList.add("hidden");
  });

  prevBtn.addEventListener("click", e => {
    e.stopPropagation();
    showImage(current - 1);
  });

  nextBtn.addEventListener("click", e => {
    e.stopPropagation();
    showImage(current + 1);
  });

  document.addEventListener("keydown", e => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") lightbox.classList.add("hidden");
    if (e.key === "ArrowLeft") showImage(current - 1);
    if (e.key === "ArrowRight") showImage(current + 1);
  });
});