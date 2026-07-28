// Loader - fetches the precompiled content bundle (built by
// scripts/build-content.js from Tier 2 metadata + Tier 3 YAML-frontmatter
// content). No client-side markdown parsing happens here anymore --
// malformed content fails the build instead of degrading silently here.

import { CONTENT_VERSION } from '../Brainstem/version.js';

let bundlePromise = null;

async function getBundle() {
    if (!bundlePromise) {
        bundlePromise = fetch(`dist/content-bundle.json?v=${CONTENT_VERSION}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                return response.json();
            });
    }
    return bundlePromise;
}

export const loader = {
    async loadQuestions(state) {
        try {
            const bundle = await getBundle();
            state.allQuestions = bundle.questions || [];
        } catch (error) {
            console.error('✗ Failed to load questions:', error.message);
            state.allQuestions = [];
            throw error;
        }
        document.getElementById('questionsCount').textContent = state.allQuestions.length;
        document.getElementById('subjectsCount').textContent = new Set(state.allQuestions.map(q => q.subject)).size;
    },

    async loadNotes(state) {
        try {
            const bundle = await getBundle();
            state.allNotes = bundle.notes || [];
        } catch (error) {
            console.error('✗ Failed to load notes:', error.message);
            state.allNotes = [];
            throw error;
        }
        const noteCount = state.allNotes.length;
        const subjectCount = new Set(state.allNotes.map(n => n.subject)).size;
        document.getElementById('notesSubjectsCount').textContent = subjectCount;
        console.log(`  → ${noteCount} notes across ${subjectCount} subjects`);
    },

    async loadFlashcards(state) {
        try {
            const bundle = await getBundle();
            state.allFlashcards = bundle.flashcards || [];
        } catch (error) {
            console.error('✗ Failed to load flashcards:', error.message);
            state.allFlashcards = [];
            throw error;
        }
        const flashcardCount = state.allFlashcards.length;
        const subjectCount = new Set(state.allFlashcards.map(f => f.subject)).size;
        console.log(`✓ Loaded ${flashcardCount} flashcards across ${subjectCount} subjects`);
    },

    // Notes content is now inlined in the bundle at load time -- no more
    // per-note fetch + regex re-parse. Kept as an async method so existing
    // call sites (notes-controller.js) don't need to change.
    async getNoteContent(note) {
        if (note.content !== undefined) return note.content;
        console.warn(`⚠ Note ${note.id} has no inline content in the bundle`);
        return 'Content not found';
    }
};
