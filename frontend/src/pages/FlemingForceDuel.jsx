import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './FlemingForceDuel.css';

const DUELS = [
    { id: 1, field: 'RIGHT', current: 'UP', force: 'INTO', label: 'Field Right, Current Up' },
    { id: 2, field: 'INTO', current: 'RIGHT', force: 'DOWN', label: 'Field Into, Current Right' },
    { id: 3, field: 'UP', current: 'LEFT', force: 'OUT OF', label: 'Field Up, Current Left' }
];

const FlemingForceDuel = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [duelIdx, setDuelIdx] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState(null);

    const currentDuel = DUELS[duelIdx];

    const handleGuess = (guess) => {
        if (guess === currentDuel.force) {
            setFeedback({ type: 'success', text: 'POWERFUL! Force predicted! ✨' });
            canvasConfetti({ particleCount: 50 });
        } else {
            setFeedback({ type: 'error', text: 'MISCALCULATED! Re-check your Left Hand!' });
        }

        setTimeout(() => {
            setFeedback(null);
            if (duelIdx < DUELS.length - 1) {
                setDuelIdx(prev => prev + 1);
            } else {
                setGameState('victory');
            }
        }, 1500);
    };

    return (
        <div className="duel-container">
            <header className="duel-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="rule-tip">LEFT HAND RULE: THUMB = FORCE</div>
            </header>

            <main className="duel-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' && (
                        <motion.div
                            key={duelIdx}
                            className="duel-stage"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, rotateY: 90 }}
                        >
                            <div className="vector-display">
                                <div className={`vector field ${currentDuel.field.toLowerCase()}`}>
                                    <span className="vector-label">FIELD (B)</span>
                                </div>
                                <div className={`vector current ${currentDuel.current.toLowerCase()}`}>
                                    <span className="vector-label">CURRENT (I)</span>
                                </div>
                            </div>

                            <div className="question">WHICH WAY IS THE FORCE?</div>

                            <div className="force-options">
                                <button onClick={() => handleGuess('UP')} className="f-btn">UP</button>
                                <button onClick={() => handleGuess('DOWN')} className="f-btn">DOWN</button>
                                <button onClick={() => handleGuess('LEFT')} className="f-btn">LEFT</button>
                                <button onClick={() => handleGuess('RIGHT')} className="f-btn">RIGHT</button>
                                <button onClick={() => handleGuess('INTO')} className="f-btn">INTO PAGE ⊗</button>
                                <button onClick={() => handleGuess('OUT OF')} className="f-btn">OUT OF PAGE ⊙</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {feedback && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`duel-feedback ${feedback.type}`}>
                        {feedback.text}
                    </motion.div>
                )}
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🤺</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>You've mastered the laws of motion in magnetic fields!</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlemingForceDuel;
