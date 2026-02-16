const SETTINGS_KEY = "pomodoroSettings";

export function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function applySettingsToState(state, settings) {

    state.durations.focus = settings.focusMinutes * 60;
    state.durations.break = settings.breakMinutes * 60;
    state.durations.longBreak = settings.longBreakMinutes * 60;

    if (!state.isRunning) {
        state.timeLeft = state.durations[state.sessionType];
    }
}
