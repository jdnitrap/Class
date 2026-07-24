// Data filtering utilities - centralized logic for filtering questions and notes

export const dataFilter = {
    filterQuestionsBySubject(questions, subject) {
        return questions.filter(q => q.subject === subject);
    },

    filterNotesBySubject(notes, subject) {
        return notes.filter(n => n.subject === subject);
    },

    getUniqueSubjects(items) {
        return [...new Set(items.map(item => item.subject))].sort();
    },

    getUniqueQuestionsSubjects(questions) {
        return this.getUniqueSubjects(questions);
    },

    getUniqueNotesSubjects(notes) {
        return this.getUniqueSubjects(notes);
    }
};
