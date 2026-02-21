import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EnergyFlow.css';

const FLOWS = [
    {
        title: "Thermal Power Flow",
        steps: [
            { id: 'fuel', label: 'Coal/Fuel', icon: '🪨' },
            { id: 'heat', label: 'Boiler Heat', icon: '🔥' },
            { id: 'turbine', label: 'Turbine', icon: '⚙️' },
            { id: 'gen', label: 'Generator', icon: '🔌' }
        ]
    },
    {
        title: "Solar Energy Flow",
        steps: [
            { id: 'sun', label: 'Sunlight', icon: '☀️' },
            { id: 'panel', label: 'Solar Panel', icon: '🟦' },
            { id: 'inv', label: 'Inverter', icon: '📦' },
            { id: 'grid', label: 'Home Grid', icon: '🏠' }
        ]
    }
];

const EnergyFlow = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentFlow, setCurrentFlow] = useState(0);
    const [placed, setPlaced] = useState([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const activeFlow = FLOWS[currentFlow];

    const handlePlace = (step) => {
        if (placed.find(p => p.id === step.id)) return;

        const expectedNext = activeFlow.steps[placed.length];
        if (step.id === expectedNext.id) {
            setPlaced([...placed, step]);
            setScore(s => s + 50);

            if (placed.length + 1 === activeFlow.steps.length) {
                if (currentFlow < FLOWS.length - 1) {
                    setTimeout(() => {
                        setCurrentFlow(prev => prev + 1);
                        setPlaced([]);
                    }, 1500);
                } else {
                    setGameState('finished');
                    canvasConfetti({ particleCount: 150, spread: 70 });
                }
            }
        } else {
            setScore(s => Math.max(0, s - 10));
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 400) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (score >= 200) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="flow-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 6: ENERGY FLOW MASTER</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentFlow}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="flow-view"
                        >
                            <h1>{activeFlow.title}</h1>
                            <div className="flow-path">
                                {activeFlow.steps.map((s, i) => (
                                    <div key={i} className="flow-step-container">
                                        <div className={`drop-zone ${placed.find(p => p.id === s.id) ? 'active' : ''}`}>
                                            {placed.find(p => p.id === s.id) ? (
                                                <div className="placed-item">
                                                    <span className="icon">{s.icon}</span>
                                                    <span className="label">{s.label}</span>
                                                </div>
                                            ) : '?'}
                                        </div>
                                        {i < activeFlow.steps.length - 1 && <div className="arrow">➡️</div>}
                                    </div>
                                ))}
                            </div>

                            <div className="icon-tray">
                                {activeFlow.steps
                                    .sort(() => Math.random() - 0.5)
                                    .map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => handlePlace(s)}
                                            className={`icon-btn ${placed.find(p => p.id === s.id) ? 'hidden' : ''}`}
                                        >
                                            <span className="btn-icon">{s.icon}</span>
                                            <span className="btn-label">{s.label}</span>
                                        </button>
                                    ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="victory-card">
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 150) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EnergyFlow;
