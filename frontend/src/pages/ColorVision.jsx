import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './ColorVision.css';

const ISHIHARA_PLATES = [
    {
        id: 1,
        number: 12,
        colors: { bg: '#e5e7eb', dots: ['#ef4444', '#10b981', '#f59e0b'] },
        type: 'demonstration',
        explanation: 'Plate 1: Everyone should see the number 12. This establishes the test format.'
    },
    {
        id: 2,
        number: 8,
        colors: { bg: '#f1f5f9', dots: ['#dc2626', '#166534', '#ca8a04'] },
        type: 'red-green',
        explanation: 'Plate 2: People with Red-Green deficiency might see a different number or nothing at all.'
    },
    {
        id: 3,
        number: 29,
        colors: { bg: '#f8fafc', dots: ['#b91c1c', '#15803d', '#b45309'] },
        type: 'red-green',
        explanation: 'Plate 3: This tests the sensitivity of your M-Cones (Green) and L-Cones (Red).'
    }
];

const ColorVision = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [guess, setGuess] = useState('');
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, learning, results
    const [feedback, setFeedback] = useState(null);

    const plate = ISHIHARA_PLATES[stage % ISHIHARA_PLATES.length];

    const handleSubmit = (e) => {
        e.preventDefault();
        const isCorrect = parseInt(guess) === plate.number;

        if (isCorrect) {
            setScore(prev => prev + 50);
            setFeedback({ type: 'success', message: `Correct! ${plate.explanation}` });
            canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } else {
            setFeedback({ type: 'error', message: `Not quite. ${plate.explanation}` });
        }

        setTimeout(() => {
            if (stage < ISHIHARA_PLATES.length - 1) {
                setStage(prev => prev + 1);
                setGuess('');
                setFeedback(null);
            } else {
                setGameState('learning');
            }
        }, 4000);
    };

    return (
        <div className="color-vision-container">
            <header className="color-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="vision-stats">
                    <div className="score-badge">CHROME XP: {score}</div>
                </div>
            </header>

            <main className="color-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' && (
                        <motion.div
                            key={stage}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="ishihara-card"
                        >
                            <div className="plate-info">TEST PLATE #{plate.id}</div>

                            <div className="plate-display">
                                <svg viewBox="0 0 200 200" className="ishihara-svg">
                                    <circle cx="100" cy="100" r="95" fill="#d1d5db" opacity="0.2" />
                                    {/* Procedural dots would go here; using symbols for demo */}
                                    <text x="50%" y="60%" textAnchor="middle" fontSize="80" fontWeight="900"
                                        fill={plate.colors.dots[0]} style={{ letterSpacing: '-5px' }}>
                                        {plate.number}
                                    </text>
                                    <circle cx="50" cy="50" r="5" fill={plate.colors.dots[1]} />
                                    <circle cx="150" cy="150" r="8" fill={plate.colors.dots[2]} />
                                    <circle cx="150" cy="50" r="6" fill={plate.colors.dots[0]} />
                                    <circle cx="50" cy="150" r="7" fill={plate.colors.dots[1]} />
                                </svg>
                            </div>

                            <form onSubmit={handleSubmit} className="guess-form">
                                <label>WHAT NUMBER DO YOU SEE?</label>
                                <input
                                    type="number"
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value)}
                                    placeholder="??"
                                    required
                                    autoFocus
                                />
                                <button type="submit" className="guess-btn">VERIFY VISION</button>
                            </form>

                            {feedback && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`feedback-msg ${feedback.type}`}>
                                    {feedback.message}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {gameState === 'learning' && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="learning-overlay">
                            <h1>THE SCIENCE OF CONES 🧬</h1>
                            <div className="cones-grid">
                                <div className="cone-card s">
                                    <div className="cone-icon">🔵</div>
                                    <h3>S-Cones</h3>
                                    <p>Sensitive to Short wavelengths (Blue).</p>
                                </div>
                                <div className="cone-card m">
                                    <div className="cone-icon">🟢</div>
                                    <h3>M-Cones</h3>
                                    <p>Sensitive to Medium wavelengths (Green).</p>
                                </div>
                                <div className="cone-card l">
                                    <div className="cone-icon">🔴</div>
                                    <h3>L-Cones</h3>
                                    <p>Sensitive to Long wavelengths (Red).</p>
                                </div>
                            </div>
                            <p className="summary-text">
                                Color blindness occurs when one or more of these cone types are missing or defective.
                                Red-green color blindness is the most common form!
                            </p>
                            <button onClick={() => setGameState('results')} className="continue-btn">VIEW RESULTS</button>
                        </motion.div>
                    )}

                    {gameState === 'results' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="results-overlay">
                            <div className="medal">🌈</div>
                            <h1>VISION CERTIFIED</h1>
                            <p>You have mastered the mechanics of color perception and cone cell biology.</p>
                            <div className="final-score">FINAL SCORE: {score} XP</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ColorVision;
