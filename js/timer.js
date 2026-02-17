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


        const result = transitionSession(state, { reason: "finished" });

        onTick({
            type: "finished",
            finishedType: result.fromType,
            nextType: result.toType,
            pomodoroNumber: result.pomodoroNumber,
            afterPomodoro: result.afterPomodoro,
            completedCycle: result.completedCycle,
        });
    }, 1000);
}

export function stopTimer(state) {
    clearInterval(state.intervalId);
    state.intervalId = null;
    state.isRunning = false;
}

export function toggleTimer(state, onTick) {
    if (state.isRunning) {
        stopTimer(state);
        onTick();
    } else {
        startTimer(state, onTick);
        onTick();
    }
}

export function resetTimer(state, onTick) {
    stopTimer(state);
    state.timeLeft = state.durations[state.sessionType];
    onTick({ type: "reset" });
}

export function transitionSession(state, { reason }) {
    const fromType = state.sessionType;

    let pomodoroNumber = null;
    let afterPomodoro = null;
    let completedCycle = false;

    if (fromType === "focus") {
        pomodoroNumber = state.setProgress;
        completedCycle = pomodoroNumber === 4;
    } else if (fromType === "break") {
        afterPomodoro = state.setProgress - 1;
    } else if (fromType === "longBreak") {
        afterPomodoro = 4;
    }


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

    return {
        reason,
        fromType,
        toType,
        pomodoroNumber,
        afterPomodoro,
        completedCycle,
    };
}

export function handleSessionEnd(state) {
    transitionSession(state, { reason: "finished" });
}

export function skipSession(state, onTick) {
    stopTimer(state);

    const result = transitionSession(state, { reason: "skipped" });

    onTick({
        type: "skipped",
        fromType: result.fromType,
        toType: result.toType,
        pomodoroNumber: result.pomodoroNumber,
        afterPomodoro: result.afterPomodoro,
    });
}
