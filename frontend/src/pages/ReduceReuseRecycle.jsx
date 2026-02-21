import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReduceReuseRecycle.css';

const WASTE_ITEMS = [
    { id: 1, name: 'Plastic Water Bottle', type: 'recycle', icon: '🧴', explanation: 'Plastic bottles can be shredded and turned into new plastic products.' },
    { id: 2, name: 'Glass Jar', type: 'reuse', icon: '🫙', explanation: 'Glass jars can be cleaned and used to store food or pens at home.' },
    { id: 3, name: 'Old Newspaper', type: 'recycle', icon: '🗞️', explanation: 'Paper can be pulped and recycled into new paper or cardboard.' },
    { id: 4, name: 'Using a Cloth Bag', type: 'reduce', icon: '👜', explanation: 'Using cloth bags reduces the need for single-use plastic bags.' },
    { id: 5, name: 'Old Clothes', type: 'reuse', icon: '👕', explanation: 'Old clothes can be donated or cut into rags for cleaning.' },
    { id: 6, name: 'Turning off Lights', type: 'reduce', icon: '💡', explanation: 'Reducing electricity usage conserves energy and natural resources.' },
    { id: 7, name: 'Aluminum Cans', type: 'recycle', icon: '🥫', explanation: 'Metal cans are 100% recyclable and save a lot of energy when reused.' },
    { id: 8, name: 'Repairing a Toy', type: 'reuse', icon: '🧸', explanation: 'Repairing items instead of buying new ones is a great way to reuse.' }
].sort(() => Math.random() - 0.5);

const THREE_RS = [
    { type: 'reduce', label: 'Reduce', icon: '📉', color: '#10b981', desc: 'Use less of something' },
    { type: 'reuse', label: 'Reuse', icon: '🔄', color: '#3b82f6', desc: 'Use things again' },
    { type: 'recycle', label: 'Recycle', icon: '♻️', color: '#8b5cf6', desc: 'Make something new' }
];

const ReduceReuseRecycle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showExpl, setShowExpl] = useState(false);
    const [lastRes, setLastRes] = useState(null); // { correct: bool, expl: string }
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handleClassify = (type) => {
        const item = WASTE_ITEMS[currentIdx];
        const isCorrect = item.type === type;

        if (isCorrect) {
            setScore(s => s + 10);
            toast.success("Correct!", { icon: '🌟' });
        } else {
            toast.error("Incorrect Category", { icon: '❌' });
        }

        setLastRes({ correct: isCorrect, expl: item.explanation });
        setShowExpl(true);
    };

    const nextItem = () => {
        setShowExpl(false);
        if (currentIdx < WASTE_ITEMS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 60) canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 5) localStorage.setItem('completed_levels_Our Environment', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        const stars = score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐';
        return (
            <div className="rrr-finish-screen">
                <motion.div className="rrr-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Waste Management Expert! ♻️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Expertise Level: {score}%</p>
                    <p className="motivational-text">
                        {score >= 80 ? "Hurray 🎉 You are an Eco Hero!" :
                            score >= 50 ? "Good job 👍 Let's make Earth greener!" :
                                "Don't worry 😊 Earth needs you, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Green City Builder →</button>
                </motion.div>
            </div>
        );
    }

    const currentItem = WASTE_ITEMS[currentIdx];

    return (
        <div className="rrr-container">
            <header className="rrr-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>♻️ Reduce, Reuse, Recycle</h1>
                <div className="rrr-stats">
                    <span>Score: {score}</span>
                    <span>Item: {currentIdx + 1}/{WASTE_ITEMS.length}</span>
                </div>
            </header>

            <main className="rrr-main">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="item-card"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <span className="item-icon">{currentItem.icon}</span>
                            <h3>{currentItem.name}</h3>
                            <p>Which "R" strategy is best for this?</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`expl-card ${lastRes?.correct ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="status-label">{lastRes?.correct ? '✅ CORRECT' : '❌ WRONG'}</div>
                            <p className="explanation-text">{lastRes?.expl}</p>
                            <button className="next-btn" onClick={nextItem}>Next Item →</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="r-bins">
                    {THREE_RS.map(r => (
                        <motion.button
                            key={r.type}
                            className="r-bin"
                            style={{ '--color': r.color }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !showExpl && handleClassify(r.type)}
                            disabled={showExpl}
                        >
                            <span className="bin-icon">{r.icon}</span>
                            <div className="bin-info">
                                <span className="bin-label">{r.label}</span>
                                <span className="bin-desc">{r.desc}</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ReduceReuseRecycle;
