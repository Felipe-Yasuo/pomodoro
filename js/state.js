export const state = {
    durations: {
        focus: 0.1 * 60,
        break: 0.1 * 60,
        longBreak: 15 * 60,
    },

    sessionType: "focus",
    timeLeft: 25 * 60,

    isRunning: false,
    intervalId: null,

    setProgress: 1,

    history: [],
};
