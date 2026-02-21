import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './LifeProcessCrossword.css';

// 6-word crossword grid (10 cols × 8 rows)
const WORDS = [
    { word: 'STOMACH', clue: 'Organ producing HCl for protein digestion', dir: 'across', row: 0, col: 0 },
    { word: 'KIDNEY', clue: 'Primary excretory organ; contains nephrons', dir: 'down', row: 0, col: 3 },
    { word: 'BLOOD', clue: 'Fluid transported by the circulatory system', dir: 'across', row: 2, col: 0 },
    { word: 'LUNGS', clue: 'Respiratory organs containing alveoli', dir: 'down', row: 2, col: 4 },
    { word: 'HEART', clue: 'Pumps blood through double circulation', dir: 'across', row: 4, col: 0 },
    { word: 'UREA', clue: 'Nitrogenous waste excreted by kidneys', dir: 'across', row: 6, col: 0 },
];

const COLS = 12;
const ROWS = 9;

const buildGrid = () => {
    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    WORDS.forEach(w => {
        for (let i = 0; i < w.word.length; i++) {
            const r = w.dir === 'across' ? w.row : w.row + i;
            const c = w.dir === 'across' ? w.col + i : w.col;
            if (r < ROWS && c < COLS) grid[r][c] = { letter: w.word[i] };
        }
    });
    return grid;
};

const GRID = buildGrid();

const LifeProcessCrossword = () => {
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

    const totalCells = Object.keys(inputs).length;

    const handleCheck = () => {
        let correct = 0;
        GRID.forEach((row, r) => row.forEach((cell, c) => {
            if (cell && inputs[`${r},${c}`] === cell.letter) correct++;
        }));
        setChecked(true);
        const pts = Math.round((correct / totalCells) * 60);
        setScore(pts);
        if (correct === totalCells) {
            canvasConfetti({ particleCount: 200, spread: 100 });
            toast.success('Perfect Crossword! 🎉');
        } else {
            toast(`${correct}/${totalCells} correct! 💡`, { icon: '📝' });
        }
        setTimeout(() => setGameState('done'), 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 8) localStorage.setItem('completed_levels_Life Processes', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / 60;
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    if (gameState === 'done') return (
        <div className="lpc-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>🧩</div>
                <h2>Crossword Complete!</h2>
                <div className="final-score">{score} / 60 pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / 60 * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="lpc-container">
            <header className="lpc-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>📝 Life Process Crossword</h1>
            </header>
            <div className="lpc-body">
                <div className="lpc-grid">
                    {GRID.map((row, r) => (
                        <div key={r} className="lpc-row">
                            {row.map((cell, c) => {
                                if (!cell) return <div key={c} className="lpc-blank" />;
                                const key = `${r},${c}`;
                                const isCorrect = checked && inputs[key] === cell.letter;
                                const isWrong = checked && inputs[key] !== cell.letter;
                                return (
                                    <input key={c} className={`lpc-cell ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                        maxLength={1} value={inputs[key] || ''}
                                        onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value.toUpperCase().slice(0, 1) }))}
                                        disabled={checked} />
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="lpc-clues">
                    <h3>📋 Clues</h3>
                    <div className="clues-section">
                        <h4>Across</h4>
                        {WORDS.filter(w => w.dir === 'across').map((w, i) => (
                            <div key={i} className="clue-row"><strong>{i + 1}.</strong> {w.clue}</div>
                        ))}
                    </div>
                    <div className="clues-section">
                        <h4>Down</h4>
                        {WORDS.filter(w => w.dir === 'down').map((w, i) => (
                            <div key={i} className="clue-row"><strong>{i + 1}.</strong> {w.clue}</div>
                        ))}
                    </div>
                    <button className="check-btn" onClick={handleCheck}>Check ✅</button>
                </div>
            </div>
        </div>
    );
};

export default LifeProcessCrossword;
