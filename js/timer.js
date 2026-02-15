export function startTimer(state, onTick) {
    if (state.isRunning) return;

    state.isRunning = true;

    state.intervalId = setInterval(() => {
        if (state.timeLeft > 0) {
            state.timeLeft--;
            onTick();
            return;
        }

        // chegou em 00:00
        stopTimer(state);
        onTick();
        alert("✅ Tempo finalizado!");
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
    state.timeLeft = state.duration;
    onTick();
}
