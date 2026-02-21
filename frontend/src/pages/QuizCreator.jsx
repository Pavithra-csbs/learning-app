import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './QuizCreator.css';

const QuizCreator = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        time_limit: 30
    });

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/teacher/add-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentQuestion, quiz_id: quizId })
            });
            if (response.ok) {
                const data = await response.json();
                setQuestions([...questions, { ...currentQuestion, id: data.question_id }]);
                setCurrentQuestion({
                    question_text: '',
                    option_a: '',
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    correct_option: 'A',
                    time_limit: 30
                });
            }
        } catch (error) {
            alert("Error adding question");
        }
    };

    return (
        <div className="creator-container">
            <header className="creator-header">
                <h2>Building your Live Quiz 🏗️</h2>
                <p>Add engaging multiple-choice questions for your live session.</p>
            </header>

            <div className="creator-split">
                <div className="question-form-panel">
                    <h3>Add Question</h3>
                    <form onSubmit={handleAddQuestion}>
                        <textarea
                            placeholder="Enter your question here..."
                            required
                            value={currentQuestion.question_text}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question_text: e.target.value })}
                        />
                        <div className="options-grid">
                            {['a', 'b', 'c', 'd'].map(opt => (
                                <div key={opt} className="opt-input">
                                    <label>Option {opt.toUpperCase()}</label>
                                    <input
                                        type="text"
                                        required
                                        value={currentQuestion[`option_${opt}`]}
                                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, [`option_${opt}`]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="question-settings">
                            <div className="setting">
                                <label>Correct Answer</label>
                                <select
                                    value={currentQuestion.correct_option}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, correct_option: e.target.value })}
                                >
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                            <div className="setting">
                                <label>Time Limit (s)</label>
                                <input
                                    type="number"
                                    value={currentQuestion.time_limit}
                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, time_limit: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="add-btn">Add to Quiz</button>
                    </form>
                </div>

                <div className="question-list-panel">
                    <h3>Questions ({questions.length})</h3>
                    <div className="q-scroll">
                        {questions.map((q, idx) => (
                            <div key={idx} className="q-preview-card">
                                <span>{idx + 1}. {q.question_text}</span>
                                <span className="q-tag">Correct: {q.correct_option}</span>
                            </div>
                        ))}
                    </div>
                    {questions.length > 0 && (
                        <button className="finish-btn" onClick={() => navigate('/teacher/dashboard')}>
                            Finish & Back to Dashboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizCreator;
