import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ProfessorCarboniusBoss.css';

const BOSS_STAGES = [
    {
        id: 1,
        title: "Construct Methane (CH₄)",
        dialogue: "Greetings, Student! I am Professor Carbonius. To pass my class, you must prove you can build the simplest hydrocarbon!",
        target: { C: 1, H: 4 },
        baseStructure: "C", // Center
        slots: [
            { id: 's1', type: 'H', angle: 0, dist: 80 },
            { id: 's2', type: 'H', angle: 90, dist: 80 },
            { id: 's3', type: 'H', angle: 180, dist: 80 },
            { id: 's4', type: 'H', angle: 270, dist: 80 }
        ]
    },
    {
        id: 2,
        title: "Synthesize Ethene (C₂H₄)",
        dialogue: "Not bad. But can you handle a Double Bond? unsaturated hydrocarbons are more reactive!",
        target: { C: 2, H: 4 },
        baseStructure: "C=C",
        slots: [
            { id: 's1', type: 'H', angle: 45, dist: 80, parent: 'left' },
            { id: 's2', type: 'H', angle: 315, dist: 80, parent: 'left' },
            { id: 's3', type: 'H', angle: 135, dist: 80, parent: 'right' }, // Visual angles relative to center
            { id: 's4', type: 'H', angle: 225, dist: 80, parent: 'right' }
        ]
    },
    {
        id: 3,
        title: "Fabricate Ethanol (C₂H₅OH)",
        dialogue: "Impressive! Final Test. Build Ethanol, the solvent of civilization! Don't forget the functional group.",
        target: { C: 2, H: 5, OH: 1 },
        baseStructure: "C-C",
        slots: [
            { id: 's1', type: 'H', angle: 90, dist: 60, parent: 'c1' },
            { id: 's2', type: 'H', angle: 270, dist: 60, parent: 'c1' },
            { id: 's3', type: 'H', angle: 180, dist: 60, parent: 'c1' },
            { id: 's4', type: 'H', angle: 90, dist: 60, parent: 'c2' },
            { id: 's5', type: 'H', angle: 270, dist: 60, parent: 'c2' },
            { id: 's6', type: 'OH', angle: 0, dist: 80, parent: 'c2' }
        ]
    }
];

const ProfessorCarboniusBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStage, setCurrentStage] = useState(0);
    const [filledSlots, setFilledSlots] = useState({});
    const [gameState, setGameState] = useState('dialogue'); // dialogue, building, won
    const [rotation, setRotation] = useState({ x: 0, y: 0 });

    const activeStage = BOSS_STAGES[currentStage];

    // Auto-rotate effect
    useEffect(() => {
        if (gameState !== 'building') return;
        const interval = setInterval(() => {
            setRotation(prev => ({ x: prev.x + 0.5, y: prev.y + 1 }));
        }, 50);
        return () => clearInterval(interval);
    }, [gameState]);

    const handleStartBuild = () => {
        setGameState('building');
    };

    const handleSlotClick = (slot) => {
        if (filledSlots[slot.id]) return;

        setFilledSlots(prev => ({ ...prev, [slot.id]: true }));

        // Visual feedback
        const remaining = activeStage.slots.length - (Object.keys(filledSlots).length + 1);
        if (remaining === 0) {
            toast.success("Structure Complete! 💎");
            setTimeout(() => {
                if (currentStage < BOSS_STAGES.length - 1) {
                    setCurrentStage(prev => prev + 1);
                    setFilledSlots({});
                    setGameState('dialogue');
                } else {
                    handleBossDefeated();
                }
            }, 2000);
        } else {
            // toast(`${remaining} atoms left`, { icon: '🔧', duration: 800 });
        }
    };

    const handleBossDefeated = () => {
        setGameState('won');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '9'); // Mark as done (stored as 9 to be safe/consistent with logic)
        canvasConfetti({ particleCount: 500, spread: 360, startVelocity: 40 });
        toast.success("You defeated Professor Carbonius! 🧬🏆");
    };

    // Helper to position atoms in "3D" space (2D projection)
    const getAtomPosition = (slot) => {
        // Simple 2D offset based on angle/dist
        const rad = slot.angle * (Math.PI / 180);
        const x = Math.cos(rad) * slot.dist;
        const y = Math.sin(rad) * slot.dist;

        // Adjust for multi-center molecules
        let cx = 0, cy = 0;
        if (activeStage.id === 2) {
            cx = slot.parent === 'left' ? -40 : 40;
        } else if (activeStage.id === 3) {
            cx = slot.parent === 'c1' ? -40 : 40;
        }

        return { x: cx + x, y: cy + y };
    };

    return (
        <div className="boss-carbon-container">
            <AnimatePresence mode="wait">
                {gameState === 'dialogue' && (
                    <motion.div
                        key="dialogue"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="boss-dialogue-box"
                    >
                        <div className="prof-avatar">👨‍🔬</div>
                        <div className="dialogue-content">
                            <h2>Professor Carbonius</h2>
                            <p>"{activeStage.dialogue}"</p>
                            <button onClick={handleStartBuild} className="start-btn">Start Challenge 🧪</button>
                        </div>
                    </motion.div>
                )}

                {gameState === 'building' && (
                    <motion.div
                        key="build"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="build-arena"
                    >
                        <header className="stage-header">
                            <h3>Stage {currentStage + 1}: {activeStage.title}</h3>
                            <button onClick={() => navigate('/map')} className="flee-btn">🏃‍♂️ FLEE</button>
                        </header>

                        <div className="molecule-viewport">
                            <motion.div
                                className="molecule-3d-wrapper"
                                style={{
                                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                                }}
                            >
                                {/* Center Structure */}
                                <div className="center-atoms">
                                    {activeStage.baseStructure === "C" && <div className="atom c">C</div>}
                                    {activeStage.baseStructure === "C=C" && (
                                        <div className="bond-group double">
                                            <div className="atom c">C</div>
                                            <div className="bond-line double"></div>
                                            <div className="atom c">C</div>
                                        </div>
                                    )}
                                    {activeStage.baseStructure === "C-C" && (
                                        <div className="bond-group single">
                                            <div className="atom c">C</div>
                                            <div className="bond-line single"></div>
                                            <div className="atom c">C</div>
                                        </div>
                                    )}
                                </div>

                                {/* Radial Slots */}
                                {activeStage.slots.map((slot) => {
                                    const pos = getAtomPosition(slot);
                                    return (
                                        <div
                                            key={slot.id}
                                            className={`orbit-slot ${filledSlots[slot.id] ? 'filled' : ''}`}
                                            style={{
                                                transform: `translate(${pos.x}px, ${pos.y}px) rotateX(${-rotation.x}deg) rotateY(${-rotation.y}deg)` // Counter-rotate to keep upright if needed, or let them spin
                                                // Let's remove counter-rotation for full 3D spin effect on structure
                                            }}
                                            onClick={() => handleSlotClick(slot)}
                                        >
                                            {filledSlots[slot.id] ?
                                                <span className={`atom-g ${slot.type.toLowerCase()}`}>{slot.type}</span> :
                                                <span className="add-icon">+</span>
                                            }
                                            {filledSlots[slot.id] && <div className="bond-connector"></div>}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        <div className="toolbox">
                            <p>Click empty nodes (+) to attach atoms!</p>
                        </div>
                    </motion.div>
                )}

                {gameState === 'won' && (
                    <motion.div
                        key="won"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="victory-screen"
                    >
                        <div className="trophy">🏆</div>
                        <h1>CONGRATULATIONS!</h1>
                        <p>You have mastered Carbon and its Compounds!</p>
                        <div className="badges">
                            <span className="badge">💎 The Tetravalent Titan</span>
                            <span className="badge">🧬 Organic Overlord</span>
                        </div>
                        <button
                            className="finish-btn"
                            onClick={() => navigate(`/map`)}
                        >
                            Return to Map
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfessorCarboniusBoss;
