import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PollutionQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Which of these gases is the main cause of Global Warming?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        answer: "Carbon Dioxide",
        icon: "🌡️",
        explanation: "Carbon Dioxide traps heat in the atmosphere, leading to the greenhouse effect and global warming."
    },
    {
        id: 2,
        question: "What is the result of presence of excess fertilizers in water bodies?",
        options: ["Oil Spills", "Eutrophication", "Acid Rain", "Ozone Depletion"],
        answer: "Eutrophication",
        icon: "🌊",
        explanation: "Excess nutrients lead to algal blooms that deplete oxygen in water, killing fish (Eutrophication)."
    },
    {
        id: 3,
        question: "Which process causes the accumulation of harmful chemicals in high trophic levels?",
        options: ["Photosynthesis", "Biological Magnification", "Transpiration", "Decomposition"],
        answer: "Biological Magnification",
        icon: "🦅",
        explanation: "Non-biodegradable chemicals like DDT get concentrated as they move up the food chain."
    },
    {
        id: 4,
        question: "What does the Ozone layer protect us from?",
        options: ["Infrared Rays", "UV Radiation", "Gamma Rays", "X-Rays"],
        answer: "UV Radiation",
        icon: "🛡️",
        explanation: "The ozone layer (O3) filters harmful Ultraviolet (UV) rays that can cause skin cancer."
    },
    {
        id: 5,
        question: "Which of these is a non-biodegradable waste?",
        options: ["Paper", "Plastic Bag", "Vegetable Peels", "Wood"],
        answer: "Plastic Bag",
        icon: "🛍️",
        explanation: "Plastics take hundreds of years to break down, polluting ecosystems persistently."
    },
    {
        id: 6,
        question: "Smog is a combination of which two components?",
        options: ["Smoke and Fog", "Smoke and Oxygen", "Dust and Rain", "Fog and Mist"],
        answer: "Smoke and Fog",
        icon: "🌫️",
        explanation: "Smog is a type of intense air pollution that reduces visibility and harms respiratory health."
    }
];

const PollutionQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    useEffect(() => {
        if (gameState !== 'playing' || showExplanation) return;

        if (timeLeft === 0) {
            handleAnswer(null); // Timeout as wrong answer
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState, showExplanation]);

    const handleAnswer = (option) => {
        setSelectedOption(option);
        const correct = option === QUESTIONS[currentIdx].answer;
        setIsCorrect(correct);

        if (correct) {
            const bonus = timeLeft > 10 ? 20 : timeLeft > 5 ? 15 : 10;
            setScore(s => s + bonus);
            toast.success("Correct Answer!");
        } else {
            toast.error(option === null ? "Time's Up!" : "Wrong Answer!");
        }

        setShowExplanation(true);
    };

    const nextQuestion = () => {
        setShowExplanation(false);
        setSelectedOption(null);
        setTimeLeft(15);
        if (currentIdx < QUESTIONS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 80) canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 3) localStorage.setItem('completed_levels_Our Environment', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        const stars = score >= 90 ? '⭐⭐⭐' : score >= 60 ? '⭐⭐' : '⭐';
        return (
            <div className="pq-finish-screen">
                <motion.div className="pq-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Quiz Completed! 📝</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Eco Score: {score}</p>
                    <p className="motivational-text">
                        {score >= 90 ? "Hurray 🎉 You are an Eco Hero!" :
                            score >= 60 ? "Good job 👍 Let's make Earth greener!" :
                                "Don't worry 😊 Earth needs you, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Clean Earth Puzzle →</button>
                </motion.div>
            </div>
        );
    }

    const q = QUESTIONS[currentIdx];

    return (
        <div className="pollution-quiz-container">
            <header className="pq-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <div className="pq-progress">
                    <div className="progress-fill" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}></div>
                </div>
                <div className="pq-timer" style={{ color: timeLeft < 5 ? '#f43f5e' : '#fff' }}>
                    ⏱️ {timeLeft}s
                </div>
            </header>

            <main className="pq-main">
                <AnimatePresence mode="wait">
                    {!showExplanation ? (
                        <motion.div
                            key={currentIdx}
                            className="question-card"
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
                            className={`explanation-view ${isCorrect ? 'correct' : 'incorrect'}`}
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

export default PollutionQuiz;
