import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './LensMatching.css';

const DEFECTS = [
    {
        id: 'myopia',
        title: 'Patient Arjun: Myopia',
        symptoms: 'Cannot see the blackboard clearly from the back of the class.',
        targetLens: 'concave',
        focalPoint: 180, // In front of retina (at 250)
        explanation: 'Myopia requires a CONCAVE lens. It diverges light rays so the eye lens can focus them exactly on the retina.'
    },
    {
        id: 'hypermetropia',
        title: 'Patient Sara: Hypermetropia',
        symptoms: 'Finds it difficult to read a book clearly at normal distance.',
        targetLens: 'convex',
        focalPoint: 320, // Behind retina (at 250)
        explanation: "Hypermetropia requires a CONVEX lens. It converges light rays so they don't fall behind the retina."
    }
];

const LensMatching = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, checking, success
    const [placedLens, setPlacedLens] = useState(null);
    const [isFixed, setIsFixed] = useState(false);

    const currentDefect = DEFECTS[stage % DEFECTS.length];

    const handleDrop = (lensType) => {
        setPlacedLens(lensType);
        if (lensType === currentDefect.targetLens) {
            setIsFixed(true);
            setScore(prev => prev + 100);
            canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            setGameState('checking');
        } else {
            setIsFixed(false);
            setScore(prev => Math.max(0, prev - 10));
        }
    };

    const nextStage = () => {
        if (stage < DEFECTS.length - 1) {
            setStage(prev => prev + 1);
            setPlacedLens(null);
            setIsFixed(false);
            setGameState('playing');
        } else {
            setGameState('success');
        }
    };

    return (
        <div className="lens-game-container">
            <header className="lens-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="lens-stats">
                    <div className="score-badge">CLINIC SCORE: {score}</div>
                </div>
            </header>

            <main className="lens-arena">
                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lens-overlay">
                            <h1>MISSION COMPLETE! 👓</h1>
                            <p>You've successfully prescribed corrective lenses for all patients!</p>
                            <div className="final-score">TOTAL EXPERTISE: {score} XP</div>
                            <button onClick={() => navigate('/map')} className="start-btn">RETURN TO MAP</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="optics-lab">
                    <div className="case-study">
                        <div className="case-header">CASE #{stage + 1}</div>
                        <h3>{currentDefect.title}</h3>
                        <p className="symptom-text">"{currentDefect.symptoms}"</p>
                    </div>

                    <div className="ray-simulation">
                        <svg viewBox="0 0 500 300" className="lens-svg">
                            {/* Eye Outline */}
                            <path d="M 200 50 A 100 100 0 1 1 200 250 L 300 250 A 100 100 0 1 0 300 50 Z" fill="rgba(255,255,255,0.05)" stroke="white" />
                            <line x1="400" y1="80" x2="400" y2="220" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                            <text x="390" y="70" fill="gray" fontSize="10">RETINA</text>

                            {/* Eye Lens */}
                            <ellipse cx="200" cy="150" rx="10" ry="40" fill="rgba(76, 201, 240, 0.3)" stroke="#4cc9f0" />

                            {/* Incoming Rays */}
                            <line x1="20" y1="130" x2="190" y2="130" stroke="white" opacity="0.3" />
                            <line x1="20" y1="170" x2="190" y2="170" stroke="white" opacity="0.3" />

                            {/* Corrective Lens Placeholder */}
                            <rect
                                x="100" y="100" width="40" height="100"
                                fill="none" stroke="dashed white" strokeDasharray="5,5"
                                opacity={placedLens ? 0 : 0.5}
                            />

                            {/* Placed Lens */}
                            {placedLens && (
                                <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    {placedLens === 'concave' ? (
                                        <path d="M 110 100 Q 120 150 110 200 L 130 200 Q 120 150 130 100 Z" fill="rgba(76, 201, 240, 0.5)" stroke="#4cc9f0" />
                                    ) : (
                                        <ellipse cx="120" cy="150" rx="10" ry="50" fill="rgba(76, 201, 240, 0.5)" stroke="#4cc9f0" />
                                    )}
                                </motion.g>
                            )}

                            {/* Focused Rays */}
                            <motion.path
                                d={`M 200 110 L ${isFixed ? 400 : currentDefect.focalPoint} 150 L 200 190`}
                                fill="none" stroke={isFixed ? "#4ade80" : "#f87171"} strokeWidth="2"
                                animate={{ opacity: 1 }}
                            />
                        </svg>

                        <div className="lens-inventory">
                            <div className="inventory-label">DRAG LENS TO PRESCRIBE</div>
                            <div className="lenses">
                                <motion.div
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => {
                                        if (info.point.x > 300 && info.point.x < 600) handleDrop('concave');
                                    }}
                                    className="lens-chip concave"
                                >
                                    CONCAVE
                                </motion.div>
                                <motion.div
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => {
                                        if (info.point.x > 300 && info.point.x < 600) handleDrop('convex');
                                    }}
                                    className="lens-chip convex"
                                >
                                    CONVEX
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {gameState === 'checking' && (
                        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lens-explanation">
                            <h4>DIAGNOSIS CORRECT! 🎯</h4>
                            <p>{currentDefect.explanation}</p>
                            <button onClick={nextStage} className="next-btn">NEXT PATIENT ➡️</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default LensMatching;
