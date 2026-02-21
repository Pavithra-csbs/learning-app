import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './EnvironmentCrossword.css';

const CROSSWORD_DATA = {
    grid: [
        ['E', 'C', 'O', 'S', 'Y', 'S', 'T', 'E', 'M', ''],
        ['', '', '', '', '', '', '', '', 'N', ''],
        ['', 'B', 'I', 'O', 'T', 'I', 'C', '', 'V', ''],
        ['', '', '', '', '', '', '', '', 'I', ''],
        ['', 'O', 'Z', 'O', 'N', 'E', '', '', 'R', ''],
        ['', '', '', '', '', '', '', '', 'O', ''],
        ['', 'W', 'A', 'S', 'T', 'E', '', '', 'N', ''],
        ['', '', '', '', '', '', '', '', 'M', ''],
        ['T', 'R', 'O', 'P', 'H', 'I', 'C', '', 'E', ''],
        ['', '', '', '', '', '', '', '', 'N', ''],
        ['', '', '', '', 'T', '', '', '', 'T', ''],
    ],
    words: [
        { word: 'ECOSYSTEM', direction: 'horizontal', row: 0, col: 0, clue: 'Self-sustaining functional unit of biosphere.' },
        { word: 'BIOTIC', direction: 'horizontal', row: 2, col: 1, clue: 'Living components of an ecosystem.' },
        { word: 'OZONE', direction: 'horizontal', row: 4, col: 1, clue: 'O3 molecule that protects us from UV rays.' },
        { word: 'WASTE', direction: 'horizontal', row: 6, col: 1, clue: 'Unwanted materials from human activities.' },
        { word: 'TROPHIC', direction: 'horizontal', row: 8, col: 0, clue: 'A step or level in a food chain.' },
        { word: 'ENVIRONMENT', direction: 'vertical', row: 0, col: 8, clue: 'Everything that surrounds an organism.' }
    ]
};

const EnvironmentCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [userGrid, setUserGrid] = useState(
        Array(11).fill(null).map((_, r) =>
            Array(10).fill(null).map((_, c) =>
                CROSSWORD_DATA.grid[r][c] === '' ? null : ''
            )
        )
    );
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handleInput = (r, c, val) => {
        if (val.length > 1) return;
        const newGrid = [...userGrid];
        newGrid[r][c] = val.toUpperCase();
        setUserGrid(newGrid);
    };

    const checkSolution = () => {
        let allCorrect = true;
        for (let r = 0; r < 11; r++) {
            for (let c = 0; c < 10; c++) {
                const target = CROSSWORD_DATA.grid[r][c];
                if (target !== '' && userGrid[r][c] !== target) {
                    allCorrect = false;
                    break;
                }
            }
        }

        if (allCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("Crossword Solved! Excellent vocabulary! 📚✨");
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error("Some letters are missing or incorrect. Keep trying!");
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 8) localStorage.setItem('completed_levels_Our Environment', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        return (
            <div className="ec-finish-screen">
                <motion.div className="ec-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Crossword Champion! 🔡</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="motivational-text">Hurray 🎉 You are an Eco Hero! Your environmental science vocabulary is top-notch.</p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Boss: Eco Hero →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="ec-container">
            <header className="ec-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>🔡 Environment Crossword</h1>
                <button className="check-btn" onClick={checkSolution}>Check Grid ✅</button>
            </header>

            <main className="ec-main">
                <div className="ec-grid-view">
                    {userGrid.map((row, r) => (
                        <div key={r} className="ec-row">
                            {row.map((cell, c) => (
                                <div key={c} className={`ec-cell ${cell === null ? 'blocked' : ''}`}>
                                    {cell !== null && (
                                        <input
                                            type="text"
                                            maxLength="1"
                                            value={cell}
                                            onChange={(e) => handleInput(r, c, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="ec-clues-view">
                    <h3>Environment Clues</h3>
                    <div className="clues-container">
                        <div className="clue-section">
                            <h4>Across ➡️</h4>
                            {CROSSWORD_DATA.words.filter(w => w.direction === 'horizontal').map((w, i) => (
                                <p key={i}><strong>{w.row + 1},{w.col + 1}:</strong> {w.clue}</p>
                            ))}
                        </div>
                        <div className="clue-section">
                            <h4>Down ⬇️</h4>
                            {CROSSWORD_DATA.words.filter(w => w.direction === 'vertical').map((w, i) => (
                                <p key={i}><strong>{w.row + 1},{w.col + 1}:</strong> {w.clue}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EnvironmentCrossword;
