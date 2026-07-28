// Ingest - handles uploading a lecture document to the ingestion Worker.
//
// SETUP: replace WORKER_URL below with your deployed Worker's URL
// (see gobook-ingest-worker/SETUP.md). Until you deploy the Worker, this
// button will show a clear "not configured" message instead of failing
// silently.

const WORKER_URL = 'REPLACE_WITH_YOUR_WORKER_URL'; // e.g. https://gobook-ingest-worker.YOUR-SUBDOMAIN.workers.dev

export const ingest = {
    async uploadLecture() {
        const input = document.getElementById('lectureUploadInput');
        const status = document.getElementById('lectureUploadStatus');
        if (!input || !status) return;

        if (WORKER_URL.startsWith('REPLACE_WITH')) {
            status.textContent = '⚠ Upload isn\'t set up yet -- deploy the Worker and set WORKER_URL in ingest.js.';
            status.style.color = '#b45309';
            return;
        }

        const file = input.files && input.files[0];
        if (!file) {
            status.textContent = 'Choose a .docx file first.';
            status.style.color = '#b45309';
            return;
        }

        const passcodeInput = document.getElementById('lectureUploadPasscode');
        const passcode = passcodeInput ? passcodeInput.value : '';
        if (!passcode) {
            status.textContent = 'Enter the passcode first.';
            status.style.color = '#b45309';
            return;
        }

        status.textContent = '⏳ Uploading and processing -- this can take up to a minute...';
        status.style.color = '#666';

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('passcode', passcode);
            const response = await fetch(WORKER_URL, { method: 'POST', body: formData });
            const result = await response.json();

            if (!response.ok) {
                status.textContent = `✗ Failed: ${result.error || 'unknown error'}${result.details ? ' -- ' + result.details.join('; ') : ''}`;
                status.style.color = '#b91c1c';
                return;
            }

            status.textContent = `✓ Added ${result.subject} (${result.folder}): ${result.notes} notes, ${result.flashcards} flashcards, ${result.questions} questions. The site will update in a minute or two once GitHub rebuilds.`;
            status.style.color = '#15803d';
            input.value = '';
            if (passcodeInput) passcodeInput.value = '';
        } catch (err) {
            status.textContent = `✗ Upload failed: ${err.message}`;
            status.style.color = '#b91c1c';
        }
    }
};
