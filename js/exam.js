// Exam module - handles all exam-related logic

import { ui } from './ui.js';
import { uiUtils } from './ui-utils.js';
import { dataFilter } from './data-filter.js';

export const exam = {
    startTopicExamSelection(app) {
        app.currentMode = 'exam';
        app.isComprehensiveExam = false;
        ui.renderSubjectSelection(app);
    },

    backToExamConfig(app) {
        ui.showExamConfigScreen(app);
    },

    prepareComprehensiveExam(app) {
        const totalQuestions = app.allQuestions.length;
        document.getElementById('maxQuestions').textContent = totalQuestions;
        document.getElementById('questionCount').max = totalQuestions;
        document.getElementById('questionCount').value = Math.min(20, totalQuestions);

        document.getElementById('selectedSubjectName').textContent = 'All Topics';
        document.getElementById('modeButtonText').textContent = 'Comprehensive Exam';
        document.getElementById('subjectButtonsContainer').innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">Random questions from all topics</p>';
        document.getElementById('questionCountContainer').style.display = 'block';

        app.isComprehensiveExam = true;
        uiUtils.showScreen('subjectScreen');
    },

    startExam(app) {
        const allQuestions = dataFilter.filterQuestionsBySubject(app.allQuestions, app.currentSubject);
        const questionCountInput = uiUtils.getInputNumberValue('questionCount') || 10;
        const questionCount = Math.min(questionCountInput, allQuestions.length);

        app.answers = this.getRandomQuestions(allQuestions, questionCount);
        app.currentQuestionIndex = 0;
        app.selectedAnswers = {};
        this.showQuestion(app);
        uiUtils.showScreen('examScreen');
    },

    startComprehensiveExam(app) {
        const questionCountInput = uiUtils.getInputNumberValue('comprehensiveQuestionCount') || 10;
        const questionCount = Math.min(questionCountInput, app.allQuestions.length);

        app.answers = this.getRandomQuestions(app.allQuestions, questionCount);
        app.currentQuestionIndex = 0;
        app.selectedAnswers = {};
        app.isComprehensiveExam = true;
        this.showQuestion(app);
        uiUtils.showScreen('examScreen');
    },

    getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    },

    showQuestion(app) {
        const question = app.answers[app.currentQuestionIndex];
        if (!question) return;

        document.getElementById('questionNumber').textContent = app.currentQuestionIndex + 1;
        document.getElementById('questionTotal').textContent = app.answers.length;
        document.getElementById('questionText').textContent = question.text;

        const progress = uiUtils.getProgressPercentage(app.currentQuestionIndex, app.answers.length);
        document.getElementById('progressFill').style.width = progress + '%';

        const container = document.getElementById('optionsContainer');
        uiUtils.clearContainer('optionsContainer');

        question.options.forEach(option => {
            const label = document.createElement('label');
            label.className = 'option';
            label.innerHTML = `
                <input type="radio" name="answer" value="${option.letter}"
                    ${app.selectedAnswers[app.currentQuestionIndex] === option.letter ? 'checked' : ''}>
                <span>${option.letter.toUpperCase()}. ${option.text}</span>
            `;
            label.onclick = () => {
                app.selectedAnswers[app.currentQuestionIndex] = option.letter;
                document.querySelectorAll('#optionsContainer .option').forEach(o => o.classList.remove('selected'));
                label.classList.add('selected');
            };
            container.appendChild(label);

            if (app.selectedAnswers[app.currentQuestionIndex] === option.letter) {
                label.classList.add('selected');
            }
        });
    },

    nextQuestion(app) {
        if (app.currentQuestionIndex < app.answers.length - 1) {
            app.currentQuestionIndex++;
            this.showQuestion(app);
        } else {
            this.submitExam(app);
        }
    },

    submitExam(app) {
        let correct = 0;
        app.answers.forEach((question, index) => {
            const answer = app.selectedAnswers[index];
            const correctOption = question.options.find(o => o.correct);
            if (answer === correctOption.letter) {
                correct++;
            }
        });

        const score = Math.round((correct / app.answers.length) * 100);
        document.getElementById('scoreDisplay').textContent = score + '%';

        if (score >= 90) {
            document.getElementById('scoreMessage').textContent = '🎉 Excellent! Outstanding work!';
        } else if (score >= 80) {
            document.getElementById('scoreMessage').textContent = '👏 Good job! Keep it up!';
        } else if (score >= 70) {
            document.getElementById('scoreMessage').textContent = '👍 Fair attempt! Review the material.';
        } else {
            document.getElementById('scoreMessage').textContent = '💪 Keep practicing! You\'ll get better!';
        }

        uiUtils.showScreen('resultsScreen');
    }
};
