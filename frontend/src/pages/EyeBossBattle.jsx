import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EyeBossBattle.css';

const BOSS_PHASES = [
    {
        id: 'anatomy',
        title: "PHASE 1: ANATOMY SCAN",
        question: "Which part of the eye controls the amount of light entering?",
        options: ["Iris", "Retina", "Ciliary Muscles", "Cornea"],
        correct: 0,
        tip: "Think of the shutter in a camera!"
    },
    {
        id: 'defects',
        title: "PHASE 2: DIAGNOSTIC DUEL",
        question: "A patient's eye forms images in front of the retina. The condition is:",
        options: ["Hypermetropia", "Cataract", "Myopia", "Presbyopia"],
        correct: 2,
        tip: "The eyeball might be too long..."
    },
    {
        id: 'lens',
        title: "PHASE 3: LENS LOGIC",
        question: "To correct Hypermetropia, we must use a lens that is:",
        options: ["Diverging (Concave)", "Converging (Convex)", "Bifocal", "Opaque"],
        correct: 1,
        tip: "We need more bending power!"
    },
    {
        id: 'care',
        title: "PHASE 4: CARE & VISION",
        question: "The 20-20-20 rule suggests looking at something 20 feet away for:",
        options: ["20 minutes", "20 seconds", "2 days", "20 hours"],
        correct: 1,
        tip: "A quick break for your ciliary muscles."
    }
];

const EyeBossBattle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [phaseIdx, setPhaseIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // Total battle time
    const [bossHealth, setBossHealth] = useState(100);
    const [gameState, setGameState] = useState('intro'); // intro, fighting, results, lost
    const [feedback, setFeedback] = useState(null);

    const phase = BOSS_PHASES[phaseIdx];

    const calculateStars = (finalScore) => {
        if (finalScore >= 350) return '⭐⭐⭐';
        if (finalScore >= 200) return '⭐⭐';
        return '⭐';
    };

    const handleAnswer = (idx) => {
        if (feedback) return;

        if (idx === phase.correct) {
            const timeBonus = timeLeft;
            setScore(prev => prev + 100 + timeBonus);
            setBossHealth(prev => Math.max(0, prev - 25));
            setFeedback({ type: 'success', message: 'CRITICAL HIT! Doctor Vision is weakening!' });

            setTimeout(() => {
                if (phaseIdx < BOSS_PHASES.length - 1) {
                    setPhaseIdx(prev => prev + 1);
                    setFeedback(null);
                } else {
                    setGameState('results');
                    canvasConfetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
                }
            }, 2000);
        } else {
            setScore(prev => Math.max(0, prev - 20));
            setFeedback({ type: 'error', message: 'MISSED! Doctor Vision retaliates!' });
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    useEffect(() => {
        if (gameState !== 'fighting') return;
        if (timeLeft === 0) {
            setGameState('lost');
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    return (
        <div className="boss-game-container">
            <div className="digital-bg"></div>

            <header className="boss-header">
                <button onClick={() => navigate('/map')} className="retreat-btn">⬅️ RETREAT</button>
                <div className="battle-timer">⏱️ {timeLeft}s</div>
                <div className="score-counter">XP: {score}</div>
            </header>

            <main className="boss-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="boss-overlay">
                            <div className="boss-avatar">👨‍⚕️⚡</div>
                            <h1>DOCTOR VISION CHALLENGE</h1>
                            <p>Doctor Vision has hidden all the colors of the world. Pass his advanced ocular trials to earn the "Eye Master" badge and restore clarity!</p>
                            <button onClick={() => setGameState('fighting')} className="start-btn">ENGAGE DOCTOR VISION</button>
                        </motion.div>
                    )}

                    {gameState === 'fighting' && (
                        <div className="battle-zone">
                            <div className="boss-section">
                                <div className="boss-hp-bar">
                                    <label>DOCTOR VISION HP</label>
                                    <div className="hp-track"><motion.div className="hp-fill" animate={{ width: `${bossHealth}%` }} /></div>
                                </div>
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="boss-sprite">
                                    👨‍⚕️
                                </motion.div>
                            </div>

                            <motion.div key={phaseIdx} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="trial-card">
                                <div className="trial-header">{phase.title}</div>
                                <h2 className="trial-question">{phase.question}</h2>

                                <div className="trial-options">
                                    {phase.options.map((opt, i) => (
                                        <button key={i} onClick={() => handleAnswer(i)} className="trial-opt-btn" disabled={!!feedback}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>

                                {feedback && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`trial-feedback ${feedback.type}`}>
                                        {feedback.message}
                                    </motion.div>
                                )}
                                <div className="trial-tip">💡 TIP: {phase.tip}</div>
                            </motion.div>
                        </div>
                    )}

                    {gameState === 'results' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="boss-overlay victory">
                            <div className="badge-icon">🎖️</div>
                            <h1>EYE MASTER EARNED!</h1>
                            <p>You have defeated Doctor Vision and restored the world's colorful beauty.</p>

                            <div className="victory-stats">
                                <div className="stat">SCORE: {score}</div>
                                <div className="stars">RANK: {calculateStars(score)}</div>
                                <div className="badge-name">TITLE: DOCTOR OF OPTICS</div>
                            </div>

                            <button onClick={() => navigate('/map')} className="finish-btn">CHAPTER COMPLETE</button>
                        </motion.div>
                    )}

                    {gameState === 'lost' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="boss-overlay defeat">
                            <h1>VISION FADED...</h1>
                            <p>Doctor Vision's trials were too fast. Recharge and try again!</p>
                            <button onClick={() => window.location.reload()} className="finish-btn">RETRY CHALLENGE</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EyeBossBattle;
