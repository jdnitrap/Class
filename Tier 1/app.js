// App module - core initialization and state management

import { dataLoader } from './data-loader.js';
import { ui } from './ui.js';
import { exam } from './exam.js';
import { flashcard } from './flashcard.js';
import { notes } from './notes.js';

// Global app state
window.app = {
    allQuestions: [],
    allNotes: [],
    allFlashcards: [],
    currentSubject: null,
    currentNotesSubject: null,
    currentMode: null,
    currentQuestionIndex: 0,
    currentCardIndex: 0,
    selectedAnswers: {},
    answers: [],
    cardFlipped: false,
    isComprehensiveExam: false,

    // Public API methods
    async init() {
        try {
            console.log('🔄 App initializing...');
            await dataLoader.loadQuestions(this);
            console.log(`✓ Loaded ${this.allQuestions.length} questions`);
            await dataLoader.loadNotes(this);
            console.log(`✓ Loaded ${this.allNotes.length} notes`);
            await dataLoader.loadFlashcards(this);
            console.log(`✓ Loaded ${this.allFlashcards.length} flashcards`);
            const subjects = [...new Set(this.allNotes.map(n => n.subject))].sort();
            console.log(`✓ Available subjects: ${subjects.join(', ')}`);

            // Update home screen with subject count
            const homeSubjectCountEl = document.getElementById('homeSubjectCount');
            if (homeSubjectCountEl) {
                homeSubjectCountEl.textContent = subjects.length;
            }
        } catch (error) {
            console.error('✗ Initialization failed:', error);
            throw error;
        }
    },

    selectMode(mode) {
        ui.selectMode(this, mode);
    },

    showExamConfigScreen() {
        ui.showExamConfigScreen(this);
    },

    startTopicExamSelection() {
        exam.startTopicExamSelection(this);
    },

    backToExamConfig() {
        exam.backToExamConfig(this);
    },

    prepareComprehensiveExam() {
        exam.prepareComprehensiveExam(this);
    },

    startMode() {
        ui.startMode(this, exam, flashcard, notes);
    },

    async startFlashcards() {
        await flashcard.startFlashcards(this);
    },

    async startExam() {
        exam.startExam(this);
    },

    startComprehensiveExam() {
        exam.startComprehensiveExam(this);
    },

    renderSubjectSelection() {
        ui.renderSubjectSelection(this);
    },

    renderNotesSelection() {
        ui.renderNotesSelection(this);
    },

    selectSubject(subject) {
        ui.selectSubject(this, subject);
    },

    selectNotesSubject(subject) {
        ui.selectNotesSubject(this, subject);
    },

    startStudyMode() {
        const mode = ui.startStudyMode(this);
        if (mode === 'flashcard') {
            this.startFlashcards();
        } else if (mode === 'notes') {
            notes.viewNotes(this);
        }
    },

    async viewNotes() {
        await notes.viewNotes(this);
    },

    goHome() {
        ui.goHome(this);
    },

    flipCard() {
        flashcard.flipCard(this);
    },

    async previousCard() {
        await flashcard.previousCard(this);
    },

    async nextCard() {
        await flashcard.nextCard(this);
    },

    previousQuestion() {
        console.log('🔙 previousQuestion called');
        exam.previousQuestion(this);
    },

    nextQuestion() {
        exam.nextQuestion(this);
    },

    goBackToNotesSelection() {
        ui.goBackToNotesSelection(this);
    },

    goBackToExamSelection() {
        exam.startTopicExamSelection(this);
    },

    goBackToFlashcardSelection() {
        this.currentMode = 'flashcard';
        ui.renderNotesSelection(this);
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
        console.log('Test: Open browser DevTools Console (F12) and paste this:');
        console.log('window.app.allNotes.filter(n=>n.subject==="CP06").length');
        console.log('Should show: 47 (CP06 Q&A flashcards for focused study)');
        console.log('CP06 Study Option:');
        console.log('  CP06 flashcards: window.app.allNotes.filter(n=>n.subject==="CP06").length  // 47 Q&A flashcards');
    } catch (err) {
        console.log('==========================================');
        console.error('❌ INITIALIZATION FAILED');
        console.log('==========================================');
        console.error(err);
    }
});
