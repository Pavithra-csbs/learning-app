import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MenstrualCyclePuzzle.css';

const CYCLE_PHASES = [
    { id: 'menstruation', name: 'Menstruation', days: '1-5', icon: '🩸', desc: 'The uterine lining breaks down and flows out if fertilization did not occur.' },
    { id: 'follicular', name: 'Follicular Phase', days: '6-13', icon: '🥚', desc: 'The egg matures inside the ovary and the uterine lining starts rebuilding.' },
    { id: 'ovulation', name: 'Ovulation', days: '14', icon: '✨', desc: 'The mature egg is released from the ovary into the fallopian tube.' },
    { id: 'luteal', name: 'Luteal Phase', days: '15-28', icon: '🏗️', desc: 'Uterine lining thickens further, preparing for a potential embryo.' }
];

const MenstrualCyclePuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [showHormoneInfo, setShowHormoneInfo] = useState(false);

    useEffect(() => {
        setItems([...CYCLE_PHASES].sort(() => Math.random() - 0.5));
    }, []);

    const checkOrder = () => {
        const isCorrect = items.every((item, idx) => item.id === CYCLE_PHASES[idx].id);

        if (isCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success('Excellent! You understand the cycle perfectly. 📅');
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error('The phases are out of order. Think about the start! 🔄');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '5');
        if (curLevel < 6) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '6');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        return (
            <div className="mcp-finish-screen">
                <motion.div className="mcp-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Cycle Expert! 📅</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Logic Multiplier: x10</p>
                    <p className="motivational-text">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Go to Fertilization Steps →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="menstrual-cycle-container">
            <header className="mcp-header">
                <button className="mcp-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🔄 Menstrual Cycle Puzzle</h1>
                <div className="mcp-score">Points: 100/100</div>
            </header>

            <main className="mcp-game-area">
                <div className="mcp-intro">
                    <p>Arrange the phases of the menstrual cycle in the correct sequential order (starting from Day 1).</p>
                </div>

                <div className="mcp-puzzle-box">
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="mcp-phase-list">
                        {items.map((phase) => (
                            <Reorder.Item key={phase.id} value={phase} className="mcp-phase-item">
                                <div className="phase-marker">{phase.days}</div>
                                <div className="phase-content">
                                    <div className="phase-top">
                                        <span className="phase-icon">{phase.icon}</span>
                                        <h3>{phase.name}</h3>
                                    </div>
                                    <p className="phase-desc">{phase.desc}</p>
                                </div>
                                <div className="drag-handle">⋮⋮</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                <div className="mcp-actions">
                    <button className="mcp-hormone-btn" onClick={() => setShowHormoneInfo(!showHormoneInfo)}>
                        {showHormoneInfo ? 'Hide Hormones' : 'Show Hormones Involved'}
                    </button>
                    <button className="mcp-check-btn" onClick={checkOrder}>Check Sequence ✅</button>
                </div>

                <AnimatePresence>
                    {showHormoneInfo && (
                        <motion.div className="mcp-hormone-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                            <h3>🧪 Hormonal Control</h3>
                            <div className="hormone-grid">
                                <div className="hormone-u1"><strong>FSH:</strong> Matures the follicle.</div>
                                <div className="hormone-u1"><strong>LH:</strong> Triggers ovulation.</div>
                                <div className="hormone-u1"><strong>Oestrogen:</strong> Rebuilds uterine lining.</div>
                                <div className="hormone-u1"><strong>Progesterone:</strong> Maintains lining.</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default MenstrualCyclePuzzle;
