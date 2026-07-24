// UI Utilities - pure DOM manipulation functions

export const uiUtils = {
    showScreen(screenId) {
        document.querySelectorAll('#app > .container > .content, #app > .container > div[id$="Screen"]').forEach(el => {
            el.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    },

    createElement(tag, className = '', text = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text) el.textContent = text;
        return el;
    },

    setTextContent(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = text;
    },

    getInputValue(elementId) {
        const el = document.getElementById(elementId);
        return el ? el.value : '';
    },

    setInputValue(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) el.value = value;
    },

    getInputNumberValue(elementId) {
        return parseInt(this.getInputValue(elementId)) || 0;
    },

    setElementDisplay(elementId, display) {
        const el = document.getElementById(elementId);
        if (el) el.style.display = display;
    },

    toggleClass(elementId, className, add = true) {
        const el = document.getElementById(elementId);
        if (el) {
            if (add) {
                el.classList.add(className);
            } else {
                el.classList.remove(className);
            }
        }
    },

    clearContainer(containerId) {
        const container = document.getElementById(containerId);
        if (container) container.innerHTML = '';
    },

    appendToContainer(containerId, element) {
        const container = document.getElementById(containerId);
        if (container) container.appendChild(element);
    },

    getProgressPercentage(current, total) {
        return Math.round(((current + 1) / total) * 100);
    }
};
