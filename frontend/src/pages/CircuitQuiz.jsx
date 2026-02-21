import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CircuitQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Which of these circuit diagrams represents a PARALLEL connection?",
        options: ["Diagram A", "Diagram B", "Diagram C", "Diagram D"],
        answer: 1, // Diagram B
        explanation: "In a parallel circuit, there are multiple paths for current to flow. Diagram B shows two loops connected across the same voltage source.",
        diagram: "parallel-comparison"
    },
    {
        id: 2,
        question: "If one bulb in a SERIES circuit breaks, what happens to the others?",
        options: ["They get brighter", "They stay the same", "They all go out", "Only one stays on"],
        answer: 2,
        explanation: "Series circuits have only one path. If that path is broken anywhere, the entire circuit stops functioning.",
        diagram: "series-break"
    },
    {
        id: 3,
        question: "What is the total resistance in this circuit?",
        options: ["5Ω", "15Ω", "10Ω", "20Ω"],
        answer: 1,
        explanation: "For series resistors, R_total = R1 + R2. Here, 5Ω + 10Ω = 15Ω.",
        diagram: "series-calc"
    },
    {
        id: 4,
        question: "Identify the symbol for a VOLTMETER.",
        options: ["(A)", "(V)", "(G)", "(S)"],
        answer: 1,
        explanation: "A circle with a 'V' represents a Voltmeter, used to measure potential difference across components.",
        diagram: "symbols"
    }
];

const CircuitQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameState, setGameState] = useState('playing'); // playing, feedback, finished
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const question = QUESTIONS[currentQuestionIdx];

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIdx < QUESTIONS.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setTimeLeft(15);
            setSelectedOption(null);
            setIsCorrect(null);
            setGameState('playing');
        } else {
            setGameState('finished');
            if (score >= 300) {
                canvasConfetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            }
        }
    }, [currentQuestionIdx, score]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleAnswer(-1); // Time's up
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, handleNextQuestion]);

    const handleAnswer = (optionIdx) => {
        if (gameState !== 'playing') return;

        setSelectedOption(optionIdx);
        const correct = optionIdx === question.answer;
        setIsCorrect(correct);
        setGameState('feedback');

        if (correct) {
            setScore(prev => prev + 100 + (timeLeft * 5));
        }
    };

    const renderDiagram = () => {
        switch (question.diagram) {
            case "parallel-comparison":
                return (
                    <svg viewBox="0 0 400 150" className="quiz-svg">
                        <g transform="translate(10, 10)">
                            <text x="50" y="20" fill="#94a3b8" fontSize="12">A (Series)</text>
                            <rect x="20" y="30" width="100" height="60" fill="none" stroke="#475569" strokeWidth="2" />
                            <circle cx="50" cy="30" r="5" fill="#fbbf24" />
                            <circle cx="90" cy="30" r="5" fill="#fbbf24" />
                        </g>
                        <g transform="translate(140, 10)">
                            <text x="50" y="20" fill="#38bdf8" fontSize="12" fontWeight="bold">B (Parallel)</text>
                            <rect x="20" y="30" width="100" height="60" fill="none" stroke="#38bdf8" strokeWidth="3" />
                            <line x1="20" y1="60" x2="120" y2="60" stroke="#38bdf8" strokeWidth="2" />
                            <circle cx="70" cy="30" r="5" fill="#fbbf24" stroke="white" strokeWidth="1" />
                            <circle cx="70" cy="60" r="5" fill="#fbbf24" stroke="white" strokeWidth="1" />
                        </g>
                        <g transform="translate(270, 10)">
                            <text x="50" y="20" fill="#94a3b8" fontSize="12">C (Open)</text>
                            <path d="M 20 60 L 50 60 M 70 40 L 120 60" stroke="#475569" strokeWidth="2" />
                        </g>
                    </svg>
                );
            case "series-calc":
                return (
                    <svg viewBox="0 0 300 120" className="quiz-svg">
                        <rect x="50" y="30" width="200" height="60" fill="none" stroke="#38bdf8" strokeWidth="3" rx="10" />
                        <path d="M 100 20 l 5 10 l 10 -20 l 10 20 l 10 -20 l 5 10" transform="translate(50, 0)" fill="none" stroke="#f87171" strokeWidth="3" />
                        <text x="110" y="25" fill="#f87171" fontSize="14" fontWeight="bold">5Ω</text>
                        <path d="M 100 20 l 5 10 l 10 -20 l 10 20 l 10 -20 l 5 10" transform="translate(130, 0)" fill="none" stroke="#f87171" strokeWidth="3" />
                        <text x="190" y="25" fill="#f87171" fontSize="14" fontWeight="bold">10Ω</text>
                        <circle cx="50" cy="60" r="10" fill="#fbbf24" />
                        <text x="35" y="85" fill="#fbbf24" fontSize="12" fontWeight="bold">V</text>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getFeedback = () => {
        const percent = (correctAnswersCount / QUESTIONS.length) * 100;
        if (percent === 100) return {
            msg: "Hurray 🎉 Woohoo! You are an Electricity Champion!",
            stars: 3,
            class: 'full'
        };
        if (percent >= 50) return {
            msg: "Good job 👍 Try for full score!",
            stars: 2,
            class: 'med'
        };
        return {
            msg: "Don’t feel bad 😊 Try again!",
            stars: 1,
            class: 'low'
        };
    };

    const feedback = getFeedback();
    const percentCorrect = (correctAnswersCount / QUESTIONS.length) * 100;

    useEffect(() => {
        if (showResults && percentCorrect === 100) {
            canvasConfetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
    }, [showResults, percentCorrect]);


    return (
        <div className="quiz-container">
            <header className="quiz-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="quiz-progress">
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIdx + 1) / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                    <span>QUESTION {currentQuestionIdx + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="score-badge">SCORE: {score}</div>
            </header>

            <main className="quiz-arena">
                <AnimatePresence mode="wait">
                    {gameState !== 'finished' ? (
                        <motion.div
                            key={currentQuestionIdx}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="question-card"
                        >
                            <div className="timer-section">
                                <svg className="timer-svg" viewBox="0 0 40 40">
                                    <circle className="timer-bg" cx="20" cy="20" r="18" />
                                    <motion.circle
                                        className="timer-fill"
                                        cx="20" cy="20" r="18"
                                        initial={{ pathLength: 1 }}
                                        animate={{ pathLength: timeLeft / 15 }}
                                        style={{ stroke: timeLeft < 5 ? "#ef4444" : "#38bdf8" }}
                                    />
                                    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                                        {timeLeft}
                                    </text>
                                </svg>
                            </div>

                            <h2 className="question-text">{question.question}</h2>

                            <div className="diagram-well">
                                {renderDiagram()}
                            </div>

                            <div className="options-grid">
                                {question.options.map((opt, idx) => {
                                    let status = "";
                                    if (gameState === 'feedback') {
                                        if (idx === question.answer) status = "correct";
                                        else if (idx === selectedOption) status = "wrong";
                                        else status = "dimmed";
                                    }

                                    return (
                                        <motion.button
                                            key={idx}
                                            whileHover={gameState === 'playing' ? { scale: 1.02 } : {}}
                                            whileTap={gameState === 'playing' ? { scale: 0.98 } : {}}
                                            onClick={() => handleAnswer(idx)}
                                            className={`option-btn ${status}`}
                                            disabled={gameState !== 'playing'}
                                        >
                                            <span className="opt-index">{String.fromCharCode(65 + idx)}</span>
                                            <span className="opt-text">{opt}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {gameState === 'feedback' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="explanation-box"
                                >
                                    <div className={`status-tag ${isCorrect ? 'correct' : 'wrong'}`}>
                                        {isCorrect ? 'Correct! 🎉' : timeLeft === 0 ? 'Time\'s Up! ⏰' : 'Incorrect ❌'}
                                    </div>
                                    <p className="exp-text">{question.explanation}</p>
                                    <button className="next-btn" onClick={handleNextQuestion}>
                                        {currentQuestionIdx === QUESTIONS.length - 1 ? 'FINISH QUIZ' : 'NEXT QUESTION'}
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="results-card"
                        >
                            <div className="trophy-icon">🏆</div>
                            <h1>QUIZ COMPLETED!</h1>
                            <div className="final-score">
                                <span className="label">FINAL MISSION SCORE</span>
                                <span className="value">{score}</span>
                            </div>
                            <div className="stats-row">
                                <div className="stat-pill">Accuracy: {Math.round((score / (QUESTIONS.length * 150)) * 100)}%</div>
                                <div className="stat-pill">Time Bonus: +{score % 100}</div>
                            </div>
                            <button onClick={() => navigate('/map')} className="restart-btn">RETURN TO MISSION MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CircuitQuiz;
