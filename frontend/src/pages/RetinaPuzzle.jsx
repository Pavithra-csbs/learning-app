import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RetinaPuzzle.css';

const INITIAL_LAYERS = [
    { id: 'nerve', name: 'Nerve Fibers', color: '#4cc9f0', label: 'Transmits signals to Brain', description: 'The innermost layer that carries electrical impulses to the optic nerve.' },
    { id: 'rods', name: 'Rods (Photoreceptors)', color: '#f72585', label: 'Detects Light & Motion', description: 'Highly sensitive cells for low-light vision and peripheral motion detection.' },
    { id: 'cones', name: 'Cones (Photoreceptors)', color: '#7209b7', label: 'Detects Color & Detail', description: 'Cells responsible for color vision and high-acuity central vision.' }
];

const CORRECT_ORDER = ['rods', 'cones', 'nerve']; // Schematic order from back to front

const RetinaPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [items, setItems] = useState(() => [...INITIAL_LAYERS].sort(() => Math.random() - 0.5));
    const [gameState, setGameState] = useState('playing'); // playing, success
    const [score, setScore] = useState(0);

    const checkOrder = () => {
        const currentOrder = items.map(item => item.id);
        const isPhotoreceptorBase = currentOrder[0] === 'rods' || currentOrder[0] === 'cones';
        const isNerveTop = currentOrder[2] === 'nerve';

        if (isPhotoreceptorBase && isNerveTop) {
            setScore(100);
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
            // Shake or feedback
        }
    };

    return (
        <div className="retina-puzzle-container">
            <header className="retina-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="puzzle-stats">
                    <div className="star-reward">⭐ SUCCESS STARS: {gameState === 'success' ? '⭐⭐⭐' : '---'}</div>
                </div>
            </header>

            <main className="retina-arena">
                <div className="puzzle-workspace">
                    <div className="schematic-info">
                        <h2>RETINA ARCHITECTURE</h2>
                        <p>Drag the layers to reconstruct the retina. Remember: Photoreceptors are at the back, Nerve fibers lead to the front!</p>
                    </div>

                    <div className="stack-area">
                        <div className="stack-labels">
                            <span>FRONT (INSIDE EYE)</span>
                            <div className="stack-line"></div>
                            <span>BACK (CHOROID SIDE)</span>
                        </div>

                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="layer-list">
                            {items.map((item) => (
                                <Reorder.Item key={item.id} value={item} className="retina-layer-item">
                                    <div className="layer-content" style={{ borderLeft: `8px solid ${item.color}` }}>
                                        <div className="layer-meta">
                                            <h3>{item.name}</h3>
                                            <p>{item.label}</p>
                                        </div>
                                        <div className="drag-handle">☰</div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>

                    <button className="verify-btn" onClick={checkOrder} disabled={gameState === 'success'}>
                        VERIFY CONNECTION
                    </button>
                </div>

                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="success-overlay">
                            <div className="scientific-popup">
                                <h1>Visual Signal Path Locked! ⚡</h1>
                                <p>Excellent! You've correctly ordered the retina. Light triggers the <strong>Rods and Cones</strong> at the back, which then pass electrical signals through the <strong>Nerve Fibers</strong> straight to your brain via the Optic Nerve.</p>

                                <div className="layer-breakdown">
                                    {INITIAL_LAYERS.map(l => (
                                        <div key={l.id} className="mini-card">
                                            <strong>{l.name}:</strong> {l.description}
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE ⭐⭐⭐</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default RetinaPuzzle;
