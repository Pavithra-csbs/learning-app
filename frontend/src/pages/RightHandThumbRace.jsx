import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RightHandThumbRace.css';

const QUESTS = [
    { id: 1, currentDir: 'UP', correctField: 'CLOCKWISE', label: 'Wire facing UP' },
    { id: 2, currentDir: 'DOWN', correctField: 'ANTI-CLOCKWISE', label: 'Wire facing DOWN' },
    { id: 3, currentDir: 'RIGHT', correctField: 'INTO', label: 'Wire facing RIGHT' },
    { id: 4, currentDir: 'LEFT', correctField: 'OUT OF', label: 'Wire facing LEFT' }
];

const RightHandThumbRace = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [questIdx, setQuestIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, victory
    const [timeLeft, setTimeLeft] = useState(15);
    const [feedback, setFeedback] = useState(null);

    const currentQuest = QUESTS[questIdx];

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setGameState('victory');
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (choice) => {
        // Correct directional logic (simplified for 2D game)
        // Actually, let's keep it simple for Class 10:
        // UP -> Anti-clockwise (from top view), but let's just use Clockwise/Anti for simplicity 
        // In a real 3D sense it's more complex, but for this game:
        const isCorrect = (currentQuest.currentDir === 'UP' && choice === 'ANTI-CLOCKWISE') ||
            (currentQuest.currentDir === 'DOWN' && choice === 'CLOCKWISE') ||
            (currentQuest.currentDir === 'RIGHT' && choice === 'INTO') ||
            (currentQuest.currentDir === 'LEFT' && choice === 'OUT OF');

        if (isCorrect) {
            setScore(prev => prev + 100);
            setFeedback({ type: 'success', text: 'CORRECT! +100 XP' });
            canvasConfetti({ particleCount: 50, spread: 40 });
        } else {
            setFeedback({ type: 'error', text: 'WRONG DIRECTION! -2s' });
            setTimeLeft(prev => Math.max(0, prev - 2));
        }

        setTimeout(() => {
            setFeedback(null);
            if (questIdx < QUESTS.length - 1) {
                setQuestIdx(prev => prev + 1);
            } else {
                setGameState('victory');
            }
        }, 1000);
    };

    return (
        <div className="race-container">
            <header className="race-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="race-stats">
                    <div className="timer">⏱️ {timeLeft}s</div>
                    <div className="score">XP: {score}</div>
                </div>
                <div className="progress">MISSION {questIdx + 1}/{QUESTS.length}</div>
            </header>

            <main className="race-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' && (
                        <motion.div
                            key={questIdx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="quest-card"
                        >
                            <h2>Where does the field flow?</h2>
                            <div className="wire-visual">
                                <div className={`wire-body ${currentQuest.currentDir.toLowerCase()}`}>
                                    <div className="arrow">↑</div>
                                    <span className="label">CURRENT (I)</span>
                                </div>
                            </div>
                            <div className="controls">
                                <button onClick={() => handleAnswer('CLOCKWISE')} className="btn cw">CLOCKWISE ↻</button>
                                <button onClick={() => handleAnswer('ANTI-CLOCKWISE')} className="btn acw">ANTI-CLOCKWISE ↺</button>
                                <button onClick={() => handleAnswer('INTO')} className="btn into">INTO PAGE ⊗</button>
                                <button onClick={() => handleAnswer('OUT OF')} className="btn out">OUT OF PAGE ⊙</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {feedback && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`race-feedback ${feedback.type}`}>
                        {feedback.text}
                    </motion.div>
                )}
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">👍</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>Your reflexes are as fast as magnetic fields! Total Score: {score}</p>
                        <div className="stars">
                            {score >= 300 ? '⭐⭐⭐' : score >= 200 ? '⭐⭐' : '⭐'}
                        </div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightHandThumbRace;
