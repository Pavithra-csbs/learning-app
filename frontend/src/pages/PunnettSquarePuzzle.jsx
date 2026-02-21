import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PunnettSquarePuzzle.css';

const MISSIONS = [
    {
        id: 1,
        title: 'Tall vs Short Pea Plants',
        parent1: 'Tt',
        parent2: 'Tt',
        logic: (p1, p2) => (p1 + p2).split('').sort().join(''),
        targetGrid: ['TT', 'Tt', 'Tt', 'tt'],
        description: 'Cross two heterozygous tall plants (Tt).'
    },
    {
        id: 2,
        title: 'Pure Tall vs Pure Short',
        parent1: 'TT',
        parent2: 'tt',
        targetGrid: ['Tt', 'Tt', 'Tt', 'Tt'],
        description: 'Cross homozygous tall (TT) and homozygous short (tt).'
    }
];

const PunnettSquarePuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [missionIdx, setMissionIdx] = useState(0);
    const [grid, setGrid] = useState([null, null, null, null]);
    const [selectedAllele, setSelectedAllele] = useState(null);
    const [gameState, setGameState] = useState('playing');

    const mission = MISSIONS[missionIdx];
    const p1 = mission.parent1.split('');
    const p2 = mission.parent2.split('');

    const handleAlleleClick = (allele) => {
        setSelectedAllele(allele);
    };

    const handleCellClick = (idx) => {
        if (!selectedAllele) return;

        const newGrid = [...grid];
        newGrid[idx] = selectedAllele;
        setGrid(newGrid);
        setSelectedAllele(null);
    };

    const checkSolution = () => {
        const isComplete = grid.every(cell => cell !== null);
        if (!isComplete) {
            toast.error('Fill all cells first!');
            return;
        }

        const isCorrect = grid.every((cell, idx) => cell === mission.targetGrid[idx]);

        if (isCorrect) {
            toast.success('Correct genotypes! 🎉');
            if (missionIdx < MISSIONS.length - 1) {
                setTimeout(() => {
                    setMissionIdx(m => m + 1);
                    setGrid([null, null, null, null]);
                }, 1500);
            } else {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('finished'), 1500);
            }
        } else {
            toast.error('Incorrect. Think about which alleles combine in that cell!');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '2');
        if (curLevel < 3) localStorage.setItem('completed_levels_Heredity and Evolution', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        return (
            <div className="psp-finish-screen">
                <motion.div className="psp-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Punnett Mastered! 🧩</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Logic Accuracy: 100%</p>
                    <p className="motivational-text">Hurray 🎉 You are a Genetics Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Dominant Traits Quiz →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="punnett-puzzle-container">
            <header className="psp-header">
                <button className="psp-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>🧩 Punnett Square Puzzle</h1>
                <div className="psp-mission-info">Mission {missionIdx + 1} / {MISSIONS.length}</div>
            </header>

            <main className="psp-game-area">
                <div className="psp-instructions">
                    <h2>{mission.title}</h2>
                    <p>{mission.description}</p>
                </div>

                <div className="punnett-grid-container">
                    <div className="parent-vertical">
                        <span>{p1[0]}</span>
                        <span>{p1[1]}</span>
                    </div>
                    <div className="grid-main-wrapper">
                        <div className="parent-horizontal">
                            <span>{p2[0]}</span>
                            <span>{p2[1]}</span>
                        </div>
                        <div className="punnett-grid">
                            {grid.map((cell, idx) => (
                                <motion.div
                                    key={idx}
                                    className={`psp-cell ${cell ? 'filled' : ''}`}
                                    onClick={() => handleCellClick(idx)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {cell || '?'}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="psp-allele-bank">
                    <h3>Select Alleles Combination</h3>
                    <div className="allele-btns">
                        {Array.from(new Set(mission.targetGrid)).map(allele => (
                            <button
                                key={allele}
                                className={`allele-btn ${selectedAllele === allele ? 'active' : ''}`}
                                onClick={() => handleAlleleClick(allele)}
                            >
                                {allele}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="psp-check-btn" onClick={checkSolution}>Check Grid ✅</button>
            </main>
        </div>
    );
};

export default PunnettSquarePuzzle;
