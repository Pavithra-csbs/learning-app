import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './FertilizationSteps.css';

const STEPS = [
    { id: 'fusion', text: 'Fertilization: Sperm fuses with the egg in the fallopian tube.', icon: '⚡' },
    { id: 'zygote', text: 'Zygote Formation: A single diploid cell is formed after fusion.', icon: '🧪' },
    { id: 'cleavage', text: 'Division: The zygote starts dividing as it moves towards the uterus.', icon: '➗' },
    { id: 'embryo', text: 'Embryo: A multicellular ball of cells is formed.', icon: '🧬' },
    { id: 'implantation', text: 'Implantation: The embryo gets attached to the thick uterine wall.', icon: '⚓' },
    { id: 'placenta', text: 'Placenta Development: Special tissue forms to provide nutrition from mother to embryo.', icon: '🩸' }
];

const FertilizationSteps = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        setItems([...STEPS].sort(() => Math.random() - 0.5));
    }, []);

    const checkOrder = () => {
        const isCorrect = items.every((item, idx) => item.id === STEPS[idx].id);

        if (isCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success('Excellent! Life begins with perfect timing. ✨');
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error('The sequence is incorrect. Think about the path to implantation! 🔄');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '6');
        if (curLevel < 7) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '7');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        return (
            <div className="fs-finish-screen">
                <motion.div className="fs-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Development Expert! 🧬</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Logic Multiplier: x10</p>
                    <p className="motivational-text">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Plant Reproduction Simulation →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="fertilization-steps-container">
            <header className="fs-header">
                <button className="fs-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🧪 Fertilization & Development</h1>
                <div className="fs-score">Steps Correct: {items.filter((item, idx) => item.id === STEPS[idx].id).length} / {STEPS.length}</div>
            </header>

            <main className="fs-game-area">
                <div className="fs-intro">
                    <p>📦 Drag the steps to arrange them in the correct biological order, from the moment of fertilization to successful implantation.</p>
                </div>

                <div className="fs-puzzle-box">
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="fs-step-list">
                        {items.map((step, index) => (
                            <Reorder.Item key={step.id} value={step} className="fs-step-item">
                                <span className={`fs-step-num ${items[index].id === STEPS[index].id ? 'correct' : ''}`}>{index + 1}</span>
                                <span className="fs-step-icon">{step.icon}</span>
                                <p className="fs-step-text">{step.text}</p>
                                <div className="drag-handle">⋮⋮</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                <div className="fs-visual-hint">
                    <motion.div className="sperm-swimmer" animate={{ x: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 3 }}>たまこ</motion.div>
                    <div className="fallopian-path"></div>
                </div>

                <button className="fs-check-btn" onClick={checkOrder}>Verify Sequence ✅</button>
            </main>
        </div>
    );
};

export default FertilizationSteps;
