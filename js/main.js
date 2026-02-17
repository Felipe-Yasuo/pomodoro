import { state } from "./state.js";
import { dom, renderTime, renderSession, updateButtons, applyTheme, updateProgressCircle } from "./ui.js";
import { toggleTimer, resetTimer, skipSession } from "./timer.js";
import { loadHistory, renderHistory, addHistoryEntry, clearHistory } from "./history.js";
import { loadTimerState, saveTimerState } from "./storage.js";
import { loadSettings, saveSettings, applySettingsToState } from "./settings.js";

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
        if (evt.finishedType === "focus") {
            addHistoryEntry(state, dom, renderHistory, `✅ Pomodoro ${evt.pomodoroNumber}/4 concluído`);

            if (evt.completedCycle) {
                addHistoryEntry(state, dom, renderHistory, "🏁 Ciclo completo! (4/4)");
            }
        } else if (evt.finishedType === "break") {
            addHistoryEntry(state, dom, renderHistory, `☕ Pausa curta (após Pomodoro ${evt.afterPomodoro}) concluída`);
        } else {
            addHistoryEntry(state, dom, renderHistory, "🌙 Pausa longa concluída");
        }
        const started =
            evt.nextType === "focus"
                ? "🎯 Foco iniciado"
                : evt.nextType === "break"
                    ? "☕ Pausa curta iniciada"
                    : "🌙 Pausa longa iniciada";

        addHistoryEntry(state, dom, renderHistory, started);
    }

    if (evt.type === "skipped") {
        if (evt.fromType === "focus") {
            addHistoryEntry(state, dom, renderHistory, `⏭️ Pomodoro ${evt.pomodoroNumber}/4 pulado`);
        } else if (evt.fromType === "break") {
            addHistoryEntry(state, dom, renderHistory, `⏭️ Pausa curta (após Pomodoro ${evt.afterPomodoro}) pulada`);
        } else {
            addHistoryEntry(state, dom, renderHistory, "⏭️ Pausa longa pulada");
        }
    }

    if (evt.type === "reset") {
        addHistoryEntry(state, dom, renderHistory, "🔁 Timer resetado");
    }
}


state.history = loadHistory();
renderHistory(state, dom);

const settings = loadSettings();
if (settings) {
    applySettingsToState(state, settings);

    dom.focusInput.value = settings.focusMinutes;
    dom.breakInput.value = settings.breakMinutes;
    dom.longBreakInput.value = settings.longBreakMinutes;
} else {

    dom.focusInput.value = state.durations.focus / 60;
    dom.breakInput.value = state.durations.break / 60;
    dom.longBreakInput.value = state.durations.longBreak / 60;
}

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

        renderAll();
        if (state.timeLeft > 0) {
            toggleTimer(state, onTimerEvent);
        }
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

dom.clearHistoryBtn.addEventListener("click", () => {
    clearHistory(state, dom, renderHistory);
});


dom.saveSettingsBtn.addEventListener("click", () => {
    const focusMinutes = Number(dom.focusInput.value);
    const breakMinutes = Number(dom.breakInput.value);
    const longBreakMinutes = Number(dom.longBreakInput.value);

    const ok =
        Number.isFinite(focusMinutes) && focusMinutes >= 1 && focusMinutes <= 120 &&
        Number.isFinite(breakMinutes) && breakMinutes >= 1 && breakMinutes <= 60 &&
        Number.isFinite(longBreakMinutes) && longBreakMinutes >= 1 && longBreakMinutes <= 120;

    if (!ok) {
        alert("Valores inválidos. Verifique os minutos informados.");
        return;
    }

    const newSettings = { focusMinutes, breakMinutes, longBreakMinutes };
    saveSettings(newSettings);
    applySettingsToState(state, newSettings);

    renderAll();
    addHistoryEntry(state, dom, renderHistory, "⚙️ Configurações atualizadas");
});