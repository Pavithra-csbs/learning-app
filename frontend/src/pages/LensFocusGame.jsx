import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './LensFocusGame.css';

const LensFocusGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [lensType, setLensType] = useState('convex'); // convex or concave
    const [u, setU] = useState(-200); // Object distance (negative by convention)
    const [screenV, setScreenV] = useState(200); // Screen position (user controlled)
    const [f] = useState(100); // Focal length
    const [gameState, setGameState] = useState('intro'); // intro, playing, success

    const effectiveF = lensType === 'convex' ? f : -f;

    // Lens Formula: 1/v - 1/u = 1/f  => 1/v = 1/f + 1/u => v = (f*u) / (f+u)
    const realV = useMemo(() => {
        if (u === -effectiveF) return 10000; // Infinity
        return (effectiveF * u) / (effectiveF + u);
    }, [u, effectiveF]);

    const magnification = useMemo(() => {
        return Math.abs(realV / u);
    }, [realV, u]);

    const isReal = realV > 0;
    const isInverted = isReal; // Real images from single lens are inverted

    const blurAmount = useMemo(() => {
        const diff = Math.abs(screenV - realV);
        return Math.min(20, diff / 10);
    }, [screenV, realV]);

    const isFocused = blurAmount < 0.5;

    useEffect(() => {
        if (isFocused && gameState === 'playing') {
            const timer = setTimeout(() => {
                setGameState('success');
                canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isFocused, gameState]);

    return (
        <div className="lens-game-container">
            <header className="lens-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="physics-hud">
                    <div className="lens-formula">1/f = 1/v - 1/u</div>
                    <div className="lens-select">
                        <button className={lensType === 'convex' ? 'active' : ''} onClick={() => setLensType('convex')}>CONVEX</button>
                        <button className={lensType === 'concave' ? 'active' : ''} onClick={() => setLensType('concave')}>CONCAVE</button>
                    </div>
                </div>
            </header>

            <main className="optical-bench">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lens-card overlay-card">
                            <h1>Lens Focus Challenge 🔍</h1>
                            <p>Master the art of image formation! Move the object and screen to find the perfect focal point.</p>
                            <button onClick={() => setGameState('playing')} className="start-btn">ENTER LAB</button>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="lens-card success-card">
                            <h1>Sharp Focus! 📸</h1>
                            <p>You've successfully mapped the light rays. Your optical precision is unmatched!</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bench-visualization">
                    <div className="ruler"></div>

                    {/* Object (Candle) */}
                    <motion.div
                        className="bench-object"
                        style={{ left: `calc(50% + ${u}px)` }}
                    >
                        <div className="candle">🕯️</div>
                        <div className="label">OBJECT (u = {Math.abs(u)})</div>
                    </motion.div>

                    {/* Lens */}
                    <div className={`bench-lens ${lensType}`}>
                        <div className="lens-glass"></div>
                        <div className="label">LENS (f = {f})</div>
                    </div>

                    {/* Screen */}
                    <motion.div
                        className="bench-screen"
                        style={{ left: `calc(50% + ${screenV}px)` }}
                    >
                        <div className="screen-surface">
                            <div
                                className="projected-image"
                                style={{
                                    filter: `blur(${blurAmount}px)`,
                                    transform: `scale(${magnification}) ${isInverted ? 'rotate(180deg)' : ''}`,
                                    opacity: isReal ? 0.8 : 0.2
                                }}
                            >
                                🕯️
                            </div>
                        </div>
                        <div className="label">SCREEN (v = {Math.round(screenV)})</div>
                    </motion.div>

                    {/* Image Info Tooltip */}
                    <div className="image-info">
                        <h3>Image Properties:</h3>
                        <ul>
                            <li>Type: <span className="val">{isReal ? 'REAL' : 'VIRTUAL'}</span></li>
                            <li>Orientation: <span className="val">{isInverted ? 'INVERTED' : 'UPRIGHT'}</span></li>
                            <li>Size: <span className="val">{magnification > 1 ? 'MAGNIFIED' : 'DIMINISHED'}</span></li>
                        </ul>
                    </div>
                </div>

                <div className="controls-panel">
                    <div className="control-group">
                        <label>OBJECT POSITION (u)</label>
                        <input type="range" min="-400" max="-50" value={u} onChange={(e) => setU(parseInt(e.target.value))} />
                    </div>
                    <div className="control-group">
                        <label>SCREEN POSITION (v)</label>
                        <input type="range" min="50" max="400" value={screenV} onChange={(e) => setScreenV(parseInt(e.target.value))} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LensFocusGame;
