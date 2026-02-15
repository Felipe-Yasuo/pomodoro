export const dom = {
    timeDisplay: document.querySelector("#time"),
    startPauseBtn: document.querySelector("#startPauseBtn"),
    resetBtn: document.querySelector("#resetBtn"),
    sessionLabelImg: document.querySelector("#sessionLabel img"),
    pomodoroCountEl: document.querySelector("#pomodoroCount"),
    skipBtn: document.querySelector("#skipBtn"),
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

export function updateStartPauseIcon(state) {
    const img = dom.startPauseBtn.querySelector("img");
    if (!img) return;

    if (state.isRunning) {
        img.src = "./assets/ButtonPause.svg";
        img.alt = "Pausar";
    } else {
        img.src = "./assets/ButtonPlay.svg";
        img.alt = "Iniciar";
    }
}
