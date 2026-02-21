import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ProfessorChemLabs.css';

const STAGES = [
    {
        id: 1,
        text: "Salutations, young scientist! I am Professor Chem. Today, we will explore Exothermic Reactions. First, let's select our reactant: Calcium Oxide (Quick Lime).",
        task: "Select Quick Lime",
        options: ["Calcium Oxide", "Sodium Chloride", "Copper Sulphate"],
        correct: "Calcium Oxide",
        animation: "setup"
    },
    {
        id: 2,
        text: "Excellent! Now, carefully add water to the beaker. What do you hear and feel?",
        task: "Add Water",
        options: ["Bubbling & Heat", "Freezing", "No Change"],
        correct: "Bubbling & Heat",
        animation: "reaction"
    },
    {
        id: 3,
        text: "The beaker is hot because energy is released! This is an Exothermic Combination Reaction. What is the final product formed?",
        task: "Identify Product",
        options: ["Slaked Lime", "Quick Lime", "Limestone"],
        correct: "Slaked Lime",
        animation: "result"
    },
    {
        id: 4,
        text: "One final test! If we pass CO₂ through this slaked lime (lime water), what happens?",
        task: "Pass CO₂",
        options: ["Turns Milky", "Turns Blue", "Explodes"],
        correct: "Turns Milky",
        animation: "final"
    }
];

const ProfessorChemLabs = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [isReacting, setIsReacting] = useState(false);

    const activeStage = STAGES[currentIdx];

    const handleOptionSelect = (opt) => {
        if (opt === activeStage.correct) {
            setScore(prev => prev + 250);
            setIsReacting(true);
            toast.success("Magnificent! Correct step.");

            setTimeout(() => {
                setIsReacting(false);
                if (currentIdx < STAGES.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                } else {
                    setGameState('finished');
                    localStorage.setItem('completed_levels_Chemical Reactions and Equations', '8');
                    canvasConfetti({ particleCount: 200, spread: 90, colors: ['#3b82f6', '#fbbf24', '#22c55e'] });
                }
            }, 2000);
        } else {
            setScore(prev => Math.max(0, prev - 50));
            toast.error("Think again! Professor Chem believes in you.");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 1000) return "Master of Chemistry! 🧙‍♂️ You've conquered the Virtual Lab!";
        if (score >= 500) return "Great work, Apprentice! Almost a master!";
        return "Keep learning! Science is about exploration!";
    };

    return (
        <div className="boss-lab-container">
            <Toaster position="top-center" />
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">BOSS LEVEL: PROFESSOR CHEM'S LAB</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="boss-view"
                        >
                            <div className="lab-scene">
                                <div className="professor-avatar">🧪 👴</div>
                                <div className="speech-bubble">
                                    {activeStage.text}
                                </div>

                                <div className="beaker-area">
                                    <motion.div
                                        animate={isReacting ? { y: [0, -10, 0], scale: [1, 1.05, 1] } : {}}
                                        transition={{ repeat: Infinity, duration: 0.5 }}
                                        className={`beaker ${activeStage.animation}`}
                                    >
                                        <div className="liquid"></div>
                                        {isReacting && <div className="bubbles">🫧🫧🫧</div>}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="controls">
                                <h3>{activeStage.task}</h3>
                                <div className="options-row">
                                    {activeStage.options.map(opt => (
                                        <button
                                            key={opt}
                                            disabled={isReacting}
                                            onClick={() => handleOptionSelect(opt)}
                                            className="lab-opt-btn"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card final-victory"
                        >
                            <div className="badge">🏅</div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <p>You've successfully completed the Chemical Reactions & Equations Module!</p>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="finish-btn">MISSION COMPLETE 🚀</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ProfessorChemLabs;
