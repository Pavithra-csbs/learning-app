import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './FocusAdjuster.css';

const FocusAdjuster = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    // State for sliders
    const [u, setU] = useState(400); // Object distance (positive for display logic)
    const [lensThick, setLensThick] = useState(20); // Lens thickness / curvature factor
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, success

    const RETINA_DISTANCE = 150; // Fixed v in our model

    // Calculate required focal length for perfect focus: 1/f = 1/v + 1/u
    const perfectF = useMemo(() => {
        return 1 / (1 / RETINA_DISTANCE + 1 / u);
    }, [u]);

    // Map lens thickness slider to a focal length range
    // Thicker lens (high slider) = smaller focal length
    const currentF = useMemo(() => {
        // Base f around 50-100. thick=10 -> f=120, thick=50 -> f=40
        return 150 - (lensThick * 2);
    }, [lensThick]);

    const blurAmount = useMemo(() => {
        const diff = Math.abs(currentF - perfectF);
        return Math.min(15, diff / 2);
    }, [currentF, perfectF]);

    const isFocused = blurAmount < 0.5;

    useEffect(() => {
        if (isFocused && gameState === 'playing') {
            const timer = setTimeout(() => {
                setScore(prev => prev + 100);
                // In a multi-level version, we'd change U here
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isFocused, gameState]);

    const getAccommodationText = () => {
        if (u > 300) return "Object is far. Ciliary muscles relax. Lens should be THIN (Long focal length).";
        if (u < 150) return "Object is near. Ciliary muscles contract. Lens should be THICK (Short focal length).";
        return "Keep adjusting to find the perfect focus!";
    };

    const handleCheck = () => {
        if (isFocused) {
            setScore(prev => prev + 100);
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    };

    return (
        <div className="focus-game-container">
            <header className="focus-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="game-stats">
                    <div className="score-pill">SCORE: {score}</div>
                    <div className={`focus-status ${isFocused ? 'sharp' : ''}`}>
                        {isFocused ? "🎯 PERFECT FOCUS" : "🌫️ BLURRY"}
                    </div>
                </div>
            </header>

            <main className="focus-arena">
                <div className="simulation-box">
                    <div className="accommodation-info">
                        <h3>CILIARY MUSCLE ACTIVITY</h3>
                        <p className="process-text">{getAccommodationText()}</p>
                    </div>

                    <div className="eye-diagram-area">
                        <svg viewBox="0 0 800 400" className="focus-svg">
                            {/* Visual Axis */}
                            <line x1="100" y1="200" x2="700" y2="200" stroke="rgba(255,255,255,0.1)" strokeDasharray="5,5" />

                            {/* Retina */}
                            <rect x="650" y="80" width="10" height="240" fill="#222" rx="5" />
                            <text x="640" y="70" fill="gray" fontSize="12" fontWeight="bold">RETINA</text>

                            {/* Object */}
                            <motion.g animate={{ x: 500 - u }}>
                                <text x="40" y="150" fill="#f72585" fontSize="30">🕯️</text>
                                <text x="35" y="190" fill="#f72585" fontSize="10" fontWeight="bold">OBJECT</text>
                            </motion.g>

                            {/* Lens */}
                            <motion.ellipse
                                cx="500" cy="200"
                                rx={15 + lensThick / 5} ry={50 + lensThick}
                                fill="rgba(76, 201, 240, 0.4)"
                                stroke="#4cc9f0"
                                strokeWidth="3"
                            />
                            <text x="480" y="320" fill="#4cc9f0" fontSize="12" fontWeight="bold">EYE LENS</text>

                            {/* Converging Rays */}
                            <motion.path
                                d={`M 500 150 L 650 ${200 - blurAmount * 8} L 500 250`}
                                fill="none" stroke="#4cc9f0" strokeWidth="2" opacity="0.8"
                            />
                            <motion.path
                                d={`M 500 200 L 650 200`}
                                fill="none" stroke="#4cc9f0" strokeWidth="1" opacity="0.4"
                            />
                        </svg>

                        <div className="retina-view">
                            <h4>RETINA SCREEN</h4>
                            <div className="image-preview">
                                <motion.div
                                    className="retina-image"
                                    animate={{
                                        filter: `blur(${blurAmount}px)`,
                                        scale: isFocused ? 1 : 1.1
                                    }}
                                >
                                    🕯️
                                </motion.div>
                            </div>
                            <div className="blur-meter">
                                <div className="meter-fill" style={{ width: `${100 - blurAmount * 6.6}%`, background: isFocused ? '#2ea043' : '#f72585' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="controls-panel">
                        <div className="control-group">
                            <label>1. OBJECT DISTANCE</label>
                            <div className="slider-with-labels">
                                <span className="s-label">NEAR</span>
                                <input
                                    type="range" min="150" max="600" value={u}
                                    onChange={(e) => { setU(parseInt(e.target.value)); setGameState('playing'); }}
                                />
                                <span className="s-label">FAR</span>
                            </div>
                        </div>

                        <div className="control-group">
                            <label>2. LENS CURVATURE (ACCOMMODATION)</label>
                            <div className="slider-with-labels">
                                <span className="s-label">THIN</span>
                                <input
                                    type="range" min="10" max="60" value={lensThick}
                                    onChange={(e) => { setLensThick(parseInt(e.target.value)); setGameState('playing'); }}
                                />
                                <span className="s-label">THICK</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className={`check-focus-btn ${isFocused ? 'active' : ''}`}
                        onClick={handleCheck}
                        disabled={!isFocused || gameState === 'success'}
                    >
                        {isFocused ? "PERFECT FOCUS! CLICK TO SCORE" : "ADJUST LENS TO FOCUS"}
                    </button>
                </div>

                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="focus-success-card">
                            <h2>Exquisite Focus! 🎯</h2>
                            <p>You've successfully demonstrated the Power of Accommodation. The ciliary muscles correctly adjusted the lens to focus the light onto the retina.</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default FocusAdjuster;
