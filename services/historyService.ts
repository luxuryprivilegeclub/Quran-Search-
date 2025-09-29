const HISTORY_KEY = 'quranVerseHistory';
const MAX_HISTORY_ITEMS = 15;

export function getHistory(): string[] {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error("Failed to parse history from localStorage", e);
        // If parsing fails, clear the corrupted data
        localStorage.removeItem(HISTORY_KEY);
        return [];
    }
}

function saveHistory(history: string[]): void {
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Failed to save history to localStorage", e);
    }
}

export function addHistoryItem(query: string): string[] {
    const currentHistory = getHistory();
    // Remove existing entry to move it to the top (case-insensitive)
    const filteredHistory = currentHistory.filter(item => item.toLowerCase() !== query.toLowerCase());
    
    // Add new query to the front
    const newHistory = [query, ...filteredHistory];
    
    // Enforce size limit
    const finalHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    
    saveHistory(finalHistory);
    return finalHistory;
}

export function clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}
