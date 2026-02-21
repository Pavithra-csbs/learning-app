import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EnergyQuiz.css';

const QUIZ_DATA = {
    easy: [
        { q: "Which of these is a non-renewable source?", options: ["Wind", "Coal", "Solar"], correct: 1, explanation: "Coal is a fossil fuel and takes millions of years to form." },
        { q: "Hydro-electricity is generated using:", options: ["Moving air", "Flowing water", "Burning wood"], correct: 1, explanation: "Potential energy of water at height is converted to electricity." }
    ],
    medium: [
        { q: "Which gas is the main component of Biogas?", options: ["Oxygen", "Carbon Dioxide", "Methane"], correct: 2, explanation: "Biogas contains up to 75% methane." },
        { q: "The process associated with sun's energy is:", options: ["Nuclear Fission", "Nuclear Fusion", "Combustion"], correct: 1, explanation: "Hydrogen nuclei fuse together at extreme temperatures." }
    ],
    hard: [
        { q: "What is the typical efficiency of a solar cell?", options: ["5-10%", "15-20%", "40-50%"], correct: 1, explanation: "Modern commercial solar cells have efficiency around 15-20%." },
        { q: "Which of these is used as a moderator in nuclear reactors?", options: ["Uranium", "Boron", "Heavy Water"], correct: 2, explanation: "Heavy water slows down neutrons for efficient fission." }
    ]
};

const EnergyQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [difficulty, setDifficulty] = useState(null); // easy, medium, hard
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameState, setGameState] = useState('selection'); // selection, playing, feedback, finished
    const [lastAnswer, setLastAnswer] = useState(null); // { correct: boolean }

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleAnswer(-1); // Timeout
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const handleAnswer = (idx) => {
        const correctIdx = QUIZ_DATA[difficulty][currentIndex].correct;
        const isCorrect = idx === correctIdx;

        setLastAnswer({ correct: isCorrect });
        if (isCorrect) setScore(s => s + 100 + timeLeft * 5); // Speed bonus

        setGameState('feedback');
    };

    const nextQuestion = () => {
        if (currentIndex < QUIZ_DATA[difficulty].length - 1) {
            setCurrentIndex(currentIndex + 1);
            setTimeLeft(15);
            setGameState('playing');
        } else {
            setGameState('finished');
            const currentProgress = parseInt(localStorage.getItem('completed_levels_Sources of Energy') || '0');
            if (currentProgress < 2) localStorage.setItem('completed_levels_Sources of Energy', '2');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const startQuiz = (diff) => {
        setDifficulty(diff);
        setGameState('playing');
        setTimeLeft(15);
    };

    const getMotivationalMessage = () => {
        const totalPossible = QUIZ_DATA[difficulty].length * 200; // rough max
        const percentage = (score / totalPossible) * 100;
        if (percentage >= 80) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (percentage >= 40) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="quiz-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 2: ENERGY ENIGMA</div>
            </header>

            <main className="game-arena">
                {gameState === 'selection' && (
                    <div className="selection-view">
                        <h1>Choose Difficulty</h1>
                        <div className="diff-grid">
                            {['easy', 'medium', 'hard'].map(d => (
                                <button key={d} onClick={() => startQuiz(d)} className={`diff-btn ${d}`}>
                                    {d.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="quiz-view">
                        <div className="timer-bar">
                            <motion.div
                                className="timer-fill"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(timeLeft / 15) * 100}%` }}
                                transition={{ duration: 1, ease: 'linear' }}
                            />
                        </div>
                        <div className="q-card">
                            <span className="q-number">Step {currentIndex + 1} of {QUIZ_DATA[difficulty].length}</span>
                            <h2>{QUIZ_DATA[difficulty][currentIndex].q}</h2>
                            <div className="options">
                                {QUIZ_DATA[difficulty][currentIndex].options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(i)} className="opt-btn">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'feedback' && (
                    <div className="feedback-view">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`feedback-card ${lastAnswer.correct ? 'success' : 'fail'}`}
                        >
                            <h1>{lastAnswer.correct ? 'BRILLIANT! ✨' : 'NOT QUITE! ❌'}</h1>
                            <p>{QUIZ_DATA[difficulty][currentIndex].explanation}</p>
                            <button onClick={nextQuestion} className="next-btn">CONTINUE</button>
                        </motion.div>
                    </div>
                )}

                {gameState === 'finished' && (
                    <div className="victory-view">
                        <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="victory-card">
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 300) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EnergyQuiz;
