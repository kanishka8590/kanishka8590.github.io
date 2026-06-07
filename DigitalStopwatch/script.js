let hours = 0, minutes = 0, seconds = 0, milliseconds = 0;
let timer;

const timeDisplay = document.getElementById('time');
const lapsList = document.getElementById('laps');

function updateTime() {
  milliseconds += 10;
  if (milliseconds === 1000) { milliseconds = 0; seconds++; }
  if (seconds === 60) { seconds = 0; minutes++; }
  if (minutes === 60) { minutes = 0; hours++; }

  timeDisplay.textContent = 
    `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(milliseconds).padStart(3,'0')}`;
}

document.getElementById('start').onclick = () => {
  clearInterval(timer);
  timer = setInterval(updateTime, 10); // update every 10ms for precision
}

document.getElementById('pause').onclick = () => {
  clearInterval(timer);
}

document.getElementById('reset').onclick = () => {
  clearInterval(timer);
  hours = minutes = seconds = milliseconds = 0;
  timeDisplay.textContent = '00:00:00.000';
  lapsList.innerHTML = '';
}

document.getElementById('lap').onclick = () => {
  if (hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0) return;
  const lapTime = timeDisplay.textContent;
  const lapItem = document.createElement('li');
  lapItem.textContent = lapTime;
  lapsList.appendChild(lapItem);
}