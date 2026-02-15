export const dom = {
    timeDisplay: document.querySelector(".timer span"),
    startPauseBtn: document.querySelector("#startPauseBtn"),
    resetBtn: document.querySelector("#resetBtn"),
};

export function renderTime(state) {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;

    dom.timeDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
