import { state } from "./state.js";
import { dom, renderTime } from "./ui.js";
import { toggleTimer, resetTimer } from "./timer.js";

renderTime(state);

dom.startPauseBtn.addEventListener("click", () => {
    toggleTimer(state, () => renderTime(state));
});

dom.resetBtn.addEventListener("click", () => {
    resetTimer(state, () => renderTime(state));
});
