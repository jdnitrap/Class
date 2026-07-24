// Notes module - handles notes viewing and content loading

import { ui } from './ui.js';
import { uiUtils } from './ui-utils.js';
import { dataFilter } from './data-filter.js';

export const notes = {
    async getNoteContent(note) {
        if (note.content) {
            return note.content;
        }
        if (note.contentFile) {
            try {
                const response = await fetch(note.contentFile);
                const text = await response.text();
                const pattern = new RegExp(`\\[Note ID: ${note.id}\\][\\s\\S]*?(?=\\[Note ID:|$)`);
                const match = text.match(pattern);
                if (match) {
                    return match[0].replace(`[Note ID: ${note.id}]`, '').trim();
                }
                return "Content not found";
            } catch (error) {
                return "Error loading content: " + error.message;
            }
        }
        return "No content available";
    },

    async viewNotes(app) {
        const notesForSubject = dataFilter.filterNotesBySubject(app.allNotes, app.currentNotesSubject);
        uiUtils.clearContainer('notesListContainer');

        document.getElementById('notesViewTitle').textContent = app.currentNotesSubject + ' Notes';
        document.getElementById('notesCountDisplay').textContent = notesForSubject.length;

        for (const note of notesForSubject) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-card';
            const content = await this.getNoteContent(note);
            let html = `<h4>${note.title}</h4><p>${content}</p>`;
            if (note.image) {
                html += `<div style="text-align: center;">
                            <img src="${note.image}" alt="${note.title}" class="note-diagram">
                            <div class="note-image-label">${note.imageLabel || note.title}</div>
                        </div>`;
            }
            noteDiv.innerHTML = html;
            uiUtils.appendToContainer('notesListContainer', noteDiv);
        }

        uiUtils.showScreen('notesScreen');
    }
};
