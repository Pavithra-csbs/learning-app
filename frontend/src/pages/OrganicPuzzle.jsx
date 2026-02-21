import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './OrganicPuzzle.css';

const PUZZLES = [
    {
        id: 1,
        name: "Methane",
        formula: "CH₄",
        structure: ["H", "C", "H", "H", "H"], // Center C, 4 surrounding Hs
        slots: [
            { id: 'top', x: 0, y: -80, type: 'H' },
            { id: 'right', x: 80, y: 0, type: 'H' },
            { id: 'bottom', x: 0, y: 80, type: 'H' },
            { id: 'left', x: -80, y: 0, type: 'H' },
            { id: 'center', x: 0, y: 0, type: 'C', fixed: true } // Center is fixed
        ],
        pieces: [
            { id: 'p1', type: 'H' }, { id: 'p2', type: 'H' }, { id: 'p3', type: 'H' }, { id: 'p4', type: 'H' }
        ]
    },
    {
        id: 2,
        name: "Ethanol",
        formula: "C₂H₅OH",
        slots: [
            { id: 'c1', x: -60, y: 0, type: 'CH3', fixed: true },
            { id: 'c2', x: 60, y: 0, type: 'CH2', fixed: true },
            { id: 'oh', x: 160, y: 0, type: 'OH' } // User needs to place OH
        ],
        pieces: [
            { id: 'p1', type: 'OH' }, { id: 'p2', type: 'H' }, { id: 'p3', type: 'Cl' } // Distractors
        ],
        correctPieceId: 'p1' // Simple single slot logic for this one
    },
    // Simplified for MVP - sticking to drag-to-slot logic
];

// Let's refine the puzzle logic to be more general: Drag specific parts to build the structure
const LEVELS = [
    {
        id: 1,
        name: "Methane (CH₄)",
        blueprint: "C bonded to 4 H atoms",
        baseImage: "C", // Represented visually
        targetSlots: 4,
        requiredPiece: "H",
        pieces: ["H", "H", "H", "H", "O", "Cl"] // Options
    },
    {
        id: 2,
        name: "Ethene (C₂H₄)",
        blueprint: "C=C double bond with 4 H atoms",
        baseImage: "C=C",
        targetSlots: 4,
        requiredPiece: "H",
        pieces: ["H", "H", "H", "H", "N", "O"]
    },
    {
        id: 3,
        name: "Ethanol (C₂H₅OH)",
        blueprint: "Ethyl group (C₂H₅) bonded to Alcohol group (-OH)",
        baseImage: "C₂H₅-",
        targetSlots: 1,
        requiredPiece: "OH",
        pieces: ["OH", "COOH", "CHO", "Cl"]
    },
    {
        id: 4,
        name: "Ethanoic Acid (CH₃COOH)",
        blueprint: "Methyl group (CH₃) bonded to Carboxyl group (-COOH)",
        baseImage: "CH₃-",
        targetSlots: 1,
        requiredPiece: "COOH",
        pieces: ["OH", "COOH", "CHO", "Br"]
    }
];

const OrganicPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [filledSlots, setFilledSlots] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeLevel = LEVELS[currentLevel];

    const handlePieceDrop = (pieceType) => {
        if (pieceType === activeLevel.requiredPiece) {
            const newFilled = filledSlots + 1;
            setFilledSlots(newFilled);

            if (newFilled === activeLevel.targetSlots) {
                toast.success("Structure Complete! 🧩✅");
                setTimeout(() => {
                    if (currentLevel < LEVELS.length - 1) {
                        setCurrentLevel(currentLevel + 1);
                        setFilledSlots(0);
                    } else {
                        handleGameComplete();
                    }
                }, 1500);
            } else {
                toast.success("Correct piece! Keep going.");
            }
        } else {
            toast.error("Incorrect group/atom for this structure!");
        }
    };

    const handleGameComplete = () => {
        setGameState('finished');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '4');
        canvasConfetti({ particleCount: 200, spread: 100 });
        toast.success("Organic Architect! 🏛️");
        setTimeout(() => {
            navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`);
        }, 3000);
    };

    return (
        <div className="organic-puzzle-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="level-info">PUZZLE {currentLevel + 1} / {LEVELS.length}</div>
            </header>

            <main className="puzzle-arena">
                <h1 className="molecule-name">{activeLevel.name}</h1>
                <p className="blueprint-text">{activeLevel.blueprint}</p>

                <div className="construction-zone">
                    <div className="base-structure">
                        {activeLevel.baseImage}
                        {/* Render Slots */}
                        {Array.from({ length: activeLevel.targetSlots }).map((_, i) => (
                            <div key={i} className={`slot ${i < filledSlots ? 'filled' : ''}`}>
                                {i < filledSlots ? activeLevel.requiredPiece : ''}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="parts-tray">
                    {activeLevel.pieces.map((piece, i) => (
                        <motion.div
                            key={i}
                            className="puzzle-piece"
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.5}
                            onDragEnd={(e, info) => {
                                if (info.offset.y < -100) {
                                    handlePieceDrop(piece);
                                }
                            }}
                            whileHover={{ scale: 1.1, cursor: 'grab' }}
                            whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
                        >
                            {piece}
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OrganicPuzzle;
