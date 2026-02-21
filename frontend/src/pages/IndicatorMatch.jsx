import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './IndicatorMatch.css';

const INDICATORS = [
    { id: 'ind1', name: "Litmus Paper (Acid)", target: "Red", icon: "📄", medium: "Acidic" },
    { id: 'ind2', name: "Litmus Paper (Base)", target: "Blue", icon: "📄", medium: "Basic" },
    { id: 'ind3', name: "Phenolphthalein (Acid)", target: "Colorless", icon: "🧪", medium: "Acidic" },
    { id: 'ind4', name: "Phenolphthalein (Base)", target: "Pink", icon: "🧪", medium: "Basic" },
    { id: 'ind5', name: "Methyl Orange (Acid)", target: "Red", icon: "🧪", medium: "Acidic" },
    { id: 'ind6', name: "Methyl Orange (Base)", target: "Yellow", icon: "🧪", medium: "Basic" }
];

const COLORS = ["Red", "Blue", "Pink", "Yellow", "Colorless", "Green"];

const IndicatorMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeInd = INDICATORS[currentIdx];

    const handleColorPick = (color) => {
        if (color === activeInd.target) {
            setScore(prev => prev + 100);
            toast.success("Perfect Match! 🌈");
            if (currentIdx < INDICATORS.length - 1) {
                setTimeout(() => setCurrentIdx(currentIdx + 1), 1500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '4');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Not that color. Think about the indicator!");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 600) return "Excellent 🎉 You are a Color Master!";
        if (score >= 300) return "Good job 👍 Indicators are tricky!";
        return "Don’t worry 😊 Try again!";
    };

    return (
        <div className="match-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 3: INDICATOR MATCH</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="match-view"
                        >
                            <div className="challenge-card">
                                <span className="icon">{activeInd.icon}</span>
                                <h2>{activeInd.name}</h2>
                                <p>What color does it turn in <strong>{activeInd.medium}</strong> medium?</p>
                            </div>

                            <div className="color-grid">
                                {COLORS.map(color => (
                                    <motion.button
                                        key={color}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleColorPick(color)}
                                        className={`color-btn ${color.toLowerCase()}`}
                                    >
                                        {color}
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
                                    <span key={i} className={i < (score / 200) ? 'gold' : ''}>⭐</span>
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

export default IndicatorMatch;
