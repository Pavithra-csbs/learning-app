import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ProfessorAcidusLab.css';

const CHALLENGES = [
    {
        id: 1,
        mission: "Identify the unknown liquid. It turns Phenolphthalein PINK.",
        options: ["HCl (Acid)", "NaOH (Base)", "Distilled Water"],
        answer: "NaOH (Base)",
        explanation: "Phenolphthalein turns pink only in basic solutions."
    },
    {
        id: 2,
        mission: "Produce Magnesium Chloride salt. Select the correct reactant for HCl.",
        options: ["Mg (Metal)", "Mg(OH)₂ (Base)", "MgO (Oxide)", "All of these"],
        answer: "All of these",
        explanation: "Acids react with metals, bases, and metallic oxides to form salts."
    },
    {
        id: 3,
        mission: "The pH of a solution is 2.0. If we add equal amount of NaOH (pH 12), the new pH will be closer to...",
        options: ["0.0", "7.0 (Neutral)", "14.0"],
        answer: "7.0 (Neutral)",
        explanation: "Neutralization reaction between acid and base moves pH towards 7."
    }
];

const ProfessorAcidusLab = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeC = CHALLENGES[currentIdx];

    const handleAnswer = (opt) => {
        if (opt === activeC.answer) {
            setScore(prev => prev + 200);
            toast.success("Brilliant! 🧪🧠");
            if (currentIdx < CHALLENGES.length - 1) {
                setTimeout(() => setCurrentIdx(prev => prev + 1), 2000);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '9');
                canvasConfetti({ particleCount: 200, spread: 90 });
            }
        } else {
            toast.error("Incorrect. Use your notes!");
            setScore(prev => Math.max(0, prev - 50));
        }
    };

    return (
        <div className="boss-lab-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">BOSS LEVEL: PROFESSOR ACIDUS</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="boss-view">
                            <div className="professor-box">
                                <div className="avatar">👨‍🔬</div>
                                <div className="speech-bubble">
                                    "{activeC.mission}"
                                </div>
                            </div>

                            <div className="lab-options">
                                {activeC.options.map(opt => (
                                    <motion.button
                                        key={opt}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer(opt)}
                                        className="lab-btn"
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
                            <div className="badge">🏆 MASTER OF ACIDS & BASES</div>
                            <h2>Incredible performance! 🧪✨</h2>
                            <h1>Final Score: {score}</h1>
                            <p>You have successfully completed every level in this module.</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">RETURN TO MISSION MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ProfessorAcidusLab;
