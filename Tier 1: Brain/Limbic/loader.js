// Loader - fetches data from Tier 2 metadata and Tier 3 content files

import { config } from '../Brainstem/config.js';

export const loader = {
    async loadQuestions(state) {
        state.allQuestions = [];
        try {
            const response = await fetch(config.getMetadataPath('questions'));
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
            const response = await fetch(contentFile + '?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();
            const questions = [];

            // Detect file format
            const isMarkdown = contentFile.endsWith('.md');

            if (isMarkdown) {
                // Parse markdown format (## Question ID: X)
                questions.push(...this.parseMarkdownQuestions(text, contentFile));
            } else {
                // Parse text format ([Question ID: X] followed by JSON)
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
            }

            return questions;
        } catch (error) {
            console.error(`✗ Error loading questions from ${contentFile}:`, error.message);
            return [];
        }
    },

    parseMarkdownQuestions(markdown, contentFile) {
        const questions = [];
        const qPattern = /^##\s+(?:Question\s+)?ID:\s*(\d+)/mi;
        const blocks = markdown.split(qPattern);

        for (let i = 1; i < blocks.length; i += 2) {
            const id = blocks[i].trim();
            const content = blocks[i + 1];

            if (!content) continue;

            const questionMatch = content.match(/^###\s+Question:\s*(.+?)(?:\n|$)/m);
            const questionText = questionMatch ? questionMatch[1].trim() : '';

            const optionMatches = content.match(/^-\s+([a-d]\))\s+(.+?)$/gm) || [];
            const options = optionMatches.map(opt => {
                const match = opt.match(/^-\s+([a-d])\)\s+(.+?)$/m);
                return {
                    letter: match[1],
                    text: match[2].trim()
                };
            });

            const correctMatch = content.match(/\*\*Correct:\*\*\s+([a-d])/m);
            const correctAnswer = correctMatch ? correctMatch[1] : null;

            const explanationMatch = content.match(/\*\*Explanation:\*\*\s+(.+?)(?=\n\n---|\n*$)/s);
            const explanation = explanationMatch ? explanationMatch[1].trim() : '';

            questions.push({
                id: parseInt(id),
                text: questionText,
                options: options,
                correct: correctAnswer,
                explanation: explanation,
                contentFile: contentFile
            });
        }

        return questions;
    },

    async loadNotes(state) {
        state.allNotes = [];
        try {
            const response = await fetch(config.getMetadataPath('notes'));
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
            const response = await fetch(config.getMetadataPath('flashcards'));
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const data = await response.json();
            if (data.flashcards && Array.isArray(data.flashcards)) {
                for (const fcRef of data.flashcards) {
                    const flashcards = await this.getFlashcardsFromFile(fcRef.contentFile, fcRef.subject);
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

    async getFlashcardsFromFile(contentFile, subject) {
        try {
            const response = await fetch(contentFile + '?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();
            const flashcards = [];

            // Detect file format
            const isMarkdown = contentFile.endsWith('.md');

            if (isMarkdown) {
                // Parse markdown format (## Flashcard ID: X)
                const parsed = this.parseMarkdownFlashcards(text, subject, contentFile);
                return parsed;
            } else {
                // Parse text format ([Note ID: X])
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
                                    subject: subject,
                                    contentFile: contentFile,
                                    content: content.trim()
                                });
                            }
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

    parseMarkdownFlashcards(markdown, subject, contentFile) {
        const flashcards = [];
        const cardPattern = /^##\s+(?:Flashcard\s+)?ID:\s*(\d+)/mi;
        const blocks = markdown.split(cardPattern);

        for (let i = 1; i < blocks.length; i += 2) {
            const id = blocks[i].trim();
            const content = blocks[i + 1];

            if (!content) continue;

            const frontMatch = content.match(/^###\s+Question:\s*(.+?)(?:\n|$)/m);
            const front = frontMatch ? frontMatch[1].trim() : `Card ${id}`;

            let back = content.substring(content.indexOf('\n') + 1);
            back = back.split(/^##\s+/m)[0].trim();

            flashcards.push({
                id: parseInt(id),
                front: front,
                back: back,
                subject: subject,
                contentFile: contentFile
            });
        }

        return flashcards;
    },

    async getNoteContent(note) {
        if (!note.contentFile) {
            console.warn(`⚠ Note ${note.id} has no contentFile property`);
            return 'Content file not specified';
        }

        try {
            const response = await fetch(note.contentFile + '?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            const text = await response.text();

            // Detect file format
            const isMarkdown = note.contentFile.endsWith('.md');

            if (isMarkdown) {
                // Parse markdown format (## Note ID: X)
                const notePattern = /^##\s+(?:Note\s+)?ID:\s*(\d+(?:\.\d+)?)/mi;
                const blocks = text.split(notePattern);

                for (let i = 1; i < blocks.length; i += 2) {
                    const id = parseFloat(blocks[i].trim());
                    if (id === note.id) {
                        const content = blocks[i + 1];
                        if (content) {
                            // Remove title line (### ...) and clean up
                            const cleaned = content
                                .replace(/^###\s+.+?\n/, '')
                                .trim();
                            return cleaned;
                        }
                    }
                }
                console.warn(`⚠ Note ID ${note.id} not found in ${note.contentFile}`);
                return 'Content not found';
            } else {
                // Parse text format ([Note ID: X])
                const pattern = new RegExp(`\\[Note ID: ${note.id}\\][\\s\\S]*?(?=\\[Note ID:|$)`);
                const match = text.match(pattern);

                if (match) {
                    return match[0]
                        .replace(`[Note ID: ${note.id}]`, '')
                        .trim();
                }
                console.warn(`⚠ Note ID ${note.id} not found in ${note.contentFile}`);
                return 'Content not found';
            }
        } catch (error) {
            console.error(`✗ Error loading content for note ${note.id}:`, error.message);
            return `Error loading content: ${error.message}`;
        }
    }
};
