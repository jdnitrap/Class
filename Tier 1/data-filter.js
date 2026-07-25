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

        // Extract code from directory name (before the first underscore)
        // e.g., "CP01_Piping" -> code = "CP01"
        const underscore = directoryName.indexOf('_');
        const code = underscore !== -1 ? directoryName.substring(0, underscore) : directoryName;

        // Parse directory name: "CP01_Piping" -> "CP01 Piping"
        // Replace underscores with spaces
        let displayName = directoryName.replace(/_/g, ' ');

        // Clean up common patterns that may have spaces added
        displayName = displayName.replace(/Thermodynamics I(?!\w)/, 'Thermodynamics I');
        displayName = displayName.replace(/Thermodynamics II(?!\w)/, 'Thermodynamics II');
        displayName = displayName.replace(/Thermodynamics III(?!\w)/, 'Thermodynamics III');
        displayName = displayName.replace(/Thermodynamic Cycles/, 'Thermodynamic Cycles');
        displayName = displayName.replace(/Fluid Flow/, 'Fluid Flow');
        displayName = displayName.replace(/Heat Transfer/, 'Heat Transfer');
        displayName = displayName.replace(/Heat Exchangers/, 'Heat Exchangers');

        // Ensure format is "CODE Subject" by reconstructing
        // Extract just the subject part after the code and underscore
        const subjectPart = displayName.substring(code.length).trim();
        displayName = `${code} ${subjectPart}`;

        return displayName;
    }
};
