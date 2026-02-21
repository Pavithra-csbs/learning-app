import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './VisionQuiz.css';

const QUIZ_DATA = [
    {
        id: 1,
        question: "How far should your computer screen be for healthy vision?",
        options: ["10-15 cm", "Arm's length (50-70 cm)", "2 meters", "Touching your nose"],
        correct: 1,
        explanation: "Keeping screens at arm's length reduces eye strain and prevents digital eye fatigue."
    },
    {
        id: 2,
        question: "Which vitamin is most essential for maintaining healthy eyesight?",
        options: ["Vitamin C", "Vitamin D", "Vitamin A", "Vitamin B12"],
        correct: 2,
        explanation: "Vitamin A is crucial for the retina; its deficiency can lead to night blindness."
    },
    {
        id: 3,
        question: "What is the '20-20-20' rule in eye care?",
        options: ["20 pushups every 20 mins", "Look 20ft away every 20 mins for 20s", "Read 20 pages in 20 mins", "Eat 20 carrots daily"],
        correct: 1,
        explanation: "The 20-20-20 rule helps relax eye muscles during prolonged screen use."
    },
    {
        id: 4,
        question: "What happens to the focal length of the eye lens when ciliary muscles relax?",
        options: ["It decreases", "It increases", "It remains same", "Infinite"],
        correct: 1,
        explanation: "When muscles relax, the lens becomes thin, increasing its focal length for viewing distant objects."
    },
    {
        id: 5,
        question: "The least distance of distinct vision for a normal young adult is:",
        options: ["25 m", "2.5 cm", "25 cm", "2.5 m"],
        correct: 2,
        explanation: "A normal eye can see objects clearly from 25 cm (Near Point) to infinity (Far Point)."
    }
];

const VisionQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [timeLeft, setTimeLeft] = useState(15);

    const handleNext = useCallback(() => {
        if (currentQuestion < QUIZ_DATA.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setTimeLeft(15);
        } else {
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    }, [currentQuestion]);

    useEffect(() => {
        if (gameState !== 'playing' || showFeedback) return;

        if (timeLeft === 0) {
            setShowFeedback(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, gameState, showFeedback]);

    const handleOptionClick = (idx) => {
        if (showFeedback) return;
        setSelectedOption(idx);
        setShowFeedback(true);

        if (idx === QUIZ_DATA[currentQuestion].correct) {
            setScore(prev => prev + (timeLeft * 10)); // Reward speed
        }
    };

    return (
        <div className="vision-quiz-container">
            <div className="snellen-bg">
                <div className="s-row">E</div>
                <div className="s-row">F P</div>
                <div className="s-row">T O Z</div>
                <div className="s-row">L P E D</div>
                <div className="s-row">P E C F D</div>
                <div className="s-row">E D F C Z P</div>
                <div className="s-row">F E L O P Z D</div>
            </div>

            <header className="quiz-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="quiz-stats">
                    <div className="timer-pill">⏰ {timeLeft}s</div>
                    <div className="score-pill">SCORE: {score}</div>
                </div>
            </header>

            <main className="quiz-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentQuestion}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="quiz-card"
                        >
                            <div className="q-progress">QUESTION {currentQuestion + 1} / {QUIZ_DATA.length}</div>
                            <h2 className="question-text">{QUIZ_DATA[currentQuestion].question}</h2>

                            <div className="options-grid">
                                {QUIZ_DATA[currentQuestion].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className={`option-btn ${selectedOption === i ? 'selected' : ''} ${showFeedback && i === QUIZ_DATA[currentQuestion].correct ? 'correct' : ''} ${showFeedback && selectedOption === i && i !== QUIZ_DATA[currentQuestion].correct ? 'wrong' : ''}`}
                                        onClick={() => handleOptionClick(i)}
                                        disabled={showFeedback}
                                    >
                                        <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {showFeedback && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="feedback-layer">
                                        <div className="exp-content">
                                            <h4>{selectedOption === QUIZ_DATA[currentQuestion].correct ? "EXCELLENT! 🌟" : "OOH, NOT QUITE 🧐"}</h4>
                                            <p>{QUIZ_DATA[currentQuestion].explanation}</p>
                                        </div>
                                        <button onClick={handleNext} className="next-btn">CONTINUE ➡️</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="results-card">
                            <div className="medal-icon">🏆</div>
                            <h1>Vision Mastery!</h1>
                            <div className="final-stats">
                                <div className="stat-item">
                                    <label>FINAL SCORE</label>
                                    <span>{score}</span>
                                </div>
                                <div className="stat-item">
                                    <label>RANK</label>
                                    <span>{score > 500 ? 'Eagle Eye' : 'Owl Watcher'}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default VisionQuiz;
