import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './CorrosionGame.css';

const METHODS = [
    { id: 'paint', name: "Painting", desc: "Coating with paint to block air/moisture." },
    { id: 'oil', name: "Oiling/Greasing", desc: "Applying oil to prevent contact with air." },
    { id: 'galv', name: "Galvanizing", desc: "Coating iron with a thin layer of Zinc." }
];

const CorrosionGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [rustLevel, setRustLevel] = useState(80); // 100 is fully rusted
    const [appliedMethods, setAppliedMethods] = useState([]);
    const [gameState, setGameState] = useState('playing');

    const handleApply = (method) => {
        if (appliedMethods.includes(method.id)) {
            toast.error(`${method.name} is already applied!`);
            return;
        }

        setAppliedMethods([...appliedMethods, method.id]);
        setRustLevel(prev => Math.max(0, prev - 30));
        toast.success(`${method.name} applied! Rust is retreating.`);

        if (appliedMethods.length === 2) { // Need all 3
            setTimeout(() => {
                setGameState('finished');
                localStorage.setItem('completed_levels_Metals and Non-metals', '4');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }, 1000);
        }
    };

    return (
        <div className="corrosion-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="title">LEVEL 3: CORROSION DEFENSE</div>
                <div className="stat">PROTECTION: {100 - rustLevel}%</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="defense-view">
                            <div className="bridge-container">
                                <div className="bridge-base">🌉</div>
                                <motion.div
                                    className="rust-overlay"
                                    animate={{ opacity: rustLevel / 100 }}
                                    transition={{ duration: 1 }}
                                >
                                    🌉
                                </motion.div>
                                <div className="status-label">
                                    {rustLevel > 0 ? "⚠️ DANGER: RUST DETECTED" : "✅ BRIDGE SECURED!"}
                                </div>
                            </div>

                            <div className="toolbox">
                                <h3>CHOOSE PREVENTION METHODS</h3>
                                <div className="methods-grid">
                                    {METHODS.map(m => (
                                        <button
                                            key={m.id}
                                            disabled={appliedMethods.includes(m.id)}
                                            onClick={() => handleApply(m)}
                                            className={`method-btn ${appliedMethods.includes(m.id) ? 'checked' : ''}`}
                                        >
                                            <span className="name">{m.name}</span>
                                            <span className="desc">{m.desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <h2>Awesome 🎉 Rust Stopped!</h2>
                            <h1>Bridge Safety: 100%</h1>
                            <p className="explanation">
                                Corrosion occurs when metals are exposed to air and moisture.
                                <strong>Galvanizing</strong> is particularly effective because Zinc is more reactive than Iron and acts as a sacrificial layer.
                            </p>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CorrosionGame;
