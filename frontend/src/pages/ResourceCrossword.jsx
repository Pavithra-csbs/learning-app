import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ResourceCrossword.css';

const GRID = [
    ['S', 'U', 'S', 'T', 'A', 'I', 'N', 'A', 'B', 'L', 'E'], // Row 0: SUSTAINABLE (Across)
    ['', '', '', 'A', '', '', '', '', '', '', ''],
    ['R', 'E', 'N', 'E', 'W', 'A', 'B', 'L', 'E', '', ''], // Row 2: RENEWABLE (Across)
    ['', '', '', '', '', '', 'I', '', '', '', 'R'],
    ['', '', '', 'D', '', '', 'O', '', '', '', 'E'],
    ['', 'C', 'O', 'A', 'L', '', 'D', '', '', '', 'C'], // Row 5: COAL (Across), AM (part of DAM), O (part of Biodiversity)
    ['', '', '', 'M', '', '', 'I', '', '', '', 'Y'],
    ['', '', '', '', '', 'F', 'V', '', '', '', 'C'],
    ['', '', '', '', '', 'O', 'E', '', '', '', 'L'],
    ['', '', '', '', '', 'R', 'R', '', '', '', 'E'],
    ['', '', '', '', '', 'E', 'S', '', '', '', ''],
    ['', '', '', '', '', 'S', 'I', '', '', '', ''],
    ['', '', '', '', '', 'T', 'T', '', '', '', ''],
    ['', '', '', '', '', '', 'Y', '', '', '', ''],
];
// Wait, the grid above is a bit messy. Let's design a cleaner one.

/*
Across:
0: SUSTAINABLE (Row 0, Col 0-10)
2: RENEWABLE (Row 2, Col 0-8)
5: COAL (Row 5, Col 1-4)

Down:
3: DAM (Row 3-5, Col 3) -> Wait, COAL is Row 5. So Row 3,4,5 for DAM.
5: BIODIVERSITY (Row 3-13, Col 6) -> Part of Forest?
7: FOREST (Row 5-10, Col 5) -> FOREST
10: RECYCLE (Row 3-9, Col 10)
*/

const WORDS = [
    { word: 'SUSTAINABLE', clue: 'Development that preserves resources for future generations.', direction: 'across', row: 0, col: 0 },
    { word: 'RENEWABLE', clue: 'Resources that replenish naturally over time (e.g., Solar).', direction: 'across', row: 2, col: 0 },
    { word: 'COAL', clue: 'A black fossil fuel formed from buried plants.', direction: 'across', row: 5, col: 1 },
    { word: 'DAM', clue: 'Large structure to store river water for irrigation.', direction: 'down', row: 3, col: 3 },
    { word: 'FOREST', clue: 'A large area covered with trees; a biodiversity hotspot.', direction: 'down', row: 5, col: 5 },
    { word: 'RECYCLE', clue: 'Processing waste to create new products.', direction: 'down', row: 3, col: 10 }
];

const ResourceCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [userGrid, setUserGrid] = useState(Array(14).fill(0).map(() => Array(11).fill('')));
    const [gameState, setGameState] = useState('playing');

    const handleInput = (r, c, val) => {
        if (val.length > 1) return;
        const newGrid = [...userGrid];
        newGrid[r][c] = val.toUpperCase();
        setUserGrid(newGrid);
    };

    const checkSolution = () => {
        let allCorrect = true;
        WORDS.forEach(w => {
            for (let i = 0; i < w.word.length; i++) {
                const r = w.direction === 'across' ? w.row : w.row + i;
                const c = w.direction === 'across' ? w.col + i : w.col;
                if (userGrid[r][c] !== w.word[i]) allCorrect = false;
            }
        });

        if (allCorrect) {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("Crossword Solved! 🔡");
        } else {
            toast.error("Some letters are incorrect. Keep trying! ❌");
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 8) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        return (
            <div className="cr-finish-screen">
                <motion.div className="cr-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Crossword Solved! 🔡</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="motivational-text">Excellent 🎉 You are a Smart Resource Manager!</p>
                    <button className="finish-btn" onClick={handleComplete}>Final Boss Challenge →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="resource-crossword-container">
            <header className="cr-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>🔡 Resource Crossword</h1>
            </header>

            <main className="cr-main">
                <div className="cr-layout">
                    <div className="grid-container">
                        {userGrid.map((row, rIdx) => (
                            <div key={rIdx} className="grid-row">
                                {row.map((cell, cIdx) => {
                                    const isEditable = WORDS.some(w => {
                                        if (w.direction === 'across') {
                                            return rIdx === w.row && cIdx >= w.col && cIdx < w.col + w.word.length;
                                        } else {
                                            return cIdx === w.col && rIdx >= w.row && rIdx < w.row + w.word.length;
                                        }
                                    });

                                    const clueNum = WORDS.find(w => w.row === rIdx && w.col === cIdx);

                                    return (
                                        <div key={cIdx} className={`grid-cell ${isEditable ? 'editable' : 'empty'}`}>
                                            {clueNum && <span className="clue-number">{WORDS.indexOf(clueNum) + 1}</span>}
                                            {isEditable && (
                                                <input
                                                    type="text"
                                                    maxLength="1"
                                                    value={cell}
                                                    onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="clues-container">
                        <h3>Clues</h3>
                        <div className="clue-list">
                            {WORDS.map((w, i) => (
                                <div key={i} className="clue-item">
                                    <strong>{i + 1}. ({w.direction})</strong> {w.clue}
                                </div>
                            ))}
                        </div>
                        <button className="check-btn" onClick={checkSolution}>Check Answers ✔️</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResourceCrossword;
