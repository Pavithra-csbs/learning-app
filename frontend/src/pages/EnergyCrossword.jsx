import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EnergyCrossword.css';

const GRID_SIZE = 10;

// Simple crossword structure
// WORD: SOLAR (0,0 H), COAL (0,0 V), WIND (2,0 H), NUCLEAR (0,4 H)
const CROSSWORD_DATA = [
    { word: 'SOLAR', clue: 'Energy from the Sun', x: 0, y: 0, direction: 'H' },
    { word: 'COAL', clue: 'Black fossil fuel', x: 0, y: 0, direction: 'V' },
    { word: 'WIND', clue: 'Kinetic energy of air', x: 2, y: 0, direction: 'H' },
    { word: 'NUCLEAR', clue: 'Energy from atoms', x: 4, y: 0, direction: 'H' },
    { word: 'HYDRO', clue: 'Plant using falling water', x: 0, y: 6, direction: 'H' }
];

const EnergyCrossword = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [userGrid, setUserGrid] = useState(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('')));
    const [solvedWords, setSolvedWords] = useState([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const handleInput = (row, col, val) => {
        if (gameState === 'finished') return;
        const newGrid = [...userGrid];
        newGrid[row][col] = val.toUpperCase().charAt(0);
        setUserGrid(newGrid);

        // Check if any word is newly completed
        CROSSWORD_DATA.forEach(wordObj => {
            if (solvedWords.includes(wordObj.word)) return;

            let currentGuess = '';
            for (let i = 0; i < wordObj.word.length; i++) {
                const r = wordObj.direction === 'H' ? wordObj.x : wordObj.x + i;
                const c = wordObj.direction === 'H' ? wordObj.y + i : wordObj.y;
                currentGuess += newGrid[r][c];
            }

            if (currentGuess === wordObj.word) {
                setSolvedWords([...solvedWords, wordObj.word]);
                setScore(s => s + 100);

                if (solvedWords.length + 1 === CROSSWORD_DATA.length) {
                    setGameState('finished');
                    canvasConfetti({ particleCount: 150, spread: 70 });
                }
            }
        });
    };

    const getMotivationalMessage = () => {
        if (score >= 500) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (score >= 300) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    // Helper to see if a cell is part of any word
    const isActiveCell = (r, c) => {
        return CROSSWORD_DATA.some(w => {
            for (let i = 0; i < w.word.length; i++) {
                const wr = w.direction === 'H' ? w.x : w.x + i;
                const wc = w.direction === 'H' ? w.y + i : w.y;
                if (wr === r && wc === c) return true;
            }
            return false;
        });
    };

    return (
        <div className="crossword-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">WORDS: {solvedWords.length} / {CROSSWORD_DATA.length}</div>
                <div className="title">LEVEL 7: ENERGY CROSSWORD</div>
            </header>

            <main className="game-arena">
                <div className="crossword-layout">
                    <div className="grid">
                        {userGrid.map((row, rIdx) => (
                            <div key={rIdx} className="grid-row">
                                {row.map((cell, cIdx) => {
                                    const active = isActiveCell(rIdx, cIdx);
                                    return (
                                        <input
                                            key={cIdx}
                                            className={`cell ${active ? 'active' : 'empty'} ${cell ? 'filled' : ''}`}
                                            maxLength="1"
                                            value={cell}
                                            onChange={(e) => handleInput(rIdx, cIdx, e.target.value)}
                                            disabled={!active || gameState === 'finished'}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>

                    <div className="clues-panel">
                        <h2>Clues</h2>
                        <div className="clues-list">
                            {CROSSWORD_DATA.map((w, i) => (
                                <div key={i} className={`clue-item ${solvedWords.includes(w.word) ? 'solved' : ''}`}>
                                    <span className="clue-num">{i + 1}.</span>
                                    <p>{w.clue} ({w.direction === 'H' ? 'Across' : 'Down'})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {gameState === 'finished' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-overlay"
                        >
                            <div className="victory-card">
                                <div className="stars">
                                    {[...Array(3)].map((_, i) => (
                                        <span key={i} className={i < (score / 200) ? 'gold' : ''}>⭐</span>
                                    ))}
                                </div>
                                <h2>{getMotivationalMessage()}</h2>
                                <h1>Final Score: {score}</h1>
                                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EnergyCrossword;
