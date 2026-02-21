import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CompassPuzzle.css';

const CompassPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [userAngle, setUserAngle] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, checking, feedback, victory
    const [score, setScore] = useState(0);
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const [showFinalScore, setShowFinalScore] = useState(false);

    const QUESTS = [
        { x: 100, y: 50, targetAngle: 180, desc: "Place the compass above the North pole." },
        { x: 300, y: 50, targetAngle: 0, desc: "Place the compass above the South pole." },
        { x: 200, y: 20, targetAngle: 180, desc: "Directly above the center of the magnet." },
        { x: 400, y: 100, targetAngle: 0, desc: "To the right of the South pole." },
        { x: 0, y: 100, targetAngle: 180, desc: "To the left of the North pole." }
    ];

    const handleCheck = () => {
        const target = QUESTS[currentStep].targetAngle;
        const diff = Math.abs((userAngle % 360) - target);
        const isCorrect = diff < 20 || diff > 340;

        setGameState('checking');

        if (isCorrect) {
            setScore(s => s + 100);
            setFeedbackMsg("PERRECT! The needle aligns with the field lines. ✨");
            setTimeout(() => {
                if (currentStep < QUESTS.length - 1) {
                    setCurrentStep(prev => prev + 1);
                    setUserAngle(0);
                    setGameState('playing');
                } else {
                    setGameState('victory');
                    setShowFinalScore(true);
                    canvasConfetti({ particleCount: 150, spread: 70 });
                }
            }, 1500);
        } else {
            setFeedbackMsg("NOT QUITE! Remember, the North needle (red) points where field lines go. ❌");
            setTimeout(() => setGameState('playing'), 2000);
        }
    };

    const getFeedbackText = () => {
        const percentage = (score / (QUESTS.length * 100)) * 100;
        if (percentage === 100) return "Hurray 🎉 Woohoo! You are a Magnetism Master!";
        if (percentage >= 50) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="compass-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="back-btn">⬅️ MAP</button>
                <div className="stat-box">SCORE: {score}</div>
                <div className="stat-box">LEVEL 4: COMPASS PUZZLE</div>
            </header>

            <main className="game-arena">
                <div className="instruction-card">
                    <h2>{QUESTS[currentStep].desc}</h2>
                    <p>Rotate the red needle to predict the compass direction.</p>
                </div>

                <div className="sim-board">
                    {/* Bar Magnet */}
                    <div className="bar-magnet">
                        <div className="pole n">N</div>
                        <div className="pole s">S</div>
                    </div>

                    {/* Target Compass Spot */}
                    <motion.div
                        className="compass-spot"
                        style={{ left: QUESTS[currentStep].x, top: QUESTS[currentStep].y }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />

                    {/* Interactive Compass */}
                    <div className="compass-visual">
                        <div className="compass-face">
                            <motion.div
                                className="needle"
                                style={{ rotate: userAngle }}
                            >
                                <div className="needle-n"></div>
                                <div className="needle-s"></div>
                            </motion.div>
                        </div>
                        <div className="controls">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={userAngle}
                                onChange={(e) => setUserAngle(Number(e.target.value))}
                                disabled={gameState !== 'playing'}
                            />
                            <button className="check-btn" onClick={handleCheck} disabled={gameState !== 'playing'}>
                                {gameState === 'checking' ? 'ALIGNING...' : 'LOCK IN'}
                            </button>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {feedbackMsg && gameState === 'checking' && (
                        <motion.div
                            className="feedback-popup"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {feedbackMsg}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {showFinalScore && (
                <div className="victory-overlay">
                    <motion.div className="victory-card" initial={{ y: 50 }} animate={{ y: 0 }}>
                        <div className="stars">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={i < (score / 200) ? 'gold' : ''}>⭐</span>
                            ))}
                        </div>
                        <h2>{getFeedbackText()}</h2>
                        <h1>Score: {score}</h1>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="next-level-btn">CONTINUE MISSION</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CompassPuzzle;
