const sidebar = document.getElementById('sidebar');
const toggle = document.getElementById('sidebarToggle');

/* Adds an event listener to the toggle button in the top right which controls 
the visibility of the sidebar, if open it will remove the open class, if not it adds it*/
toggle.addEventListener('click', () => {
    if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    } else {
        sidebar.classList.add('open');
    }
});