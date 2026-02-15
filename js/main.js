import { state } from "./state.js";
import { dom, renderTime, renderSession, updateStartPauseIcon } from "./ui.js";
import { toggleTimer, resetTimer, skipSession } from "./timer.js";

function renderAll() {
    renderTime(state);
    renderSession(state);
    updateStartPauseIcon(state);
}

renderAll();

dom.startPauseBtn.addEventListener("click", () => {
    toggleTimer(state, renderAll);
});

dom.resetBtn.addEventListener("click", () => {
    resetTimer(state, renderAll);
});


dom.skipBtn.addEventListener("click", () => {
    skipSession(state, renderAll);
});