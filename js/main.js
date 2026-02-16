import { state } from "./state.js";
import { dom, renderTime, renderSession, updateButtons, applyTheme, updateProgressCircle } from "./ui.js";
import { toggleTimer, resetTimer, skipSession } from "./timer.js";
import { loadHistory, renderHistory, addHistoryEntry, clearHistory } from "./history.js";

function renderAll() {
    renderTime(state);
    renderSession(state);
    updateButtons(state);
    applyTheme(state);
    updateProgressCircle(state);
}

renderAll();


function onTimerEvent(evt) {
    renderAll();

    if (!evt) return;

    if (evt.type === "finished") {
        const label = evt.finishedType === "focus"
            ? "✅ Foco concluído"
            : evt.finishedType === "break"
                ? "Pausa concluída"
                : "Pausa longa concluída";

        addHistoryEntry(state, dom, renderHistory, label);

        const started = state.sessionType === "focus"
            ? "Novo foco iniciado"
            : state.sessionType === "break"
                ? "Pausa iniciada"
                : "Pausa longa iniciada";

        addHistoryEntry(state, dom, renderHistory, started);
    }

    if (evt.type === "skipped") {
        const from = evt.fromType === "focus"
            ? "Foco pulado"
            : evt.fromType === "break"
                ? "Pausa pulada"
                : "Pausa longa pulada";

        addHistoryEntry(state, dom, renderHistory, from);
    }

    if (evt.type === "reset") {
        addHistoryEntry(state, dom, renderHistory, "🔁 Timer resetado");
    }
}


dom.startPauseBtn.addEventListener("click", () => {
    toggleTimer(state, onTimerEvent);
});

dom.resetBtn.addEventListener("click", () => {
    resetTimer(state, onTimerEvent);
});

dom.skipBtn.addEventListener("click", () => {
    skipSession(state, onTimerEvent);
});

state.history = loadHistory();
renderHistory(state, dom);

dom.clearHistoryBtn.addEventListener("click", () => {
    clearHistory(state, dom, renderHistory);
});

