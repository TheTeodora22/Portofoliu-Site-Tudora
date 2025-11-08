function showSidebar() {
    document.querySelector('.sidebar').classList.add('is-open');
    document.body.classList.add('sidebar-open');
  }
  function hideSidebar() {
    document.querySelector('.sidebar').classList.remove('is-open');
    document.body.classList.remove('sidebar-open');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const open = document.getElementById('openSidebar');
    const close = document.getElementById('closeSidebar');

    if (open) open.addEventListener('click', (e) => {
      e.preventDefault();      // oprește navigarea la "#"
      e.stopPropagation();     // oprește bubbling pe <li>
      showSidebar();
    });

    if (close) close.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideSidebar();
    });
  });