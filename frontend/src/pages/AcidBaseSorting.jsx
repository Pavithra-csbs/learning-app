import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './AcidBaseSorting.css';

const SUBSTANCES = [
    { id: 'sb1', name: "Hydrochloric Acid", category: "acid", icon: "🧪", info: "Strong lab acid (HCl)" },
    { id: 'sb2', name: "Sodium Hydroxide", category: "base", icon: "🧼", info: "Strong base (NaOH), soapy to touch" },
    { id: 'sb3', name: "Common Salt", category: "neutral", icon: "🧂", info: "Neutral salt (NaCl)" },
    { id: 'sb4', name: "Lemon Juice", category: "acid", icon: "🍋", info: "Contains citric acid" },
    { id: 'sb5', name: "Baking Soda", category: "base", icon: "🍰", info: "Acts as a mild base" },
    { id: 'sb6', name: "Pure Water", category: "neutral", icon: "💧", info: "Standard neutral substance" },
    { id: 'sb7', name: "Vinegar", category: "acid", icon: "🍱", info: "Contains acetic acid" },
    { id: 'sb8', name: "Antacid Tablet", category: "base", icon: "💊", info: "Bases used to treat acidity" }
];

const AcidBaseSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([...SUBSTANCES].sort(() => Math.random() - 0.5));
    const [bins, setBins] = useState({ acid: [], base: [], neutral: [] });
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleDrop = (category, item) => {
        if (item.category === category) {
            setScore(prev => prev + 50);
            setBins(prev => ({ ...prev, [category]: [...prev[category], item] }));
            setItems(prev => prev.filter(i => i.id !== item.id));
            toast.success(`Correct! ${item.name} is a ${category}.`);

            if (items.length === 1) {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '3');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error(`Mistake! ${item.name} is not a ${category}.`);
            setScore(prev => Math.max(0, prev - 10));
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 400) return "Excellent 🎉 You are a Sorting Specialist!";
        if (score >= 200) return "Good job 👍 Try to get them all right!";
        return "Don’t worry 😊 Keep learning!";
    };

    return (
        <div className="sorting-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 2: ACID/BASE SORTING</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="sorting-view">
                            <div className="items-pool">
                                {items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layoutId={item.id}
                                        drag
                                        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                                        onDragEnd={(e, info) => {
                                            // Simple collision detection based on landing position
                                            const x = e.clientX;
                                            const y = e.clientY;
                                            const elements = document.elementsFromPoint(x, y);
                                            const bin = elements.find(el => el.classList.contains('bin'));
                                            if (bin) {
                                                handleDrop(bin.dataset.cat, item);
                                            }
                                        }}
                                        className="draggable-item"
                                    >
                                        <span className="icon">{item.icon}</span>
                                        <span className="name">{item.name}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bins-container">
                                {['acid', 'neutral', 'base'].map(cat => (
                                    <div key={cat} className={`bin ${cat}`} data-cat={cat}>
                                        <h3>{cat.toUpperCase()}S</h3>
                                        <div className="bin-count">{bins[cat].length} Items</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 150) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AcidBaseSorting;
