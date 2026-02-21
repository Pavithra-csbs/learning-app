import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MagnetBattleQuiz.css';

const MagnetBattleQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('playing'); // playing, victory, loss
    const [currentQ, setCurrentQ] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [isVibrating, setIsVibrating] = useState(false);

    const QUESTIONS = [
        { q: "Which pole does the north needle of a compass point to?", options: ["Magnetic North", "Magnetic South", "Geographic South"], correct: 1 },
        { q: "Field lines are closest together where the field is:", options: ["Weakest", "Strongest", "Uniform"], correct: 1 },
        { q: "Increasing the current in a coil makes the field:", options: ["Stronger", "Weaker", "Reverse"], correct: 0 },
        { q: "What rule identifies the direction of force on a current?", options: ["Maxwell's Thumb", "Fleming's Left Hand", "Oersted's Law"], correct: 1 },
        { q: "The magnetic field inside a long solenoid is:", options: ["Zero", "Non-uniform", "Same at all points"], correct: 2 }
    ];

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('loss');
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (idx) => {
        if (idx === QUESTIONS[currentQ].correct) {
            setScore(s => s + 200);
            if (currentQ < QUESTIONS.length - 1) {
                setCurrentQ(prev => prev + 1);
            } else {
                setGameState('victory');
                canvasConfetti({ particleCount: 300, spread: 100 });
            }
        } else {
            setIsVibrating(true);
            setTimeout(() => setIsVibrating(false), 500);
            setScore(s => Math.max(0, s - 50));
        }
    };

    const getFeedbackText = () => {
        const percentage = (score / (QUESTIONS.length * 200)) * 100;
        if (percentage >= 100) return "Hurray 🎉 Woohoo! You are a Magnetism Master!";
        if (percentage >= 50) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="boss-quiz-container">
            <header className="boss-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="back-btn">⬅️ RUN AWAY</button>
                <div className="timer">⏱️ {timeLeft}s</div>
                <div className="boss-hp">MAGNET MASTER HP: {100 - (currentQ * 20)}%</div>
            </header>

            <main className="boss-arena">
                <div className="boss-visual">
                    <motion.div
                        className={`master-avatar ${isVibrating ? 'vibrate' : ''}`}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        🎭🧲
                    </motion.div>
                    <div className="boss-dialogue">
                        "Pop Quiz! Prove your mastery or be repelled!"
                    </div>
                </div>

                <div className="quiz-card">
                    <div className="q-progress">BATTLE STEP {currentQ + 1} / {QUESTIONS.length}</div>
                    <h2>{QUESTIONS[currentQ].q}</h2>
                    <div className="options-grid">
                        {QUESTIONS[currentQ].options.map((opt, i) => (
                            <button key={i} onClick={() => handleAnswer(i)} className="boss-opt-btn">
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {gameState !== 'playing' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="win-badge">{gameState === 'victory' ? '👑' : '💀'}</div>
                        <h2>{gameState === 'victory' ? getFeedbackText() : "Time's Up! The Magnet Master won this round."}</h2>
                        <h1>Score: {score}</h1>
                        <div className="stars">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={i < (score / 350) ? 'gold' : ''}>⭐</span>
                            ))}
                        </div>
                        <button onClick={() => navigate('/map')} className="next-level-btn">
                            {gameState === 'victory' ? 'COMPLETE CHAPTER' : 'RETRY MISSION'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagnetBattleQuiz;
