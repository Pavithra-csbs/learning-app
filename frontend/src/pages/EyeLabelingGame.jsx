import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EyeLabelingGame.css';

const EyeLabelingGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('intro'); // intro, playing, success
    const [score, setScore] = useState(0);
    const [explanation, setExplanation] = useState(null);

    const partsInfo = {
        cornea: "The transparent outer layer that refracts light entering the eye.",
        iris: "The colored part that controls the amount of light by adjusting pupil size.",
        pupil: "The central opening through which light enters the eye.",
        lens: "A crystal-like structure that focuses light onto the retina.",
        retina: "The light-sensitive inner surface containing rods and cones.",
        'optic-nerve': "Transmits electrical signals from the retina to the brain.",
        'ciliary-muscles': "Adjust the curvature of the lens for focusing."
    };

    const [availableLabels, setAvailableLabels] = useState([
        { id: 'cornea', text: 'Cornea' },
        { id: 'iris', text: 'Iris' },
        { id: 'pupil', text: 'Pupil' },
        { id: 'lens', text: 'Lens' },
        { id: 'retina', text: 'Retina' },
        { id: 'optic-nerve', text: 'Optic Nerve' },
        { id: 'ciliary-muscles', text: 'Ciliary Muscles' }
    ]);

    const [droppedLabels, setDroppedLabels] = useState({
        cornea: null,
        iris: null,
        pupil: null,
        lens: null,
        retina: null,
        'optic-nerve': null,
        'ciliary-muscles': null
    });

    const hotspots = {
        cornea: { x: 340, y: 200, label: 'Drop Cornea' },
        iris: { x: 300, y: 140, label: 'Drop Iris' },
        pupil: { x: 310, y: 200, label: 'Drop Pupil' },
        lens: { x: 270, y: 200, label: 'Drop Lens' },
        retina: { x: 60, y: 200, label: 'Drop Retina' },
        'optic-nerve': { x: 20, y: 250, label: 'Drop Nerve' },
        'ciliary-muscles': { x: 270, y: 110, label: 'Drop Muscle' }
    };

    const handleDrop = (labelId, zoneId) => {
        if (labelId === zoneId) {
            setDroppedLabels(prev => ({ ...prev, [zoneId]: labelId }));
            setAvailableLabels(prev => prev.filter(l => l.id !== labelId));
            setScore(prev => prev + 25);
            setExplanation(partsInfo[labelId]);
            setTimeout(() => setExplanation(null), 4000);
        } else {
            // Visual feedback for wrong drop could be added here
        }
    };

    useEffect(() => {
        if (Object.values(droppedLabels).every(v => v !== null)) {
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    }, [droppedLabels]);

    return (
        <div className="eye-game-container">
            <header className="eye-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="score-display">ANATOMICAL SCORE: {score}</div>
            </header>

            <main className="eye-arena">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="eye-card overlay">
                            <h1>The Human Eye 👁️</h1>
                            <p>Master the anatomy of the eye! Drag the labels to the correct parts of the diagram.</p>
                            <button onClick={() => setGameState('playing')} className="start-btn">BEGIN DISSECTION</button>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="eye-card overlay success">
                            <h1>Anatomy Expert! 🎓</h1>
                            <p>You have correctly identified all major parts of the human eye. Brilliant!</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="game-layout">
                    <div className="diagram-container">
                        <AnimatePresence>
                            {explanation && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="explanation-popup">
                                    {explanation}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <svg viewBox="0 0 400 400" className="eye-svg">
                            {/* Outer Sclera */}
                            <circle cx="180" cy="200" r="150" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="2" />

                            {/* Cornea bulge */}
                            <path d="M 320 140 A 100 100 0 0 1 320 260" fill="none" stroke="#4cc9f0" strokeWidth="4" />

                            {/* Lens */}
                            <ellipse cx="280" cy="200" rx="15" ry="40" fill="rgba(76, 201, 240, 0.3)" stroke="#4cc9f0" strokeWidth="2" />

                            {/* Iris */}
                            <line x1="300" y1="120" x2="300" y2="160" stroke="#f72585" strokeWidth="8" />
                            <line x1="300" y1="240" x2="300" y2="280" stroke="#f72585" strokeWidth="8" />

                            {/* Retina */}
                            <path d="M 120 70 A 140 140 0 0 0 120 330" fill="none" stroke="#f72585" strokeWidth="3" strokeDasharray="5,2" />

                            {/* Optic Nerve */}
                            <path d="M 40 180 Q 0 200 40 220" fill="none" stroke="white" strokeWidth="15" />

                            {/* Ciliary Muscles */}
                            <path d="M 280 155 Q 260 140 280 125" fill="none" stroke="#4cc9f0" strokeWidth="4" />
                            <path d="M 280 245 Q 260 260 280 275" fill="none" stroke="#4cc9f0" strokeWidth="4" />

                            {/* Hotspots */}
                            {Object.entries(hotspots).map(([id, pos]) => (
                                <g key={id} className={`hotspot ${droppedLabels[id] ? 'filled' : ''}`}>
                                    <circle
                                        cx={pos.x} cy={pos.y} r="15"
                                        fill={droppedLabels[id] ? '#4cc9f0' : 'rgba(255,255,255,0.1)'}
                                        stroke="white" strokeDasharray="3,3"
                                    />
                                    {droppedLabels[id] && (
                                        <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontSize="12" fill="white">✓</text>
                                    )}
                                </g>
                            ))}
                        </svg>
                    </div>

                    <div className="labels-panel">
                        <h3>ANATOMICAL TERMS</h3>
                        <div className="labels-grid">
                            {availableLabels.map(label => (
                                <motion.div
                                    key={label.id}
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => {
                                        const svgRect = document.querySelector('.eye-svg').getBoundingClientRect();
                                        Object.entries(hotspots).forEach(([zid, zpos]) => {
                                            const targetX = svgRect.left + (zpos.x / 400) * svgRect.width;
                                            const targetY = svgRect.top + (zpos.y / 400) * svgRect.height;
                                            const dist = Math.sqrt((info.point.x - targetX) ** 2 + (info.point.y - targetY) ** 2);
                                            if (dist < 40) handleDrop(label.id, zid);
                                        });
                                    }}
                                    className="label-chip"
                                    whileHover={{ scale: 1.05 }}
                                    whileDrag={{ scale: 1.1, zIndex: 100 }}
                                >
                                    {label.text}
                                </motion.div>
                            ))}
                        </div>

                        <div className="completed-list">
                            {Object.entries(droppedLabels).map(([id, val]) => val && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={id} className="checked-label">
                                    <span>{availableLabels.find(l => l.id === id)?.text || id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</span>
                                    <span className="check">✔</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EyeLabelingGame;
