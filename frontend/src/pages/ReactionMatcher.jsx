import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReactionMatcher.css';

const REACTIONS = [
    { id: 1, eq: "CaO + H₂O → Ca(OH)₂", type: "Combination", explanation: "Two reactants combine to form a single product." },
    { id: 2, eq: "2FeSO₄ → Fe₂O₃ + SO₂ + SO₃", type: "Decomposition", explanation: "A single reactant breaks down into simpler products." },
    { id: 3, eq: "Fe + CuSO₄ → FeSO₄ + Cu", type: "Displacement", explanation: "A more reactive element (Fe) displaces a less reactive one (Cu)." },
    { id: 4, eq: "Na₂SO₄ + BaCl₂ → BaSO₄ + 2NaCl", type: "Double Displacement", explanation: "Exchange of ions between reactants, forming a precipitate." },
    { id: 5, eq: "CuO + H₂ → Cu + H₂O", type: "Redox", explanation: "Simultaneous oxidation (H₂) and reduction (CuO)." },
    { id: 6, eq: "NH₃ + HCl → NH₄Cl", type: "Combination", explanation: "Ammonia and HCl combine to form ammonium chloride." },
    { id: 7, eq: "CaCO₃ → CaO + CO₂", type: "Decomposition", explanation: "Calcium carbonate decomposes on heating." },
    { id: 8, eq: "Zn + H₂SO₄ → ZnSO₄ + H₂", type: "Displacement", explanation: "Zinc displaces hydrogen from the acid." }
];

const CATEGORIES = ["Combination", "Decomposition", "Displacement", "Double Displacement", "Redox"];

const ReactionMatcher = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameState('finished');
        }
    }, [timeLeft, gameState]);

    const handleMatch = (type) => {
        const correct = REACTIONS[currentIdx].type === type;
        if (correct) {
            setScore(prev => prev + 50);
            if (currentIdx < REACTIONS.length - 1) {
                setCurrentIdx(currentIdx + 1);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '2');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            setScore(prev => Math.max(0, prev - 20));
            // Optional: Shake animation or shake feedback
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 350) return "Hurray 🎉 Woohoo! You are a Chemistry Champion!";
        if (score >= 200) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="matcher-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stats">
                    <div className="stat">SCORE: {score}</div>
                    <div className="stat">TIME: {timeLeft}s</div>
                </div>
                <div className="title">LEVEL 2: REACTION MATCHING</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="match-view"
                        >
                            <div className="equation-card">
                                <h2>Identify the Reaction Type:</h2>
                                <div className="eq-text">{REACTIONS[currentIdx].eq}</div>
                            </div>

                            <div className="categories-grid">
                                {CATEGORIES.map(cat => (
                                    <motion.button
                                        key={cat}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleMatch(cat)}
                                        className="cat-btn"
                                    >
                                        {cat}
                                    </motion.button>
                                ))}
                            </div>
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

export default ReactionMatcher;
