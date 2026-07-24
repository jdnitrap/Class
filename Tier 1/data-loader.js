// Data loading module - handles fetching questions and notes from JSON and text files

export const dataLoader = {
    async loadQuestions(app) {
        app.allQuestions = [];
        try {
            const response = await fetch('Tier 2/questions.json?v=' + Date.now());
            const data = await response.json();
            if (data.questions && Array.isArray(data.questions)) {
                // Load questions from their text files
                for (const qRef of data.questions) {
                    const questions = await this.getQuestionsFromFile(qRef.contentFile);
                    app.allQuestions = app.allQuestions.concat(questions);
                }
            }
        } catch (error) {
            console.warn('Questions not loaded:', error);
        }
        document.getElementById('questionsCount').textContent = app.allQuestions.length;
        document.getElementById('subjectsCount').textContent = new Set(app.allQuestions.map(q => q.subject)).size;
    },

    async getQuestionsFromFile(contentFile) {
        try {
            const response = await fetch(contentFile);
            const text = await response.text();
            const questions = [];

            // Parse questions - each starts with [Question ID: X]
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('[Question ID:')) {
                    // Next line should have the JSON
                    if (i + 1 < lines.length) {
                        try {
                            const questionJson = JSON.parse(lines[i + 1].trim());
                            questions.push(questionJson);
                        } catch (e) {
                            console.warn('Failed to parse question:', e);
                        }
                    }
                }
            }
            return questions;
        } catch (error) {
            console.warn('Error loading questions from file:', contentFile, error);
            return [];
        }
    },

    async loadNotes(app) {
        app.allNotes = [];
        try {
            const response = await fetch('Tier 2/notes.json?v=' + Date.now());
            const data = await response.json();
            if (data.notes && Array.isArray(data.notes)) {
                app.allNotes = data.notes;
            }
        } catch (error) {
            console.warn('Notes not loaded:', error);
        }
        document.getElementById('notesSubjectsCount').textContent = new Set(app.allNotes.map(n => n.subject)).size;
    }
};
