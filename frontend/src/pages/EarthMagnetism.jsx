import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EarthMagnetism.css';

const EarthMagnetism = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('intro'); // intro, matching, quiz, victory
    const [score, setScore] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);

    const QUESTIONS = [
        {
            q: "Where is the Earth's Magnetic North pole located?",
            options: ["Near Geographic North", "Near Geographic South", "At the Equator"],
            correct: 1, // Magnetic North is near Geographic South!
            explanation: "Earth's magnetic poles are actually reversed compared to geographic ones. The point we call 'Magnetic North' is actually a South magnetic pole!"
        },
        {
            q: "Magnetic Declination is the angle between:",
            options: ["Magnetic North and South", "Geographic North and Magnetic North", "Equator and Poles"],
            correct: 1,
            explanation: "Declination is the difference between true north and the harbor where the compass points."
        }
    ];

    const handleAnswer = (idx) => {
        if (idx === QUESTIONS[currentQuestion].correct) {
            setScore(s => s + 200);
            if (currentQuestion < QUESTIONS.length - 1) {
                setCurrentQuestion(prev => prev + 1);
            } else {
                setGameState('victory');
                canvasConfetti({ particleCount: 200 });
            }
        } else {
            alert("Oops! " + QUESTIONS[currentQuestion].explanation);
        }
    };

    return (
        <div className="earth-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">XP: {score}</div>
                <div className="title">LEVEL 5: EARTH'S MAGNETOSPHERE</div>
            </header>

            <main className="earth-arena">
                <div className="globe-container">
                    <motion.div
                        className="globe"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        🌍
                        <div className="magnetic-axis"></div>
                    </motion.div>
                </div>

                <div className="interaction-panel">
                    {gameState === 'intro' && (
                        <div className="intro-view">
                            <h2>Did you know?</h2>
                            <p>Earth itself is a giant bar magnet! Its magnetic field protects us from solar winds.</p>
                            <button className="start-btn" onClick={() => setGameState('quiz')}>START MISSION</button>
                        </div>
                    )}

                    {gameState === 'quiz' && (
                        <div className="quiz-view">
                            <span className="q-count">QUESTION {currentQuestion + 1}</span>
                            <h3>{QUESTIONS[currentQuestion].q}</h3>
                            <div className="options">
                                {QUESTIONS[currentQuestion].options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(i)} className="option-btn">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🌍</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are a Magnetism Master!</h1>
                        <p>You've mastered the global field! You're ready for more complex magnetic circuits.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="next-level-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarthMagnetism;
