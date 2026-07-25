// Router - handles navigation between screens and mode selection

import { helpers } from './ui/helpers.js';
import { processor } from './data/processor.js';
import { exam } from './modes/exam-controller.js';
import { flashcard } from './modes/flashcard-controller.js';
import { notes } from './modes/notes-controller.js';

export const router = {
    showScreen(screenId) {
        helpers.showScreen(screenId);
    },

    goHome(state) {
        state.isComprehensiveExam = false;
        this.showScreen('homeScreen');
    },

    selectMode(state, mode) {
        state.currentMode = mode;
        state.currentQuestionIndex = 0;
        state.currentCardIndex = 0;
        state.selectedAnswers = {};
        state.answers = [];
        state.cardFlipped = false;

        if (mode === 'notes') {
            this.renderNotesSelection(state);
        } else if (mode === 'exam') {
            this.showExamConfigScreen(state);
        } else if (mode === 'flashcard') {
            this.renderNotesSelection(state);
        }
    },

    showExamConfigScreen(state) {
        this.showScreen('examConfigScreen');
    },

    renderSubjectSelection(state) {
        console.log('📚 Rendering exam subject selection...');
        if (!state.allQuestions || state.allQuestions.length === 0) {
            console.error('✗ ERROR: allQuestions is empty! Data not loaded.');
            return;
        }

        const subjects = processor.getUniqueQuestionsSubjects(state.allQuestions);
        console.log(`  → Found ${subjects.length} subjects: ${subjects.join(', ')}`);

        const container = document.getElementById('subjectButtonsContainer');
        if (!container) {
            console.error('✗ ERROR: subjectButtonsContainer not found in DOM');
            return;
        }

        helpers.clearContainer('subjectButtonsContainer');

        subjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'subject-btn';
            const displayName = processor.getDisplayName(subject, state.allQuestions);
            btn.textContent = displayName;
            btn.onclick = () => this.selectSubject(state, subject);
            container.appendChild(btn);
        });

        if (subjects.length > 0) this.selectSubject(state, subjects[0]);
        this.showScreen('subjectScreen');
    },

    renderNotesSelection(state) {
        console.log('📝 Rendering notes selection...');

        let subjects;
        if (state.currentMode === 'flashcard') {
            if (!state.allFlashcards || state.allFlashcards.length === 0) {
                console.error('✗ ERROR: allFlashcards is empty! Data not loaded.');
                return;
            }
            subjects = processor.getUniqueFlashcardsSubjects(state.allFlashcards);
            console.log(`  → Found ${subjects.length} flashcard subjects: ${subjects.join(', ')}`);
        } else {
            if (!state.allNotes || state.allNotes.length === 0) {
                console.error('✗ ERROR: allNotes is empty! Data not loaded.');
                return;
            }
            subjects = processor.getUniqueNotesSubjects(state.allNotes);
            console.log(`  → Found ${subjects.length} note subjects: ${subjects.join(', ')}`);
        }

        const container = document.getElementById('notesSubjectButtonsContainer');
        if (!container) {
            console.error('✗ ERROR: notesSubjectButtonsContainer not found in DOM');
            return;
        }

        helpers.clearContainer('notesSubjectButtonsContainer');

        const dataSource = state.currentMode === 'flashcard' ? state.allFlashcards : state.allNotes;
        subjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'subject-btn';
            const displayName = processor.getDisplayName(subject, dataSource);
            btn.textContent = displayName;
            btn.onclick = () => this.selectNotesSubject(state, subject);
            container.appendChild(btn);
        });

        if (subjects.length > 0) this.selectNotesSubject(state, subjects[0]);
        this.showScreen('notesSelectScreen');
    },

    selectSubject(state, subject) {
        state.currentSubject = subject;
        const displayName = processor.getDisplayName(subject, state.allQuestions);
        document.getElementById('selectedSubjectName').textContent = displayName;
        document.getElementById('modeButtonText').textContent = state.currentMode === 'exam' ? 'Exam' : 'Flashcards';
        document.querySelectorAll('#subjectButtonsContainer .subject-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === displayName);
        });

        if (state.currentMode === 'exam') {
            const subjectQuestions = processor.filterQuestionsBySubject(state.allQuestions, subject);
            const maxQuestions = subjectQuestions.length;
            document.getElementById('maxQuestions').textContent = maxQuestions;
            document.getElementById('questionCount').max = maxQuestions;
            document.getElementById('questionCount').value = Math.min(10, maxQuestions);
            document.getElementById('questionCountContainer').style.display = 'block';
        } else {
            document.getElementById('questionCountContainer').style.display = 'none';
        }
    },

    selectNotesSubject(state, subject) {
        console.log(`🔄 Selecting notes subject: ${subject}, mode: ${state.currentMode}`);
        state.currentNotesSubject = subject;
        const subjectNameEl = document.getElementById('selectedNotesSubjectName');
        if (!subjectNameEl) {
            console.error('✗ ERROR: selectedNotesSubjectName element not found');
            return;
        }
        const dataSource = state.currentMode === 'flashcard' ? state.allFlashcards : state.allNotes;
        const displayName = processor.getDisplayName(subject, dataSource);
        subjectNameEl.textContent = displayName;
        document.querySelectorAll('#notesSubjectButtonsContainer .subject-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === displayName);
        });
        const buttonText = state.currentMode === 'flashcard' ? 'Start Flashcards' : 'View Notes';
        document.getElementById('studyModeButtonText').textContent = buttonText;
        console.log(`✓ Subject selected: ${subject}`);
    },

    startStudyMode(state) {
        if (state.currentMode === 'flashcard') {
            return 'flashcard';
        } else {
            return 'notes';
        }
    },

    startMode(state) {
        if (!state.currentMode) {
            console.error('Mode not set. Current mode:', state.currentMode);
            return;
        }
        if (state.isComprehensiveExam) {
            exam.startComprehensiveExam(state);
        } else if (state.currentMode === 'exam') {
            exam.startExam(state);
        } else if (state.currentMode === 'flashcard') {
            flashcard.startFlashcards(state);
        } else {
            console.error('Unknown mode:', state.currentMode);
        }
    },

    goBackToNotesSelection(state) {
        this.renderNotesSelection(state);
    }
};
