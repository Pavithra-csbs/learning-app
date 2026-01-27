import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Puzzle.css';

const Puzzle = () => {
    const { token } = useAuth();
    const [puzzles, setPuzzles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // { correct: bool, msg: string }
    const [loading, setLoading] = useState(true);
    const [topicId, setTopicId] = useState(1); // Default to topic 1 for demo

    useEffect(() => {
        const fetchPuzzles = async () => {
            try {
                // Topic 1 as default for demo
                const res = await axios.post('/puzzle/generate', {
                    topic_id: topicId
                });
                setPuzzles(res.data);
            } catch (err) {
                console.error("Failed to fetch puzzles");
                // Mock for demo
                setPuzzles([
                    { id: 1, question: "Unscramble: T-A-N-E-R-C", puzzle_type: "word", correct_answer: "NCERT" },
                    { id: 2, question: "Identify this organ: _ _ _ R T", puzzle_type: "word", correct_answer: "HEART" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchPuzzles();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const current = puzzles[currentIndex];

        try {
            // Check via backend if possible, or local
            const isCorrect = answer.toUpperCase().trim() === (current.correct_answer || "NCERT").toUpperCase();

            setFeedback({
                correct: isCorrect,
                msg: isCorrect ? "Fantastic! 🌟 You solved it!" : "Not quite! Try again! 🧩"
            });

            if (isCorrect) {
                setTimeout(() => {
                    setFeedback(null);
                    setAnswer('');
                    if (currentIndex < puzzles.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        alert("You've solved all puzzles for this topic! 🎉");
                    }
                }, 2000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="puzzle-page-loading">Puzzling things out... 🧩</div>;
    if (puzzles.length === 0) return <div className="puzzle-page-empty">No puzzles found for this topic yet! Check back later. 🎈</div>;

    const currentPuzzle = puzzles[currentIndex];

    return (
        <div className="puzzle-page-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="puzzle-card"
            >
                <div className="puzzle-header">
                    <h2>Brain Tickler #{currentIndex + 1} 🧩</h2>
                    <p>NCERT Topic Challenge</p>
                </div>

                <div className="puzzle-content">
                    <p className="puzzle-question">{currentPuzzle.question}</p>

                    {currentPuzzle.image_url && (
                        <img src={currentPuzzle.image_url} alt="Puzzle" className="puzzle-image" />
                    )}

                    <form onSubmit={handleSubmit} className="puzzle-form">
                        <input
                            type="text"
                            placeholder="Type your answer here..."
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            disabled={!!feedback?.correct}
                        />
                        <button type="submit" disabled={!answer || !!feedback?.correct}>
                            Check Answer 🚀
                        </button>
                    </form>

                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`feedback-banner ${feedback.correct ? 'success' : 'error'}`}
                            >
                                {feedback.msg}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Puzzle;
