const foodItems = document.querySelectorAll('.food-item');

// Change background color based on the food item in viewport
function changeBackground() {
  let scrollPos = window.scrollY + window.innerHeight/2;
  foodItems.forEach(item => {
    const top = item.offsetTop;
    const bottom = top + item.offsetHeight;
    if(scrollPos >= top && scrollPos <= bottom){
      document.body.style.backgroundColor = item.dataset.color;
    }
  });
}

window.addEventListener('scroll', changeBackground);

// Smooth scrolling for navbar links and explore button
document.querySelectorAll('.navbar a, .explore-btn').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'});
  });
});
