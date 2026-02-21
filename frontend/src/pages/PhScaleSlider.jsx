import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PhScaleSlider.css';

const SUBSTANCES = [
    { name: "Lemon Juice", ph: 2.2, type: "Strong Acid", icon: "🍋", description: "Rich in citric acid." },
    { name: "Pure Water", ph: 7.0, type: "Neutral", icon: "💧", description: "The standard for neutrality." },
    { name: "Baking Soda Solution", ph: 9.0, type: "Weak Base", icon: "🧂", description: "Commonly used as an antacid." },
    { name: "Vinegar", ph: 3.0, type: "Acid", icon: "🍱", description: "Contains acetic acid." },
    { name: "Soapy Water", ph: 12.0, type: "Strong Base", icon: "🧼", description: "Slippery to touch, typical of bases." }
];

const PhScaleSlider = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [currentVal, setCurrentVal] = useState(7);
    const [gameState, setGameState] = useState('playing'); // playing, checking, finished
    const [score, setScore] = useState(0);

    const activeSub = SUBSTANCES[currentIdx];

    const handleCheck = () => {
        const diff = Math.abs(currentVal - activeSub.ph);
        const isCorrect = diff <= 1.0; // Allow a small margin for the slider

        if (isCorrect) {
            setScore(prev => prev + 100);
            toast.success(`Correct! pH of ${activeSub.name} is about ${activeSub.ph}`);
            if (currentIdx < SUBSTANCES.length - 1) {
                setTimeout(() => {
                    setCurrentIdx(currentIdx + 1);
                    setCurrentVal(7);
                }, 2000);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '2');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Not quite! Try sliding the marker again.");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 500) return "Excellent 🎉 You are a pH Pro!";
        if (score >= 300) return "Good job 👍 Keep practicing!";
        return "Don’t worry 😊 Try again!";
    };

    return (
        <div className="ph-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 1: pH SCALE SLIDER</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="slider-view"
                        >
                            <div className="substance-card">
                                <span className="icon">{activeSub.icon}</span>
                                <h2>{activeSub.name}</h2>
                                <p>{activeSub.description}</p>
                            </div>

                            <div className="interactive-scale">
                                <div className="scale-labels">
                                    <span>Acidic (0)</span>
                                    <span>Neutral (7)</span>
                                    <span>Basic (14)</span>
                                </div>
                                <div className="ph-strip">
                                    <input
                                        type="range"
                                        min="0"
                                        max="14"
                                        step="0.1"
                                        value={currentVal}
                                        onChange={(e) => setCurrentVal(parseFloat(e.target.value))}
                                        className="ph-input"
                                        style={{ accentColor: getPhColor(currentVal) }}
                                    />
                                    <div className="current-ph-display" style={{ color: getPhColor(currentVal) }}>
                                        CURRENT SELECTION: {currentVal}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleCheck} className="check-btn">LOCK pH 🔒</button>
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

const getPhColor = (val) => {
    if (val < 7) {
        // Red to Yellow
        const r = 255;
        const g = Math.floor((val / 7) * 255);
        return `rgb(${r}, ${g}, 0)`;
    } else if (val === 7) {
        return '#34c759';
    } else {
        // Green to Blue/Purple
        const b = Math.floor(((val - 7) / 7) * 255);
        const g = 255 - b;
        return `rgb(0, ${g}, ${b})`;
    }
};

export default PhScaleSlider;
