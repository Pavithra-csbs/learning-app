import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './SymbolConverter.css';

const PROBLEMS = [
    {
        word: "Hydrogen + Oxygen → Water",
        correct: "H₂ + O₂ → H₂O",
        parts: ["H₂", "+", "O₂", "→", "H₂O"],
        hints: "Hydrogen and Oxygen are diatomic molecules (H₂, O₂)."
    },
    {
        word: "Magnesium + Oxygen → Magnesium Oxide",
        correct: "Mg + O₂ → MgO",
        parts: ["Mg", "+", "O₂", "→", "MgO"],
        hints: "Magnesium is a metal (Mg), Oxygen is O₂."
    },
    {
        word: "Zinc + Sulphuric Acid → Zinc Sulphate + Hydrogen",
        correct: "Zn + H₂SO₄ → ZnSO₄ + H₂",
        parts: ["Zn", "+", "H₂SO₄", "→", "ZnSO₄", "+", "H₂"],
        hints: "Zinc is Zn, Sulphuric acid is H₂SO₄."
    },
    {
        word: "Sodium + Water → Sodium Hydroxide + Hydrogen",
        correct: "Na + H₂O → NaOH + H₂",
        parts: ["Na", "+", "H₂O", "→", "NaOH", "+", "H₂"],
        hints: "Metals like Na react with water to form hydroxides."
    }
];

const SymbolConverter = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userInputs, setUserInputs] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const activeProb = PROBLEMS[currentIdx];

    const handleSubmit = () => {
        const fullString = userInputs.join(' ').replace(/\s+/g, ' ');
        const correctString = activeProb.parts.join(' ');

        if (fullString === correctString) {
            setScore(prev => prev + 100);
            if (currentIdx < PROBLEMS.length - 1) {
                toast.success("Perfect Formula! Next...");
                setTimeout(() => {
                    setCurrentIdx(currentIdx + 1);
                    setUserInputs([]);
                    setShowHint(false);
                }, 1500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '3');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Formula mismatch. Try again!");
        }
    };

    const addPart = (part) => {
        setUserInputs([...userInputs, part]);
    };

    const clearInputs = () => setUserInputs([]);

    const getMotivationalMessage = () => {
        if (score >= 400) return "Hurray 🎉 Woohoo! You are a Chemistry Champion!";
        if (score >= 200) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    // Combine all unique parts from all problems for the picker
    const allOptions = Array.from(new Set(PROBLEMS.flatMap(p => p.parts))).sort();

    return (
        <div className="symbol-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 3: SYMBOL CONVERTER</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="converter-view"
                        >
                            <div className="word-equation-card">
                                <h2>Convert to Symbols:</h2>
                                <div className="word-text">{activeProb.word}</div>
                            </div>

                            <div className="display-area">
                                {userInputs.length === 0 ? (
                                    <span className="placeholder">Pick elements to build equation...</span>
                                ) : (
                                    <div className="built-eq">
                                        {userInputs.map((p, i) => (
                                            <span key={i} className={`part ${p === '→' || p === '+' ? 'op' : ''}`}>{p}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="picker-grid">
                                {allOptions.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => addPart(opt)}
                                        className={`opt-btn ${opt === '→' || opt === '+' ? 'op-btn' : ''}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <div className="action-row">
                                <button onClick={clearInputs} className="clear-btn">❌ CLEAR</button>
                                <button onClick={() => setShowHint(true)} className="hint-btn">💡 HINT</button>
                                <button onClick={handleSubmit} className="submit-btn" disabled={userInputs.length === 0}>SUBMIT EQUATION 🚀</button>
                            </div>

                            {showHint && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hint-box">
                                    {activeProb.hints}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 150) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SymbolConverter;
