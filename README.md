# GoBook - Educational Study Platform

A modern, modular three-tier study application for power plant operator training materials.

## Project Overview

GoBook is an interactive learning platform that provides exam practice, flashcard study, and comprehensive study notes across multiple technical topics. The application uses a clean three-tier architecture that separates concerns and makes it easy to add new content.

## Three-Tier Architecture

### 🎯 Tier 1: Application Logic (Controller Layer)

**Location:** `Tier 1/` and `index.html`

The application logic layer handles user interface, screen navigation, and data management.

**Files:**
- `index.html` - Entry point with HTML structure and styling
- `app.js` - Core application state and initialization
- `ui.js` - Screen navigation and routing logic
- `ui-utils.js` - Reusable DOM manipulation utilities
- `exam.js` - Exam mode functionality
- `flashcard.js` - Flashcard study mode
- `notes.js` - Study notes display logic
- `data-loader.js` - Async data fetching from Tier 2 and Tier 3
- `data-filter.js` - Pure utility functions for filtering data

**How it works:**
1. User loads `index.html` in browser
2. `app.js` imports all modules and initializes on page load
3. `data-loader.js` fetches JSON metadata from Tier 2
4. Content file paths from JSON are used to load actual content from Tier 3
5. UI modules render screens and handle user interactions

### 📊 Tier 2: Metadata (Data Manager Layer)

**Location:** `Tier 2/`

Metadata files that index and reference all learning content.

**Files:**

#### `questions.json`
Maps exam questions to their content files in Tier 3.

```json
{
  "questions": [
    {
      "subject": "CP01",
      "contentFile": "Tier 3/CP01/CP01_questions.txt"
    },
    // ... more subjects
  ]
}
```

Current subjects: CP01, TH01, TH02, TH03, TH04, TH05, Fluid Flow (TH06B), TH07B, Pumps

#### `notes.json`
Maps study notes to their content files with metadata.

```json
{
  "notes": [
    {
      "id": 1,
      "subject": "CP01",
      "title": "Note Title",
      "contentFile": "Tier 3/CP01/CP01_notes.txt",
      "image": "assets/images/diagram.png",
      "imageLabel": "Optional caption"
    },
    // ... more notes (143 total)
  ]
}
```

**Key Features:**
- Minimal metadata - only references and IDs
- Decouples structure from content
- Easy to update or add new subjects
- Supports images and captions

### 📚 Tier 3: Content (Learning Materials)

**Location:** `Tier 3/{SUBJECT}/`

Actual learning content organized by topic in plain text files.

**Structure:**
```
Tier 3/
├── CP01/                           # Piping
│   ├── CP01_notes.txt             # 5 study notes
│   └── CP01_questions.txt         # 30 exam questions
├── TH01/ through TH05/            # Thermodynamics I-V
├── CP06/                          # Heat Exchangers & Condensers
│   └── CP06_notes.txt             # 25 study notes (notes-only subject)
├── Fluid_Flow/                    # Fluid Flow (TH06B)
│   ├── Fluid_Flow_notes.txt       # 45 study notes
│   └── Fluid_Flow_TH06B__questions.txt  # 37 exam questions
├── Pumps/                         # Pumps (CP04)
│   ├── Pumps_notes.txt            # 30 study notes
│   └── Pumps_questions.txt        # 20 exam questions
└── TH07B/                         # TH07B
    ├── TH07B_notes.txt            # 20 study notes
    └── TH07B_questions.txt        # 25 exam questions
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
- **143 Study Notes** across 10 subjects
- **191 Exam Questions** across 9 subjects

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

1. **Create Topic Directory** in Tier 3:
   ```bash
   mkdir -p Tier 3/NEW_TOPIC
   ```

2. **Create Content Files**:
   - `Tier 3/NEW_TOPIC/NEW_TOPIC_notes.txt` with [Note ID: X] markers
   - `Tier 3/NEW_TOPIC/NEW_TOPIC_questions.txt` with [Question ID: X] markers (optional)

3. **Update Tier 2 Metadata**:
   - Add entries to `questions.json` (if questions exist)
   - Add entries to `notes.json` for each note

4. **Verify**:
   - Content file ID markers must match JSON entry IDs
   - All `contentFile` paths must be relative from repository root
   - Questions must have "subject" field matching JSON entries

#### File Paths

All file paths in Tier 2 JSON are relative from the repository root:
- ✓ Correct: `"Tier 3/CP01/CP01_notes.txt"`
- ✗ Wrong: `"./Tier 3/CP01/CP01_notes.txt"` or `"/Tier 3/CP01/CP01_notes.txt"`

#### Data Loading Flow

```
index.html
    ↓
Tier 1/app.js (init)
    ↓
Tier 1/data-loader.js (fetch JSON)
    ↓
Tier 2/questions.json & notes.json (read contentFile paths)
    ↓
Tier 3/*.txt files (fetch actual content)
    ↓
Tier 1/ui.js & exam.js & notes.js (render to user)
```

## Module System

The application uses ES6 modules with `import`/`export`:

```javascript
// Tier 1/app.js
import { dataLoader } from './data-loader.js';
import { ui } from './ui.js';
// ... more imports

// Each module exports its functionality
export const exam = { /* ... */ };
```

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
| Total Subjects | 10 |
| Study Notes | 143 |
| Exam Questions | 191 |
| Largest Topic | Fluid Flow (45 notes, 37 questions) |
| Modules | 8 JS files + index.html |
| Content Files | 19 .txt files |

## Common Tasks

### Testing a New Subject
1. Add content to Tier 3/{SUBJECT}/
2. Update Tier 2/questions.json and notes.json
3. Verify ID markers match: `grep "Note ID: 114" Tier\ 3/*/Pumps_notes.txt`
4. Open browser, press F12 to check console for errors
5. Test in each mode: Exams, Flashcards, Study Notes

### Checking Data Integrity
```bash
# Verify all content file references exist
node -e "const q=require('./Tier\ 2/questions.json'); q.questions.forEach(x => console.log(require('fs').existsSync(x.contentFile) ? '✓' : '✗ ' + x.contentFile))"

# Count notes by subject
grep "\"subject\"" Tier\ 2/notes.json | sort | uniq -c
```

### Finding Content by ID
```bash
# Find note ID 69 (first CP06 note)
grep -n "Note ID: 69" Tier\ 3/*/CP06_notes.txt

# Find question ID 1
grep -n "Question ID: 1" Tier\ 3/*/questions.txt
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
