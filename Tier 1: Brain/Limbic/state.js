// State management - central data store for the application

const RATINGS_STORAGE_KEY = 'gobook_flashcard_ratings';

function loadRatings() {
    try {
        const raw = localStorage.getItem(RATINGS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.warn('⚠ Could not load flashcard ratings from localStorage:', e.message);
        return {};
    }
}

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
    cardFlipped: false,

    // Flashcard difficulty ratings: { [cardId]: 1-5 }, 1 = hardest/most
    // recently missed, 5 = easiest. Persisted across sessions so the
    // shuffle can keep biasing toward cards the user finds difficult.
    flashcardRatings: loadRatings(),

    saveFlashcardRating(cardId, rating) {
        this.flashcardRatings[cardId] = rating;
        try {
            localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(this.flashcardRatings));
        } catch (e) {
            console.warn('⚠ Could not persist flashcard rating:', e.message);
        }
    }
};
