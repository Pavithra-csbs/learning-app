import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './NeutralizationPuzzle.css';

const PUZZLES = [
    {
        id: 1,
        equation: "HCl + NaOH → NaCl + H₂O",
        parts: ["HCl (Acid)", "NaOH (Base)", "NaCl (Salt)", "H₂O (Water)"],
        hint: "Hydrochloric acid and Sodium hydroxide form common salt."
    },
    {
        id: 2,
        equation: "H₂SO₄ + 2KOH → K₂SO₄ + 2H₂O",
        parts: ["H₂SO₄ (Acid)", "2KOH (Base)", "K₂SO₄ (Salt)", "2H₂O (Water)"],
        hint: "Sulphuric acid and Potassium hydroxide form Potassium sulphate."
    },
    {
        id: 3,
        equation: "HNO₃ + NH₄OH → NH₄NO₃ + H₂O",
        parts: ["HNO₃ (Acid)", "NH₄OH (Base)", "NH₄NO₃ (Salt)", "H₂O (Water)"],
        hint: "Nitric acid and Ammonium hydroxide form Ammonium nitrate."
    }
];

const NeutralizationPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userParts, setUserParts] = useState([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activePuzzle = PUZZLES[currentIdx];
    const pool = [...activePuzzle.parts].sort(() => Math.random() - 0.5);

    const handlePartClick = (part) => {
        if (userParts.includes(part)) {
            setUserParts(prev => prev.filter(p => p !== part));
        } else {
            if (userParts.length < activePuzzle.parts.length) {
                setUserParts(prev => [...prev, part]);
            }
        }
    };

    const handleCheck = () => {
        const isCorrect = userParts.every((p, i) => p === activePuzzle.parts[i]) && userParts.length === activePuzzle.parts.length;

        if (isCorrect) {
            setScore(prev => prev + 100);
            toast.success("Perfectly Neutralized! ⚗️✨");
            if (currentIdx < PUZZLES.length - 1) {
                setTimeout(() => {
                    setCurrentIdx(prev => prev + 1);
                    setUserParts([]);
                }, 2000);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '6');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Equation is not balanced or in the right order. Try again!");
            setUserParts([]);
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 300) return "Excellent 🎉 You are a Neutralization Ninja!";
        if (score >= 200) return "Good job 👍 Chemistry is logical!";
        return "Don’t worry 😊 Keep experimenting!";
    };

    return (
        <div className="puzzle-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 5: NEUTRALIZATION PUZZLE</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="puzzle-view">
                            <div className="assembly-area">
                                <div className="slots">
                                    <div className="part acid-slot">{userParts[0] || "ACID"}</div>
                                    <span className="plus">+</span>
                                    <div className="part base-slot">{userParts[1] || "BASE"}</div>
                                    <span className="arrow">→</span>
                                    <div className="part salt-slot">{userParts[2] || "SALT"}</div>
                                    <span className="plus">+</span>
                                    <div className="part water-slot">{userParts[3] || "WATER"}</div>
                                </div>
                            </div>

                            <div className="hint-box">💡 <em>{activePuzzle.hint}</em></div>

                            <div className="parts-pool">
                                {activePuzzle.parts.map(part => (
                                    <button
                                        key={part}
                                        disabled={userParts.includes(part)}
                                        onClick={() => handlePartClick(part)}
                                        className="pool-btn"
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>

                            <div className="controls">
                                <button onClick={() => setUserParts([])} className="reset-btn">RESET</button>
                                <button onClick={handleCheck} className="check-btn">CHECK EQUATION</button>
                            </div>
                        </div>
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
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default NeutralizationPuzzle;
