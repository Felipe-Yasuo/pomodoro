const timeDisplay = document.querySelector('.timer span');
const startPauseBtn = document.querySelector('#startPauseBtn');
const resetBtn = document.querySelector('#resetBtn');
const skipBtn = document.querySelector('#skipBtn');
const clearHistoryBtn = document.querySelector('#clearHistoryBtn');
const pomodoroCountEl = document.querySelector('#pomodoroCount');
const historyList = document.querySelector('#historyList');
const sessionLabelImg = document.querySelector('#sessionLabel img');

const DURATIONS = {
    focus: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
};
let timeLeft = DURATIONS.focus;
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
                        timeLeft = DURATIONS.break;
                        applySessionChanges('break');
                    } else {

                        sessionType = 'longBreak';
                        timeLeft = DURATIONS.longBreaks;
                        applySessionChanges('longBreak');


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
                    timeLeft = DURATIONS.focus;
                    applySessionChanges('focus');


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

    if (sessionType === 'focus') {
        timeLeft = DURATIONS.focus;
    } else if (sessionType === 'break') {
        timeLeft = DURATIONS.break;
    } else if (sessionType === 'longBreak') {
        timeLeft = DURATIONS.longBreak;
    }

    updateDisplay();
    updatePomodoroCountUI();
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
            timeLeft = DURATIONS.break;
            applySessionChanges('break');
        } else {

            sessionType = 'longBreak';
            timeLeft = DURATIONS.longBreak;
            applySessionChanges('longBreak');

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
        timeLeft = DURATIONS.focus;
        applySessionChanges('focus');
    } else if (sessionType === 'longBreak') {
        history.push({
            message: 'Descanso longo pulado — novo ciclo iniciado',
            time: `${hh}:${mm}`
        });
        saveHistory();
        renderHistory();

        sessionType = 'focus';
        timeLeft = DURATIONS.focus;
        setProgress = 1;
        updatePomodoroCountUI();

        applySessionChanges('focus');
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
        root.style.setProperty('--bg-color', '#D6F8D6');
        root.style.setProperty('--panel-color', '#A8E6A1');
        root.style.setProperty('--text-color', '#1B4D1B');
        root.style.setProperty('--button-color', '#A8E6A166');
    } else if (mode === 'longBreak') {
        root.style.setProperty('--bg-color', '#D6E8FF');
        root.style.setProperty('--panel-color', '#A5C8FF');
        root.style.setProperty('--text-color', '#142B5E');
        root.style.setProperty('--button-color', '#A5C8FF66');
    } else {
        root.style.setProperty('--bg-color', '#FFE8E8');
        root.style.setProperty('--panel-color', '#F9B6B6');
        root.style.setProperty('--text-color', '#471515');
        root.style.setProperty('--button-color', '#FF4C4C26');
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

function applySessionChanges(mode) {
    changeTheme(mode);
    changeButtons(mode);
    setPlayIcon();
    updateDisplay();
}



updateDisplay();
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
skipBtn.addEventListener('click', skipSession);
window.addEventListener('load', renderHistory);
clearHistoryBtn.addEventListener('click', clearHistory);


