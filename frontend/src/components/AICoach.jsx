import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './AICoach.css';

const AICoach = ({ isOpen, onClose, studentId }) => {
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);

    useEffect(() => {
        if (isOpen && studentId) {
            fetchData();
        }
    }, [isOpen, studentId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [analysisRes, recRes] = await Promise.all([
                fetch(`http://127.0.0.1:5000/api/ai/analyze_student/${studentId}`),
                fetch(`http://127.0.0.1:5000/api/ai/recommendations/${studentId}`)
            ]);

            const analysisData = await analysisRes.json();
            const recData = await recRes.json();

            setAnalysis(Array.isArray(analysisData) ? analysisData : []);
            setRecommendations(Array.isArray(recData) ? recData : []);
        } catch (error) {
            console.error('Error fetching AI data:', error);
            setAnalysis([]);
            setRecommendations([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLaunchAIQuiz = async () => {
        setIsLaunching(true);
        try {
            const response = await fetch('http://127.0.0.1:5000/api/ai/generate_quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: studentId })
            });
            const data = await response.json();
            if (data.questions && data.questions.length > 0) {
                // Navigate to quiz arena in AI mode
                onClose();
                navigate('/quiz/ai-mastery?isAi=true');
            } else {
                alert("The AI is still gathering data! Try taking some more regular quizzes first. 🤖");
            }
        } catch (error) {
            console.error('Error launching AI quiz:', error);
            alert("Connection error. Please try again!");
        } finally {
            setIsLaunching(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-coach-overlay">
            <motion.div
                className="ai-coach-glass"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button className="close-coach" onClick={onClose}>×</button>

                <div className="coach-header">
                    <div className="coach-avatar-container">
                        <div className="avatar-circle">🤖</div>
                        <div className="coach-status-dot"></div>
                    </div>
                    <div className="coach-info">
                        <h2>AI Learning Coach</h2>
                        <p>Personalized insights for your success</p>
                    </div>
                </div>

                <div className="coach-content">
                    {isLoading ? (
                        <div className="coach-loading">
                            <div className="spinner"></div>
                            <p>Analyzing your performance...</p>
                        </div>
                    ) : (
                        <>
                            <div className="coach-section">
                                <h3>Weak Chapters 📉</h3>
                                <div className="weak-chapters-list">
                                    {analysis.filter(a => a.status === 'WEAK').length > 0 ? (
                                        analysis.filter(a => a.status === 'WEAK').map((item, idx) => (
                                            <div key={idx} className="weak-topic-card">
                                                <div className="topic-info">
                                                    <span className="topic-name">{item.topic}</span>
                                                    <span className="topic-score">{Math.round(item.avg_score)}%</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${item.avg_score}%` }}></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Great job! No weak chapters identified yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="coach-section">
                                <h3>Recommendations 💡</h3>
                                <div className="recommendations-container">
                                    {recommendations.length > 0 ? (
                                        recommendations.map((rec, idx) => (
                                            <div key={idx} className="rec-card">
                                                <div className="rec-difficulty" data-level={rec.difficulty_level}>
                                                    {rec.difficulty_level}
                                                </div>
                                                <p className="rec-text">{rec.reason}</p>
                                                <button className="rec-btn">Try: {rec.recommended_game}</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Start taking quizzes to see personalized tips!</p>
                                    )}
                                </div>
                            </div>

                            <div className="coach-footer">
                                <button
                                    className="ai-quiz-btn"
                                    onClick={handleLaunchAIQuiz}
                                    disabled={isLaunching}
                                >
                                    {isLaunching ? 'Preparing Master Quiz...' : '🚀 Launch Personalized Mastery Quiz'}
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="ai-tips">
                    <strong>Pro Tip:</strong> Spending 5 minutes a day on your "Weak" topics can improve your scores by 30%!
                </div>
            </motion.div>
        </div>
    );
};

export default AICoach;
