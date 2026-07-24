// UI module - handles screen navigation and DOM management

import { uiUtils } from './ui-utils.js';
import { dataFilter } from './data-filter.js';

export const ui = {
    showScreen(screenId) {
        uiUtils.showScreen(screenId);
    },

    goHome(app) {
        app.isComprehensiveExam = false;
        this.showScreen('homeScreen');
    },

    selectMode(app, mode) {
        app.currentMode = mode;
        app.currentQuestionIndex = 0;
        app.currentCardIndex = 0;
        app.selectedAnswers = {};
        app.answers = [];
        app.cardFlipped = false;
        if (mode === 'notes') {
            this.renderNotesSelection(app);
        } else if (mode === 'exam') {
            this.showExamConfigScreen(app);
        } else if (mode === 'flashcard') {
            this.renderNotesSelection(app);
        }
    },

    showExamConfigScreen(app) {
        this.showScreen('examConfigScreen');
    },

    renderSubjectSelection(app) {
        console.log('📚 Rendering exam subject selection...');
        if (!app.allQuestions || app.allQuestions.length === 0) {
            console.error('✗ ERROR: allQuestions is empty! Data not loaded.');
            return;
        }

        const subjects = dataFilter.getUniqueQuestionsSubjects(app.allQuestions);
        console.log(`  → Found ${subjects.length} subjects: ${subjects.join(', ')}`);

        const container = document.getElementById('subjectButtonsContainer');
        if (!container) {
            console.error('✗ ERROR: subjectButtonsContainer not found in DOM');
            return;
        }

        uiUtils.clearContainer('subjectButtonsContainer');

        subjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'subject-btn';
            btn.textContent = subject;
            btn.onclick = () => this.selectSubject(app, subject);
            container.appendChild(btn);
        });

        if (subjects.length > 0) this.selectSubject(app, subjects[0]);
        this.showScreen('subjectScreen');
    },

    renderNotesSelection(app) {
        console.log('📝 Rendering notes selection...');
        if (!app.allNotes || app.allNotes.length === 0) {
            console.error('✗ ERROR: allNotes is empty! Data not loaded.');
            return;
        }

        const subjects = dataFilter.getUniqueNotesSubjects(app.allNotes);
        console.log(`  → Found ${subjects.length} subjects: ${subjects.join(', ')}`);

        const container = document.getElementById('notesSubjectButtonsContainer');
        if (!container) {
            console.error('✗ ERROR: notesSubjectButtonsContainer not found in DOM');
            return;
        }

        uiUtils.clearContainer('notesSubjectButtonsContainer');

        subjects.forEach(subject => {
            const btn = document.createElement('button');
            btn.className = 'subject-btn';
            btn.textContent = subject;
            btn.onclick = () => this.selectNotesSubject(app, subject);
            container.appendChild(btn);
        });

        if (subjects.length > 0) this.selectNotesSubject(app, subjects[0]);
        this.showScreen('notesSelectScreen');
    },

    selectSubject(app, subject) {
        app.currentSubject = subject;
        document.getElementById('selectedSubjectName').textContent = subject;
        document.getElementById('modeButtonText').textContent = app.currentMode === 'exam' ? 'Exam' : 'Flashcards';
        document.querySelectorAll('#subjectButtonsContainer .subject-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === subject);
        });

        if (app.currentMode === 'exam') {
            const subjectQuestions = dataFilter.filterQuestionsBySubject(app.allQuestions, subject);
            const maxQuestions = subjectQuestions.length;
            document.getElementById('maxQuestions').textContent = maxQuestions;
            document.getElementById('questionCount').max = maxQuestions;
            document.getElementById('questionCount').value = Math.min(10, maxQuestions);
            document.getElementById('questionCountContainer').style.display = 'block';
        } else {
            document.getElementById('questionCountContainer').style.display = 'none';
        }
    },

    selectNotesSubject(app, subject) {
        console.log(`🔄 Selecting notes subject: ${subject}, mode: ${app.currentMode}`);
        app.currentNotesSubject = subject;
        const subjectNameEl = document.getElementById('selectedNotesSubjectName');
        if (!subjectNameEl) {
            console.error('✗ ERROR: selectedNotesSubjectName element not found');
            return;
        }
        subjectNameEl.textContent = subject;
        document.querySelectorAll('#notesSubjectButtonsContainer .subject-btn').forEach(btn => {
            btn.classList.toggle('active', btn.textContent === subject);
        });
        const buttonText = app.currentMode === 'flashcard' ? 'Start Flashcards' : 'View Notes';
        document.getElementById('studyModeButtonText').textContent = buttonText;
        console.log(`✓ Subject selected: ${subject}`);
    },

    startStudyMode(app) {
        if (app.currentMode === 'flashcard') {
            return 'flashcard';
        } else {
            return 'notes';
        }
    },

    startMode(app, exam, flashcard, notes) {
        if (!app.currentMode) {
            console.error('Mode not set. Current mode:', app.currentMode);
            return;
        }
        if (app.isComprehensiveExam) {
            exam.startComprehensiveExam(app);
        } else if (app.currentMode === 'exam') {
            exam.startExam(app);
        } else if (app.currentMode === 'flashcard') {
            flashcard.startFlashcards(app);
        } else {
            console.error('Unknown mode:', app.currentMode);
        }
    },

    goBackToNotesSelection(app) {
        this.renderNotesSelection(app);
    }
};
