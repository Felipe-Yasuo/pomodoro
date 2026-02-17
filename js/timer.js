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


function transitionSession(state) {
    const fromType = state.sessionType;
    let toType = fromType;

    if (fromType === "focus") {
        if (state.setProgress < 4) {
            state.setProgress += 1;
            toType = "break";
        } else {
            state.setProgress = 1;
            toType = "longBreak";
        }
    } else {
        toType = "focus";
    }

    state.sessionType = toType;
    state.timeLeft = state.durations[toType];

    return { fromType, toType };
}

export function handleSessionEnd(state) {
    transitionSession(state);
}

export function skipSession(state, onTick) {
    stopTimer(state);

    const { fromType } = transitionSession(state);

    onTick({ type: "skipped", fromType });
}
