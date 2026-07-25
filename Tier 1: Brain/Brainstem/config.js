// Configuration - centralized settings and constants

export const config = {
    // Cache settings
    cache: {
        enabled: true,
        busting: true,  // Add timestamp to fetch URLs to bypass cache
    },

    // Data paths (Tier 2: Nervous System metadata files)
    paths: {
        metadata: {
            questions: 'Tier 2: Nervous System/questions-synapses.json',
            notes: 'Tier 2: Nervous System/notes-synapses.json',
            flashcards: 'Tier 2: Nervous System/flashcards-synapses.json',
        },
        content: 'Tier 3: Library/',  // Base path for content files
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
    },

    // Get cache-busting timestamp
    getCacheBuster() {
        return this.cache.busting ? '?v=' + Date.now() : '';
    },

    // Get full metadata path with cache buster
    getMetadataPath(type) {
        const path = this.paths.metadata[type];
        return path + this.getCacheBuster();
    }
};
