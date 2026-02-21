import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EMIExplorer.css';

const EMIExplorer = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [magnetPos, setMagnetPos] = useState(0); // 0 to 100
    const [inducedCurrent, setInducedCurrent] = useState(0);
    const [energyCollected, setEnergyCollected] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const lastPos = useRef(0);

    const TARGET_ENERGY = 1000;

    useEffect(() => {
        // Current is proportional to rate of change of magnetic flux (velocity of magnet)
        const velocity = Math.abs(magnetPos - lastPos.current);
        const current = velocity * 5;

        setInducedCurrent(current);
        if (current > 0) {
            setEnergyCollected(prev => {
                const newValue = prev + current;
                if (newValue >= TARGET_ENERGY) {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 200 });
                }
                return newValue;
            });
        }

        lastPos.current = magnetPos;
    }, [magnetPos]);

    return (
        <div className="emi-container">
            <header className="emi-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="mission-info">
                    TASK: GENERATE {TARGET_ENERGY} UNITS OF INDUCED ENERGY
                </div>
            </header>

            <main className="emi-arena">
                <div className="energy-stats">
                    <div className="stat-card">
                        <label>INDUCED CURRENT (I)</label>
                        <div className="current-meter">
                            <motion.div
                                className="meter-needle"
                                animate={{ rotate: (inducedCurrent / 50) * 90 - 45 }}
                            />
                        </div>
                        <div className="current-val">{Math.round(inducedCurrent)} A</div>
                    </div>

                    <div className="stat-card">
                        <label>ENERGY COLLECTED</label>
                        <div className="energy-bar">
                            <motion.div className="energy-fill" animate={{ width: `${(energyCollected / TARGET_ENERGY) * 100}%` }} />
                        </div>
                        <div className="energy-val">{Math.round(energyCollected)} / {TARGET_ENERGY}</div>
                    </div>
                </div>

                <div className="simulation-bench">
                    <div className="coil-visual">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="coil-turn" />
                        ))}
                    </div>

                    <motion.div
                        className="magnet-visual"
                        drag="x"
                        dragConstraints={{ left: -300, right: 300 }}
                        onDrag={(e, info) => setMagnetPos(info.point.x)}
                    >
                        <div className="pole n">N</div>
                        <div className="pole s">S</div>
                        <div className="drag-handle">↔️ DRAG ME FAST!</div>
                    </motion.div>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🧲</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>Faraday would be proud! You've generated enough electricity to power the dashboard!</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EMIExplorer;
