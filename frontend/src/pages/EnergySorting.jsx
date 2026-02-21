import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EnergySorting.css';

const SOURCES = [
    { id: 'coal', name: 'Coal', category: 'non-renewable', icon: '🪨', info: 'Formed from vegetation buried millions of years ago. High carbon content.' },
    { id: 'solar', name: 'Solar', category: 'renewable', icon: '☀️', info: 'Direct conversion of sunlight into electricity using photovoltaic cells.' },
    { id: 'petroleum', name: 'Petroleum', category: 'non-renewable', icon: '🛢️', info: 'Liquid fossil fuel found deep underground. Major source for transport.' },
    { id: 'wind', name: 'Wind', category: 'renewable', icon: '🌬️', info: 'Kinetic energy of wind converted to electricity by turbines.' },
    { id: 'hydro', name: 'Water (Hydro)', category: 'renewable', icon: '🌊', info: 'Potential energy of water at heights used to turn turbines.' },
    { id: 'nuclear', name: 'Nuclear', category: 'non-renewable', icon: '⚛️', info: 'Energy released from atoms of heavy elements like Uranium.' },
    { id: 'biogas', name: 'Biogas', category: 'renewable', icon: '🌱', info: 'Produced by anaerobic decomposition of organic matter.' }
];

const EnergySorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showInfo, setShowInfo] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing, feedback, finished
    const [lastAction, setLastAction] = useState(null); // { correct: boolean, category: string }

    const currentSource = SOURCES[currentIndex];

    const handleSort = (category) => {
        const isCorrect = currentSource.category === category;
        setLastAction({ correct: isCorrect, category });

        if (isCorrect) setScore(s => s + 100);

        setShowInfo(true);
        setGameState('feedback');
    };

    const nextSource = () => {
        setShowInfo(false);
        setGameState('playing');
        setLastAction(null);

        if (currentIndex < SOURCES.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setGameState('finished');
            const currentProgress = parseInt(localStorage.getItem('completed_levels_Sources of Energy') || '0');
            if (currentProgress < 1) localStorage.setItem('completed_levels_Sources of Energy', '1');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const getMotivationalMessage = () => {
        const percentage = (score / (SOURCES.length * 100)) * 100;
        if (percentage >= 100) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (percentage >= 50) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="sorting-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 1: CATEGORY CLASH</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState !== 'finished' ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className="source-card"
                        >
                            <div className="card-icon">{currentSource.icon}</div>
                            <h2>{currentSource.name}</h2>
                            <p>Which category does this belong to?</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 300) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === 'playing' && (
                    <div className="sort-buttons">
                        <button className="category-btn renewable" onClick={() => handleSort('renewable')}>
                            RENEWABLE
                        </button>
                        <button className="category-btn fossil" onClick={() => handleSort('non-renewable')}>
                            NON-RENEWABLE
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className={`info-popup ${lastAction?.correct ? 'success' : 'fail'}`}
                        >
                            <div className="status-label">{lastAction?.correct ? 'PERFECT! ✨' : 'OOPS! ❌'}</div>
                            <p>{currentSource.info}</p>
                            <button onClick={nextSource}>CONTINUE</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EnergySorting;
