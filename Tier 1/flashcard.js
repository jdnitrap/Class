// Flashcard module - handles flashcard study mode

import { ui } from './ui.js';
import { uiUtils } from './ui-utils.js';
import { dataFilter } from './data-filter.js';

export const flashcard = {
    async startFlashcards(app) {
        const flashcardsForSubject = dataFilter.filterFlashcardsBySubject(app.allFlashcards, app.currentNotesSubject);
        app.answers = flashcardsForSubject;
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
        // Show first line or first part as front of card
        const contentLines = card.content.split('\n');
        const frontText = contentLines[0].length > 100
            ? contentLines[0].substring(0, 100) + '...'
            : contentLines[0];
        document.getElementById('cardContent').textContent = frontText || 'Flashcard ' + card.id;
    },

    flipCard(app) {
        const card = app.answers[app.currentCardIndex];
        if (!card) return;

        app.cardFlipped = !app.cardFlipped;
        if (app.cardFlipped) {
            document.getElementById('cardContent').textContent = card.content;
        } else {
            const contentLines = card.content.split('\n');
            const frontText = contentLines[0].length > 100
                ? contentLines[0].substring(0, 100) + '...'
                : contentLines[0];
            document.getElementById('cardContent').textContent = frontText || 'Flashcard ' + card.id;
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
