#!/usr/bin/env node
// Build-time content compiler.
//
// Reads Tier 2 metadata + Tier 3 YAML-frontmatter content files and produces
// a single precompiled bundle at dist/content-bundle.json. The running app
// (loader.js) just fetches this one file -- no client-side markdown parsing,
// no per-note network round trips, no way for a malformed entry to silently
// degrade at runtime. A malformed entry throws here, at build time, instead.
//
// Run from repo root: node scripts/build-content.js
// Exits 1 with a clear message on any content problem.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = path.resolve(__dirname, '..');
const TIER2 = path.join(REPO_ROOT, 'Tier 2: Nervous System');
const DIST = path.join(REPO_ROOT, 'dist');

let errorCount = 0;
function fail(msg) {
    errorCount++;
    console.error(`✗ ${msg}`);
}

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

// Splits a Tier 3 file into { frontmatter, body } entries. Each entry is
// fenced by a line of exactly '---' opening and closing the YAML block.
function parseEntries(text, filePath) {
    const lines = text.split('\n');
    const entries = [];
    let i = 0;
    // skip the leading '# Title' line and blank lines before the first fence
    while (i < lines.length && lines[i].trim() !== '---') i++;

    while (i < lines.length) {
        if (lines[i].trim() !== '---') { i++; continue; }
        const yamlStart = i + 1;
        let j = yamlStart;
        while (j < lines.length && lines[j].trim() !== '---') j++;
        if (j >= lines.length) {
            throw new Error(`${filePath}: unterminated YAML frontmatter fence starting at line ${i + 1}`);
        }
        const yamlText = lines.slice(yamlStart, j).join('\n');
        let frontmatter;
        try {
            frontmatter = yaml.load(yamlText) || {};
        } catch (e) {
            throw new Error(`${filePath}: invalid YAML in frontmatter at line ${yamlStart + 1}: ${e.message}`);
        }
        const bodyStart = j + 1;
        let bodyEnd = bodyStart;
        while (bodyEnd < lines.length && lines[bodyEnd].trim() !== '---') bodyEnd++;
        const body = lines.slice(bodyStart, bodyEnd).join('\n').trim();
        entries.push({ frontmatter, body, line: i + 1 });
        i = bodyEnd;
    }
    return entries;
}

function extractSection(body, heading) {
    const pattern = new RegExp(`^###\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n###\\s+|$)`, 'm');
    const m = body.match(pattern);
    return m ? m[1].trim() : null;
}

// ---- Notes -----------------------------------------------------------

function buildNotes() {
    const refs = readJSON(path.join(TIER2, 'notes-synapses.json')).notes;
    const fileCache = new Map();
    const notes = [];

    for (const ref of refs) {
        const contentPath = path.join(REPO_ROOT, ref.contentFile);
        if (!fileCache.has(contentPath)) {
            if (!fs.existsSync(contentPath)) {
                fail(`Notes: contentFile does not exist: ${ref.contentFile}`);
                continue;
            }
            const text = fs.readFileSync(contentPath, 'utf-8');
            fileCache.set(contentPath, parseEntries(text, ref.contentFile));
        }
        const entries = fileCache.get(contentPath);
        const entry = entries.find(e => e.frontmatter.id === ref.id);
        if (!entry) {
            fail(`Notes: id ${ref.id} (subject ${ref.subject}) not found in ${ref.contentFile} -- Tier 2/Tier 3 have drifted apart`);
            continue;
        }
        if (!entry.body) {
            fail(`Notes: id ${ref.id} in ${ref.contentFile} has an empty body`);
            continue;
        }
        notes.push({
            id: ref.id,
            subject: ref.subject,
            title: ref.title,
            contentFile: ref.contentFile,
            content: entry.body,
            section: entry.frontmatter.section || null,
            objective: entry.frontmatter.objective || null,
            ...(ref.image ? { image: ref.image, imageLabel: ref.imageLabel } : {})
        });
    }
    return notes;
}

// ---- Flashcards --------------------------------------------------------

function buildFlashcards() {
    const refs = readJSON(path.join(TIER2, 'flashcards-synapses.json')).flashcards;
    const flashcards = [];

    for (const ref of refs) {
        const contentPath = path.join(REPO_ROOT, ref.contentFile);
        if (!fs.existsSync(contentPath)) {
            fail(`Flashcards: contentFile does not exist: ${ref.contentFile}`);
            continue;
        }
        const text = fs.readFileSync(contentPath, 'utf-8');
        const entries = parseEntries(text, ref.contentFile);
        if (entries.length === 0) {
            fail(`Flashcards: 0 cards parsed from ${ref.contentFile}`);
        }
        if (entries.length !== ref.count) {
            fail(`Flashcards: ${ref.contentFile} has ${entries.length} cards but flashcards-synapses.json declares count ${ref.count}`);
        }
        for (const entry of entries) {
            const front = extractSection(entry.body, 'Question');
            const back = extractSection(entry.body, 'Answer');
            if (!front) {
                fail(`Flashcards: id ${entry.frontmatter.id} in ${ref.contentFile} has no "### Question" section`);
                continue;
            }
            if (!back) {
                fail(`Flashcards: id ${entry.frontmatter.id} in ${ref.contentFile} has no "### Answer" section (empty back)`);
                continue;
            }
            flashcards.push({
                id: entry.frontmatter.id,
                subject: ref.subject,
                contentFile: ref.contentFile,
                front,
                back
            });
        }
    }
    return flashcards;
}

// ---- Questions ----------------------------------------------------------

function buildQuestions() {
    const refs = readJSON(path.join(TIER2, 'questions-synapses.json')).questions;
    const questions = [];

    for (const ref of refs) {
        const contentPath = path.join(REPO_ROOT, ref.contentFile);
        if (!fs.existsSync(contentPath)) {
            fail(`Questions: contentFile does not exist: ${ref.contentFile}`);
            continue;
        }
        const text = fs.readFileSync(contentPath, 'utf-8');
        const entries = parseEntries(text, ref.contentFile);
        if (entries.length === 0) {
            fail(`Questions: 0 questions parsed from ${ref.contentFile}`);
        }
        for (const entry of entries) {
            const loc = `id ${entry.frontmatter.id} in ${ref.contentFile}`;
            const text_ = extractSection(entry.body, 'Question');
            const explanation = extractSection(entry.body, 'Explanation') || '';
            const optionsObj = entry.frontmatter.options;
            const correct = entry.frontmatter.correct;

            if (!text_) { fail(`Questions: ${loc} has no "### Question" section`); continue; }
            if (!optionsObj || typeof optionsObj !== 'object') {
                fail(`Questions: ${loc} has no "options" map in frontmatter`); continue;
            }
            const letters = Object.keys(optionsObj).sort();
            if (letters.length < 2) {
                fail(`Questions: ${loc} has fewer than 2 options (${letters.length})`);
            }
            if (!correct) {
                fail(`Questions: ${loc} has no "correct" field set`);
            } else if (!letters.includes(correct)) {
                fail(`Questions: ${loc} marks '${correct}' correct but no option has that letter (options: ${letters.join(', ')})`);
            }
            questions.push({
                id: entry.frontmatter.id,
                subject: ref.subject,
                contentFile: ref.contentFile,
                text: text_,
                options: letters.map(letter => ({ letter, text: optionsObj[letter] })),
                correct: correct || null,
                explanation
            });
        }
    }
    return questions;
}

function getVersion() {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: REPO_ROOT }).toString().trim();
    } catch (e) {
        return 'dev-' + Date.now();
    }
}

function main() {
    console.log('Building content bundle...');
    const notes = buildNotes();
    const flashcards = buildFlashcards();
    const questions = buildQuestions();

    if (errorCount > 0) {
        console.error(`\nBuild FAILED -- ${errorCount} content problem(s) found. Fix the content, not the parser.`);
        process.exit(1);
    }

    const version = getVersion();
    const bundle = { version, builtAt: new Date().toISOString(), notes, flashcards, questions };

    fs.mkdirSync(DIST, { recursive: true });
    fs.writeFileSync(path.join(DIST, 'content-bundle.json'), JSON.stringify(bundle));

    const versionJsPath = path.join(REPO_ROOT, 'Tier 1: Brain', 'Brainstem', 'version.js');
    fs.writeFileSync(versionJsPath, `// Auto-generated by scripts/build-content.js -- do not edit by hand.\nexport const CONTENT_VERSION = ${JSON.stringify(version)};\n`);

    console.log(`✓ Built ${notes.length} notes, ${flashcards.length} flashcards, ${questions.length} questions.`);
    console.log(`✓ Version: ${version}`);
    console.log(`✓ Wrote dist/content-bundle.json and version.js`);
}

main();
