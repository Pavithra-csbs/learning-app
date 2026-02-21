import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PeriodicDrag.css';

const ELEMENTS = [
    { symbol: "Na", name: "Sodium", pos: 0, type: "metal" },
    { symbol: "Mg", name: "Magnesium", pos: 1, type: "metal" },
    { symbol: "Al", name: "Aluminium", pos: 2, type: "metal" },
    { symbol: "Si", name: "Silicon", pos: 3, type: "non-metal" },
    { symbol: "P", name: "Phosphorus", pos: 4, type: "non-metal" },
    { symbol: "S", name: "Sulfur", pos: 5, type: "non-metal" },
    { symbol: "Cl", name: "Chlorine", pos: 6, type: "non-metal" },
    { symbol: "Ar", name: "Argon", pos: 7, type: "non-metal" }
];

const PeriodicDrag = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [grid, setGrid] = useState(Array(8).fill(null));
    const [draggedEl, setDraggedEl] = useState(null);
    const [score, setScore] = useState(0);

    const pool = ELEMENTS.sort(() => Math.random() - 0.5);

    const handleDrop = (pos) => {
        if (!draggedEl) return;

        if (draggedEl.pos === pos) {
            const newGrid = [...grid];
            newGrid[pos] = draggedEl;
            setGrid(newGrid);
            setScore(prev => prev + 12.5);
            toast.success(`${draggedEl.name} placed!`);
            setDraggedEl(null);

            if (newGrid.every(el => el !== null)) {
                localStorage.setItem('completed_levels_Metals and Non-metals', '7');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Wrong position! Check the atomic number.");
            setDraggedEl(null);
        }
    };

    return (
        <div className="periodic-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">ACCURACY: {Math.round(score)}%</div>
                <div className="title">LEVEL 6: PERIODIC TABLE DRAG</div>
            </header>

            <main className="game-arena">
                <div className="grid-instructions">Arrange the 3rd Period Elements (Na to Ar)</div>

                <div className="periodic-grid">
                    {grid.map((el, i) => (
                        <div
                            key={i}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(i)}
                            className={`grid-cell ${el ? 'filled' : 'empty'}`}
                        >
                            {el ? (
                                <div className={`el-card ${el.type}`}>
                                    <span className="symbol">{el.symbol}</span>
                                    <span className="num">{11 + i}</span>
                                </div>
                            ) : (
                                <span className="placeholder">{11 + i}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="elements-pool">
                    {pool.map((el) => {
                        const isPlaced = grid.some(g => g?.symbol === el.symbol);
                        return !isPlaced && (
                            <motion.div
                                key={el.symbol}
                                draggable
                                onDragStart={() => setDraggedEl(el)}
                                whileHover={{ scale: 1.1 }}
                                className="pool-el"
                            >
                                {el.symbol}
                            </motion.div>
                        );
                    })}
                </div>

                {grid.every(el => el !== null) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="victory-card">
                        <h2>Periodic Master! 🎉</h2>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default PeriodicDrag;
