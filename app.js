const timeDisplay = document.querySelector('.timer span');
const startPauseBtn = document.querySelector('#startPauseBtn');
const resetBtn = document.querySelector('#resetBtn');
const skipBtn = document.querySelector('#skipBtn');
const clearHistoryBtn = document.querySelector('#clearHistoryBtn');
const pomodoroCountEl = document.querySelector('#pomodoroCount');
const historyList = document.querySelector('#historyList');
const sessionLabelImg = document.querySelector('#sessionLabel img');


let timeLeft = 25 * 60;
let isRunning = false;
let timerInterval = null;

let history = JSON.parse(localStorage.getItem('pomodoroHistory')) || [];
let sessionType = 'focus';

let completedPomodoros = 0;
let setProgress = 1;


function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updatePomodoroCountUI() {
    pomodoroCountEl.textContent = `Pomodoros: ${setProgress}/4`;
}

function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        setPlayIcon();
    } else {
        isRunning = true;
        setPauseIcon();

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;


                if (sessionType === 'focus') {
                    completedPomodoros++;
                    addCycleToHistory(completedPomodoros);


                    if (setProgress < 4) {
                        setProgress++;
                        updatePomodoroCountUI();


                        sessionType = 'break';
                        timeLeft = 5 * 60;
                        changeTheme('break');
                        changeButtons('break');
                        setPlayIcon();
                    } else {

                        sessionType = 'longBreak';
                        timeLeft = 15 * 60;
                        changeTheme('longBreak');
                        changeButtons('longBreak');
                        setPlayIcon();


                        const now = new Date();
                        history.push({
                            message: '☕ Descanso longo iniciado',
                            time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                        });
                        saveHistory();
                        renderHistory();
                    }
                }


                else if (sessionType === 'break' || sessionType === 'longBreak') {
                    const previousType = sessionType;

                    sessionType = 'focus';
                    timeLeft = 25 * 60;
                    changeTheme('focus');
                    changeButtons('focus');
                    setPlayIcon();


                    if (previousType === 'longBreak') {
                        setProgress = 1;
                    }
                }
                updatePomodoroCountUI();
                updateDisplay();
            }
        }, 1000);
    }
}
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();

    setPlayIcon();
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
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    if (sessionType === 'focus') {
        completedPomodoros++;

        history.push({
            message: `${completedPomodoros}° Ciclo concluído (pulado)`,
            time: `${hh}:${mm}`
        });
        saveHistory();
        renderHistory();


        if (setProgress < 4) {
            setProgress++;
            updatePomodoroCountUI();


            sessionType = 'break';
            timeLeft = 5 * 60;
            changeTheme('break');
            changeButtons('break');
        } else {

            sessionType = 'longBreak';
            timeLeft = 15 * 60;
            changeTheme('longBreak');
            changeButtons('longBreak');

            history.push({
                message: '☕ Descanso longo iniciado (pulado)',
                time: `${hh}:${mm}`
            });
            saveHistory();
            renderHistory();
        }
    } else if (sessionType === 'break') {
        history.push({
            message: 'Descanso curto pulado',
            time: `${hh}:${mm}`
        });
        saveHistory();
        renderHistory();

        sessionType = 'focus';
        timeLeft = 25 * 60;
        changeTheme('focus');
        changeButtons('focus');
    } else if (sessionType === 'longBreak') {
        history.push({
            message: 'Descanso longo pulado — novo ciclo iniciado',
            time: `${hh}:${mm}`
        });
        saveHistory();
        renderHistory();

        // 🔁 Reinicia o contador de ciclos aqui
        sessionType = 'focus';
        timeLeft = 25 * 60;
        setProgress = 1;
        updatePomodoroCountUI();

        changeTheme('focus');
        changeButtons('focus');
    }

    setPlayIcon();
    updateDisplay();
}



function addCycleToHistory(cycleNumber) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const entry = {
        message: `${cycleNumber}° Ciclo concluído`,
        time: `${hours}:${minutes}`
    };

    history.push(entry);
    saveHistory();
    renderHistory();

}


function clearHistory() {
    history = [];
    saveHistory();
    renderHistory();
}

function changeTheme(mode) {
    const root = document.documentElement;

    if (mode === 'break') {
        root.style.setProperty('--bg-color-pink', '#D6F8D6');
        root.style.setProperty('--panel-color-pink', '#A8E6A1');
        root.style.setProperty('--text-color-pink', '#1B4D1B');
        root.style.setProperty('--button-color-pink', '#A8E6A166');
    } else if (mode === 'longBreak') {
        root.style.setProperty('--bg-color-pink', '#D6E8FF');
        root.style.setProperty('--panel-color-pink', '#A5C8FF');
        root.style.setProperty('--text-color-pink', '#142B5E');
        root.style.setProperty('--button-color-pink', '#A5C8FF66');
    } else {
        root.style.setProperty('--bg-color-pink', '#FFE8E8');
        root.style.setProperty('--panel-color-pink', '#F9B6B6');
        root.style.setProperty('--text-color-pink', '#471515');
        root.style.setProperty('--button-color-pink', '#FF4C4C26');
    }
}

function setPlayIcon() {
    const img = startPauseBtn.querySelector('img');
    if (sessionType === 'break')
        img.src = './assets/ButtonPlayGreen.svg';
    else if (sessionType === 'longBreak')
        img.src = './assets/ButtonPlayBlue.svg';
    else
        img.src = './assets/ButtonPlay.svg';
    img.alt = 'Iniciar';
}

function setPauseIcon() {
    const img = startPauseBtn.querySelector('img');
    if (sessionType === 'break')
        img.src = './assets/ButtonPauseGreen.svg';
    else if (sessionType === 'longBreak')
        img.src = './assets/ButtonPauseBlue.svg';
    else
        img.src = './assets/ButtonPause.svg';
    img.alt = 'Pausar';
}

function changeButtons(mode) {
    const resetImage = resetBtn.querySelector('img');
    const skipImage = skipBtn.querySelector('img');

    if (mode === 'break') {
        resetImage.src = './assets/ButtonResetGreen.svg';
        skipImage.src = './assets/ButtonNextGreen.svg';
        if (sessionLabelImg) sessionLabelImg.src = './assets/ShortBreak.svg';
    }
    else if (mode === 'longBreak') {
        resetImage.src = './assets/ButtonResetBlue.svg';
        skipImage.src = './assets/ButtonNextBlue.svg';
        if (sessionLabelImg) sessionLabelImg.src = './assets/LongBreak.svg';
    } else {
        resetImage.src = './assets/ButtonReset.svg';
        skipImage.src = './assets/ButtonNext.svg';
        if (sessionLabelImg) sessionLabelImg.src = './assets/Chip.svg';
    }
}

updateDisplay();
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipSession);
window.addEventListener('load', renderHistory);
clearHistoryBtn.addEventListener('click', clearHistory);


