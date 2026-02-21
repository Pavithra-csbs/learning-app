import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './OreQuiz.css';

const QUESTIONS = [
    {
        q: "What is the process of heating sulfide ores in excess air called?",
        options: ["Calcination", "Roasting", "Reduction", "Electrolysis"],
        answer: "Roasting",
        explanation: "Roasting converts sulfide ores into oxides by heating them strongly in excess air."
    },
    {
        q: "Which method is used for carbonate ores in limited supply of air?",
        options: ["Calcination", "Roasting", "Galvanization", "Refining"],
        answer: "Calcination",
        explanation: "Calcination involves heating carbonate ores in limited air to remove CO₂."
    },
    {
        q: "Which metal is extracted by electrolysis of its molten chloride?",
        options: ["Iron", "Sodium", "Copper", "Gold"],
        answer: "Sodium",
        explanation: "Highly reactive metals like Sodium are extracted by electrolysis of their molten salts."
    },
    {
        q: "In the reactivity series, which metals occur in free state in nature?",
        options: ["Mg, Al", "Fe, Zn", "Ag, Au", "K, Na"],
        answer: "Ag, Au",
        explanation: "Metals at the bottom of the series (Gold, Silver) are least reactive and occur in native form."
    }
];

const OreQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [selectedOpt, setSelectedOpt] = useState(null);

    const handleAnswer = (opt) => {
        setSelectedOpt(opt);
        const correct = opt === QUESTIONS[currentIdx].answer;

        if (correct) {
            setScore(prev => prev + 25);
            toast.success("Correct! ⛏️💎");
        } else {
            toast.error("Not quite. Check the explanation!");
        }

        setTimeout(() => {
            if (currentIdx < QUESTIONS.length - 1) {
                setCurrentIdx(prev => prev + 1);
                setSelectedOpt(null);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Metals and Non-metals', '5');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        }, 2500);
    };

    return (
        <div className="quiz-game-container ore-theme">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}/100</div>
                <div className="title">LEVEL 4: ORE EXTRACTION QUIZ</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="quiz-view"
                        >
                            <div className="question-card">
                                <h3>Question {currentIdx + 1}/{QUESTIONS.length}</h3>
                                <h2>{QUESTIONS[currentIdx].q}</h2>
                            </div>

                            <div className="options-grid">
                                {QUESTIONS[currentIdx].options.map(opt => (
                                    <button
                                        key={opt}
                                        disabled={selectedOpt !== null}
                                        onClick={() => handleAnswer(opt)}
                                        className={`opt-btn ${selectedOpt === opt ? (opt === QUESTIONS[currentIdx].answer ? 'right' : 'wrong') : ''}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            {selectedOpt !== null && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="explanation">
                                    💡 <strong>Fact:</strong> {QUESTIONS[currentIdx].explanation}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">⭐ ⭐ ⭐</div>
                            <h2>Nice work 👍 Mining Master!</h2>
                            <h1>Final Score: {score}/100</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default OreQuiz;
