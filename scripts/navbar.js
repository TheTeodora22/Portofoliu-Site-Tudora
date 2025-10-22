function showSidebar() {
    document.querySelector('.sidebar').style.display = 'flex';
    document.body.classList.add('sidebar-open');
}
function hideSidebar() {
    document.querySelector('.sidebar').style.display = 'none';
    document.body.classList.remove('sidebar-open');
}