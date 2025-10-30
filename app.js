const timeDisplay = document.querySelector('.timer span');
const startPauseBtn = document.querySelector('#startPauseBtn');
const resetBtn = document.querySelector('#resetBtn');
const skipBtn = document.querySelector('#skipBtn');
const clearHistoryBtn = document.querySelector('#clearHistoryBtn');

let timeLeft = 0.1 * 60;
let isRunning = false;
let timerInterval = null;
let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];


function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function toggleTimer() {
    const playImage = startPauseBtn.querySelector('img');

    if (isRunning) {
        // Pausa o timer
        clearInterval(timerInterval);
        isRunning = false;
        playImage.src = './assets/ButtonPlay.svg';
        playImage.alt = 'Iniciar';
    } else {
        // Inicia o timer
        isRunning = true;
        playImage.src = './assets/ButtonPause.svg';
        playImage.alt = 'Pausar';

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                playImage.src = './assets/ButtonPlay.svg';
                playImage.alt = 'Iniciar';

            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();


    const playImage = startPauseBtn.querySelector('img');
    playImage.src = './assets/ButtonPlay.svg';
    playImage.alt = 'Iniciar';
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
      <span class="message">${item.message}</span>
      <span class="time">${item.time}</span>
    `;
        historyList.prepend(li);
    });
}

function saveHistory() {
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
}


function skipSession() {
    clearInterval(timerInterval);
    isRunning = false;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const entry = {
        message: 'Ciclo pulado',
        time: `${hours}:${minutes}`
    };

    history.push(entry);
    saveHistory();
    renderHistory();

    timeLeft = 25 * 60;
    updateDisplay();

    const playImage = startPauseBtn.querySelector('img');
    playImage.src = './assets/ButtonPlay.svg';
    playImage.alt = 'Iniciar';
}


function clearHistory() {
    history = [];
    saveHistory();
    renderHistory();
}



updateDisplay();
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipSession);
window.addEventListener('load', renderHistory);
clearHistoryBtn.addEventListener('click', clearHistory);