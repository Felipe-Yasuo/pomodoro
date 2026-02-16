export function startTimer(state, onTick) {
    if (state.isRunning) return;

    state.isRunning = true;

    state.intervalId = setInterval(() => {
        if (state.timeLeft > 0) {
            state.timeLeft--;
            onTick({ type: "tick" });
            return;
        }

        stopTimer(state);

        const finishedType = state.sessionType;
        handleSessionEnd(state);

        onTick({ type: "finished", finishedType });
    }, 1000);
}

export function stopTimer(state) {
    clearInterval(state.intervalId);
    state.intervalId = null;
    state.isRunning = false;
}

export function toggleTimer(state, onTick) {
    if (state.isRunning) stopTimer(state);
    else startTimer(state, onTick);
}

export function resetTimer(state, onTick) {
    stopTimer(state);
    state.timeLeft = state.durations[state.sessionType];
    onTick({ type: "reset" });
}


export function handleSessionEnd(state) {
    if (state.sessionType === "focus") {
        if (state.setProgress < 4) {
            state.setProgress++;
            state.sessionType = "break";
        } else {
            state.sessionType = "longBreak";
            state.setProgress = 1;
        }
    } else {
        state.sessionType = "focus";
    }

    state.timeLeft = state.durations[state.sessionType];
}

export function skipSession(state, onTick) {
    stopTimer(state);

    const fromType = state.sessionType;

    if (state.sessionType === "focus") {
        if (state.setProgress < 4) {
            state.setProgress += 1;
            state.sessionType = "break";
        } else {
            state.sessionType = "longBreak";
            state.setProgress = 1;
        }
    } else {
        state.sessionType = "focus";
    }

    state.timeLeft = state.durations[state.sessionType];

    onTick({ type: "skipped", fromType });
}