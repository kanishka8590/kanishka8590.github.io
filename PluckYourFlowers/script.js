const messages = [
  "I love you so much",
  "I am sorry ki aapko mujhe baar baar samjhaana padtaa hain and for repeating my stupid mistakes",
  "I am sorry for all the times I didn't understand you",
  "I am sorry for all the (non-true) harsh words I said",
  "I am sorry for all the promises I ever broke",
  "I am sorry baby for not expressing my love enough",
  "I am sorry for my silences when you needed me to speak",
  "I am sorry for all the times I didn't prioritise you",
  "I am sorry for all times I made things about myself when you were the one hurting too",
  "I am sorry for all the times I made you cry baby",
  "Main aapse sacchi bohat pyaar karti hoon",
  "Meri galtiyon ke liye please mujhe maaf kardo?",
  "Main apni galtiyo ki vajah se aapko kabhi khonaa nahi chaahti",
  "You are my world, my baby, my biggest acheivement and my sabkuch",
  "Main humisha aapko apne paas apne se chipkaakar rakhnaa chaahti hoon",
  "Main aapko utnaa khush rakhnaa chaahti hoon jitnaa aap mujhe rakhte ho",
  "Your smile and that cute si laugh is my biggest happiness",
  "Please mere saath raho"
];

const icons = ["🌸","🌹","🌺","🌻","🌷","🌼","💐","🌸","🌹","🌺","🌻","🌷","🌼","💐","🌹","🌺","🌻","🌼"];
const flowers = [];

// Create all flowers
for (let i = 0; i < messages.length; i++) {
  let icon = document.createElement("div");
  icon.className = "icon";
  icon.innerHTML = icons[i % icons.length]; // wrap around icons if fewer
  icon.style.left = Math.random() * (window.innerWidth - 100) + "px";
  icon.style.top = Math.random() * (window.innerHeight - 100) + "px";
  icon.onclick = () => showCard(icon, messages[i]);
  document.body.appendChild(icon);
  flowers.push(icon);
}

// Move flowers randomly every 2 seconds
function randomMove() {
  flowers.forEach(flower => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    flower.style.left = x + "px";
    flower.style.top = y + "px";
  });
}
setInterval(randomMove, 2000);

let flowersPlucked = 0;
let finalClickStage = 0;
const finalMessages = ["Karo naa", "Please?", "PLEASEEEEEEEEE"];
let awaitingFinalSequence = false;

// Show the message when flower is clicked
function showCard(flower, message) {
  const card = document.getElementById("card");
  card.innerText = message;
  document.getElementById("overlay").style.display = "block";
  card.classList.add("show");
  document.getElementById("instruction").style.display = "none";

  flower.remove();
  flowersPlucked++;

  // If all flowers are plucked, wait until the LAST card is closed
  if (flowersPlucked === messages.length) {
    awaitingFinalSequence = true; // mark that after closing, we trigger "I miss you"
  }
}

// Close card overlay
function closeCard() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("card").classList.remove("show");

  const card = document.getElementById("card");

  if (awaitingFinalSequence) {
    // Show the "I miss you" card after the last flower card is closed
    card.innerText = "I miss you. Please call karo naa?";
    document.getElementById("overlay").style.display = "block";
    card.classList.add("show");
    awaitingFinalSequence = false;

    // Replace closeCard temporarily to handle this special case
    closeCard = function () {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("card").classList.remove("show");
      document.addEventListener("click", handleFinalMessages);
    };
  }
}

// Handle final "Karo naa" → "Please?" → "PLEASEEEEEEEEE"
function handleFinalMessages() {
  const card = document.getElementById("card");
  if (finalClickStage < finalMessages.length) {
    card.innerText = finalMessages[finalClickStage];
    card.style.fontSize = `${2 + finalClickStage}rem`; // makes each message bigger
    document.getElementById("overlay").style.display = "block";
    card.classList.add("show");
    finalClickStage++;
  } else {
    document.removeEventListener("click", handleFinalMessages);
  }
}
