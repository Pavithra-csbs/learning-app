import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import './ChemistryQuiz.css';

const QUESTIONS = [
    {
        q: "What type of reaction is: CaO + H₂O → Ca(OH)₂ + Heat?",
        options: ["Decomposition", "Combination", "Displacement", "None"],
        answer: "Combination",
        explanation: "Two substances combine to form a single product while releasing heat."
    },
    {
        q: "The brownish coating on iron nails dipped in copper sulphate is due to?",
        options: ["Rusting", "Displacement", "Oxidation", "Reduction"],
        answer: "Displacement",
        explanation: "Iron displaces copper from copper sulphate, forming a brown copper layer."
    },
    {
        q: "Which gas is released when dilute HCl reacts with Zinc?",
        options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"],
        answer: "Hydrogen",
        explanation: "Metals react with acids to release Hydrogen gas."
    },
    {
        q: "What is the chemical name of Slaked Lime?",
        options: ["Calcium Carbonate", "Calcium Oxide", "Calcium Hydroxide", "Calcium Chloride"],
        answer: "Calcium Hydroxide",
        explanation: "Ca(OH)₂ is commonly known as slaked lime."
    },
    {
        q: "What happens during a Redox reaction?",
        options: ["Only Oxidation", "Only Reduction", "Both simultaneously", "None of these"],
        answer: "Both simultaneously",
        explanation: "Redox involves both Reduction and Oxidation happening together."
    }
];

const ChemistryQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedOpt, setSelectedOpt] = useState(null);

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing' && selectedOpt === null) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && selectedOpt === null) {
            handleAnswer(null); // Time out
        }
    }, [timeLeft, gameState, selectedOpt]);

    const handleAnswer = (opt) => {
        setSelectedOpt(opt);
        const correct = opt === QUESTIONS[currentIdx].answer;

        if (correct) {
            setScore(prev => prev + 20);
            toast.success("Correct! 🎯");
        } else {
            toast.error("Incorrect! Explore the explanation.");
        }

        setTimeout(() => {
            if (currentIdx < QUESTIONS.length - 1) {
                setCurrentIdx(prev => prev + 1);
                setSelectedOpt(null);
                setTimeLeft(15);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '5');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        }, 2000);
    };

    const getMotivationalMessage = () => {
        if (score >= 100) return "Hurray 🎉 Woohoo! You are a Chemistry Champion!";
        if (score >= 60) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="quiz-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stats">
                    <div className="stat">SCORE: {score}</div>
                    <div className="stat timer">⏳ {timeLeft}s</div>
                </div>
                <div className="title">LEVEL 5: REACTION QUIZ</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="quiz-view"
                        >
                            <div className="question-card">
                                <div className="q-num">Question {currentIdx + 1}/{QUESTIONS.length}</div>
                                <h2>{QUESTIONS[currentIdx].q}</h2>
                            </div>

                            <div className="options-grid">
                                {QUESTIONS[currentIdx].options.map(opt => {
                                    const isSelected = selectedOpt === opt;
                                    const isCorrect = opt === QUESTIONS[currentIdx].answer;
                                    const showCorrect = selectedOpt !== null && isCorrect;
                                    const showWrong = selectedOpt === opt && !isCorrect;

                                    return (
                                        <button
                                            key={opt}
                                            disabled={selectedOpt !== null}
                                            onClick={() => handleAnswer(opt)}
                                            className={`opt-btn ${showCorrect ? 'right' : ''} ${showWrong ? 'wrong' : ''}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedOpt !== null && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="explanation">
                                    <strong>Explanation:</strong> {QUESTIONS[currentIdx].explanation}
                                </motion.div>
                            )}
                        </motion.div>
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
                            <h1>Final Score: {score}/100</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ChemistryQuiz;
