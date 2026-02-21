import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './EvolutionTimeline.css';

const EVOLUTION_STEPS = [
    { id: 'prokaryotes', name: 'Simple Prokaryotes', period: '3.5 Billion years ago', icon: '🧫', desc: 'Single-celled organisms without a nucleus.' },
    { id: 'fish', name: 'Early Fish', period: '500 Million years ago', icon: '🐟', desc: 'First vertebrates evolved in the oceans.' },
    { id: 'reptiles', name: 'Dinosaurs & Reptiles', period: '230 Million years ago', icon: '🦖', desc: 'Dominant land animals with scaly skin.' },
    { id: 'mammals', name: 'Early Mammals', period: '200 Million years ago', icon: '🐀', desc: 'Small, warm-blooded animals co-existing with dinos.' },
    { id: 'apes', name: 'Ancient Apes', period: '20 Million years ago', icon: '🐒', desc: 'Primates adapting to changing environments.' },
    { id: 'humans', name: 'Early Humans', period: '200,000 years ago', icon: '🚶', desc: 'Homo sapiens evolved with large brains.' }
];

const EvolutionTimeline = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        setItems([...EVOLUTION_STEPS].sort(() => Math.random() - 0.5));
    }, []);

    const checkOrder = () => {
        const isCorrect = items.every((item, idx) => item.id === EVOLUTION_STEPS[idx].id);

        if (isCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success('Perfect! You\'ve traced the history of life. 🌍');
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error('The timeline is incorrect. Reorder from oldest to newest! 🔄');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '5');
        if (curLevel < 6) localStorage.setItem('completed_levels_Heredity and Evolution', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        return (
            <div className="et-finish-screen">
                <motion.div className="et-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Evolution Master! ⏳</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">History Accuracy: 100%</p>
                    <p className="motivational-text">Hurray 🎉 You are a Genetics Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Genetic Cross Simulation →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="evolution-timeline-container">
            <header className="et-header">
                <button className="et-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>🕰️ Evolution Timeline</h1>
                <div className="et-score">Items: {items.length}</div>
            </header>

            <main className="et-game-area">
                <div className="et-instructions">
                    <p>📦 Drag and reorder the organisms from the <strong>Oldest (Top)</strong> to the <strong>Most Recent (Bottom)</strong> evolutionary stage.</p>
                </div>

                <div className="et-puzzle-box">
                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="et-list">
                        {items.map((step) => (
                            <Reorder.Item key={step.id} value={step} className="et-item">
                                <div className="et-item-icon">{step.icon}</div>
                                <div className="et-item-content">
                                    <h3>{step.name}</h3>
                                    <span className="et-period">{step.period}</span>
                                    <p className="et-desc">{step.desc}</p>
                                </div>
                                <div className="drag-handle">⋮⋮</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                <button className="et-check-btn" onClick={checkOrder}>Verify Timeline ✅</button>
            </main>
        </div>
    );
};

export default EvolutionTimeline;
