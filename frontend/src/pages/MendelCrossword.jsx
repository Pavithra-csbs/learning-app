import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MendelCrossword.css';

const CROSSWORD_DATA = [
    { id: 1, word: 'ALLELE', hint: 'Alternative forms of a gene (6 letters)', row: 0, col: 0, direction: 'across' },
    { id: 2, word: 'GENE', hint: 'Unit of heredity (4 letters)', row: 0, col: 0, direction: 'down' },
    { id: 3, word: 'TRAIT', hint: 'Observable characteristic like height (5 letters)', row: 2, col: 0, direction: 'across' },
    { id: 4, word: 'DOMINANT', hint: 'Trait that expresses itself in Tt (8 letters)', row: 0, col: 5, direction: 'down' },
    { id: 5, word: 'RECESSIVE', hint: 'Trait that remains hidden in Tt (9 letters)', row: 4, col: 0, direction: 'across' }
];

const GRID_SIZE = 10;

const MendelCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [grid, setGrid] = useState(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill({ char: '', active: false, id: null })));
    const [userInput, setUserInput] = useState({});
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill({ char: '', active: false, id: null }));
        CROSSWORD_DATA.forEach(item => {
            const { word, row, col, direction, id } = item;
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'across' ? row : row + i;
                const c = direction === 'across' ? col + i : col;
                newGrid[r][c] = { char: word[i], active: true, id: i === 0 ? id : null };
            }
        });
        setGrid(newGrid);
    }, []);

    const handleInputChange = (r, c, val) => {
        if (val.length > 1) return;
        const key = `${r}-${c}`;
        setUserInput(prev => ({ ...prev, [key]: val.toUpperCase() }));
    };

    const checkCrossword = () => {
        let correctCount = 0;
        let totalActive = 0;

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c].active) {
                    totalActive++;
                    if (userInput[`${r}-${c}`] === grid[r][c].char) {
                        correctCount++;
                    }
                }
            }
        }

        if (correctCount === totalActive) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success('Crossword Solved! 🔡');
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error(`You have ${totalActive - correctCount} incorrect or empty letters!`);
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '7');
        if (curLevel < 8) localStorage.setItem('completed_levels_Heredity and Evolution', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        return (
            <div className="mc-finish-screen">
                <motion.div className="mc-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Vocabulary Master! 🔡</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Genetics Terminologies: 100%</p>
                    <p className="motivational-text">Hurray 🎉 You are a Genetics Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Final Boss Battle →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="crossword-container">
            <header className="mc-header">
                <button className="mc-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>🔡 Mendel's Crossword</h1>
            </header>

            <main className="mc-game-area">
                <div className="mc-grid-view">
                    {grid.map((row, r) => (
                        <div key={r} className="mc-row">
                            {row.map((cell, c) => (
                                <div key={c} className={`mc-cell ${cell.active ? 'active' : 'empty'}`}>
                                    {cell.id && <span className="cell-num">{cell.id}</span>}
                                    {cell.active ? (
                                        <input
                                            type="text"
                                            maxLength="1"
                                            value={userInput[`${r}-${c}`] || ''}
                                            onChange={(e) => handleInputChange(r, c, e.target.value)}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mc-hints-view">
                    <h3>💡 Genetics Clues</h3>
                    <div className="hints-list">
                        {CROSSWORD_DATA.map(item => (
                            <div key={item.id} className="hint-item">
                                <strong>{item.id}.</strong> {item.hint}
                            </div>
                        ))}
                    </div>
                    <button className="mc-check-btn" onClick={checkCrossword}>Check Answers ✅</button>
                </div>
            </main>
        </div>
    );
};

export default MendelCrossword;
