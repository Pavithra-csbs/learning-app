import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PollutionSorting.css';

const POLLUTANTS = [
    { id: 1, name: 'Plastic Bottles', type: 'soil', icon: '🍾', explanation: 'Plastic doesn\'t decompose easily and pollutes the soil for hundreds of years.' },
    { id: 2, name: 'Factory Smoke', type: 'air', icon: '💨', explanation: 'Smoke contains harmful gases like CO2 and SO2 that pollute the air.' },
    { id: 3, name: 'Sewage Water', type: 'water', icon: '💧', explanation: 'Untreated sewage carries pathogens and chemicals into water bodies.' },
    { id: 4, name: 'Loud Speakers', type: 'noise', icon: '📢', explanation: 'High-intensity sound from speakers causes noise pollution and stress.' },
    { id: 5, name: 'Chemical Fertilizers', type: 'soil', icon: '🧪', explanation: 'Excessive chemicals degrade soil quality and harm microorganisms.' },
    { id: 6, name: 'Oil Spill', type: 'water', icon: '⛴️', explanation: 'Oil slicks on the ocean surface kill marine life by blocking oxygen.' },
    { id: 7, name: 'Vehicle Exhaust', type: 'air', icon: '🚗', explanation: 'Vehicles release carbon monoxide and lead, harming human health.' },
    { id: 8, name: 'Construction Drills', type: 'noise', icon: '🏗️', explanation: 'Constant loud machinery disrupts the peace and affects hearing.' }
].sort(() => Math.random() - 0.5);

const BINS = [
    { type: 'air', label: 'Air Pollution', icon: '☁️', color: '#38bdf8' },
    { type: 'water', label: 'Water Pollution', icon: '🌊', color: '#0ea5e9' },
    { type: 'soil', label: 'Soil Pollution', icon: '🌱', color: '#a855f7' },
    { type: 'noise', label: 'Noise Pollution', icon: '🔊', color: '#f43f5e' }
];

const PollutionSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showExpl, setShowExpl] = useState(false);
    const [lastResult, setLastResult] = useState(null); // { correct: boolean, explanation: string }
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handleSort = (binType) => {
        const item = POLLUTANTS[currentIdx];
        const isCorrect = item.type === binType;

        if (isCorrect) {
            setScore(s => s + 10);
            toast.success("Correct Category!", { icon: '✅' });
        } else {
            setMistakes(m => m + 1);
            toast.error("Oops! Wrong Category.", { icon: '❌' });
        }

        setLastResult({ correct: isCorrect, explanation: item.explanation });
        setShowExpl(true);
    };

    const nextItem = () => {
        setShowExpl(false);
        if (currentIdx < POLLUTANTS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 60) canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 2) localStorage.setItem('completed_levels_Our Environment', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        const stars = score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐';
        return (
            <div className="ps-finish-screen">
                <motion.div className="ps-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Pollution Sorting Complete! 🌍</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Final Score: {score}</p>
                    <p className="mistakes">Mistakes: {mistakes}</p>
                    <p className="motivational-text">
                        {score >= 80 ? "Hurray 🎉 You are an Eco Hero!" :
                            score >= 50 ? "Good job 👍 Let's make Earth greener!" :
                                "Don't worry 😊 Earth needs you, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Air & Water Quiz →</button>
                </motion.div>
            </div>
        );
    }

    const currentPollutant = POLLUTANTS[currentIdx];

    return (
        <div className="pollution-sorting-container">
            <header className="ps-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>🗑️ Pollution Sorting</h1>
                <div className="ps-stats">
                    <span>Score: {score}</span>
                    <span>Item: {currentIdx + 1}/{POLLUTANTS.length}</span>
                </div>
            </header>

            <main className="ps-game-arena">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="pollutant-card"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                        >
                            <span className="pollutant-icon">{currentPollutant.icon}</span>
                            <h3>{currentPollutant.name}</h3>
                            <p>Drag or click the correct pollution bin below!</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`explanation-card ${lastResult?.correct ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <h3>{lastResult?.correct ? '✅ Awesome!' : '❌ Not Quite...'}</h3>
                            <p>{lastResult?.explanation}</p>
                            <button className="next-btn" onClick={nextItem}>Next Item →</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bins-row">
                    {BINS.map(bin => (
                        <motion.button
                            key={bin.type}
                            className="bin-item"
                            style={{ '--bin-color': bin.color }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !showExpl && handleSort(bin.type)}
                            disabled={showExpl}
                        >
                            <span className="bin-icon">{bin.icon}</span>
                            <span className="bin-label">{bin.label}</span>
                        </motion.button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default PollutionSorting;
