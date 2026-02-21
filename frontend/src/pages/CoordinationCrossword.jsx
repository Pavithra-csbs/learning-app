import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './CoordinationCrossword.css';

const GRID_SIZE = 10;
const WORDS = [
    { word: 'NEURON', hint: 'Basic unit of nervous system', row: 1, col: 1, dir: 'across' },
    { word: 'BRAIN', hint: 'Main coordination center of body', row: 1, col: 1, dir: 'down' },
    { word: 'HORMONE', hint: 'Chemical messenger carrying signals', row: 5, col: 1, dir: 'across' },
    { word: 'REFLEX', hint: 'Sudden involuntary response', row: 3, col: 4, dir: 'down' },
    { word: 'INSULIN', hint: 'Hormone that regulates blood sugar', row: 8, col: 2, dir: 'across' },
    { word: 'THYROID', hint: 'Gland that secretes thyroxine', row: 2, col: 8, dir: 'down' }
];

const CoordinationCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [grid, setGrid] = useState([]);
    const [inputs, setInputs] = useState({});
    const [completed, setCompleted] = useState(new Set());
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(null));
        WORDS.forEach((w, wordIdx) => {
            for (let i = 0; i < w.word.length; i++) {
                const r = w.dir === 'across' ? w.row : w.row + i;
                const c = w.dir === 'across' ? w.col + i : w.col;
                if (!newGrid[r][c]) newGrid[r][c] = { char: w.word[i], numbers: [] };
                if (i === 0) newGrid[r][c].numbers.push(wordIdx + 1);
            }
        });
        setGrid(newGrid);
    }, []);

    const handleInput = (r, c, val) => {
        const char = val.slice(-1).toUpperCase();
        const newInputs = { ...inputs, [`${r}-${c}`]: char };
        setInputs(newInputs);

        // Check words
        WORDS.forEach((w, idx) => {
            if (completed.has(idx)) return;
            let isWordDone = true;
            for (let i = 0; i < w.word.length; i++) {
                const row = w.dir === 'across' ? w.row : w.row + i;
                const col = w.dir === 'across' ? w.col + i : w.col;
                if (newInputs[`${row}-${col}`] !== w.word[i]) {
                    isWordDone = false;
                    break;
                }
            }
            if (isWordDone) {
                const nextCompleted = new Set(completed);
                nextCompleted.add(idx);
                setCompleted(nextCompleted);
                toast.success(`Found: ${w.word}! ✨`);
                if (nextCompleted.size === WORDS.length) {
                    canvasConfetti({ particleCount: 150, spread: 70 });
                    setTimeout(() => setGameState('done'), 1500);
                }
            }
        });
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '7');
        if (cur < 8) localStorage.setItem('completed_levels_Control and Coordination', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        return (
            <div className="ccw-container done">
                <motion.div className="ccw-result-card" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h2>Crossword Solved! 🧩</h2>
                    <div className="ccw-stars">⭐⭐⭐</div>
                    <p className="ccw-motto">Hurray 🎉 You are a Brain Power Champion!</p>
                    <button className="ccw-btn" onClick={handleComplete}>Face the Boss Level! →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="ccw-container">
            <header className="ccw-header">
                <button className="ccw-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>🧩 Coordination Crossword</h1>
                <div className="ccw-score">{completed.size} / {WORDS.length} Words</div>
            </header>

            <div className="ccw-layout">
                <div className="ccw-grid-area">
                    <div className="crossword-grid">
                        {grid.map((row, rIdx) => (
                            <div key={rIdx} className="crossword-row">
                                {row.map((cell, cIdx) => (
                                    <div key={cIdx} className={`crossword-cell ${cell ? 'active' : 'empty'}`}>
                                        {cell && (
                                            <>
                                                {cell.numbers.length > 0 && <span className="cell-num">{cell.numbers.join(',')}</span>}
                                                <input
                                                    type="text"
                                                    maxLength="1"
                                                    value={inputs[`${rIdx}-${cIdx}`] || ''}
                                                    onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ccw-clues">
                    <h3>💡 Clues</h3>
                    <div className="clue-section">
                        <h4>Across</h4>
                        {WORDS.filter(w => w.dir === 'across').map((w, idx) => (
                            <p key={idx} className={completed.has(WORDS.indexOf(w)) ? 'complete' : ''}>
                                <strong>{WORDS.indexOf(w) + 1}.</strong> {w.hint}
                            </p>
                        ))}
                    </div>
                    <div className="clue-section">
                        <h4>Down</h4>
                        {WORDS.filter(w => w.dir === 'down').map((w, idx) => (
                            <p key={idx} className={completed.has(WORDS.indexOf(w)) ? 'complete' : ''}>
                                <strong>{WORDS.indexOf(w) + 1}.</strong> {w.hint}
                            </p>
                        ))}
                    </div>
                    <button className="ccw-hint-btn" onClick={() => toast('Hint: Check thyroxine gland name!')}>Need a Hint? 💡</button>
                </div>
            </div>
        </div>
    );
};

export default CoordinationCrossword;
