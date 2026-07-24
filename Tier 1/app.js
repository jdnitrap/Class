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
        await dataLoader.loadQuestions(this);
        await dataLoader.loadNotes(this);
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

    async nextCard() {
        await flashcard.nextCard(this);
    },

    nextQuestion() {
        exam.nextQuestion(this);
    },

    goBackToNotesSelection() {
        ui.goBackToNotesSelection(this);
    }
};

// Initialize on page load
window.addEventListener('load', () => window.app.init());
