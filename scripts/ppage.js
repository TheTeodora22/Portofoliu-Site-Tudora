(function () {
  function isMobile() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function upsertBeginMobile() {
    const h3 = document.querySelector('.project-text h3#begin');
    const images = document.querySelector('.project-images');
    if (!h3 || !images) return;

    let clone = document.querySelector('.begin-mobile');

    if (isMobile()) {
      // create or update the clone
      if (!clone) {
        clone = document.createElement('h3');
        clone.className = 'begin-mobile';
        clone.id = 'begin-mobile';
        clone.innerHTML = h3.innerHTML; // keep formatting/br
        images.parentNode.insertBefore(clone, images); // insert before photos
      } else {
        // keep text in sync if you edit original later
        clone.innerHTML = h3.innerHTML;
      }
    } else {
      // desktop: remove clone if exists
      if (clone) clone.remove();
    }
  }

  window.addEventListener('load', upsertBeginMobile);
  window.addEventListener('resize', upsertBeginMobile);
})();