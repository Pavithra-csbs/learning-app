import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PollinationPuzzle.css';

const STEPS = [
    { id: 'pollen', text: 'Pollen grains are transferred from anther to stigma (Pollination).', icon: '🐝' },
    { id: 'tube', text: 'Pollen grain germinates and grows a pollen tube through the style.', icon: '🧪' },
    { id: 'travel', text: 'Male germ cell travels through the pollen tube to reach the ovary.', icon: '⚡' },
    { id: 'fusion', text: 'Male germ cell fuses with the female germ cell (Fertilization) to form a Zygote.', icon: '✨' },
    { id: 'embryo', text: 'Zygote divides many times to form an embryo within the ovule.', icon: '🧬' },
    { id: 'seed', text: 'Ovule develops a tough coat and becomes a seed, while the ovary ripens into a fruit.', icon: '🍎' }
];

const PollinationPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [showHint, setShowHint] = useState(false);

    useEffect(() => {
        // Shuffle steps for the puzzle
        setItems([...STEPS].sort(() => Math.random() - 0.5));
    }, []);

    const checkOrder = () => {
        const isCorrect = items.every((item, idx) => item.id === STEPS[idx].id);

        if (isCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success('Perfect! The cycle is complete. 🌱');
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error('The sequence is incorrect. Try swapping the steps! 🔄');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '3');
        if (curLevel < 4) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '4');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        return (
            <div className="pp-finish-screen">
                <motion.div className="pp-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Seed Mastered! 🌳</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Logic Multiplier: x10</p>
                    <p className="motivational-text">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Human Reproduction Quiz →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pollination-puzzle-container">
            <header className="pp-header">
                <button className="pp-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🐝 Pollination Puzzle</h1>
                <div className="pp-controls">
                    <button className="pp-hint-btn" onClick={() => setShowHint(!showHint)}>{showHint ? 'Hide Hint' : 'Show Hint'}</button>
                </div>
            </header>

            <main className="pp-game-area">
                <div className="pp-instructions">
                    <p>📦 Drag and reorder the steps to show the correct sequence of plant reproduction from pollination to seed formation.</p>
                </div>

                <div className="pp-puzzle-grid">
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="pp-step-list">
                        {items.map((step, index) => (
                            <Reorder.Item key={step.id} value={step} className="pp-step-item">
                                <span className="pp-step-num">{index + 1}</span>
                                <span className="pp-step-icon">{step.icon}</span>
                                <p className="pp-step-text">{step.text}</p>
                                <div className="drag-handle">⋮⋮</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                {showHint && (
                    <motion.div className="pp-hint-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <p><strong>💡 Hint:</strong> First comes pollination (transfer to stigma), then the pollen tube grows, then fertilization, then the zygote becomes an embryo, and finally the seed/fruit form.</p>
                    </motion.div>
                )}

                <button className="pp-check-btn" onClick={checkOrder}>Check Sequence ✅</button>
            </main>
        </div>
    );
};

export default PollinationPuzzle;
