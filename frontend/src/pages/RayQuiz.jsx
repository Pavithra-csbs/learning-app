import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RayQuiz.css';

const RayQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, playing, feedback, success
    const [userChoice, setUserChoice] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    const questions = [
        {
            id: 1,
            question: "The reflected ray always lies in the same plane as the incident ray and the normal.",
            answer: true,
            explanation: "This is the first law of reflection! All three lie in the same plane at the point of incidence.",
            diagram: (
                <svg viewBox="0 0 400 300" className="quiz-svg">
                    <line x1="50" y1="250" x2="350" y2="250" stroke="white" strokeWidth="4" />
                    <line x1="200" y1="100" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeDasharray="5,5" />
                    <line x1="100" y1="150" x2="200" y2="250" stroke="#f72585" strokeWidth="4" />
                    <line x1="200" y1="250" x2="300" y2="150" stroke="#4cc9f0" strokeWidth="4" />
                    <text x="180" y="80" fill="gray" fontSize="12">NORMAL</text>
                </svg>
            )
        },
        {
            id: 2,
            question: "When light travels from air to glass, it bends away from the normal.",
            answer: false,
            explanation: "False! Light bends TOWARDS the normal when moving from a rarer medium (air) to a denser medium (glass).",
            diagram: (
                <svg viewBox="0 0 400 300" className="quiz-svg">
                    <rect x="50" y="150" width="300" height="100" fill="rgba(76, 201, 240, 0.1)" stroke="#4cc9f0" />
                    <line x1="200" y1="50" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeDasharray="5,5" />
                    <line x1="100" y1="80" x2="200" y2="150" stroke="#f72585" strokeWidth="4" />
                    <line x1="200" y1="150" x2="240" y2="250" stroke="#f72585" strokeWidth="4" />
                    <text x="260" y="130" fill="#4cc9f0" fontSize="12">GLASS</text>
                </svg>
            )
        },
        {
            id: 3,
            question: "A convex lens can form both real and virtual images.",
            answer: true,
            explanation: "True! It forms real images for objects beyond F, and a virtual, magnified image when the object is between F and O.",
            diagram: (
                <svg viewBox="0 0 400 300" className="quiz-svg">
                    <ellipse cx="200" cy="150" rx="30" ry="100" fill="rgba(76, 201, 240, 0.2)" stroke="#4cc9f0" />
                    <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="1" opacity="0.3" />
                    <circle cx="100" cy="150" r="5" fill="#f72585" />
                    <text x="90" y="180" fill="#f72585" fontSize="12">F</text>
                </svg>
            )
        }
    ];

    const currentQuestion = questions[currentStep];

    const handleAnswer = (choice) => {
        setUserChoice(choice);
        const correct = choice === currentQuestion.answer;
        setIsCorrect(correct);
        setGameState('feedback');
        if (correct) {
            setScore(score + 100);
        }
    };

    const nextQuestion = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
            setGameState('playing');
            setUserChoice(null);
            setIsCorrect(null);
        } else {
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    };

    return (
        <div className="ray-quiz-container">
            <header className="quiz-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="quiz-progress">
                    <div className="progress-text">QUESTION {currentStep + 1} / {questions.length}</div>
                    <div className="progress-track">
                        <motion.div
                            className="progress-fill"
                            animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>
                <div className="score-box">SCORE: {score}</div>
            </header>

            <main className="quiz-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="quiz-card intro"
                        >
                            <h1>True or False? 🧠</h1>
                            <p>Test your optical intuition. Analyze the diagrams and decide if the statements are correct.</p>
                            <button onClick={() => setGameState('playing')} className="start-btn">START QUIZ</button>
                        </motion.div>
                    )}

                    {(gameState === 'playing' || gameState === 'feedback') && (
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="question-card"
                        >
                            <div className="diagram-container">
                                {currentQuestion.diagram}
                            </div>

                            <div className="question-content">
                                <h2>{currentQuestion.question}</h2>

                                {gameState === 'playing' && (
                                    <div className="quiz-actions">
                                        <button className="true-btn" onClick={() => handleAnswer(true)}>TRUE</button>
                                        <button className="false-btn" onClick={() => handleAnswer(false)}>FALSE</button>
                                    </div>
                                )}

                                {gameState === 'feedback' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`feedback-box ${isCorrect ? 'correct' : 'incorrect'}`}
                                    >
                                        <h3>{isCorrect ? "CORRECT! 🎉" : "INCORRECT! ❌"}</h3>
                                        <p>{currentQuestion.explanation}</p>
                                        <button className="next-btn" onClick={nextQuestion}>
                                            {currentStep < questions.length - 1 ? 'NEXT QUESTION ➡️' : 'VIEW RESULTS 🏆'}
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="quiz-card results"
                        >
                            <h1>Quiz Complete! 🎖️</h1>
                            <div className="final-stats">
                                <div className="stat-row">
                                    <span>Accuracy:</span>
                                    <span>{Math.round((score / (questions.length * 100)) * 100)}%</span>
                                </div>
                                <div className="stat-row highlight">
                                    <span>Final Score:</span>
                                    <span>{score}</span>
                                </div>
                            </div>
                            <button onClick={() => navigate('/map')} className="finish-btn">BACK TO WORLD MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default RayQuiz;
