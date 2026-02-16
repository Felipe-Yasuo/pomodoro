import { state } from "./state.js";
import { dom, renderTime, renderSession, updateButtons, applyTheme, updateProgressCircle } from "./ui.js";
import { toggleTimer, resetTimer, skipSession } from "./timer.js";
import { loadHistory, renderHistory, addHistoryEntry, clearHistory } from "./history.js";
import { loadTimerState, saveTimerState } from "./storage.js";


function renderAll() {
    renderTime(state);
    renderSession(state);
    updateButtons(state);
    applyTheme(state);
    updateProgressCircle(state);

    saveTimerState(state);
}


function onTimerEvent(evt) {
    renderAll();
    if (!evt) return;

    if (evt.type === "finished") {
        const label =
            evt.finishedType === "focus"
                ? "✅ Foco concluído"
                : evt.finishedType === "break"
                    ? "☕ Pausa concluída"
                    : "🌙 Pausa longa concluída";

        addHistoryEntry(state, dom, renderHistory, label);

        const started =
            state.sessionType === "focus"
                ? "🎯 Novo foco iniciado"
                : state.sessionType === "break"
                    ? "☕ Pausa iniciada"
                    : "🌙 Pausa longa iniciada";

        addHistoryEntry(state, dom, renderHistory, started);
    }

    if (evt.type === "skipped") {
        const from =
            evt.fromType === "focus"
                ? "⏭️ Foco pulado"
                : evt.fromType === "break"
                    ? "⏭️ Pausa pulada"
                    : "⏭️ Pausa longa pulada";

        addHistoryEntry(state, dom, renderHistory, from);
    }

    if (evt.type === "reset") {
        addHistoryEntry(state, dom, renderHistory, "🔁 Timer resetado");
    }
}


state.history = loadHistory();
renderHistory(state, dom);

const saved = loadTimerState();

if (saved) {
    state.sessionType = saved.sessionType ?? state.sessionType;
    state.timeLeft = typeof saved.timeLeft === "number" ? saved.timeLeft : state.timeLeft;
    state.setProgress = typeof saved.setProgress === "number" ? saved.setProgress : state.setProgress;

    state.isRunning = false;
    state.intervalId = null;

    if (saved.isRunning) {
        const elapsedSeconds = Math.floor((Date.now() - saved.savedAt) / 1000);
        state.timeLeft = Math.max(0, state.timeLeft - elapsedSeconds);

        if (state.timeLeft > 0) {
            toggleTimer(state, onTimerEvent);
        }
    }
}

renderAll();


dom.startPauseBtn.addEventListener("click", () => {
    toggleTimer(state, onTimerEvent);
});

dom.resetBtn.addEventListener("click", () => {
    resetTimer(state, onTimerEvent);
});

dom.skipBtn.addEventListener("click", () => {
    skipSession(state, onTimerEvent);
});

dom.clearHistoryBtn.addEventListener("click", () => {
    clearHistory(state, dom, renderHistory);
});
