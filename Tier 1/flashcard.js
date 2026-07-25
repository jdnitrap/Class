// Flashcard module - handles flashcard study mode

import { ui } from './ui.js';
import { uiUtils } from './ui-utils.js';
import { dataFilter } from './data-filter.js';
import { notes } from './notes.js';

export const flashcard = {
    async startFlashcards(app) {
        const notesForSubject = dataFilter.filterNotesBySubject(app.allNotes, app.currentNotesSubject);
        app.answers = notesForSubject;
        app.currentCardIndex = 0;
        app.cardFlipped = false;
        await this.showFlashcard(app);
        uiUtils.showScreen('flashcardScreen');
    },

    async showFlashcard(app) {
        const card = app.answers[app.currentCardIndex];
        if (!card) return;

        document.getElementById('cardNumber').textContent = app.currentCardIndex + 1;
        document.getElementById('cardTotal').textContent = app.answers.length;

        const progress = uiUtils.getProgressPercentage(app.currentCardIndex, app.answers.length);
        document.getElementById('cardProgressFill').style.width = progress + '%';

        app.cardFlipped = false;
        document.getElementById('cardContent').textContent = card.title;

        // Preload content for this card
        if (!card._contentLoaded) {
            card._content = await notes.getNoteContent(card);
            card._contentLoaded = true;
        }
    },

    flipCard(app) {
        const card = app.answers[app.currentCardIndex];
        if (!card) return;

        app.cardFlipped = !app.cardFlipped;
        if (app.cardFlipped) {
            document.getElementById('cardContent').textContent = card._content || card.content || "Loading...";
        } else {
            document.getElementById('cardContent').textContent = card.title;
        }
    },

    async previousCard(app) {
        if (app.currentCardIndex > 0) {
            app.currentCardIndex--;
            await this.showFlashcard(app);
        }
    },

    async nextCard(app) {
        if (app.currentCardIndex < app.answers.length - 1) {
            app.currentCardIndex++;
            await this.showFlashcard(app);
        } else {
            ui.goHome(app);
        }
    }
};
