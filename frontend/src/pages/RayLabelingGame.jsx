import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RayLabelingGame.css';

const RayLabelingGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('intro'); // intro, playing, success
    const [score, setScore] = useState(0);
    const [hint, setHint] = useState("");

    // Labels to be dragged
    const [availableLabels, setAvailableLabels] = useState([
        { id: 'incident', text: 'Incident Ray' },
        { id: 'reflected', text: 'Reflected Ray' },
        { id: 'normal', text: 'Normal' },
        { id: 'angle-i', text: 'Angle of Incidence (i)' },
        { id: 'angle-r', text: 'Angle of Reflection (r)' }
    ]);

    // Drop zones on the diagram
    const [droppedLabels, setDroppedLabels] = useState({
        incident: null,
        reflected: null,
        normal: null,
        'angle-i': null,
        'angle-r': null
    });

    const dropZones = {
        incident: { x: 80, y: 150, text: 'Drop Ray' },
        reflected: { x: 300, y: 150, text: 'Drop Ray' },
        normal: { x: 170, y: 80, text: 'Drop Line' },
        'angle-i': { x: 170, y: 220, text: 'Drop ∠i' },
        'angle-r': { x: 210, y: 220, text: 'Drop ∠r' }
    };

    const handleDrop = (labelId, zoneId) => {
        if (labelId === zoneId) {
            setDroppedLabels(prev => ({ ...prev, [zoneId]: labelId }));
            setAvailableLabels(prev => prev.filter(l => l.id !== labelId));
            setScore(prev => prev + 20);
            setHint("Correct! That's the " + labelId.replace('-', ' ') + ".");
        } else {
            setHint("Oops! That doesn't go there. Try again!");
        }
    };

    useEffect(() => {
        if (Object.values(droppedLabels).every(v => v !== null)) {
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    }, [droppedLabels]);

    const showHint = () => {
        const remaining = availableLabels[0];
        if (remaining) {
            setHint(`Hint: Look for the ${remaining.text}!`);
        }
    };

    return (
        <div className="labeling-game-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="game-stats">
                    <span className="score-badge">SCORE: {score}</span>
                    <button onClick={showHint} className="hint-btn">GET HINT 💡</button>
                </div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="game-card">
                            <h1>Ray Labeling Mission 🏷️</h1>
                            <p>Identify the key parts of a reflection diagram. Drag the labels to their correct locations on the board.</p>
                            <button onClick={() => setGameState('playing')} className="start-btn">START LABELING</button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <div className="labeling-layout">
                            <div className="diagram-section">
                                <div className="hint-banner">{hint}</div>
                                <svg viewBox="0 0 400 400" className="labeling-svg">
                                    {/* Mirror */}
                                    <line x1="50" y1="300" x2="350" y2="300" stroke="white" strokeWidth="6" />
                                    <line x1="50" y1="310" x2="350" y2="310" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4,4" />

                                    {/* Normal Line */}
                                    <line x1="200" y1="50" x2="200" y2="300" stroke="white" strokeWidth="2" strokeDasharray="8,8" opacity="0.5" />

                                    {/* Incident Ray */}
                                    <line x1="80" y1="180" x2="200" y2="300" stroke="#f72585" strokeWidth="5" />
                                    <path d="M 140 240 l -10 0 l 10 10 l 10 -10 z" fill="#f72585" transform="rotate(-45, 140, 240)" />

                                    {/* Reflected Ray */}
                                    <line x1="200" y1="300" x2="320" y2="180" stroke="#4cc9f0" strokeWidth="5" />
                                    <path d="M 260 240 l -10 0 l 10 -10 l 10 10 z" fill="#4cc9f0" transform="rotate(45, 260, 240)" />

                                    {/* Angles */}
                                    <path d="M 170 300 A 30 30 0 0 1 200 270" fill="none" stroke="#f72585" strokeWidth="2" opacity="0.6" />
                                    <path d="M 230 300 A 30 30 0 0 0 200 270" fill="none" stroke="#4cc9f0" strokeWidth="2" opacity="0.6" />

                                    {/* Drop Zones */}
                                    {Object.entries(dropZones).map(([id, pos]) => (
                                        <g key={id} className={`drop-zone ${droppedLabels[id] ? 'filled' : ''}`}>
                                            <rect
                                                x={pos.x} y={pos.y} width="100" height="40"
                                                rx="8" fill="rgba(255,255,255,0.05)"
                                                stroke={droppedLabels[id] ? '#4cc9f0' : 'rgba(255,255,255,0.2)'}
                                                strokeDasharray={droppedLabels[id] ? '0' : '4,4'}
                                                className="drop-rect"
                                            />
                                            <text x={pos.x + 50} y={pos.y + 25} textAnchor="middle" fontSize="10" fill="gray">
                                                {droppedLabels[id] ? '✅' : pos.text}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            <div className="labels-section">
                                <h3>DRAG LABELS:</h3>
                                <div className="labels-grid">
                                    {availableLabels.map(label => (
                                        <motion.div
                                            key={label.id}
                                            drag
                                            dragSnapToOrigin
                                            onDragEnd={(e, info) => {
                                                const x = e.clientX;
                                                const y = e.clientY;
                                                // Simplified hit test based on element under cursor
                                                const element = document.elementFromPoint(x, y);
                                                const zone = element?.closest('.drop-zone');
                                                if (zone) {
                                                    // This is a bit hacky in standard React but works for this demo
                                                    // In a real app we'd use a DnD library like dnd-kit
                                                }
                                                // Fallback: Check coordinates against zones
                                                Object.entries(dropZones).forEach(([zid, zpos]) => {
                                                    const svgRect = document.querySelector('.labeling-svg').getBoundingClientRect();
                                                    const targetX = svgRect.left + (zpos.x / 400) * svgRect.width;
                                                    const targetY = svgRect.top + (zpos.y / 400) * svgRect.height;
                                                    const dist = Math.sqrt((x - targetX - 50) ** 2 + (y - targetY - 20) ** 2);
                                                    if (dist < 60) handleDrop(label.id, zid);
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

                                <div className="completed-labels">
                                    {Object.entries(droppedLabels).map(([id, val]) => val && (
                                        <div key={id} className="completed-label">
                                            <span>{availableLabels.find(l => l.id === id)?.text || id.replace('-', ' ')}</span>
                                            <span>✅</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="game-card success">
                            <h1>Diagram Master! 🏆</h1>
                            <p>You correctly identified all components of the ray diagram. Your technical knowledge is excellent!</p>
                            <div className="final-score">SCORE: {score}</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">BACK TO WORLD MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default RayLabelingGame;
