/**
 * Markdown Parser for GoBook
 * Parses markdown files for notes, flashcards, and questions
 * Extracts content structured with ## ID: markers
 */

export async function parseMarkdownNotes(mdFile) {
  try {
    const response = await fetch(mdFile + '?v=' + Date.now());
    if (!response.ok) throw new Error(`Failed to fetch ${mdFile}`);

    const markdown = await response.text();
    const notes = [];

    // Split by ## Note ID: pattern (case-insensitive for robustness)
    const notePattern = /^##\s+(?:Note\s+)?ID:\s*(\d+(?:\.\d+)?)/mi;
    const blocks = markdown.split(notePattern);

    // Process each note (skip first empty split)
    for (let i = 1; i < blocks.length; i += 2) {
      const id = blocks[i].trim();
      const content = blocks[i + 1];

      if (!content) continue;

      // Extract title from ### heading
      const titleMatch = content.match(/^###\s+(.+?)(?:\n|$)/m);
      const title = titleMatch ? titleMatch[1].trim() : `Note ${id}`;

      // Extract image references using ![alt](path) pattern
      const imageMatches = content.match(/!\[([^\]]*)\]\(([^\)]+)\)/g) || [];
      const images = imageMatches.map(img => {
        const match = img.match(/!\[([^\]]*)\]\(([^\)]+)\)/);
        return {
          alt: match[1] || 'Image',
          path: match[2]
        };
      });

      // Clean markdown formatting for display
      const cleanContent = cleanMarkdown(content);

      notes.push({
        id: parseFloat(id),
        title: title,
        content: cleanContent,
        images: images,
        rawMarkdown: content
      });
    }

    return notes;
  } catch (error) {
    console.error('Error parsing markdown notes:', error);
    return [];
  }
}

export async function parseMarkdownFlashcards(mdFile) {
  try {
    const response = await fetch(mdFile + '?v=' + Date.now());
    if (!response.ok) throw new Error(`Failed to fetch ${mdFile}`);

    const markdown = await response.text();
    const flashcards = [];

    // Split by ## Flashcard ID: pattern
    const cardPattern = /^##\s+(?:Flashcard\s+)?ID:\s*(\d+)/mi;
    const blocks = markdown.split(cardPattern);

    // Process each flashcard
    for (let i = 1; i < blocks.length; i += 2) {
      const id = blocks[i].trim();
      const content = blocks[i + 1];

      if (!content) continue;

      // Extract front (question) from ### heading
      const frontMatch = content.match(/^###\s+(.+?)(?:\n|$)/m);
      const front = frontMatch ? frontMatch[1].trim() : `Card ${id}`;

      // Extract back (answer) - everything after front that's not another heading
      let back = content.substring(content.indexOf('\n') + 1);
      // Remove any following ## headings
      back = back.split(/^##\s+/m)[0].trim();

      flashcards.push({
        id: parseInt(id),
        front: front,
        back: back,
        rawMarkdown: content
      });
    }

    return flashcards;
  } catch (error) {
    console.error('Error parsing markdown flashcards:', error);
    return [];
  }
}

export async function parseMarkdownQuestions(mdFile) {
  try {
    const response = await fetch(mdFile + '?v=' + Date.now());
    if (!response.ok) throw new Error(`Failed to fetch ${mdFile}`);

    const markdown = await response.text();
    const questions = [];

    // Split by ## Question ID: pattern
    const qPattern = /^##\s+(?:Question\s+)?ID:\s*(\d+)/mi;
    const blocks = markdown.split(qPattern);

    // Process each question
    for (let i = 1; i < blocks.length; i += 2) {
      const id = blocks[i].trim();
      const content = blocks[i + 1];

      if (!content) continue;

      // Extract question text from ### Question:
      const questionMatch = content.match(/^###\s+Question:\s*(.+?)(?:\n|$)/m);
      const questionText = questionMatch ? questionMatch[1].trim() : '';

      // Extract all options (lines starting with - a), - b), etc.)
      const optionMatches = content.match(/^-\s+([a-d]\))\s+(.+?)$/gm) || [];
      const options = optionMatches.map(opt => {
        const match = opt.match(/^-\s+([a-d])\)\s+(.+?)$/m);
        return {
          letter: match[1],
          text: match[2].trim()
        };
      });

      // Extract correct answer
      const correctMatch = content.match(/\*\*Correct:\*\*\s+([a-d])/m);
      const correctAnswer = correctMatch ? correctMatch[1] : null;

      // Extract explanation
      const explanationMatch = content.match(/\*\*Explanation:\*\*\s+(.+?)(?=\n\n---|\n*$)/s);
      const explanation = explanationMatch ? explanationMatch[1].trim() : '';

      questions.push({
        id: parseInt(id),
        text: questionText,
        options: options,
        correct: correctAnswer,
        explanation: explanation,
        rawMarkdown: content
      });
    }

    return questions;
  } catch (error) {
    console.error('Error parsing markdown questions:', error);
    return [];
  }
}

/**
 * Clean markdown formatting for display
 * Removes markdown syntax while preserving content structure
 */
function cleanMarkdown(markdown) {
  let clean = markdown;

  // Remove frontmatter (### Question:, ### Flashcard:, etc.)
  clean = clean.replace(/^###\s+[^:]+:\s*/m, '');

  // Remove heading levels and preserve text
  clean = clean.replace(/^###\s+/gm, '');      // ### -> plain text
  clean = clean.replace(/^##\s+/gm, '');       // ## -> plain text
  clean = clean.replace(/^#\s+/gm, '');        // # -> plain text

  // Remove markdown formatting but keep content
  clean = clean.replace(/\*\*(.+?)\*\*/g, '$1');  // Remove bold markers **text**
  clean = clean.replace(/\*(.+?)\*/g, '$1');      // Remove italic markers *text*
  clean = clean.replace(/`(.+?)`/g, '$1');        // Remove code markers `text`

  // Replace image references with descriptive markers
  clean = clean.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '\n[IMAGE: $1 ($2)]\n');

  // Remove markdown link syntax but keep text and URL
  clean = clean.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$1 ($2)');

  // Clean up excessive whitespace
  clean = clean.replace(/^\s*\n/gm, '\n');    // Remove blank lines with only whitespace
  clean = clean.replace(/\n\n\n+/g, '\n\n'); // Max 2 consecutive newlines

  return clean.trim();
}

/**
 * Extract code blocks from markdown while preserving formatting
 */
export function extractCodeBlocks(markdown) {
  const codeBlocks = [];
  const codePattern = /```([a-z]*)\n([\s\S]*?)```/g;
  let match;

  while ((match = codePattern.exec(markdown)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }

  return codeBlocks;
}

/**
 * Extract tables from markdown
 */
export function extractTables(markdown) {
  const tables = [];
  const tablePattern = /\|.+\|.*\n\|[-:\s|]+\|[\s\S]*?\n(?!\|)/g;
  let match;

  while ((match = tablePattern.exec(markdown)) !== null) {
    const tableMarkdown = match[0];
    const rows = tableMarkdown
      .split('\n')
      .filter(line => line.trim().startsWith('|'))
      .map(line =>
        line
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell)
      );

    if (rows.length > 0) {
      tables.push(rows);
    }
  }

  return tables;
}
