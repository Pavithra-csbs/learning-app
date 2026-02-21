import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './EndocrinePuzzle.css';

const GLANDS = [
    { id: 'pituitary', name: 'Pituitary Gland', pos: { top: '10%', left: '48%' }, color: '#818cf8', icon: '👑', hormone: 'Growth Hormone' },
    { id: 'thyroid', name: 'Thyroid', pos: { top: '22%', left: '48%' }, color: '#38bdf8', icon: '🦋', hormone: 'Thyroxine' },
    { id: 'adrenal', name: 'Adrenal Glands', pos: { top: '48%', left: '48%' }, color: '#fbbf24', icon: '⚡', hormone: 'Adrenaline' },
    { id: 'pancreas', name: 'Pancreas', pos: { top: '42%', left: '42%' }, color: '#f472b6', icon: '🧬', hormone: 'Insulin' },
];

const EndocrinePuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [selectedGland, setSelectedGland] = useState(null);
    const [placed, setPlaced] = useState({});
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleGlandClick = (gland) => {
        if (placed[gland.id]) return;
        setSelectedGland(gland);
    };

    const handleDropZoneClick = (glandId) => {
        if (!selectedGland) {
            toast('Select a gland piece first! 🧩', { icon: '💡' });
            return;
        }

        if (selectedGland.id === glandId) {
            setPlaced(prev => ({ ...prev, [glandId]: true }));
            setScore(s => s + 25);
            toast.success(`Perfect! ${selectedGland.name} placed correctly.\nHormone: ${selectedGland.hormone}`);
            setSelectedGland(null);

            if (Object.keys(placed).length + 1 === GLANDS.length) {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('done'), 1500);
            }
        } else {
            toast.error('Wrong location! Think about where this gland is in the body.');
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '5');
        if (cur < 6) localStorage.setItem('completed_levels_Control and Coordination', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        return (
            <div className="ep-container done">
                <motion.div className="ep-result-card" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h2>Endocrine System Assembled! 🧩</h2>
                    <div className="ep-stars">⭐⭐⭐</div>
                    <p className="ep-final-score">Score: {score} pts</p>
                    <p className="ep-motto">Hurray 🎉 You are a Brain Power Champion!</p>
                    <button className="ep-btn" onClick={handleComplete}>Next: Labeling Game →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="ep-container">
            <header className="ep-header">
                <button className="ep-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>🧩 Endocrine Puzzle</h1>
                <div className="ep-score">Progress: {Object.keys(placed).length} / {GLANDS.length}</div>
            </header>

            <div className="ep-layout">
                <div className="ep-pieces-bank">
                    <h3>🧩 Pieces</h3>
                    <div className="ep-grid-pieces">
                        {GLANDS.map(g => (
                            <button
                                key={g.id}
                                className={`ep-piece-btn ${selectedGland?.id === g.id ? 'active' : ''} ${placed[g.id] ? 'placed' : ''}`}
                                onClick={() => handleGlandClick(g)}
                                disabled={placed[g.id]}
                            >
                                <span className="ep-piece-icon">{g.icon}</span>
                                <span className="ep-piece-name">{g.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ep-body-map">
                    <div className="human-outline">
                        {/* Placeholder for human body silhouette */}
                        <div className="silhouette">
                            <div className="body-part head"></div>
                            <div className="body-part neck"></div>
                            <div className="body-part torso"></div>
                        </div>

                        {GLANDS.map(g => (
                            <motion.div
                                key={g.id}
                                className={`ep-drop-zone ${placed[g.id] ? 'filled' : ''} ${selectedGland && !placed[g.id] ? 'highlight' : ''}`}
                                style={{ ...g.pos, border: placed[g.id] ? `2px solid ${g.color}` : '2px dashed rgba(255,255,255,0.3)' }}
                                onClick={() => handleDropZoneClick(g.id)}
                                whileHover={!placed[g.id] ? { scale: 1.1 } : {}}
                            >
                                {placed[g.id] ? (
                                    <div className="filled-content" style={{ backgroundColor: g.color }}>
                                        {g.icon}
                                        <div className="gland-tag">{g.name}</div>
                                    </div>
                                ) : (
                                    '?'
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="ep-info-panel">
                    <h3>📋 Hormone Info</h3>
                    <div className="ep-info-list">
                        {GLANDS.map(g => (
                            <div key={g.id} className={`ep-info-item ${placed[g.id] ? 'visible' : ''}`}>
                                {placed[g.id] ? (
                                    <><strong>{g.hormone}:</strong> From {g.name}</>
                                ) : (
                                    'Locked - Place gland to reveal'
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EndocrinePuzzle;
