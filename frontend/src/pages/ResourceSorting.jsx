import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import { playSFX } from '../utils/audio';
import './ResourceSorting.css';

const RESOURCES = [
    { id: 1, name: 'Solar Energy', type: 'renewable', icon: '☀️', explanation: 'Solar energy is inexhaustible and harnessed using photovoltaic cells.' },
    { id: 2, name: 'Coal', type: 'non-renewable', icon: '🪨', explanation: 'Coal is a fossil fuel formed over millions of years and releases CO2 when burnt.' },
    { id: 3, name: 'Wind Power', type: 'renewable', icon: '🌬️', explanation: 'Wind energy is clean and renewable, used to generate electricity via turbines.' },
    { id: 4, name: 'Petroleum', type: 'non-renewable', icon: '⛽', explanation: 'Oil is a finite resource used for transport and industry, causing pollution.' },
    { id: 5, name: 'Fresh Water', type: 'renewable', icon: '💧', explanation: 'Water is replenished via the water cycle, but its quality must be managed.' },
    { id: 6, name: 'Natural Gas', type: 'non-renewable', icon: '🔥', explanation: 'A fossil fuel that is cleaner than coal but still limited in supply.' },
    { id: 7, name: 'Forests', type: 'renewable', icon: '🌳', explanation: 'Forests grow back if managed sustainably and act as carbon sinks.' },
    { id: 8, name: 'Iron Ore', type: 'non-renewable', icon: '⛓️', explanation: 'Metallic minerals are finite and require mining and recycling.' }
].sort(() => Math.random() - 0.5);

const BINS = [
    { type: 'renewable', label: 'Renewable', icon: '♻️', color: '#10b981' },
    { type: 'non-renewable', label: 'Non-Renewable', icon: '🚫', color: '#ef4444' }
];

const ResourceSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showExpl, setShowExpl] = useState(false);
    const [lastIsCorrect, setLastIsCorrect] = useState(null);
    const [gameState, setGameState] = useState('playing');

    const handleSort = (binType) => {
        const item = RESOURCES[currentIdx];
        const isCorrect = item.type === binType;

        if (isCorrect) {
            setScore(s => s + 10);
            playSFX('correct');
            toast.success("Spot on! 🌟");
        } else {
            setMistakes(m => m + 1);
            playSFX('wrong');
            toast.error("Not quite! Check the type. ❌");
        }

        setLastIsCorrect(isCorrect);
        setShowExpl(true);
    };

    const nextItem = () => {
        setShowExpl(false);
        if (currentIdx < RESOURCES.length - 1) {
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
        if (curLevel < 2) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        const stars = score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐';
        return (
            <div className="res-finish-screen">
                <motion.div className="res-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Resource Sorting Complete! 🌿</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Eco Score: {score}</p>
                    <p className="motivational-text">
                        {score >= 80 ? "Excellent 🎉 You are a Smart Resource Manager!" :
                            score >= 50 ? "Good job 👍 You are learning to save Earth!" :
                                "Don't worry 😊 Save resources, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 2: Quiz →</button>
                </motion.div>
            </div>
        );
    }

    const currentResource = RESOURCES[currentIdx];

    return (
        <div className="resource-sorting-container">
            <header className="res-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>♻️ Resource Sorting</h1>
                <div className="res-stats">
                    <span>Score: {score}</span>
                    <span>Item: {currentIdx + 1}/{RESOURCES.length}</span>
                </div>
            </header>

            <main className="res-game-arena">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="resource-card"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                        >
                            <span className="res-icon">{currentResource.icon}</span>
                            <h3>{currentResource.name}</h3>
                            <p>Drag or click the correct bin!</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`expl-card ${lastIsCorrect ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <h3>{lastIsCorrect ? '✅ Well Done!' : '❌ Thinking Time...'}</h3>
                            <p>{currentResource.explanation}</p>
                            <button className="next-btn" onClick={nextItem}>Next Resource →</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bins-row">
                    {BINS.map(bin => (
                        <motion.button
                            key={bin.type}
                            className={`bin-btn ${bin.type}`}
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

export default ResourceSorting;
