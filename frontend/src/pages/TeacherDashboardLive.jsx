import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './TeacherDashboardLive.css';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        class: '6',
        subject: 'Biology',
        chapter: ''
    });

    useEffect(() => {
        // Fetch existing quizzes for this teacher
        // For now, let's mock or fetch from API
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch(`/api/teacher/quizzes/${user.id}`);
            const data = await res.json();
            if (res.ok) {
                setQuizzes(data);
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/teacher/create-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newQuiz, teacher_id: user.id })
            });
            const data = await response.json();
            if (response.ok) {
                navigate(`/teacher/quiz/${data.quiz_id}/edit`);
            } else {
                alert(`Error: ${data.message}${data.error ? " - " + data.error : ""}`);
            }
        } catch (error) {
            alert("Connection error occurred while creating quiz");
        }
    };

    return (
        <div className="teacher-dashboard-container">
            <header className="teacher-header">
                <h1>Teacher Command Center 👩‍🏫</h1>
                <p>Create and host live interactive quizzes for your students.</p>
            </header>

            <div className="dashboard-actions">
                <button className="create-quiz-btn" onClick={() => setShowCreateModal(true)}>
                    ➕ Create New Live Quiz
                </button>
            </div>

            <div className="quiz-grid">
                {quizzes.length === 0 ? (
                    <div className="empty-state">
                        <p>No quizzes created yet. Start by creating your first Kahoot-style quiz!</p>
                    </div>
                ) : (
                    quizzes.map(quiz => (
                        <div key={quiz.id} className="quiz-card">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.subject} - Class {quiz.class}</p>
                            <div className="card-actions">
                                <button onClick={() => navigate(`/teacher/live/${quiz.id}`)}>🚀 Start Session</button>
                                <button onClick={() => navigate(`/teacher/quiz/${quiz.id}/edit`)}>⚙️ Edit</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <div className="modal-overlay">
                    <motion.div
                        className="create-quiz-modal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <h2>Create New Quiz</h2>
                        <form onSubmit={handleCreateQuiz}>
                            <input
                                type="text"
                                placeholder="Quiz Title (e.g. Photosynthesis Master)"
                                required
                                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                            />
                            <select onChange={(e) => setNewQuiz({ ...newQuiz, class: e.target.value })}>
                                {['6', '7', '8', '9', '10'].map(c => <option key={c} value={c}>Class {c}</option>)}
                            </select>
                            <select onChange={(e) => setNewQuiz({ ...newQuiz, subject: e.target.value })}>
                                {['Biology', 'Physics', 'Chemistry'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Chapter Name"
                                required
                                onChange={(e) => setNewQuiz({ ...newQuiz, chapter: e.target.value })}
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="confirm-btn">Create Quiz</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
