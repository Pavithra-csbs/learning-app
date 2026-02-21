import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './HouseholdQuiz.css';

const QUESTIONS = [
    {
        q: "Which substance is used to relieve acidity in the stomach?",
        options: ["Lemon Juice", "Antacid (Milk of Magnesia)", "Vinegar", "Water"],
        answer: "Antacid (Milk of Magnesia)",
        explanation: "Antacids are mild bases that neutralize excess HCl in the stomach."
    },
    {
        q: "What is the nature of Toothpaste?",
        options: ["Acidic", "Basic", "Neutral", "Corrosive"],
        answer: "Basic",
        explanation: "Toothpaste is basic to neutralize the acid produced by bacteria in the mouth."
    },
    {
        q: "Why does Curd taste sour?",
        options: ["It is a base", "It contains Lactic Acid", "It is neutral", "It contains Salt"],
        answer: "It contains Lactic Acid",
        explanation: "Curd is sour because of the presence of Lactic acid."
    },
    {
        q: "Which of these is commonly used in batteries?",
        options: ["Acetic Acid", "Sulphuric Acid", "Citric Acid", "Nitric Acid"],
        answer: "Sulphuric Acid",
        explanation: "Sulphuric acid (H₂SO₄) is a strong mineral acid used in lead-acid batteries."
    },
    {
        q: "Soap solutions feel slippery because they are...",
        options: ["Acidic", "Neutral", "Basic", "Salty"],
        answer: "Basic",
        explanation: "Bases feel soapy or slippery to the touch."
    }
];

const HouseholdQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [selectedOpt, setSelectedOpt] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);

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
            toast.error(opt === null ? "Time's up! ⏰" : "Oops! Incorrect.");
        }

        setTimeout(() => {
            if (currentIdx < QUESTIONS.length - 1) {
                setCurrentIdx(prev => prev + 1);
                setSelectedOpt(null);
                setTimeLeft(15);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '5');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        }, 2000);
    };

    const getMotivationalMessage = () => {
        if (score >= 100) return "Excellent 🎉 You are a Daily Life Chemist!";
        if (score >= 60) return "Good job 👍 Practical knowledge is key!";
        return "Don’t worry 😊 Try again!";
    };

    return (
        <div className="quiz-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stats">
                    <div className="stat">SCORE: {score}</div>
                    <div className="stat timer">⏳ {timeLeft}s</div>
                </div>
                <div className="title">LEVEL 4: HOUSEHOLD QUIZ</div>
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
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default HouseholdQuiz;
