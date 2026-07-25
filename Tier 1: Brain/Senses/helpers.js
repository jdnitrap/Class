// UI Helpers - DOM manipulation utilities

export const helpers = {
    showScreen(screenId) {
        document.querySelectorAll('[id*="Screen"]').forEach(el => {
            if (el.id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        });
    },

    clearContainer(elementId) {
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = '';
        }
    },

    getProgressPercentage(current, total) {
        return total > 0 ? Math.round((current / total) * 100) : 0;
    }
};
