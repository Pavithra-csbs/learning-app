import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MagnetSymbols.css';

const SYMBOLS = [
    { id: 'magnet', name: 'Bar Magnet', icon: '🧲', desc: 'Source of constant magnetic field.' },
    { id: 'compass', name: 'Compass', icon: '🧭', desc: 'Detects magnetic field direction.' },
    { id: 'coil', name: 'Coil', icon: '🌀', desc: 'Current creates field here.' },
    { id: 'battery', name: 'Battery', icon: '🔋', desc: 'Power source for the coil.' },
    { id: 'switch', name: 'Switch', icon: '⏻', desc: 'Controls flow of current.' }
];

const MagnetSymbols = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [placed, setPlaced] = useState([]);
    const [gameState, setGameState] = useState('playing');
    const [hint, setHint] = useState('Drag the symbols to their correct function descriptions!');

    const handleDrop = (id) => {
        if (!placed.includes(id)) {
            const nextIdx = placed.length;
            if (SYMBOLS[nextIdx].id === id) {
                setPlaced([...placed, id]);
                setHint(`Correct! ${SYMBOLS[nextIdx].name} identified. ✨`);
                if (placed.length + 1 === SYMBOLS.length) {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 150 });
                }
            } else {
                setHint(`Wrong position! Think about the ${SYMBOLS[nextIdx].name}. ❌`);
            }
        }
    };

    return (
        <div className="symbols-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="back-btn">⬅️ MAP</button>
                <div className="progress">PROGRESS: {placed.length}/{SYMBOLS.length}</div>
                <div className="title">LEVEL 6: SYMBOL IDENTIFIER</div>
            </header>

            <main className="symbols-arena">
                <div className="discovery-grid">
                    {SYMBOLS.map((s, i) => (
                        <div key={s.id} className={`target-slot ${placed.includes(s.id) ? 'solved' : ''}`}>
                            <div className="slot-desc">
                                <strong>STATION {i + 1}</strong>
                                <p>{s.desc}</p>
                            </div>
                            <div className="slot-visual">
                                {placed.includes(s.id) ? <span>{s.icon}</span> : '?'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="symbol-tray">
                    <h3>PARTS BIN</h3>
                    <p className="hint-text">{hint}</p>
                    <div className="symbols-list">
                        {SYMBOLS.map(s => (
                            <motion.div
                                key={s.id}
                                className={`symbol-card ${placed.includes(s.id) ? 'locked' : ''}`}
                                draggable={!placed.includes(s.id)}
                                onDragEnd={() => handleDrop(s.id)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="s-icon">{s.icon}</span>
                                <span className="s-name">{s.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="win-badge">📐</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are a Magnetism Master!</h1>
                        <p>You've identified all the tools of the trade! Ready for advanced electromagnetism.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="next-level-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagnetSymbols;
