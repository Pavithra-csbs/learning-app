import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './DrMetallusBoss.css';

const CHALLENGES = [
    {
        id: 1,
        mission: "Dr. Metallus is building a bridge! Which process is BEST to prevent iron rust permanently?",
        options: ["Painting", "Applying Grease", "Galvanization", "Washing with water"],
        answer: "Galvanization",
        explanation: "Galvanization provides permanent protection by using Zinc as a sacrificial layer."
    },
    {
        id: 2,
        mission: "A metal 'X' reacts vigorously with cold water. What is 'X'?",
        options: ["Iron", "Sodium", "Copper", "Gold"],
        answer: "Sodium",
        explanation: "Sodium and Potassium are highly reactive and react violently with cold water."
    },
    {
        id: 3,
        mission: "We have a Carbonate ore. Which step comes BEFORE reduction?",
        options: ["Roasting", "Calcination", "Refining", "Oiling"],
        answer: "Calcination",
        explanation: "Carbonate ores are converted to oxides through Calcination (heating in limited air)."
    },
    {
        id: 4,
        mission: "Which non-metal is a good conductor of electricity?",
        options: ["Sulfur", "Iodine", "Graphite", "Chlorine"],
        answer: "Graphite",
        explanation: "Graphite (an allotrope of Carbon) is an exceptional non-metal that conducts electricity."
    }
];

const DrMetallusBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeC = CHALLENGES[currentIdx];

    const handleAnswer = (opt) => {
        if (opt === activeC.answer) {
            setScore(prev => prev + 250);
            toast.success("Correct! Dr. Metallus is impressed! 🤖🧠");
            if (currentIdx < CHALLENGES.length - 1) {
                setTimeout(() => setCurrentIdx(prev => prev + 1), 2000);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Metals and Non-metals', '9');
                canvasConfetti({ particleCount: 200, spread: 90 });
            }
        } else {
            toast.error("Incorrect! You lose points.");
            setScore(prev => Math.max(0, prev - 50));
        }
    };

    return (
        <div className="boss-game-container metallurgical-theme">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">BOSS LEVEL: DR. METALLUS</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="boss-view">
                            <div className="boss-avatar">🤖</div>
                            <div className="mission-bubble">
                                <div className="boss-name">DR. METALLUS:</div>
                                <div className="text">"{activeC.mission}"</div>
                            </div>

                            <div className="options-stack">
                                {activeC.options.map(opt => (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ scale: 1.02, x: 10 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(opt)}
                                        className="opt-row"
                                    >
                                        {opt}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="badge">🏆 METAL SCIENCE MASTER</div>
                            <h2>System Mission Accomplished! 🎉</h2>
                            <h1>Final Score: {score}</h1>
                            <p>You have mastered the properties, reactivity, and extraction of metals.</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">RETURN TO MISSION MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default DrMetallusBoss;
