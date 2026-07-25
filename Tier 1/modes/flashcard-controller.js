// Flashcard mode - handles flashcard study functionality

import { router } from '../router.js';
import { processor } from '../processor.js';
import { helpers } from '../ui/helpers.js';

export const flashcard = {
    async startFlashcards(state) {
        const flashcardsForSubject = processor.filterFlashcardsBySubject(state.allFlashcards, state.currentNotesSubject);
        state.answers = flashcardsForSubject;
        state.currentCardIndex = 0;
        state.cardFlipped = false;
        await this.showFlashcard(state);
        router.showScreen('flashcardScreen');
    },

    async showFlashcard(state) {
        const card = state.answers[state.currentCardIndex];
        if (!card) return;

        document.getElementById('cardNumber').textContent = state.currentCardIndex + 1;
        document.getElementById('cardTotal').textContent = state.answers.length;

        const progress = helpers.getProgressPercentage(state.currentCardIndex, state.answers.length);
        document.getElementById('cardProgressFill').style.width = progress + '%';

        state.cardFlipped = false;
        const contentLines = card.content.split('\n');
        const frontText = contentLines[0].length > 100
            ? contentLines[0].substring(0, 100) + '...'
            : contentLines[0];
        document.getElementById('cardContent').textContent = frontText || 'Flashcard ' + card.id;
    },

    flipCard(state) {
        const card = state.answers[state.currentCardIndex];
        if (!card) return;

        state.cardFlipped = !state.cardFlipped;
        if (state.cardFlipped) {
            document.getElementById('cardContent').textContent = card.content;
        } else {
            const contentLines = card.content.split('\n');
            const frontText = contentLines[0].length > 100
                ? contentLines[0].substring(0, 100) + '...'
                : contentLines[0];
            document.getElementById('cardContent').textContent = frontText || 'Flashcard ' + card.id;
        }
    },

    async previousCard(state) {
        if (state.currentCardIndex > 0) {
            state.currentCardIndex--;
            await this.showFlashcard(state);
        }
    },

    async nextCard(state) {
        if (state.currentCardIndex < state.answers.length - 1) {
            state.currentCardIndex++;
            await this.showFlashcard(state);
        } else {
            router.goHome(state);
        }
    }
};
