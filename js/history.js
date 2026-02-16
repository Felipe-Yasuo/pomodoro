const STORAGE_KEY = "pomodoroHistory";

export function loadHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function clearHistory(state, dom, renderHistory) {
    state.history = [];
    saveHistory(state.history);
    renderHistory(state, dom);
}

export function addHistoryEntry(state, dom, renderHistory, message) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    state.history.push({ message, time: `${hh}:${mm}` });
    saveHistory(state.history);
    renderHistory(state, dom);
}

export function renderHistory(state, dom) {
    dom.historyList.innerHTML = "";

    // mostra os mais recentes em cima
    for (let i = state.history.length - 1; i >= 0; i--) {
        const item = state.history[i];
        const li = document.createElement("li");
        li.innerHTML = `
      <span class="message">${item.message}</span>
      <span class="time">${item.time}</span>
    `;
        dom.historyList.appendChild(li);
    }
}
