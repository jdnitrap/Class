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
    },

    getDisplayName(subject, items) {
        // Find an item with this subject to extract the display name from contentFile
        const item = items.find(i => i.subject === subject);
        if (!item || !item.contentFile) {
            return subject; // Fallback to subject code
        }

        // Extract directory name from contentFile path
        // e.g., "Tier 3/CP01_Piping/CP01_Piping_notes.txt" -> "CP01_Piping"
        const pathParts = item.contentFile.split('/');
        const directoryName = pathParts[1]; // Get the directory name

        if (!directoryName) {
            return subject;
        }

        // Simply replace underscores with spaces to match the directory name format
        // CP01_Piping -> CP01 Piping
        // TH01_Measurement -> TH01 Measurement
        // TH06B_Fluid_Flow -> TH06B Fluid Flow
        // CP06_Heat_Exchangers -> CP06 Heat Exchangers
        const displayName = directoryName.replace(/_/g, ' ');

        return displayName;
    }
};
