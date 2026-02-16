export const dom = {
    timeDisplay: document.querySelector("#time"),
    startPauseBtn: document.querySelector("#startPauseBtn"),
    resetBtn: document.querySelector("#resetBtn"),
    sessionLabelImg: document.querySelector("#sessionLabel img"),
    pomodoroCountEl: document.querySelector("#pomodoroCount"),
    skipBtn: document.querySelector("#skipBtn"),
    historyList: document.querySelector("#historyList"),
    clearHistoryBtn: document.querySelector("#clearHistoryBtn"),
};

export function renderTime(state) {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;

    dom.timeDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function renderSession(state) {
    dom.pomodoroCountEl.textContent = `Pomodoros: ${state.setProgress}/4`;

    if (state.sessionType === "break") {
        dom.sessionLabelImg.src = "./assets/ShortBreak.svg";
    } else if (state.sessionType === "longBreak") {
        dom.sessionLabelImg.src = "./assets/LongBreak.svg";
    } else {
        dom.sessionLabelImg.src = "./assets/Chip.svg";
    }
}


export function applyTheme(state) {
    const body = document.body;

    body.classList.remove("break", "longBreak");

    if (state.sessionType === "break") {
        body.classList.add("break");
    } else if (state.sessionType === "longBreak") {
        body.classList.add("longBreak");
    }
}

export function updateButtons(state) {
    const playPauseImg = dom.startPauseBtn.querySelector("img");
    const resetImg = dom.resetBtn.querySelector("img");
    const skipImg = dom.skipBtn.querySelector("img");

    const mode = state.sessionType;
    const isRunning = state.isRunning;

    // Define cor base do modo
    let color = "";

    if (mode === "break") color = "Green";
    else if (mode === "longBreak") color = "Blue";
    else color = "";

    // PLAY / PAUSE
    if (isRunning) {
        playPauseImg.src = `./assets/ButtonPause${color}.svg`;
        playPauseImg.alt = "Pausar";
    } else {
        playPauseImg.src = `./assets/ButtonPlay${color}.svg`;
        playPauseImg.alt = "Iniciar";
    }

    // RESET
    resetImg.src = `./assets/ButtonReset${color}.svg`;

    // SKIP
    skipImg.src = `./assets/ButtonNext${color}.svg`;
}