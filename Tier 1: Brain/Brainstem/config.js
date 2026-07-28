// Configuration - centralized settings and constants

export const config = {
    // Cache settings. Content is now served as a single precompiled bundle
    // (dist/content-bundle.json) versioned by git short-sha (see version.js),
    // so the fetch URL only changes when content actually changes -- not on
    // every single page load like the old Date.now() cache-buster did. This
    // lets the browser (and future service worker) cache it properly.
    cache: {
        enabled: true,
        busting: false,
    },

    // Data paths. Tier 2 metadata files are no longer fetched at runtime --
    // they're consumed by scripts/build-content.js at build time and folded
    // into dist/content-bundle.json. Kept here only for reference/tooling.
    paths: {
        metadata: {
            questions: 'Tier%202:%20Nervous%20System/questions-synapses.json',
            notes: 'Tier%202:%20Nervous%20System/notes-synapses.json',
            flashcards: 'Tier%202:%20Nervous%20System/flashcards-synapses.json',
        },
        content: 'Tier%203:%20Pathways/',  // Base path for content files
        bundle: 'dist/content-bundle.json',
    },

    // UI settings
    ui: {
        maxDisplayNameLength: 100,
        progressUpdateInterval: 100,
    },

    // Exam settings
    exam: {
        defaultQuestionCount: 10,
        passingScore: 60,
        excellentScore: 80,
    },

    // Feature flags
    features: {
        comprehensiveExam: true,
        flashcardMode: true,
        notesMode: true,
    },

    // Logging
    logging: {
        enabled: true,
        verbose: false,  // Set to true for detailed logs
    }
};
