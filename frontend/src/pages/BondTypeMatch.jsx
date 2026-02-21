import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './BondTypeMatch.css';

const BONDS = [
    { type: 'single', name: 'Single Bond', symbol: '—', desc: '1 Pair Shared' },
    { type: 'double', name: 'Double Bond', symbol: '=', desc: '2 Pairs Shared' },
    { type: 'triple', name: 'Triple Bond', symbol: '≡', desc: '3 Pairs Shared' }
];

const MOLECULES = [
    { id: 1, name: 'Ethane (C₂H₆)', formula: 'H₃C — CH₃', bondType: 'single' },
    { id: 2, name: 'Ethene (C₂H₄)', formula: 'H₂C = CH₂', bondType: 'double' },
    { id: 3, name: 'Ethyne (C₂H₂)', formula: 'HC ≡ CH', bondType: 'triple' },
    { id: 4, name: 'Methane (CH₄)', formula: 'C — H', bondType: 'single' },
    { id: 5, name: 'Oxygen (O₂)', formula: 'O = O', bondType: 'double' },
    { id: 6, name: 'Nitrogen (N₂)', formula: 'N ≡ N', bondType: 'triple' }
];

const BondTypeMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const currentMolecule = MOLECULES[currentIdx];

    const handleMatch = (selectedType) => {
        if (selectedType === currentMolecule.bondType) {
            toast.success("Correct Bond! 🔗✅");
            setScore(score + 10);

            if (currentIdx < MOLECULES.length - 1) {
                setTimeout(() => setCurrentIdx(currentIdx + 1), 500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Carbon and its Compounds', '3');
                canvasConfetti({ particleCount: 150, spread: 70 });
                toast.success("Bonding Expert! 🏆");
            }
        } else {
            toast.error("Oops! Wrong bond type. Try again.");
        }
    };

    return (
        <div className="bond-match-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="score-board">SCORE: {score}</div>
            </header>

            <AnimatePresence mode="wait">
                {gameState === 'playing' ? (
                    <motion.main
                        key="game"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="match-arena"
                    >
                        <div className="molecule-display">
                            <h2>Identify the Bond Type</h2>
                            <motion.div
                                className="molecule-card"
                                key={currentMolecule.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                            >
                                <div className="formula-display">{currentMolecule.formula}</div>
                                <div className="molecule-name">{currentMolecule.name}</div>
                            </motion.div>
                        </div>

                        <div className="bond-options">
                            {BONDS.map((bond) => (
                                <motion.button
                                    key={bond.type}
                                    className={`bond-btn ${bond.type}`}
                                    onClick={() => handleMatch(bond.type)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="bond-symbol">{bond.symbol}</div>
                                    <div className="bond-name">{bond.name}</div>
                                    <div className="bond-desc">{bond.desc}</div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.main>
                ) : (
                    <motion.div
                        className="victory-screen"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h1>🎉 Completed!</h1>
                        <p>You've mastered Chemical Bonds!</p>
                        <div className="final-score">Final Score: {score}</div>
                        <button
                            className="next-level-btn"
                            onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`)}
                        >
                            Back to Levels
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BondTypeMatch;
