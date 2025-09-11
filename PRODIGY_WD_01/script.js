// Change navbar background on scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
});
