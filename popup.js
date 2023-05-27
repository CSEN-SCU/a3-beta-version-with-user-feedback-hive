let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let resetButton = document.getElementById('reset');
let timerDisplay = document.getElementById('timer');

let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds

function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

startButton.addEventListener('click', () => {
  if (!isRunning) {
    isRunning = true;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({tabId: tabs[0].id, command: 'start'});
    });
    timer = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  }
});

stopButton.addEventListener('click', () => {
  if (isRunning) {
    isRunning = false;
    clearInterval(timer);
  }
});

resetButton.addEventListener('click', () => {
  isRunning = false;
  timeLeft = 1500;
  updateTimerDisplay();
  clearInterval(timer);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.sendMessage({tabId: tabs[0].id, command: 'reset'});
  });
});

updateTimerDisplay();