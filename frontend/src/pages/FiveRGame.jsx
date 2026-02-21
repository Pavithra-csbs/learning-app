import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './FiveRGame.css';

const ITEMS = [
    { id: 1, name: 'Single-use Plastic Straw', type: 'refuse', icon: '🥤', explanation: 'Refuse unnecessary plastics that pollute the ocean.' },
    { id: 2, name: 'Old Glass Jar', type: 'reuse', icon: '🫙', explanation: 'Reuse jars for storage instead of buying new containers.' },
    { id: 3, name: 'Broken Wooden Chair', type: 'repair', icon: '🪑', explanation: 'Repair furniture to extend its life and save resources.' },
    { id: 4, name: 'Empty Aluminum Cans', type: 'recycle', icon: '🥫', explanation: 'Recycle metals to save energy and raw materials.' },
    { id: 5, name: 'Turn off Extra Lights', type: 'reduce', icon: '💡', explanation: 'Reduce energy consumption by being mindful of usage.' },
    { id: 6, name: 'Plastic Carry Bag', type: 'refuse', icon: '🛍️', explanation: 'Refuse plastic bags and carry your own cloth bag.' },
    { id: 7, name: 'Old Newspaper', type: 'recycle', icon: '📰', explanation: 'Paper can be recycled multiple times to save trees.' },
    { id: 8, name: 'Leaking Tap', type: 'repair', icon: '🚰', explanation: 'Repair leaks immediately to prevent precious water wastage.' },
    { id: 9, name: 'Leftover Food Container', type: 'reuse', icon: '🍱', explanation: 'Reuse containers for lunch or storage.' },
    { id: 10, name: 'Less Packaging', type: 'reduce', icon: '📦', explanation: 'Reduce waste by choosing items with minimal packaging.' }
].sort(() => Math.random() - 0.5);

const BINS = [
    { type: 'refuse', label: 'Refuse', icon: '🚫', color: '#f43f5e' },
    { type: 'reduce', label: 'Reduce', icon: '📉', color: '#fbbf24' },
    { type: 'reuse', label: 'Reuse', icon: '🔄', color: '#38bdf8' },
    { type: 'repair', label: 'Repair', icon: '🛠️', color: '#a855f7' },
    { type: 'recycle', label: 'Recycle', icon: '♻️', color: '#10b981' }
];

const FiveRGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showExpl, setShowExpl] = useState(false);
    const [lastIsCorrect, setLastIsCorrect] = useState(null);
    const [gameState, setGameState] = useState('playing');

    const handleSort = (binType) => {
        const item = ITEMS[currentIdx];
        const isCorrect = item.type === binType;

        if (isCorrect) {
            setScore(s => s + 10);
            toast.success("Perfect Choice! 🌟");
        } else {
            setMistakes(m => m + 1);
            toast.error("Think about the 5Rs! ❌");
        }

        setLastIsCorrect(isCorrect);
        setShowExpl(true);
    };

    const nextItem = () => {
        setShowExpl(false);
        if (currentIdx < ITEMS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 70) canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 5) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        const stars = score >= 90 ? '⭐⭐⭐' : score >= 60 ? '⭐⭐' : '⭐';
        return (
            <div className="fr-finish-screen">
                <motion.div className="fr-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>5R Mastery Achieved! ♻️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Sustainability Score: {score}</p>
                    <p className="motivational-text">
                        {score >= 90 ? "Excellent 🎉 You are a Smart Resource Manager!" :
                            score >= 60 ? "Good job 👍 You are learning to save Earth!" :
                                "Don't worry 😊 Save resources, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 5: Smart Planner →</button>
                </motion.div>
            </div>
        );
    }

    const currentItem = ITEMS[currentIdx];

    return (
        <div className="five-r-game-container">
            <header className="fr-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>♻️ The 5R Strategy</h1>
                <div className="fr-stats">
                    <span>Eco-Points: {score}</span>
                    <span>Action: {currentIdx + 1}/{ITEMS.length}</span>
                </div>
            </header>

            <main className="fr-game-arena">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="item-card"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <span className="item-icon">{currentItem.icon}</span>
                            <h3>{currentItem.name}</h3>
                            <p>Which 'R' fits this best?</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`fr-expl-card ${lastIsCorrect ? 'correct' : 'incorrect'}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <h3>{lastIsCorrect ? '✅ Sustainable!' : '❌ Let\'s Rethink...'}</h3>
                            <p>{currentItem.explanation}</p>
                            <button className="next-btn" onClick={nextItem}>Next Item →</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="fr-bins-grid">
                    {BINS.map(bin => (
                        <motion.button
                            key={bin.type}
                            className="fr-bin"
                            style={{ '--accent': bin.color }}
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

export default FiveRGame;
