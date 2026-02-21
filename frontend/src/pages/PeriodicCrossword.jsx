import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PeriodicCrossword.css';

// Simple 5-word crossword
const WORDS = [
    { word: 'SODIUM', clue: 'Symbol Na, in Group 1, Period 3', dir: 'across', row: 0, col: 0 },
    { word: 'NEON', clue: 'Noble gas, atomic number 10', dir: 'down', row: 0, col: 2 },
    { word: 'OXYGEN', clue: 'Essential for breathing, symbol O', dir: 'across', row: 2, col: 0 },
    { word: 'GOLD', clue: 'Symbol Au, doesn\'t tarnish', dir: 'down', row: 2, col: 3 },
    { word: 'IODINE', clue: 'Halogen used in medicine, symbol I', dir: 'across', row: 4, col: 0 },
];

// Build grid (9 cols × 6 rows)
const COLS = 10;
const ROWS = 7;

const buildGrid = () => {
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    WORDS.forEach(w => {
        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'across' ? w.row : w.row + i;
            const c = w.dir === 'across' ? w.col + i : w.col;
            if (!grid[r]) grid[r] = Array(COLS).fill(null);
            grid[r][c] = { letter: w.word[i], wordIdx: WORDS.indexOf(w) };
        }
    });
    return grid;
};

const GRID = buildGrid();

const PeriodicCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState(() => {
        const map = {};
        GRID.forEach((row, r) => row.forEach((cell, c) => { if (cell) map[`${r},${c}`] = ''; }));
        return map;
    });
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleInput = (r, c, val) => {
        setInputs(prev => ({ ...prev, [`${r},${c}`]: val.toUpperCase().slice(0, 1) }));
    };

    const handleCheck = () => {
        let correct = 0;
        let total = 0;
        GRID.forEach((row, r) => row.forEach((cell, c) => {
            if (cell) {
                total++;
                if (inputs[`${r},${c}`] === cell.letter) correct++;
            }
        }));
        setChecked(true);
        const pts = Math.round((correct / total) * 50);
        setScore(pts);
        if (correct === total) {
            canvasConfetti({ particleCount: 200, spread: 100 });
            toast.success('Perfect Crossword! 🎉');
        } else {
            toast(`${correct}/${total} letters correct! 💡`, { icon: '📝' });
        }
        setTimeout(() => setGameState('done'), 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (cur < 6) localStorage.setItem('completed_levels_Periodic Classification of Elements', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / 50;
        if (pct >= 0.9) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="cw-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div>🧩</div>
                <h2>Crossword Done!</h2>
                <div className="final-score">{score} / 50 pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.floor(score / 17) + 1)))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="cw-container">
            <header className="cw-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>🧩 Periodic Crossword</h1>
            </header>
            <div className="cw-body">
                <div className="cw-grid">
                    {GRID.map((row, r) => (
                        <div key={r} className="cw-row">
                            {row.map((cell, c) => {
                                if (!cell) return <div key={c} className="cw-blank" />;
                                const key = `${r},${c}`;
                                const isCorrect = checked && inputs[key] === cell.letter;
                                const isWrong = checked && inputs[key] !== cell.letter;
                                return (
                                    <input
                                        key={c}
                                        className={`cw-cell ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                        maxLength={1}
                                        value={inputs[key] || ''}
                                        onChange={e => handleInput(r, c, e.target.value)}
                                        disabled={checked}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="clues-panel">
                    <h3>📋 Clues</h3>
                    <div className="clues-list">
                        <div className="clue-group">
                            <h4>Across</h4>
                            {WORDS.filter(w => w.dir === 'across').map((w, i) => (
                                <div key={i} className="clue-item"><strong>{i + 1}.</strong> {w.clue}</div>
                            ))}
                        </div>
                        <div className="clue-group">
                            <h4>Down</h4>
                            {WORDS.filter(w => w.dir === 'down').map((w, i) => (
                                <div key={i} className="clue-item"><strong>{i + 1}.</strong> {w.clue}</div>
                            ))}
                        </div>
                    </div>
                    <button className="check-btn" onClick={handleCheck}>Check Answers ✅</button>
                </div>
            </div>
        </div>
    );
};

export default PeriodicCrossword;
