const timeDisplay = document.querySelector('.timer span');
const startPauseBtn = document.querySelector('#startPauseBtn');

let timeLeft = 25 * 60;
let isRunning = false;
let timerInterval = null;

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
updateDisplay();
startPauseBtn.addEventListener('click', toggleTimer);