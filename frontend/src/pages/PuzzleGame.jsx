import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PuzzleGame.css';

const PuzzleGame = ({ config, onComplete }) => {
    const {
        title,
        goal,
        items,
        targets,
        layout = "grid", // "grid" or "columns"
        successMessage = "Masterful Work! 🏆"
    } = config;

    const [placedItems, setPlacedItems] = useState([]);
    const [wrongItem, setWrongItem] = useState(null);
    const [finished, setFinished] = useState(false);
    const [stars, setStars] = useState(0);

    const handleDrop = (item, targetId) => {
        if (item.correctTarget === targetId) {
            setPlacedItems(prev => [...prev, { ...item, placedAt: targetId }]);
            setWrongItem(null);
            // Visual success feedback could go here
        } else {
            setWrongItem(item.id);
            setTimeout(() => setWrongItem(null), 600);
        }
    };

    useEffect(() => {
        if (placedItems.length === items.length && items.length > 0) {
            setTimeout(() => {
                setFinished(true);
                setStars(3);
            }, 800);
        }
    }, [placedItems, items]);

    return (
        <div className={`puzzle-game-container layout-${layout}`}>
            <div className="game-header">
                <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{title}</motion.h1>
                <p className="game-goal">{goal}</p>
            </div>

            <div className={`game-board ${layout}`}>
                {/* Items Palette */}
                <div className="items-palette">
                    <h3>Drag to Classify</h3>
                    <div className="palette-grid">
                        <AnimatePresence>
                            {items.filter(item => !placedItems.some(p => p.id === item.id)).map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    onDragEnd={(e, info) => {
                                        const elements = document.elementsFromPoint(e.clientX, e.clientY);
                                        const zone = elements.find(el => el.classList.contains('drop-zone'));
                                        if (zone) handleDrop(item, zone.getAttribute('data-id'));
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileDrag={{ scale: 1.1, zIndex: 50 }}
                                    className={`draggable-item ${wrongItem === item.id ? 'wrong' : ''}`}
                                >
                                    <span className="item-label">{item.label}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Drop Zones */}
                <div className="zones-palette">
                    {targets.map(target => (
                        <div key={target.id} data-id={target.id} className="drop-zone">
                            <div className="zone-header">
                                <span className="zone-icon">{target.icon || "📂"}</span>
                                <span className="zone-label">{target.label}</span>
                            </div>
                            <div className="zone-content">
                                {placedItems.filter(p => p.placedAt === target.id).map(p => (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        key={p.id}
                                        className="placed-item"
                                    >
                                        {p.label} <span className="check">✓</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {finished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="game-complete-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="complete-card"
                        >
                            <h2>{successMessage}</h2>
                            <p>Knowledge Mission Accomplished!</p>
                            <div className="star-rating">
                                {[1, 2, 3].map(s => (
                                    <motion.span
                                        key={s}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 * s }}
                                        className="star active"
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>
                            <button onClick={onComplete} className="continue-btn">Complete Mission</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PuzzleGame;
