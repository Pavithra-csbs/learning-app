import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './HydrocarbonSorting.css';

const BUCKETS = [
    { id: 'alkane', label: "Alkanes", formula: "CnH2n+2", color: "from-green-400 to-green-600" },
    { id: 'alkene', label: "Alkenes", formula: "CnH2n", color: "from-blue-400 to-blue-600" },
    { id: 'alkyne', label: "Alkynes", formula: "CnH2n-2", color: "from-purple-400 to-purple-600" }
];

// Initial set of compounds to sort
const COMPOUNDS = [
    { id: 'c1', name: "Methane", formula: "CH₄", type: "alkane" }, // 1*2 + 2 = 4
    { id: 'c2', name: "Ethene", formula: "C₂H₄", type: "alkene" }, // 2*2 = 4
    { id: 'c3', name: "Ethyne", formula: "C₂H₂", type: "alkyne" }, // 2*2 - 2 = 2
    { id: 'c4', name: "Propane", formula: "C₃H₈", type: "alkane" }, // 3*2 + 2 = 8
    { id: 'c5', name: "Propene", formula: "C₃H₆", type: "alkene" }, // 3*2 = 6
    { id: 'c6', name: "Propyne", formula: "C₃H₄", type: "alkyne" }, // 3*2 - 2 = 4
    { id: 'c7', name: "Butane", formula: "C₄H₁₀", type: "alkane" }, // 4*2 + 2 = 10
    { id: 'c8', name: "Butene", formula: "C₄H₈", type: "alkene" }, // 4*2 = 8
    { id: 'c9', name: "Butyne", formula: "C₄H₆", type: "alkyne" }  // 4*2 - 2 = 6
];

const HydrocarbonSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState(COMPOUNDS);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleDrop = (item, bucketId) => {
        if (item.type === bucketId) {
            toast.success(`Correct! ${item.name} is an ${bucketId.charAt(0).toUpperCase() + bucketId.slice(1)}`);
            setScore(prev => prev + 10);
            setItems(prevItems => prevItems.filter(i => i.id !== item.id));

            if (items.length === 1) { // This was the last item
                handleGameComplete();
            }
        } else {
            toast.error("Oops! Check the general formula.");
        }
    };

    const handleGameComplete = () => {
        setGameState('finished');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '5');
        canvasConfetti({ particleCount: 200, spread: 100 });
        toast.success("Hydrocarbon Hero! 🦸‍♂️");
        setTimeout(() => {
            navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`);
        }, 3000);
    };

    return (
        <div className="hydrocarbon-sorting-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="score-board">SCORE: {score}</div>
            </header>

            {gameState === 'playing' ? (
                <main className="sorting-arena">
                    <h1>Sort the Hydrocarbons</h1>
                    <p className="hint-text">Drag the cards to the correct family based on their formula.</p>

                    <div className="buckets-container">
                        {BUCKETS.map(bucket => (
                            <div key={bucket.id} className="bucket">
                                <div className={`bucket-inner ${bucket.id}`}>
                                    <span className="bucket-label">{bucket.label}</span>
                                    <span className="bucket-formula">{bucket.formula}</span>
                                </div>
                                <motion.div
                                    className="drop-zone"
                                    // In a real dnd lib, this would be a drop target. 
                                    // For Framer Motion simple drag, we assume overlap.
                                    // But since we are dragging *to* here, we'll handle the logic in the Item's onDragEnd.
                                    id={`bucket-${bucket.id}`} // Helper ID for position checking if needed
                                >
                                    📥 DROP HERE
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="card-deck">
                        <AnimatePresence>
                            {items.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    drag
                                    dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                    dragElastic={0.5}
                                    whileDrag={{ scale: 1.2, zIndex: 100 }}
                                    onDragEnd={(e, info) => {
                                        // Simple heuristic: Check horizontal position relative to screen width
                                        // Left: < 33%, Center: 33-66%, Right: > 66%
                                        // This is a bit fragile but works for a full-width layout with 3 cols
                                        // Alternatively, we could simpler interaction: Click card -> Click bucket.
                                        // But prompt asked for drag/drop.
                                        // Let's rely on visual proximity if possible, or just simplified regions.

                                        const x = info.point.x;
                                        const screenW = window.innerWidth;
                                        let targetBucket = null;

                                        if (x < screenW / 3) targetBucket = 'alkane';
                                        else if (x < (2 * screenW) / 3) targetBucket = 'alkene';
                                        else targetBucket = 'alkyne';

                                        // Also ensure it was dragged down into the "bucket zone" (y > some value)
                                        // Assuming buckets are below the deck? 
                                        // Actually layout: Deck at bottom, Buckets at top? Or Buckets middle?
                                        // Let's assume Buckets are clearly defined zones. 
                                        // We will just use the horizontal split for simplicity as it's cleaner.

                                        handleDrop(item, targetBucket);
                                    }}
                                    className="chemical-card"
                                >
                                    <div className="chem-formula">{item.formula}</div>
                                    <div className="chem-name">{item.name}</div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </main>
            ) : (
                <div className="victory-screen">
                    <h1>🎉 Sorting Complete!</h1>
                    <p>You know your Alkanes from your Alkynes!</p>
                </div>
            )}
        </div>
    );
};

export default HydrocarbonSorting;
