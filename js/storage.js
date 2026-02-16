const TIMER_KEY = "pomodoroTimerState";

export function saveTimerState(state) {
    const data = {
        sessionType: state.sessionType,
        timeLeft: state.timeLeft,
        setProgress: state.setProgress,
        isRunning: state.isRunning,
        savedAt: Date.now(),
    };

    localStorage.setItem(TIMER_KEY, JSON.stringify(data));
}

export function loadTimerState() {
    try {
        const raw = localStorage.getItem(TIMER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearTimerState() {
    localStorage.removeItem(TIMER_KEY);
}
