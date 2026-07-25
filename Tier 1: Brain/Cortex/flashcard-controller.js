// Flashcard mode - handles flashcard study functionality

import { processor } from '../Limbic/processor.js';
import { helpers } from '../Senses/helpers.js';
import { router } from './router.js';

export const flashcard = {
    extractFrontBack(content) {
        const lines = content.split('\n').filter(l => l.trim());
        let front = '';
        let back = '';

        // Check for explicit FRONT:/BACK: format
        let hasFrontBack = false;
        for (const line of lines) {
            if (line.includes('FRONT:') || line.includes('BACK:')) {
                hasFrontBack = true;
                break;
            }
        }

        if (hasFrontBack) {
            // Explicit FRONT:/BACK: format
            for (const line of lines) {
                if (line.includes('FRONT:')) {
                    front = line.replace(/^.*?FRONT:\s*/, '').trim();
                } else if (line.includes('BACK:')) {
                    back = line.replace(/^.*?BACK:\s*/, '').trim();
                } else if (back) {
                    back += '\n' + line;
                }
            }
        } else {
            // Implicit format: first line is question, rest is answer
            if (lines.length > 0) {
                front = lines[0];
                back = lines.slice(1).join('\n');
            }
        }

        return {
            front: front || 'Flashcard',
            back: back.trim() || 'No answer'
        };
    },

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
        // Use front/back properties from markdown loader, fallback to content parsing for legacy format
        const front = card.front || (card.content ? this.extractFrontBack(card.content).front : 'Flashcard');
        document.getElementById('cardContent').textContent = front;
    },

    flipCard(state) {
        const card = state.answers[state.currentCardIndex];
        if (!card) return;

        state.cardFlipped = !state.cardFlipped;
        // Use front/back properties from markdown loader, fallback to content parsing for legacy format
        const front = card.front || (card.content ? this.extractFrontBack(card.content).front : 'Flashcard');
        const back = card.back || (card.content ? this.extractFrontBack(card.content).back : 'No answer');

        if (state.cardFlipped) {
            document.getElementById('cardContent').textContent = back;
        } else {
            document.getElementById('cardContent').textContent = front;
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
