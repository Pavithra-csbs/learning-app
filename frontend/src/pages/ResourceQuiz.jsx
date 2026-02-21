import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import { playSFX } from '../utils/audio';
import './ResourceQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Which movement was started to protect the Khejri trees in Rajasthan?",
        options: ["Chipko Andolan", "Bishnoi Movement", "Narmada Bachao", "Appiko Movement"],
        answer: "Bishnoi Movement",
        icon: "🌳",
        explanation: "Amrita Devi Bishnoi and others sacrificed their lives in 1731 to protect Khejri trees."
    },
    {
        id: 2,
        question: "What is the main purpose of constructing dams on rivers?",
        options: ["Stop rainfall", "Electricity & Irrigation", "Increase fish count", "Cool the water"],
        answer: "Electricity & Irrigation",
        icon: "🏗️",
        explanation: "Dams store water for agricultural use and generate hydroelectric power."
    },
    {
        id: 3,
        question: "Which of these is a traditional water harvesting method in Rajasthan?",
        options: ["Khadins", "Ahars", "Kulhs", "Eris"],
        answer: "Khadins",
        icon: "💧",
        explanation: "Khadins are traditional rainwater harvesting structures used in Rajasthan's arid regions."
    },
    {
        id: 4,
        question: "Chipko Andolan (Hug the Trees) originated in which region?",
        options: ["Kerala", "Garhwal Himalayas", "Thar Desert", "Sunderbans"],
        answer: "Garhwal Himalayas",
        icon: "🤗",
        explanation: "Started in the 1970s in Reni village, Garhwal, to prevent commercial logging."
    },
    {
        id: 5,
        question: "What does 'Coliform' bacteria in water indicate?",
        options: ["Rich minerals", "Cleanliness", "Contamination by disease-causing microbes", "High oxygen"],
        answer: "Contamination by disease-causing microbes",
        icon: "🔬",
        explanation: "Presence of coliform (found in human intestines) indicates sewage contamination."
    }
];

const ResourceQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExpl, setShowExpl] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        if (gameState !== 'playing' || showExpl) return;

        if (timeLeft === 0) {
            handleAnswer(null);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState, showExpl]);

    const handleAnswer = (option) => {
        setSelectedOption(option);
        const correct = option === QUESTIONS[currentIdx].answer;
        setIsCorrect(correct);

        if (correct) {
            const bonus = timeLeft > 10 ? 20 : timeLeft > 5 ? 15 : 10;
            setScore(s => s + bonus);
            playSFX('correct');
            toast.success("Correct! 🌟");
        } else {
            playSFX('wrong');
            toast.error(option === null ? "Time's Up! ⏱️" : "Wrong Answer! ❌");
        }

        setShowExpl(true);
    };

    const nextQuestion = () => {
        setShowExpl(false);
        setSelectedOption(null);
        setTimeLeft(15);
        if (currentIdx < QUESTIONS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 60) {
                playSFX('levelUp');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 3) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        const stars = score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐';
        return (
            <div className="rq-finish-screen">
                <motion.div className="rq-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Quiz Completed! 📝</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Knowledge Score: {score}</p>
                    <p className="motivational-text">
                        {score >= 80 ? "Excellent 🎉 You are a Smart Resource Manager!" :
                            score >= 50 ? "Good job 👍 You are learning to save Earth!" :
                                "Don't worry 😊 Save resources, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 3: Puzzle →</button>
                </motion.div>
            </div>
        );
    }

    const q = QUESTIONS[currentIdx];

    return (
        <div className="resource-quiz-container">
            <header className="rq-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <div className="rq-progress">
                    <div className="progress-fill" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}></div>
                </div>
                <div className="rq-timer" style={{ color: timeLeft < 5 ? '#f43f5e' : '#fff' }}>
                    ⏱️ {timeLeft}s
                </div>
            </header>

            <main className="rq-main">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="q-card"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                        >
                            <span className="q-icon">{q.icon}</span>
                            <h3>{q.question}</h3>
                            <div className="options-grid">
                                {q.options.map((opt, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(opt)}
                                        className={`opt-btn ${selectedOption === opt ? 'selected' : ''}`}
                                    >
                                        {opt}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`expl-view ${isCorrect ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="status-label">{isCorrect ? "✅ CORRECT" : "❌ INCORRECT"}</div>
                            <p className="ans-text">The answer is: <strong>{q.answer}</strong></p>
                            <div className="exp-box">
                                <p>{q.explanation}</p>
                            </div>
                            <button className="next-btn" onClick={nextQuestion}>
                                {currentIdx === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question →"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="current-score">Current Score: {score}</div>
            </main>
        </div>
    );
};

export default ResourceQuiz;
