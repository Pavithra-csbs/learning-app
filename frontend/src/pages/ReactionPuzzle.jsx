import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReactionPuzzle.css';

const PUZZLES = [
    {
        id: 1,
        title: "Photosynthesis Reaction",
        pieces: [
            { id: '6co2', content: "6CO₂", type: 'reactant' },
            { id: '6h2o', content: "6H₂O", type: 'reactant' },
            { id: 'light', content: "Chlorophyll/Sunlight", type: 'agent' },
            { id: 'c6h12o6', content: "C₆H₁₂O₆", type: 'product' },
            { id: '6o2', content: "6O₂", type: 'product' }
        ],
        slots: ['reactant', 'reactant', 'agent', 'product', 'product'],
        targetOrder: ['6co2', '6h2o', 'light', 'c6h12o6', '6o2'], // simplified order check
        hint: "Plants use CO₂ and H₂O with sunlight."
    },
    {
        id: 2,
        title: "Electrolysis of Water",
        pieces: [
            { id: '2h2o', content: "2H₂O", type: 'reactant' },
            { id: 'elec', content: "Electricity", type: 'agent' },
            { id: '2h2', content: "2H₂", type: 'product' },
            { id: 'o2', content: "O₂", type: 'product' }
        ],
        slots: ['reactant', 'agent', 'product', 'product'],
        targetOrder: ['2h2o', 'elec', '2h2', 'o2'],
        hint: "Breaking water down using electricity."
    }
];

const ReactionPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [assembled, setAssembled] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [score, setScore] = useState(0);

    const activePuzzle = PUZZLES[currentIdx];
    const availablePieces = activePuzzle.pieces.filter(p => !assembled.some(a => a.id === p.id));

    const handlePieceClick = (piece) => {
        if (assembled.length < activePuzzle.slots.length) {
            setAssembled([...assembled, piece]);
        }
    };

    const removePiece = (index) => {
        setAssembled(assembled.filter((_, i) => i !== index));
    };

    const checkPuzzle = () => {
        const assembledOrder = assembled.map(a => a.id);
        const isCorrect = JSON.stringify(assembledOrder) === JSON.stringify(activePuzzle.targetOrder);

        if (isCorrect) {
            setScore(prev => prev + 100);
            if (currentIdx < PUZZLES.length - 1) {
                toast.success("Puzzle Solved! Great job 🧩");
                setTimeout(() => {
                    setCurrentIdx(currentIdx + 1);
                    setAssembled([]);
                }, 1500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '4');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Incorrect order. Think about the arrows and reactants!");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 200) return "Hurray 🎉 Woohoo! You are a Chemistry Champion!";
        if (score >= 100) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="puzzle-game-container">
            <Toaster position="top-center" />
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 4: REACTION PUZZLE</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="puzzle-view"
                        >
                            <h1>{activePuzzle.title}</h1>
                            <p className="hint">Tip: {activePuzzle.hint}</p>

                            <div className="assembly-board">
                                {activePuzzle.slots.map((slot, i) => (
                                    <div key={i} className={`slot ${slot}`}>
                                        {assembled[i] ? (
                                            <motion.div
                                                layoutId={assembled[i].id}
                                                onClick={() => removePiece(i)}
                                                className="piece placed"
                                            >
                                                {assembled[i].content}
                                            </motion.div>
                                        ) : (
                                            <span className="slot-label">{slot.toUpperCase()}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pieces-pool">
                                {availablePieces.map(piece => (
                                    <motion.div
                                        key={piece.id}
                                        layoutId={piece.id}
                                        onClick={() => handlePieceClick(piece)}
                                        whileHover={{ scale: 1.1 }}
                                        className={`piece pool-piece ${piece.type}`}
                                    >
                                        {piece.content}
                                    </motion.div>
                                ))}
                            </div>

                            <button onClick={checkPuzzle} className="check-btn" disabled={assembled.length < activePuzzle.slots.length}>
                                CHECK ASSEMBLY 🔬
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 100) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ReactionPuzzle;
