import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PlantReproductionSim.css';

const PROPAGATION_METHODS = [
    { id: 'bryophyllum', name: 'Bryophyllum', method: 'Leaves', desc: 'Buds produced in the notches along the leaf margins fall on soil and develop into new plants.' },
    { id: 'potato', name: 'Potato', method: 'Stem (Eyes)', desc: 'Vegetative propagation by using small nodes or "eyes" containing buds.' },
    { id: 'moneyplant', name: 'Money Plant', method: 'Stem Cutting', desc: 'A node of a stem cutting can grow into a new plant when placed in water/soil.' },
    { id: 'rose', name: 'Rose', method: 'Grafting/Cutting', desc: 'Artificial vegetative propagation used for commercial growth.' }
];

const PlantReproductionSim = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('choose'); // choose | germination | propagation | finished
    const [germStage, setGermStage] = useState(0); // 0-3
    const [plantedMethod, setPlantedMethod] = useState(null);

    const handleGermination = () => {
        if (germStage < 3) {
            setGermStage(s => s + 1);
            if (germStage === 0) toast('Seeds sown! Add water... 💧');
            if (germStage === 1) toast('Radicle emerges! Adding sun... ☀️');
            if (germStage === 2) toast('Plumule grows into a shoot! 🌱');
        } else {
            toast.success('Seed Germination Success! 🌻');
            setGameState('propagation');
        }
    };

    const handlePropagationSelect = (item) => {
        setPlantedMethod(item);
        toast.success(`Success! ${item.name} uses ${item.method} for reproduction.`);
        setTimeout(() => {
            canvasConfetti({ particleCount: 150, spread: 70 });
            setGameState('finished');
        }, 2000);
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '7');
        if (curLevel < 8) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '8');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        return (
            <div className="prs-finish-screen">
                <motion.div className="prs-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Green Thumb Pro! 🌿</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Plant Mastery: 100%</p>
                    <p className="motivational-text">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Final Boss: Bio Master →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="plant-repro-container">
            <header className="prs-header">
                <button className="prs-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🌳 Plant Reproduction Simulation</h1>
                <div className="prs-stage-indicator">Stage: {gameState.toUpperCase()}</div>
            </header>

            <main className="prs-game-area">
                {gameState === 'choose' && (
                    <motion.div className="prs-intro-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2>Welcome to the Garden!</h2>
                        <p>Plants have incredible ways to reproduce. You will first simulate <strong>Seed Germination</strong> and then explore <strong>Vegetative Propagation</strong>.</p>
                        <button className="prs-start-btn" onClick={() => setGameState('germination')}>Start Experiment 🌱</button>
                    </motion.div>
                )}

                {gameState === 'germination' && (
                    <div className="prs-sim-view">
                        <h3>🌱 Task: Simulate Seed Germination</h3>
                        <div className="germination-box">
                            <motion.div className="soil-layer">
                                <AnimatePresence>
                                    {germStage >= 1 && <motion.div className="seed-body" initial={{ scale: 0 }} animate={{ scale: 1 }}>🫘</motion.div>}
                                    {germStage >= 2 && <motion.div className="radicle" initial={{ height: 0 }} animate={{ height: 40 }}>🌱</motion.div>}
                                    {germStage >= 3 && <motion.div className="shoot" initial={{ y: 20, opacity: 0 }} animate={{ y: -50, opacity: 1 }}>🌿</motion.div>}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                        <div className="prs-actions-row">
                            <button className="action-btn water" onClick={handleGermination} disabled={germStage >= 4}>💧 Water</button>
                            <button className="action-btn sun" onClick={handleGermination} disabled={germStage < 1 || germStage >= 4}>☀️ Sun</button>
                        </div>
                        <p className="prs-sim-info">The seed contains the future plant (embryo). Food is stored in cotyledons!</p>
                    </div>
                )}

                {gameState === 'propagation' && (
                    <div className="prs-prop-view">
                        <h3>🌿 Task: Identify Vegetative Propagation</h3>
                        <p className="prs-prop-hint">Select the plant you want to grow using natural vegetative methods.</p>
                        <div className="prop-grid">
                            {PROPAGATION_METHODS.map(item => (
                                <motion.div key={item.id} className="prop-card" whileHover={{ scale: 1.05 }} onClick={() => handlePropagationSelect(item)}>
                                    <div className="prop-icon">{item.id === 'bryophyllum' ? '🍃' : item.id === 'potato' ? '🥔' : '🪴'}</div>
                                    <h4>{item.name}</h4>
                                    <span>via {item.method}</span>
                                </motion.div>
                            ))}
                        </div>
                        {plantedMethod && (
                            <motion.div className="prop-info-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <p><strong>NCERT Fact:</strong> {plantedMethod.desc}</p>
                            </motion.div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PlantReproductionSim;
