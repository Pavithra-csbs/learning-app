import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './LabSafetyGame.css';

const ITEMS = [
    { id: 1, text: "Wearing Safety Goggles", safe: true, type: "Practice" },
    { id: 2, text: "Tasting Chemicals", safe: false, type: "Practice" },
    { id: 3, text: "Keeping Lab Coat buttoned", safe: true, type: "Practice" },
    { id: 4, text: "Eating inside the Lab", safe: false, type: "Practice" },
    { id: 5, text: "Washing hands after experiments", safe: true, type: "Practice" },
    { id: 6, text: "Heating test tube towards a friend", safe: false, type: "Practice" },
    { id: 7, text: "Adding Water to Acid (incorrect way)", safe: false, type: "Practice" },
    { id: 8, text: "Checking smell by wafting gently", safe: true, type: "Practice" }
];

const LabSafetyGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleSort = (isSafe) => {
        const item = ITEMS[currentIdx];
        if (item.safe === isSafe) {
            setScore(prev => prev + 25);
            toast.success("Correct! Safety First! ✅");
        } else {
            toast.error("Danger! Improper practice. ⚠️");
        }

        if (currentIdx < ITEMS.length - 1) {
            setCurrentIdx(prev => prev + 1);
        } else {
            setGameState('finished');
            localStorage.setItem('completed_levels_Chemical Reactions and Equations', '6');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 200) return "Hurray 🎉 Woohoo! You are a Lab Safety Expert!";
        if (score >= 100) return "Good job 👍 Always be careful in the lab!";
        return "Don’t feel bad 😊 Study the safety rules again!";
    };

    return (
        <div className="safety-game-container">
            <Toaster position="top-center" />
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 6: LAB SAFETY MASTER</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="safety-view"
                        >
                            <div className="practice-card">
                                <h3>Is this Practice Safe?</h3>
                                <div className="practice-text">{ITEMS[currentIdx].text}</div>
                            </div>

                            <div className="bins-row">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleSort(true)}
                                    className="bin safe-bin"
                                >
                                    <div className="icon">🛡️</div>
                                    <div className="label">SAFE</div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleSort(false)}
                                    className="bin unsafe-bin"
                                >
                                    <div className="icon">⚠️</div>
                                    <div className="label">UNSAFE</div>
                                </motion.button>
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
                                    <span key={i} className={i < (score / 70) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}/200</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default LabSafetyGame;
