// ============================================
// MOBILE MENU TOGGLE
// ============================================

// Grab references to the hamburger button and the nav menu
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

// When the hamburger button is clicked, toggle the "open" class on the nav.
// The CSS we wrote earlier says: .main-nav.open { right: 0; }
// So adding/removing this class is what slides the menu in and out.
menuToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});

// On mobile, the Portal dropdown needs to open on TAP instead of HOVER
// (phones don't have a mouse to "hover" with).
// We only want this tap behavior on small screens, so we check window width.
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.dropdown');

dropdownToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 860) {
    e.preventDefault(); // stop the "#" link from jumping the page
    dropdown.classList.toggle('mobile-open');
  }
});
// ============================================
// AUTO-UPDATE COPYRIGHT YEAR
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();