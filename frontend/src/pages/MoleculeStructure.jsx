import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MoleculeStructure.css';

const LEVELS = [
    {
        id: 1,
        name: "Propane (C₃H₈)",
        instruction: "Add the missing Hydrogen atoms to satisfy Carbon's valency of 4.",
        structure: [
            { id: 'c1', type: 'C', x: -100, bonds: 4 },
            { id: 'c2', type: 'C', x: 0, bonds: 4 },
            { id: 'c3', type: 'C', x: 100, bonds: 4 }
        ],
        // Initial fixed bonds (simplified visual representation needed)
        // For this game, let's use a slot-based approach similar to Puzzle but focused on valency counts.
        // Or simpler: Click to add H until full.
        // Let's go with: "Drag H atoms to empty slots"
        slots: [
            { id: 's1', parent: 'c1', angle: 90 },
            { id: 's2', parent: 'c1', angle: 180 },
            { id: 's3', parent: 'c1', angle: 270 },
            { id: 's4', parent: 'c2', angle: 90 },
            { id: 's5', parent: 'c2', angle: 270 },
            { id: 's6', parent: 'c3', angle: 90 },
            { id: 's7', parent: 'c3', angle: 0 },
            { id: 's8', parent: 'c3', angle: 270 }
        ],
        required: 8
    },
    {
        id: 2,
        name: "Etheene (C₂H₄)",
        instruction: "Complete the structure of Ethene. Remember the Double Bond!",
        structure: [
            { id: 'c1', type: 'C', x: -60, bonds: 4 },
            { id: 'c2', type: 'C', x: 60, bonds: 4 }
        ],
        // Double bond consumes 2 valency. So each C needs 2 H.
        slots: [
            { id: 's1', parent: 'c1', angle: 135 },
            { id: 's2', parent: 'c1', angle: 225 },
            { id: 's3', parent: 'c2', angle: 45 },
            { id: 's4', parent: 'c2', angle: 315 }
        ],
        required: 4
    },
    {
        id: 3,
        name: "Cyclohexane (C₆H₁₂)",
        instruction: "A ring structure! Each Carbon needs 2 Hydrogens.",
        structure: [
            { id: 'c1', type: 'C', x: 0, y: -100 },
            { id: 'c2', type: 'C', x: 86, y: -50 },
            { id: 'c3', type: 'C', x: 86, y: 50 },
            { id: 'c4', type: 'C', x: 0, y: 100 },
            { id: 'c5', type: 'C', x: -86, y: 50 },
            { id: 'c6', type: 'C', x: -86, y: -50 }
        ],
        slots: Array.from({ length: 12 }, (_, i) => ({ id: `s${i}`, parent: `c${Math.floor(i / 2) + 1}`, angle: i % 2 === 0 ? 'outer' : 'inner' })), // Simplified placement logic needed in CSS
        required: 12,
        isRing: true
    }
];

const MoleculeStructure = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [filledSlots, setFilledSlots] = useState({});
    const [gameState, setGameState] = useState('playing');

    const activeLevel = LEVELS[currentLevel];

    const handleSlotClick = (slotId) => {
        if (filledSlots[slotId]) return;

        setFilledSlots(prev => ({ ...prev, [slotId]: true }));
        toast.success("H Added!", { icon: '⚛️', duration: 500 });

        // Check completion
        const newFilledCount = Object.keys(filledSlots).length + 1;
        if (newFilledCount === activeLevel.required) {
            setTimeout(() => {
                toast.success("Structure Stable! ✅");
                if (currentLevel < LEVELS.length - 1) {
                    setCurrentLevel(currentLevel + 1);
                    setFilledSlots({});
                } else {
                    handleGameComplete();
                }
            }, 1000);
        }
    };

    const handleGameComplete = () => {
        setGameState('finished');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '7');
        canvasConfetti({ particleCount: 200, spread: 100 });
    };

    // Helper to position slots around atoms
    const getSlotStyle = (slot, atomIndex, totalAtoms, isRing) => {
        // Simplified visual positioning for MVP
        // In a real 2D engine we'd calculate vectors.
        // Here we'll just hack standard offsets.

        let base = { position: 'absolute' };

        if (isRing) {
            // Hexagon logic
            const angleDeg = 60 * atomIndex - 90;
            const rad = angleDeg * (Math.PI / 180);
            const r = 100; // Radius of ring
            const cx = Math.cos(rad) * r;
            const cy = Math.sin(rad) * r;

            // H positions relative to C
            // Just push them outward
            const offsetR = 40;
            const hAngle1 = angleDeg - 30;
            const hAngle2 = angleDeg + 30;

            const isFirstH = slot.id.endsWith('0') || slot.id.endsWith('2') || slot.id.endsWith('4') || slot.id.endsWith('6') || slot.id.endsWith('8');
            // Logic match slot array index logic
            // Actually, the slot.parent tells us which C it belongs to.
            // Let's assume passed atomIndex matches parent index.

            const finalAngle = Number(slot.id.slice(1)) % 2 === 0 ? hAngle1 : hAngle2;
            const hRad = finalAngle * (Math.PI / 180);

            return {
                ...base,
                left: `calc(50% + ${cx + Math.cos(hRad) * offsetR}px)`,
                top: `calc(50% + ${cy + Math.sin(hRad) * offsetR}px)`
            };
        }

        // Linear Chain logic (Propane)
        if (activeLevel.name.includes("Propane")) {
            const xOffset = (atomIndex - 1) * 100; // -100, 0, 100
            let dx = 0, dy = 0;
            const dist = 60;

            if (slot.angle === 0) dx = dist;
            if (slot.angle === 90) dy = -dist;
            if (slot.angle === 180) dx = -dist;
            if (slot.angle === 270) dy = dist;

            return {
                ...base,
                left: `calc(50% + ${xOffset + dx}px)`,
                top: `calc(50% + ${dy}px)`
            };
        }

        // Ethene Logic
        if (activeLevel.name.includes("Ethene")) {
            const xOffset = atomIndex === 0 ? -60 : 60;
            const dist = 50;
            const rad = slot.angle * (Math.PI / 180);

            return {
                ...base,
                left: `calc(50% + ${xOffset + Math.cos(rad) * dist}px)`,
                top: `calc(50% + ${Math.sin(rad) * dist}px)`
            };
        }

        return base;
    };

    return (
        <div className="molecule-struct-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="level-info">Level {currentLevel + 1}</div>
            </header>

            {gameState === 'playing' ? (
                <main className="struct-arena">
                    <h1>{activeLevel.name}</h1>
                    <p className="instruction">{activeLevel.instruction}</p>

                    <div className="workspace">
                        <div className="molecule-center">
                            {/* Atoms */}
                            {activeLevel.structure.map((atom, i) => (
                                <div
                                    key={atom.id}
                                    className="carbon-atom"
                                    style={activeLevel.isRing ? {
                                        transform: `rotate(${60 * i - 90}deg) translate(100px) rotate(-${60 * i - 90}deg)`
                                    } : {
                                        transform: `translate(${atom.x}px, ${atom.y || 0}px)`
                                    }}
                                >
                                    C
                                </div>
                            ))}

                            {/* Bonds (Visual only, simple lines) */}
                            <div className="bonds-layer">
                                {/* Simplified: We assume C atoms are connected sequentially or in ring */}
                                {activeLevel.isRing && <div className="ring-bond"></div>}
                                {activeLevel.name.includes("Propane") && <div className="linear-bond" style={{ width: 200 }}></div>}
                                {activeLevel.name.includes("Ethene") && <div className="double-bond" style={{ width: 120 }}></div>}
                            </div>

                            {/* Hydrogen Slots */}
                            {activeLevel.slots.map((slot) => {
                                const parentIndex = activeLevel.structure.findIndex(a => a.id === slot.parent);
                                return (
                                    <motion.button
                                        key={slot.id}
                                        className={`h-slot ${filledSlots[slot.id] ? 'filled' : 'empty'}`}
                                        style={getSlotStyle(slot, parentIndex, activeLevel.structure.length, activeLevel.isRing)}
                                        onClick={() => handleSlotClick(slot.id)}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {filledSlots[slot.id] ? 'H' : '+'}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="controls">
                        <div className="atom-source">
                            <span className="source-icon">H</span>
                            <span>Click empty slots (+) to add Hydrogen</span>
                        </div>
                        <button className="hint-btn" onClick={() => toast("Carbon needs 4 bonds! Count the lines.")}>
                            💡 HINT
                        </button>
                    </div>
                </main>
            ) : (
                <div className="victory-screen">
                    <h1>🎉 Structure Master!</h1>
                    <p>You understand Valency and Connectivity!</p>
                    <button
                        className="next-btn"
                        onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`)}
                    >
                        Back to Menu
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoleculeStructure;
