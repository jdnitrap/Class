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

        // Parse directory name: "CP01_Piping" -> "CP01 Piping"
        // Replace underscores with spaces and handle special cases
        let displayName = directoryName.replace(/_/g, ' ');

        // Clean up common patterns
        displayName = displayName.replace(/Thermodynamics I/, 'Thermodynamics I');
        displayName = displayName.replace(/Thermodynamics II/, 'Thermodynamics II');
        displayName = displayName.replace(/Thermodynamics III/, 'Thermodynamics III');
        displayName = displayName.replace(/Thermodynamic Cycles/, 'Thermodynamic Cycles');
        displayName = displayName.replace(/Fluid Flow/, 'Fluid Flow');
        displayName = displayName.replace(/Heat Transfer/, 'Heat Transfer');
        displayName = displayName.replace(/Heat Exchangers/, 'Heat Exchangers');

        // Remove duplicate code if present (e.g., "TH06B Fluid Flow TH06B" -> "TH06B Fluid Flow")
        const code = subject.split(' ')[0]; // Get code part like "CP01" or "TH06B"
        const regex = new RegExp(`\\b${code}\\s+`, 'g');
        displayName = displayName.replace(regex, '');
        displayName = code + ' ' + displayName;

        return displayName;
    }
};
