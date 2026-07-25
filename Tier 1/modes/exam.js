// Exam mode - handles exam functionality

import { router } from '../router.js';
import { processor } from '../processor.js';
import { helpers } from '../ui/helpers.js';

export const exam = {
    startExam(state) {
        const subjectQuestions = processor.filterQuestionsBySubject(state.allQuestions, state.currentSubject);
        const numQuestions = parseInt(document.getElementById('questionCount').value);
        state.answers = this.getRandomQuestions(subjectQuestions, numQuestions);
        state.currentQuestionIndex = 0;
        state.selectedAnswers = {};
        this.showQuestion(state);
        router.showScreen('questionScreen');
    },

    startComprehensiveExam(state) {
        state.answers = this.getRandomQuestions(state.allQuestions, 50);
        state.currentQuestionIndex = 0;
        state.selectedAnswers = {};
        this.showQuestion(state);
        router.showScreen('questionScreen');
    },

    startTopicExamSelection(state) {
        router.renderSubjectSelection(state);
    },

    backToExamConfig(state) {
        router.showExamConfigScreen(state);
    },

    prepareComprehensiveExam(state) {
        state.isComprehensiveExam = true;
        state.startComprehensiveExam();
    },

    getRandomQuestions(questions, count) {
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },

    showQuestion(state) {
        const question = state.answers[state.currentQuestionIndex];
        if (!question) return;

        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');

        questionText.textContent = question.text;
        helpers.clearContainer('optionsContainer');

        if (question.options && Array.isArray(question.options)) {
            question.options.forEach((opt, idx) => {
                const label = document.createElement('label');
                label.className = 'option-label';
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'answer';
                radio.value = idx;
                radio.onchange = () => this.selectAnswer(state, idx);

                if (state.selectedAnswers[state.currentQuestionIndex] === idx) {
                    radio.checked = true;
                }

                label.appendChild(radio);
                label.appendChild(document.createTextNode(opt.text || opt));
                optionsContainer.appendChild(label);
            });
        }

        document.getElementById('questionNumber').textContent = state.currentQuestionIndex + 1;
        document.getElementById('questionTotal').textContent = state.answers.length;
        const progress = helpers.getProgressPercentage(state.currentQuestionIndex, state.answers.length);
        document.getElementById('questionProgressFill').style.width = progress + '%';
    },

    selectAnswer(state, optionIndex) {
        state.selectedAnswers[state.currentQuestionIndex] = optionIndex;
    },

    nextQuestion(state) {
        if (state.currentQuestionIndex < state.answers.length - 1) {
            state.currentQuestionIndex++;
            this.showQuestion(state);
        } else {
            this.submitExam(state);
        }
    },

    previousQuestion(state) {
        console.log('🔙 previousQuestion called');
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            this.showQuestion(state);
        }
    },

    submitExam(state) {
        let correct = 0;
        state.answers.forEach((question, idx) => {
            const userAnswer = state.selectedAnswers[idx];
            if (userAnswer !== undefined) {
                const options = question.options || [];
                if (options[userAnswer] && options[userAnswer].correct) {
                    correct++;
                }
            }
        });

        const percentage = Math.round((correct / state.answers.length) * 100);
        document.getElementById('scoreDisplay').textContent = percentage + '%';

        let message = '';
        if (percentage >= 80) {
            message = '✓ Excellent work! Keep it up!';
        } else if (percentage >= 60) {
            message = '✓ Good job! Review weak areas.';
        } else {
            message = '✗ Keep studying! Review material.';
        }
        document.getElementById('scoreMessage').textContent = message;

        router.showScreen('resultsScreen');
    }
};
