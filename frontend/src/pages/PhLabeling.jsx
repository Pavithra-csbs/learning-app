import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PhLabeling.css';

const LABELS = [
    { id: 'l1', name: "Gastric Juice", value: "1.2", category: "strong-acid" },
    { id: 'l2', name: "Lemon Juice", value: "2.2", category: "acid" },
    { id: 'l3', name: "Pure Water", value: "7.0", category: "neutral" },
    { id: 'l4', name: "Milk of Magnesia", value: "10", category: "base" },
    { id: 'l5', name: "Sodium Hydroxide", value: "14", category: "strong-base" },
    { id: 'l6', name: "Blood", value: "7.4", category: "neutral" }
];

const PhLabeling = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState({}); // { labelName: phValue }
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const phValues = LABELS.map(l => l.value).sort(() => Math.random() - 0.5);
    const substances = LABELS.map(l => l.name);

    const handleMatch = (substance, ph) => {
        setMatches(prev => ({ ...prev, [substance]: ph }));
    };

    const handleCheck = () => {
        let correctCount = 0;
        LABELS.forEach(label => {
            if (matches[label.name] === label.value) {
                correctCount++;
            }
        });

        if (correctCount === LABELS.length) {
            setScore(100);
            setGameState('finished');
            localStorage.setItem('completed_levels_Acids, Bases and Salts', '7');
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("All Correct! You know your pH values! 🥂");
        } else {
            setScore(correctCount * 10);
            toast.error(`Only ${correctCount}/${LABELS.length} correct. Try again!`);
        }
    };

    const getMotivationalMessage = () => {
        if (score === 100) return "Masterful 🎉 pH Perfection!";
        if (score >= 50) return "Good attempt 👍 Some values are very close!";
        return "Keep trying 😊 Research the NCERT chart!";
    };

    return (
        <div className="label-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 6: pH LABEL MATCHING</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="label-view">
                            <div className="labels-shelf">
                                <h3>DRAG pH VALUES TO SUBSTANCES</h3>
                                <div className="substances-grid">
                                    {substances.map(sub => (
                                        <div key={sub} className="match-row">
                                            <div className="substance-label">{sub}</div>
                                            <select
                                                className="ph-dropdown"
                                                value={matches[sub] || ""}
                                                onChange={(e) => handleMatch(sub, e.target.value)}
                                            >
                                                <option value="">Select pH</option>
                                                {phValues.map(v => (
                                                    <option key={v} value={v}>{v}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleCheck} className="check-btn">VALIDATE LABELS</button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 34) ? 'gold' : ''}>⭐</span>
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

export default PhLabeling;
