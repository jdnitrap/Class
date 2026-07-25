// Notes mode - handles comprehensive notes viewing

import { router } from '../router.js';
import { processor } from '../processor.js';
import { loader } from '../loader.js';
import { helpers } from '../ui/helpers.js';

export const notes = {
    async viewNotes(state) {
        console.log(`📖 Loading notes for subject: ${state.currentNotesSubject}`);
        const subjectNotes = processor.filterNotesBySubject(state.allNotes, state.currentNotesSubject);

        const container = document.getElementById('notesContent');
        if (!container) {
            console.error('✗ notesContent container not found');
            return;
        }

        helpers.clearContainer('notesContent');

        for (const note of subjectNotes) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';

            const titleDiv = document.createElement('h3');
            titleDiv.textContent = note.title || `Note ${note.id}`;
            noteDiv.appendChild(titleDiv);

            if (note.image) {
                const imgDiv = document.createElement('div');
                imgDiv.className = 'note-image';
                const img = document.createElement('img');
                img.src = note.image;
                img.alt = note.imageLabel || 'Note image';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                imgDiv.appendChild(img);
                if (note.imageLabel) {
                    const label = document.createElement('p');
                    label.style.fontSize = '0.9em';
                    label.style.color = '#666';
                    label.textContent = note.imageLabel;
                    imgDiv.appendChild(label);
                }
                noteDiv.appendChild(imgDiv);
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = 'note-content';
            const content = await loader.getNoteContent(note);
            contentDiv.textContent = content;
            noteDiv.appendChild(contentDiv);

            container.appendChild(noteDiv);
        }

        const selectedSubjectName = document.getElementById('selectedNotesSubjectName');
        if (selectedSubjectName) {
            const displayName = processor.getDisplayName(state.currentNotesSubject, state.allNotes);
            selectedSubjectName.textContent = displayName;
        }

        router.showScreen('notesScreen');
    }
};
