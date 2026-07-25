// Main - application initializer and coordinator
// This is the entry point that starts the app and coordinates all tiers

import { state } from '../Limbic/state.js';
import { loader } from '../Limbic/loader.js';
import { router } from '../Cortex/router.js';
import { exam } from '../Cortex/exam-controller.js';
import { flashcard } from '../Cortex/flashcard-controller.js';
import { notes } from '../Cortex/notes-controller.js';

// Expose app API to window for HTML onclick handlers
window.app = {
    // Initialization
    async init() {
        try {
            console.log('🔄 App initializing...');
            await loader.loadQuestions(state);
            console.log(`✓ Loaded ${state.allQuestions.length} questions`);
            await loader.loadNotes(state);
            console.log(`✓ Loaded ${state.allNotes.length} notes`);
            await loader.loadFlashcards(state);
            console.log(`✓ Loaded ${state.allFlashcards.length} flashcards`);
            const subjects = [...new Set(state.allNotes.map(n => n.subject))].sort();
            console.log(`✓ Available subjects: ${subjects.join(', ')}`);

            const homeSubjectCountEl = document.getElementById('homeSubjectCount');
            if (homeSubjectCountEl) {
                homeSubjectCountEl.textContent = subjects.length;
            }
        } catch (error) {
            console.error('✗ Initialization failed:', error);
            throw error;
        }
    },

    // Mode selection
    selectMode(mode) {
        router.selectMode(state, mode);
    },

    showExamConfigScreen() {
        router.showExamConfigScreen(state);
    },

    startTopicExamSelection() {
        exam.startTopicExamSelection(state);
    },

    backToExamConfig() {
        exam.backToExamConfig(state);
    },

    prepareComprehensiveExam() {
        exam.prepareComprehensiveExam(state);
    },

    startMode() {
        router.startMode(state);
    },

    async startFlashcards() {
        await flashcard.startFlashcards(state);
    },

    async startExam() {
        exam.startExam(state);
    },

    startComprehensiveExam() {
        exam.startComprehensiveExam(state);
    },

    // Subject selection
    renderSubjectSelection() {
        router.renderSubjectSelection(state);
    },

    renderNotesSelection() {
        router.renderNotesSelection(state);
    },

    selectSubject(subject) {
        router.selectSubject(state, subject);
    },

    selectNotesSubject(subject) {
        router.selectNotesSubject(state, subject);
    },

    // Study modes
    async startStudyMode() {
        const mode = router.startStudyMode(state);
        if (mode === 'flashcard') {
            await this.startFlashcards();
        } else if (mode === 'notes') {
            await notes.viewNotes(state);
        }
    },

    async viewNotes() {
        await notes.viewNotes(state);
    },

    // Navigation
    goHome() {
        router.goHome(state);
    },

    goBackToNotesSelection() {
        router.goBackToNotesSelection(state);
    },

    goBackToExamSelection() {
        exam.startTopicExamSelection(state);
    },

    goBackToFlashcardSelection() {
        state.currentMode = 'flashcard';
        router.renderNotesSelection(state);
    },

    // Exam controls
    previousQuestion() {
        console.log('🔙 previousQuestion called');
        exam.previousQuestion(state);
    },

    nextQuestion() {
        exam.nextQuestion(state);
    },

    // Flashcard controls
    flipCard() {
        flashcard.flipCard(state);
    },

    async previousCard() {
        await flashcard.previousCard(state);
    },

    async nextCard() {
        await flashcard.nextCard(state);
    }
};

// Initialize on page load
window.addEventListener('load', async () => {
    console.log('==========================================');
    console.log('🚀 STARTING APP INITIALIZATION');
    console.log('==========================================');
    try {
        await window.app.init();
        console.log('==========================================');
        console.log('✅ INITIALIZATION COMPLETE');
        console.log('==========================================');
    } catch (err) {
        console.log('==========================================');
        console.error('❌ INITIALIZATION FAILED');
        console.log('==========================================');
        console.error(err);
    }
});
