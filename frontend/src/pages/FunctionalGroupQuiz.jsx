import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './FunctionalGroupQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Identify the functional group in CH₃—CH₂—OH",
        moleculeName: "Ethanol",
        formula: "C2H5OH",
        visual: "OH",
        options: [
            { id: 'a', text: "Alcohol (-OH)", isCorrect: true },
            { id: 'b', text: "Aldehyde (-CHO)", isCorrect: false },
            { id: 'c', text: "Ketone (-CO-)", isCorrect: false },
            { id: 'd', text: "Carboxylic Acid (-COOH)", isCorrect: false }
        ]
    },
    {
        id: 2,
        question: "Which group is present in Ethanoic Acid (CH₃COOH)?",
        moleculeName: "Ethanoic Acid",
        formula: "CH3COOH",
        visual: "COOH",
        options: [
            { id: 'a', text: "Alcohol", isCorrect: false },
            { id: 'b', text: "Carboxylic Acid", isCorrect: true },
            { id: 'c', text: "Ketone", isCorrect: false },
            { id: 'd', text: "Aldehyde", isCorrect: false }
        ]
    },
    {
        id: 3,
        question: "Identify the functional group in Propanone (CH₃COCH₃)",
        moleculeName: "Propanone",
        formula: "CH3COCH3",
        visual: "CO",
        options: [
            { id: 'a', text: "Aldehyde", isCorrect: false },
            { id: 'b', text: "Alcohol", isCorrect: false },
            { id: 'c', text: "Ketone (-CO-)", isCorrect: true },
            { id: 'd', text: "Halogen", isCorrect: false }
        ]
    },
    {
        id: 4,
        question: "Which functional group is -CHO?",
        moleculeName: "Ethanal",
        formula: "CH3CHO",
        visual: "CHO",
        options: [
            { id: 'a', text: "Alcohol", isCorrect: false },
            { id: 'b', text: "Aldehyde", isCorrect: true },
            { id: 'c', text: "Ketone", isCorrect: false },
            { id: 'd', text: "Carboxylic Acid", isCorrect: false }
        ]
    },
    {
        id: 5,
        question: "What is the functional group in Chloromethane (CH₃Cl)?",
        moleculeName: "Chloromethane",
        formula: "CH3Cl",
        visual: "Cl",
        options: [
            { id: 'a', text: "Alcohol", isCorrect: false },
            { id: 'b', text: "Aldehyde", isCorrect: false },
            { id: 'c', text: "Ketone", isCorrect: false },
            { id: 'd', text: "Halogen (-Cl)", isCorrect: true }
        ]
    }
];

const FunctionalGroupQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentQIdx, setCurrentQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [selectedOpt, setSelectedOpt] = useState(null);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleTimeOut();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQIdx, gameState]);

    const handleTimeOut = () => {
        toast.error("Time's up! Moving to next question.");
        nextQuestion();
    };

    const handleOptionClick = (option) => {
        if (selectedOpt) return; // Prevent double click
        setSelectedOpt(option);

        if (option.isCorrect) {
            setScore(prev => prev + 20);
            toast.success("Correct! 🎉");
            canvasConfetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        } else {
            toast.error("Incorrect!");
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    const nextQuestion = () => {
        if (currentQIdx < QUESTIONS.length - 1) {
            setCurrentQIdx(prev => prev + 1);
            setTimeLeft(15);
            setSelectedOpt(null);
        } else {
            endGame();
        }
    };

    const endGame = () => {
        setGameState('finished');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '6');
        canvasConfetti({ particleCount: 200, spread: 100 });
    };

    const currentQ = QUESTIONS[currentQIdx];

    return (
        <div className="functional-quiz-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="timer-box" style={{ color: timeLeft < 5 ? '#ef4444' : '#fff' }}>
                    ⏳ {timeLeft}s
                </div>
                <div className="score-badge">SCORE: {score}</div>
            </header>

            {gameState === 'playing' ? (
                <main className="quiz-arena">
                    <div className="molecule-viewer">
                        <div className="molecule-3d-placeholder">
                            <span className="visual-text">{currentQ.visual}</span>
                        </div>
                        <div className="molecule-info">
                            <h2>{currentQ.moleculeName}</h2>
                            <p className="formula">{currentQ.formula}</p>
                        </div>
                    </div>

                    <div className="question-card">
                        <h3>{currentQ.question}</h3>
                        <div className="options-grid">
                            {currentQ.options.map(opt => (
                                <motion.button
                                    key={opt.id}
                                    className={`option-btn ${selectedOpt === opt ? (opt.isCorrect ? 'correct' : 'wrong') : ''}`}
                                    onClick={() => handleOptionClick(opt)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={!!selectedOpt}
                                >
                                    {opt.text}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </main>
            ) : (
                <div className="result-screen">
                    <h1>Quiz Complete! 📝</h1>
                    <p className="final-score-text">You scored {score} / 100</p>
                    <button
                        className="finish-btn"
                        onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`)}
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

export default FunctionalGroupQuiz;
