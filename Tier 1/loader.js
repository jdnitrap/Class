// Loader - fetches data from Tier 2 metadata and Tier 3 content files

export const loader = {
    async loadQuestions(state) {
        state.allQuestions = [];
        try {
            const response = await fetch('Tier 2/questions-index.json?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            if (data.questions && Array.isArray(data.questions)) {
                for (const qRef of data.questions) {
                    const questions = await this.getQuestionsFromFile(qRef.contentFile);
                    state.allQuestions = state.allQuestions.concat(questions);
                }
            }
        } catch (error) {
            console.error('✗ Failed to load questions:', error.message);
            throw error;
        }
        document.getElementById('questionsCount').textContent = state.allQuestions.length;
        document.getElementById('subjectsCount').textContent = new Set(state.allQuestions.map(q => q.subject)).size;
    },

    async getQuestionsFromFile(contentFile) {
        try {
            const response = await fetch(contentFile);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();
            const questions = [];

            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('[Question ID:')) {
                    if (i + 1 < lines.length) {
                        try {
                            const questionJson = JSON.parse(lines[i + 1].trim());
                            questionJson.contentFile = contentFile;
                            questions.push(questionJson);
                        } catch (e) {
                            console.warn(`⚠ Failed to parse question in ${contentFile} at line ${i + 1}:`, e.message);
                        }
                    }
                }
            }
            return questions;
        } catch (error) {
            console.error(`✗ Error loading questions from ${contentFile}:`, error.message);
            return [];
        }
    },

    async loadNotes(state) {
        state.allNotes = [];
        try {
            const response = await fetch('Tier 2/notes-index.json?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            if (data.notes && Array.isArray(data.notes)) {
                state.allNotes = data.notes;
            }
        } catch (error) {
            console.error('✗ Failed to load notes:', error.message);
            throw error;
        }
        const noteCount = state.allNotes.length;
        const subjectCount = new Set(state.allNotes.map(n => n.subject)).size;
        document.getElementById('notesSubjectsCount').textContent = subjectCount;
        console.log(`  → ${noteCount} notes across ${subjectCount} subjects`);
    },

    async loadFlashcards(state) {
        state.allFlashcards = [];
        try {
            const response = await fetch('Tier 2/flashcards-index.json?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            if (data.flashcards && Array.isArray(data.flashcards)) {
                for (const fcRef of data.flashcards) {
                    const flashcards = await this.getFlashcardsFromFile(fcRef.contentFile);
                    state.allFlashcards = state.allFlashcards.concat(flashcards);
                }
            }
        } catch (error) {
            console.error('✗ Failed to load flashcards:', error.message);
            throw error;
        }
        const flashcardCount = state.allFlashcards.length;
        const subjectCount = new Set(state.allFlashcards.map(f => f.subject)).size;
        console.log(`✓ Loaded ${flashcardCount} flashcards across ${subjectCount} subjects`);
    },

    async getFlashcardsFromFile(contentFile) {
        try {
            const response = await fetch(contentFile);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();
            const flashcards = [];

            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line.startsWith('[Note ID:')) {
                    const idMatch = line.match(/\[Note ID:\s*(\d+)\]/);
                    if (idMatch) {
                        const id = parseInt(idMatch[1]);
                        let content = '';
                        let j = i + 1;
                        while (j < lines.length && !lines[j].trim().startsWith('[Note ID:')) {
                            if (content || lines[j].trim()) {
                                content += (content ? '\n' : '') + lines[j];
                            }
                            j++;
                        }
                        if (content.trim()) {
                            flashcards.push({
                                id: id,
                                content: content.trim()
                            });
                        }
                    }
                }
            }
            return flashcards;
        } catch (error) {
            console.error(`✗ Error loading flashcards from ${contentFile}:`, error.message);
            return [];
        }
    },

    async getNoteContent(note) {
        if (!note.contentFile) {
            console.warn(`⚠ Note ${note.id} has no contentFile property`);
            return 'Content file not specified';
        }

        try {
            const response = await fetch(note.contentFile);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();

            const pattern = new RegExp(`\\[Note ID: ${note.id}\\][\\s\\S]*?(?=\\[Note ID:|$)`);
            const match = text.match(pattern);

            if (match) {
                return match[0]
                    .replace(`[Note ID: ${note.id}]`, '')
                    .trim();
            }
            console.warn(`⚠ Note ID ${note.id} not found in ${note.contentFile}`);
            return 'Content not found';
        } catch (error) {
            console.error(`✗ Error loading content for note ${note.id}:`, error.message);
            return `Error loading content: ${error.message}`;
        }
    }
};
