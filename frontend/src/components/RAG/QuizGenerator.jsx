import React, { useState } from 'react';
import '../../pages/Dashboard.css';

const QuizGenerator = () => {
    const [formData, setFormData] = useState({
        standard: 'Class 8',
        subject: 'Science',
        chapter: '',
        topic: ''
    });
    const [loading, setLoading] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedQuiz(null);

        try {
            const response = await fetch('http://localhost:5000/api/generate-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to generate quiz');
            }

            const data = await response.json();
            setGeneratedQuiz(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quiz-generator-container">
            <div className="glass-card generator-form-card">
                <h2>✨ NCERT Quiz Magic</h2>
                <p>Generate curriculum-aligned quizzes instantly from textbooks.</p>

                <form onSubmit={handleGenerate}>
                    <div className="form-group">
                        <label>Class</label>
                        <select name="standard" value={formData.standard} onChange={handleChange}>
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Subject</label>
                        <select name="subject" value={formData.subject} onChange={handleChange}>
                            <option value="Science">Science</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Social Science">Social Science</option>
                            <option value="English">English</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Chapter Name</label>
                        <input
                            type="text"
                            name="chapter"
                            value={formData.chapter}
                            onChange={handleChange}
                            placeholder="e.g. Crop Production"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Topic Detail</label>
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="e.g. Agricultural Practices"
                            required
                        />
                    </div>

                    <button type="submit" className="generate-btn" disabled={loading}>
                        {loading ? '🔮 Conjuring Questions...' : '🚀 Generate Quiz'}
                    </button>

                    {error && <div className="error-message">{error}</div>}
                </form>
            </div>

            {generatedQuiz && (
                <div className="glass-card results-card">
                    <div className="results-header">
                        <h3>🎉 Generated Quiz</h3>
                        <span className="badge">Strictly NCERT</span>
                    </div>

                    <div className="questions-grid">
                        {generatedQuiz.questions.map((q, index) => (
                            <div key={index} className="question-card">
                                <div className="q-header">
                                    <span className={`difficulty ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                    <span className="q-num">Q{index + 1}</span>
                                </div>
                                <p className="q-text">{q.question}</p>
                                <div className="options-list">
                                    {Object.entries(q.options).map(([key, val]) => (
                                        <div key={key} className={`option ${key === q.correct_answer ? 'correct' : ''}`}>
                                            <strong>{key}:</strong> {val}
                                        </div>
                                    ))}
                                </div>
                                <div className="reference-tag">📖 {q.ncert_reference}</div>
                            </div>
                        ))}
                    </div>

                    <button className="save-btn" onClick={() => alert("Saved to Quiz Bank! (Mock)")}>
                        💾 Save to Library
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;
