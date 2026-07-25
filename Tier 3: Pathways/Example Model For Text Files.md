# Example Model For Text Files - Tier 3 Format Specification

This file demonstrates the three required text file formats for each topic in Tier 3.
All topics must follow this structure.

## ⚠️ IMPORTANT: Naming Convention Requirements

**ALL Tier 3 directories and files MUST follow the naming format below.**

Directories must be named: **`{Code}_{Subject}/`**
Files must be named: **`{Code}_{Subject}_{type}.txt`**

Examples:
- Directory: `CP06_Heat_Exchangers/`
- Files: `CP06_Heat_Exchangers_notes.txt`, `CP06_Heat_Exchangers_flashcards.txt`, `CP06_Heat_Exchangers_questions.txt`

Failure to follow this naming convention will result in broken file references and the content will not load in the application.

## Quick Reference: Tier 3 File Structure

### 1. Comprehensive Notes
- **File naming:** `{Code}_{Subject}_notes.txt`
- **Example:** `TH06_Pump_notes.txt`
- **Content:** Full, detailed study material

### 2. Flashcards
- **2.1 File naming:** `{Code}_{Subject}_flashcards.txt`
  - **Example:** `TH06_Pump_flashcards.txt`
- **2.2** Content follows the learning objectives being asked
- **2.3** Flashcards must be maintained simple
- **2.4** Front of flashcard: The objective being asked as a question
- **2.5** Back of flashcard: A simple answer to remember

### 3. Test Questions
- **3.1 File naming:** `{Code}_{Subject}_questions.txt`
  - **Example:** `TH06_Pump_questions.txt`
- **3.2** This file will hold the subject's questions and answers
- **3.3** This file will always be modified with newer answers also (updatable)

---

## 1. Comprehensive Notes File Format

**Filename:** `{Code}_{Subject}_notes.txt`  
**Example:** `TH06_Pump_notes.txt`

**Purpose:** Full, detailed study material for comprehensive learning

### Format:
```
[Note ID: 1]
First comprehensive note content here.
Can include multiple paragraphs.
Can use bullet points:
• Point 1
• Point 2
• Point 3

Detailed explanations with context and background information.

[Note ID: 2]
Second comprehensive note content.
Full definitions and thorough explanations.

[Note ID: 3]
Additional comprehensive notes continue in this format...
```

### Key Characteristics:
- Each note starts with `[Note ID: X]`
- Sequential numbering (1, 2, 3, etc.)
- Full, detailed content for each ID
- Multiple paragraphs per note supported
- Bullet points and formatting preserved
- Used for "Study Notes" mode in the application

---

## 2. Flashcards File Format

**Filename:** `{Code}_{Subject}_flashcards.txt`  
**Example:** `TH06_Pump_flashcards.txt`

**Purpose:** Simple, focused flashcards aligned with learning objectives for memory and recall

### Format:
```
[Note ID: 1]
What is the main function of a pump?
A pump moves fluids from one location to another by converting mechanical energy into flow energy.

[Note ID: 2]
What are the two main categories of pumps?
Kinetic pumps (dynamic) and positive displacement pumps.

[Note ID: 3]
What is cavitation in pump operation?
Formation of vapor bubbles when pressure drops below saturation pressure, causing noise and damage.

[Note ID: 4]
Define NPSH (Net Positive Suction Head)?
Available absolute pressure at pump inlet minus vapor pressure of the fluid.

[Note ID: 5]
What is the purpose of cooling tower fill material?
Increases surface area for heat exchange between water and air.
```

### Key Characteristics:
- Each flashcard starts with `[Note ID: X]`
- First line after ID: Question based on learning objective
- Following lines: Simple, concise answer (easy to remember)
- Maintained simple and focused
- One concept/objective per card
- **Front:** Question
- **Back:** Answer (when flipped in app)
- Used for "Flashcards" mode in the application

---

## 3. Test Questions File Format

**Filename:** `{Code}_{Subject}_questions.txt`  
**Example:** `TH06_Pump_questions.txt`

**Purpose:** Multiple choice exam questions with answers and explanations

### Format:
```
[Question ID: 1]
{"id":1,"subject":"TH06","text":"What is the primary purpose of a pump?","options":[{"letter":"a","text":"To measure pressure","correct":false},{"letter":"b","text":"To move fluids from one location to another","correct":true},{"letter":"c","text":"To store fluids","correct":false},{"letter":"d","text":"To regulate temperature","correct":false}],"explanation":"The fundamental purpose of all pumps is to move fluids (and sometimes fluid-solid mixtures) by converting mechanical energy into fluid flow energy."}

[Question ID: 2]
{"id":2,"subject":"TH06","text":"Which type of pump is best for high-volume, low-pressure applications?","options":[{"letter":"a","text":"Centrifugal pump","correct":true},{"letter":"b","text":"Reciprocating pump","correct":false},{"letter":"c","text":"Gear pump","correct":false},{"letter":"d","text":"Jet pump","correct":false}],"explanation":"Centrifugal (kinetic) pumps are ideal for high-volume, low-pressure applications like circulating water systems."}

[Question ID: 3]
{"id":3,"subject":"TH06","text":"What does NPSH stand for?","options":[{"letter":"a","text":"Net Positive Suction Head","correct":true},{"letter":"b","text":"Normal Pump Suction Height","correct":false},{"letter":"c","text":"Negative Pressure Safety Head","correct":false},{"letter":"d","text":"Net Pump System Head","correct":false}],"explanation":"NPSH (Net Positive Suction Head) is the available absolute pressure at the pump inlet minus the vapor pressure of the fluid."}

[Question ID: 4]
{"id":4,"subject":"TH06","text":"What is cavitation?","options":[{"letter":"a","text":"Rust formation on pump impeller","correct":false},{"letter":"b","text":"Formation of vapor bubbles due to pressure drop below saturation pressure","correct":true},{"letter":"c","text":"Leakage from pump seal","correct":false},{"letter":"d","text":"Thermal expansion of pump housing","correct":false}],"explanation":"Cavitation occurs when local pressure drops below the fluid's vapor pressure, causing bubble formation, which implodes and causes damage."}

[Question ID: 5]
{"id":5,"subject":"TH06","text":"How do you prevent cavitation in pump operation?","options":[{"letter":"a","text":"Increase discharge pressure","correct":false},{"letter":"b","text":"Maintain adequate NPSH by keeping suction pressure high and temperature low","correct":true},{"letter":"c","text":"Use a larger diameter discharge pipe","correct":false},{"letter":"d","text":"Reduce fluid velocity","correct":false}],"explanation":"Cavitation is prevented by maintaining adequate Net Positive Suction Head (NPSH) - ensuring sufficient pressure at the pump inlet above vapor pressure."}
```

### Key Characteristics:
- Each question starts with `[Question ID: X]`
- Followed by one complete JSON object per question
- **JSON fields required:**
  - `id`: Question number (integer)
  - `subject`: Topic code (string, e.g., "TH06")
  - `text`: The question text (string)
  - `options`: Array of 4 answer options
    - `letter`: "a", "b", "c", or "d"
    - `text`: Answer option text
    - `correct`: true/false boolean
  - `explanation`: Detailed explanation (string)
- Each question on its own line with JSON on one line
- Used for "Exams" mode in the application

---

## Naming Convention Summary

### Directory Naming Format
All topic directories in Tier 3 must follow this naming format:

**Format:** `{Code}_{Subject}/`

**Examples:**
- `CP01_Piping/`
- `TH06_Pump/` or `CP06_Heat_Exchangers/`
- `Fluid_Flow/` (alternative with underscores for multi-word names)

### File Naming Format
All three files for a topic follow similar naming:

**Format:** `{Code}_{Subject}_{type}.txt`

**Examples:**
- `TH06_Pump_notes.txt` (Comprehensive notes)
- `TH06_Pump_flashcards.txt` (Flashcards with objectives)
- `TH06_Pump_questions.txt` (Test questions)

**OR**

- `CP06_Heat_Exchangers_notes.txt`
- `CP06_Heat_Exchangers_flashcards.txt`
- `CP06_Heat_Exchangers_questions.txt`

**Complete Directory Structure Example:**
```
Tier 3/
├── CP06_Heat_Exchangers/
│   ├── CP06_Heat_Exchangers_notes.txt
│   ├── CP06_Heat_Exchangers_flashcards.txt
│   └── CP06_Heat_Exchangers_questions.txt
├── TH06_Pump/
│   ├── TH06_Pump_notes.txt
│   ├── TH06_Pump_flashcards.txt
│   └── TH06_Pump_questions.txt
└── CP01_Piping/
    ├── CP01_Piping_notes.txt
    ├── CP01_Piping_flashcards.txt
    └── CP01_Piping_questions.txt
```

---

## Directory Structure

```
Tier 3/
├── CP01/
│   ├── CP01_Piping_notes.txt
│   ├── CP01_Piping_flashcards.txt
│   └── CP01_Piping_questions.txt
│
├── TH06/
│   ├── TH06_Pump_notes.txt
│   ├── TH06_Pump_flashcards.txt
│   └── TH06_Pump_questions.txt
│
└── [Other topics follow same pattern]
```

---

## How These Files Are Used in the Application

Tier 2 (notes.json) references these files by subject:

### Flashcards Mode
- Loads all entries with subject matching a topic
- Reads from `{Topic}_flashcards.txt`
- Displays one "TH06 Pump" button per topic
- User sees flashcard front (question) → flips to back (answer)

### Study Notes Mode
- Loads all entries with subject matching a topic
- Reads from `{Topic}_notes.txt`
- Displays one "TH06 Pump" button per topic
- User sees comprehensive notes with full content

### Exams Mode
- Loads all entries with subject matching a topic
- Reads from `{Topic}_questions.txt`
- Displays one "TH06 Pump" button per topic
- User sees multiple choice questions with options and explanations

---

## Image and Diagram Support

Each topic can include diagrams and visual aids to enhance learning.

### Image Directory Structure

Images for each topic should be organized in a dedicated images subfolder:

```
Tier 3/
├── CP01_Piping/
│   ├── CP01_Piping_notes.txt
│   ├── CP01_Piping_flashcards.txt
│   ├── CP01_Piping_questions.txt
│   └── images/
│       ├── valve-types.png
│       ├── pressure-types.svg
│       ├── pipe-support-systems.svg
│       └── thermal-expansion.svg
│
├── TH01_Measurement/
│   ├── TH01_Measurement_notes.txt
│   ├── TH01_Measurement_flashcards.txt
│   ├── TH01_Measurement_questions.txt
│   └── images/
│       ├── temperature-scales.svg
│       ├── unit-conversion-chart.svg
│       └── system-types.svg
│
└── [Other topics follow same pattern]
```

### Linking Images in Notes

Images should be referenced in the metadata file (Tier 2) with associations to specific note IDs. The application will display images inline when viewing comprehensive notes.

### Recommended Image Types

- **Diagrams:** System schematics, flow charts, component layouts
- **Charts:** Unit conversion tables, temperature comparison scales, phase diagrams
- **Illustrations:** Equipment designs, cross-sections, operational sequences
- **Graphs:** Performance curves, efficiency charts, relationships between variables

### Image File Naming

Images should be named descriptively related to their content:
- `valve-types.svg` - types of valves used in piping
- `temperature-scales.svg` - comparison of temperature measurement scales
- `pt-phase-diagram.svg` - pressure-temperature phase diagram for water
- `thermal-expansion.svg` - thermal expansion in piping systems

---

## Comprehensive Notes Format with Images

Enhanced notes files can now reference images through the metadata system:

### Example with Image References

In Tier 2 (notes-synapses.json):
```json
{
  "id": 14,
  "subject": "TH03",
  "title": "Five States of Water",
  "contentFile": "Tier 3: Pathways/TH03_Thermodynamics_II/TH03_Thermodynamics_II_notes.txt",
  "image": "Tier 3: Pathways/TH03_Thermodynamics_II/images/five-states-water.svg",
  "imageLabel": "Five States of Water Diagram"
}
```

The application will display the image above or below the note content with the provided label.

---

## Summary

Each topic in Tier 3 **MUST** have **THREE** txt files:

1. **`{Topic}_notes.txt`** - Comprehensive study materials (detailed)
2. **`{Topic}_flashcards.txt`** - Simple Q&A flashcards (focused, easy to remember)
3. **`{Topic}_questions.txt`** - Exam questions (multiple choice with explanations)

### Optional Image Support

4. **`images/`** - Directory containing diagrams, charts, and visual aids
   - Each image referenced in Tier 2 metadata
   - Displayed inline with notes during study

### Three-Tier Architecture
- **Tier 1:** Application logic (reads/displays content)
- **Tier 2:** Metadata (JSON references to files AND images)
- **Tier 3:** Content files (actual learning materials + images subfolder)

### Result
One button per topic per mode, with clean separation of content types and integrated visual aids for enhanced learning.
