import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MotorAssembly.css';

const PARTS = [
    { id: 'coil', name: 'Armature Coil', icon: '🌀', description: 'Rotates in the magnetic field.' },
    { id: 'magnet', name: 'Field Magnets', icon: '🧲', description: 'Provides uniform magnetic field.' },
    { id: 'rings', name: 'Split Rings', icon: '🔘', description: 'Reverses current direction every half-turn.' },
    { id: 'brushes', name: 'Carbon Brushes', icon: '🖌️', description: 'Maintain contact with rotating rings.' }
];

const MotorAssembly = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [placedParts, setPlacedParts] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState("Drag parts to the assembly blueprint!");

    const handleDrop = (partId) => {
        if (!placedParts.includes(partId)) {
            const nextPart = PARTS[placedParts.length];
            if (partId === nextPart.id) {
                setPlacedParts(prev => [...prev, partId]);
                setFeedback(`Correct! ${nextPart.name} in place. ✨`);
                if (placedParts.length + 1 === PARTS.length) {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 150 });
                }
            } else {
                setFeedback(`Not quite. Try placing the ${nextPart.name} first!`);
            }
        }
    };

    return (
        <div className="motor-container">
            <header className="motor-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="status">ASSEMBLY PROGRESS: {placedParts.length}/{PARTS.length}</div>
            </header>

            <main className="motor-arena">
                <div className="blueprint-area">
                    <div className="blueprint">
                        <div className={`slot magnet ${placedParts.includes('magnet') ? 'filled' : ''}`}>
                            {placedParts.includes('magnet') ? '🧲' : '?'}
                        </div>
                        <div className={`slot coil ${placedParts.includes('coil') ? 'filled' : ''}`}>
                            {placedParts.includes('coil') ? '🌀' : '?'}
                        </div>
                        <div className={`slot rings ${placedParts.includes('rings') ? 'filled' : ''}`}>
                            {placedParts.includes('rings') ? '🔘' : '?'}
                        </div>
                        <div className={`slot brushes ${placedParts.includes('brushes') ? 'filled' : ''}`}>
                            {placedParts.includes('brushes') ? '🖌️' : '?'}
                        </div>
                    </div>
                </div>

                <div className="toolbox">
                    <h3>PARTS BIN</h3>
                    <p className="hint">{feedback}</p>
                    <div className="parts-grid">
                        {PARTS.map(part => (
                            <motion.div
                                key={part.id}
                                className={`part-card ${placedParts.includes(part.id) ? 'locked' : ''}`}
                                draggable={!placedParts.includes(part.id)}
                                onDragEnd={() => handleDrop(part.id)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="part-icon">{part.icon}</div>
                                <div className="part-name">{part.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">⚙️</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>The motor is spinning perfectly! You've mastered electrical to mechanical energy conversion.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MotorAssembly;
