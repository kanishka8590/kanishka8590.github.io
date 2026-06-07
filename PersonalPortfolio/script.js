// Stars background animation
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = [];
for(let i=0;i<300;i++){
  stars.push({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    radius: Math.random()*1.5 + 0.5,
    dx: (Math.random()-0.5)*0.3,
    dy: (Math.random()-0.5)*0.3
  });
}

function drawStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#fff";
  stars.forEach(star=>{
    ctx.beginPath();
    ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
    ctx.fill();
  });
}

function updateStars(){
  stars.forEach(star=>{
    star.x += star.dx;
    star.y += star.dy;
    if(star.x<0 || star.x>canvas.width) star.dx*=-1;
    if(star.y<0 || star.y>canvas.height) star.dy*=-1;
  });
}

function animate(){
  drawStars();
  updateStars();
  requestAnimationFrame(animate);
}
animate();

// Smooth scroll for nav links
document.querySelectorAll("header nav a").forEach(link=>{
  link.addEventListener("click", e=>{
    e.preventDefault();
    const targetId = link.getAttribute("href");
    document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
  });
});

// Typewriter effect for hero subtitle
const subtitles = ["Web Developer", "Problem Solver", "Programmer"];
let idx = 0;
let charIdx = 0;
const subtitleEl = document.querySelector(".subtitle");
let deleting = false;

function typeWriter(){
  let current = subtitles[idx];
  if(deleting){
    charIdx--;
    subtitleEl.textContent = current.substring(0,charIdx);
    if(charIdx===0){ deleting=false; idx=(idx+1)%subtitles.length; }
  } else {
    charIdx++;
    subtitleEl.textContent = current.substring(0,charIdx);
    if(charIdx===current.length){ deleting=true; }
  }
  setTimeout(typeWriter,deleting?50:150);
}
typeWriter();
