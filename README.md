# GoBook - Educational Study Platform

A modern, modular three-tier study application for power plant operator training materials.

## Project Overview

GoBook is an interactive learning platform that provides exam practice, flashcard study, and comprehensive study notes across multiple technical topics. The application uses a clean three-tier architecture that separates concerns and makes it easy to add new content.

## Three-Tier Architecture (Brain Metaphor)

### 🧠 Tier 1: Brain (Application Logic)

**Location:** `Tier 1: Brain/` and `index.html`

The brain tier handles all application logic, organized by neurological function:

#### **Brainstem/** - Vital Initialization & Setup
- `config.js` - Core configuration and settings
- `main.js` - Application startup and coordination

#### **Cortex/** - Thinking & Logic
- `router.js` - Navigation pathways between screens
- `exam-controller.js` - Exam mode functionality
- `flashcard-controller.js` - Flashcard study mode
- `notes-controller.js` - Study notes display logic

#### **Limbic/** - Memory & Data Storage
- `state.js` - Application state management
- `loader.js` - Async data fetching from Tier 2 and Tier 3
- `processor.js` - Data processing and transformation

#### **Senses/** - Perception & Output
- `helpers.js` - Reusable DOM manipulation utilities

**How it works:**
1. User loads `index.html` in browser
2. Browser loads `Tier 1: Brain/Brainstem/main.js` as entry point
3. Brainstem initializes and coordinates all systems
4. Limbic modules fetch metadata synapses from Tier 2: Nervous System
5. Cortex router directs user through application flows
6. Senses render the user interface

### 🔗 Tier 2: Nervous System (Metadata & Connections)

**Location:** `Tier 2: Nervous System/`

Metadata "synapses" that connect the brain to knowledge pathways.

**Files:**

#### `questions-synapses.json`
Maps exam questions to their content files in Tier 3: Pathways.

```json
{
  "questions": [
    {
      "subject": "CP01",
      "contentFile": "Tier 3: Pathways/CP01_Piping/CP01_Piping_questions.txt"
    },
    // ... more subjects
  ]
}
```

#### `notes-synapses.json`
Maps study notes to their content files with metadata.

```json
{
  "notes": [
    {
      "id": 1,
      "subject": "CP01",
      "title": "Note Title",
      "contentFile": "Tier 3: Pathways/CP01_Piping/CP01_Piping_notes.txt",
      "image": "assets/images/diagram.png",
      "imageLabel": "Optional caption"
    },
    // ... more notes (232 total entries)
  ]
}
```

#### `flashcards-synapses.json`
Maps flashcard entries to their content files.

**Key Features:**
- Minimal metadata - only references and IDs
- Decouples structure from content
- Easy to update or add new subjects
- Supports images and captions

### 📚 Tier 3: Pathways (Learning Materials & Knowledge Routes)

**Location:** `Tier 3: Pathways/{SUBJECT}/`

Actual learning content organized by topic in plain text files. Pathways represent different routes students can take through knowledge.

**Structure:**
```
Tier 3: Pathways/
├── CP01_Piping/
│   ├── CP01_Piping_notes.txt
│   ├── CP01_Piping_flashcards.txt
│   └── CP01_Piping_questions.txt
├── CP04_Pumps/
│   ├── CP04_Pumps_notes.txt
│   ├── CP04_Pumps_flashcards.txt
│   └── CP04_Pumps_questions.txt
├── CP06_Heat_Exchangers/
│   ├── CP06_Heat_Exchangers_notes.txt
│   ├── CP06_Heat_Exchangers_flashcards.txt
│   └── CP06_Heat_Exchangers_questions.txt
├── TH01_Measurement/
├── TH02_Thermodynamics_I/
├── TH03_Thermodynamics_II/
├── TH04_Thermodynamics_III/
├── TH05_Thermodynamic_Cycles/
├── TH06B_Fluid_Flow/
└── TH07B_Heat_Transfer/
```

**Content Formats:**

Notes files use `[Note ID: X]` markers:
```
[Note ID: 1]
This is the content for note 1.
Multiple paragraphs and line breaks are preserved.

[Note ID: 2]
Next note content...
```

Questions files use `[Question ID: X]` with JSON:
```
[Question ID: 1]
{"text": "What is...?", "options": [{"letter": "a", "text": "...", "correct": true}, ...], "explanation": "..."}

[Question ID: 2]
...
```

**Total Content:**
- **257 Note Entries** across 11 subjects (including comprehensive notes and flashcards)
- **216 Exam Questions** across 10 subjects
- **CP06 offers three study modes:** 25 comprehensive notes + 47 Q&A flashcards + 25 exam questions (97 total)

## How to Use the Application

### As a Student

1. **Exams Mode** - Take practice exams by subject
   - Select topic (or comprehensive from all topics)
   - Answer multiple-choice questions
   - View score and feedback

2. **Flashcard Mode** - Study with digital flashcards
   - Select topic
   - Front: Study material title
   - Back: Full study material content
   - Navigate through all materials for a topic

3. **Study Notes** - Read comprehensive study materials
   - Select topic
   - View all notes with proper formatting
   - Build understanding through structured materials

### As a Developer

#### Adding New Content

When adding new study materials:

1. **Create Topic Directory** in Tier 3: Pathways:
   ```bash
   mkdir -p "Tier 3: Pathways/NEW_TOPIC"
   ```

2. **Create Content Files**:
   - `Tier 3: Pathways/NEW_TOPIC/NEW_TOPIC_notes.txt` with [Note ID: X] markers
   - `Tier 3: Pathways/NEW_TOPIC/NEW_TOPIC_questions.txt` with [Question ID: X] markers (optional)
   - `Tier 3: Pathways/NEW_TOPIC/NEW_TOPIC_flashcards.txt` with [Note ID: X] and FRONT/BACK format

3. **Update Tier 2: Nervous System Synapses**:
   - Add entries to `Tier 2: Nervous System/questions-synapses.json` (if questions exist)
   - Add entries to `Tier 2: Nervous System/notes-synapses.json` for each note
   - Add entries to `Tier 2: Nervous System/flashcards-synapses.json` for flashcards

4. **Verify**:
   - Content file ID markers must match JSON entry IDs
   - All `contentFile` paths must be relative from repository root
   - Questions must have "subject" field matching JSON entries
   - Flashcard format: `FRONT: Question` on line 2, `BACK: Answer` on line 3

#### File Paths

All file paths in Tier 2 JSON are relative from the repository root:
- ✓ Correct: `"Tier 3: Pathways/CP01_Piping/CP01_Piping_notes.txt"`
- ✗ Wrong: `"./Tier 3: Pathways/CP01_Piping/CP01_Piping_notes.txt"` or `"/Tier 3: Pathways/..."`

#### Data Loading Flow (Neural Cascade)

```
Browser loads index.html
    ↓
Brainstem/main.js (initialization & coordination)
    ↓
Limbic/loader.js (fetch synapses from Nervous System)
    ↓
Tier 2: Nervous System/*.json (synapses provide contentFile paths)
    ↓
Limbic/loader.js (fetch actual content from pathways)
    ↓
Tier 3: Pathways/*.txt (knowledge routes and learning materials)
    ↓
Cortex/router.js (decide which mode to show)
    ↓
Senses/helpers.js & Controllers (render to user)
```

This mirrors how a brain processes information:
- Brainstem wakes the system up
- Limbic system retrieves memories (synapses)
- Cortex routes the information
- Senses display it to the user

## Module System (Brain Organization)

The application uses ES6 modules with `import`/`export`, organized by brain function:

```javascript
// Tier 1: Brain/Brainstem/main.js (entry point)
import { state } from '../Limbic/state.js';
import { loader } from '../Limbic/loader.js';
import { router } from '../Cortex/router.js';
import { exam } from '../Cortex/exam-controller.js';
import { flashcard } from '../Cortex/flashcard-controller.js';
import { notes } from '../Cortex/notes-controller.js';

// Each module exports its functionality
export const exam = { /* ... */ };
```

**Import Patterns:**
- From Brainstem → other tiers: `import { config } from '../Brainstem/config.js'`
- From Cortex → Limbic: `import { loader } from '../Limbic/loader.js'`
- From Cortex → Senses: `import { helpers } from '../Senses/helpers.js'`

## Browser Console Debugging

Open DevTools (F12) and use these commands to debug:

```javascript
// Check total questions loaded
window.app.allQuestions.length

// Check questions by subject
window.app.allQuestions.filter(q => q.subject === 'CP01').length

// Check total notes
window.app.allNotes.length

// Check notes by subject
window.app.allNotes.filter(n => n.subject === 'Pumps').length

// View all subjects
[...new Set(window.app.allNotes.map(n => n.subject))].sort()
```

## Project Statistics

| Metric | Value |
|--------|-------|
| Total Subject Listings | 10 (CP01, TH01-TH05, CP06, Fluid Flow, TH07B, Pumps) |
| Total Note Entries | 232 (comprehensive notes + flashcard entries) |
| Exam Questions | 216+ across all subjects |
| Largest Topic | CP06 (25 comprehensive notes + 47 Q&A flashcards + exam questions) |
| Three-Tier Brain Metaphor | Brain (10 modules) → Nervous System (3 synapses JSON) → Pathways (11+ topic directories) |
| Brain Modules | 10 JS files (Brainstem: 2, Cortex: 4, Limbic: 3, Senses: 1) |
| Metadata Synapses | 3 JSON files (questions, notes, flashcards) |
| Content Pathways | 11 subject directories in Tier 3: Pathways/ |
| Content Files | 30+ .txt files (.notes, .questions, .flashcards per topic) |

## Common Tasks

### Testing a New Subject
1. Add content to `Tier 3: Pathways/{SUBJECT}/`
2. Update `Tier 2: Nervous System/questions-synapses.json` and `notes-synapses.json`
3. Verify ID markers match: `grep "Note ID: 114" "Tier 3: Pathways"/*/Pumps_notes.txt`
4. Open browser, press F12 to check console for errors
5. Test in each mode: Exams, Flashcards, Study Notes

### Checking Data Integrity
```bash
# Verify all content file references exist
cat "Tier 2: Nervous System/notes-synapses.json" | grep contentFile | \
  sed 's/.*"contentFile": "//' | sed 's/".*//' | \
  while read f; do test -f "$f" && echo "✓ $f" || echo "✗ MISSING: $f"; done

# Count notes by subject
grep "\"subject\"" "Tier 2: Nervous System/notes-synapses.json" | sort | uniq -c
```

### Finding Content by ID
```bash
# Find note ID 69 (first CP06 note)
grep -n "Note ID: 69" "Tier 3: Pathways"/*/CP06_notes.txt

# Find question ID 1
grep -n "Question ID: 1" "Tier 3: Pathways"/*/questions.txt

# Find all flashcards with FRONT/BACK format
grep -l "FRONT:" "Tier 3: Pathways"/*/*.txt
```

## Technology Stack

- **Frontend Framework:** Vanilla JavaScript (ES6 modules)
- **UI:** HTML5 + CSS3 with responsive design
- **Data Format:** JSON (metadata) + Plain Text (content)
- **Storage:** Browser's Fetch API with cache-busting
- **State Management:** Global `window.app` object

## Architecture Benefits

✅ **Separation of Concerns** - Each layer has a single responsibility
✅ **Scalability** - Adding new content only requires adding files
✅ **Maintainability** - Changes in one layer don't affect others
✅ **Clarity** - File structure immediately shows project organization
✅ **Error Recovery** - Content updates can't corrupt application logic
✅ **Developer Experience** - Easy to find and modify specific features

## Future Enhancements

- [ ] User progress tracking (localStorage)
- [ ] Question difficulty ratings
- [ ] Performance analytics
- [ ] Spaced repetition algorithm for flashcards
- [ ] Keyboard shortcuts for faster navigation
- [ ] Dark mode theme
- [ ] PDF export for study materials
- [ ] Search/filtering across all content
- [ ] User authentication and accounts

---

**Last Updated:** July 25, 2026  
**Project Status:** Active - Ready for new content and improvements
