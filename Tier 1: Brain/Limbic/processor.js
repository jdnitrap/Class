// Processor - filters and processes data for display

export const processor = {
    filterQuestionsBySubject(questions, subject) {
        return questions.filter(q => q.subject === subject);
    },

    filterNotesBySubject(notes, subject) {
        return notes.filter(n => n.subject === subject);
    },

    filterFlashcardsBySubject(flashcards, subject) {
        return flashcards.filter(f => f.subject === subject);
    },

    getUniqueSubjects(items) {
        return [...new Set(items.map(item => item.subject))].sort();
    },

    getUniqueQuestionsSubjects(questions) {
        return this.getUniqueSubjects(questions);
    },

    getUniqueNotesSubjects(notes) {
        return this.getUniqueSubjects(notes);
    },

    getUniqueFlashcardsSubjects(flashcards) {
        return this.getUniqueSubjects(flashcards);
    },

    getDisplayName(subject, items) {
        const item = items.find(i => i.subject === subject);
        if (!item || !item.contentFile) {
            return subject;
        }

        const pathParts = item.contentFile.split('/');
        const directoryName = pathParts[1];

        if (!directoryName) {
            return subject;
        }

        const displayName = directoryName.replace(/_/g, ' ');
        return displayName;
    }
};
