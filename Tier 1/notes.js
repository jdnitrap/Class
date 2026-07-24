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
                if (!response.ok) {
                    console.error(`✗ HTTP ${response.status}: Failed to load ${note.contentFile}`);
                    return `Error: Could not load content (HTTP ${response.status})`;
                }
                const text = await response.text();
                const pattern = new RegExp(`\\[Note ID: ${note.id}\\][\\s\\S]*?(?=\\[Note ID:|$)`);
                const match = text.match(pattern);
                if (match) {
                    return match[0].replace(`[Note ID: ${note.id}]`, '').trim();
                }
                console.warn(`⚠ Note ID ${note.id} not found in ${note.contentFile}`);
                return "Content not found in file";
            } catch (error) {
                console.error(`✗ Error loading content for note ${note.id}:`, error.message);
                return "Error loading content: " + error.message;
            }
        }
        return "No content file specified";
    },

    async viewNotes(app) {
        if (!app.currentNotesSubject) {
            console.error('✗ ERROR: currentNotesSubject not set!');
            return;
        }
        console.log(`📖 Loading notes for subject: ${app.currentNotesSubject}`);

        const notesForSubject = dataFilter.filterNotesBySubject(app.allNotes, app.currentNotesSubject);
        console.log(`  → Found ${notesForSubject.length} notes for ${app.currentNotesSubject}`);

        if (notesForSubject.length === 0) {
            console.error(`✗ ERROR: No notes found for subject "${app.currentNotesSubject}"`);
            console.log('Available subjects:', [...new Set(app.allNotes.map(n => n.subject))].sort());
            return;
        }

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

        console.log(`✓ Rendered ${notesForSubject.length} notes`);
        uiUtils.showScreen('notesScreen');
    }
};
