// State management - central data store for the application

export const state = {
    // Data collections
    allQuestions: [],
    allNotes: [],
    allFlashcards: [],

    // Current selections
    currentSubject: null,
    currentNotesSubject: null,
    currentMode: null,

    // Exam state
    currentQuestionIndex: 0,
    selectedAnswers: {},
    answers: [],
    isComprehensiveExam: false,

    // Flashcard state
    currentCardIndex: 0,
    cardFlipped: false
};
