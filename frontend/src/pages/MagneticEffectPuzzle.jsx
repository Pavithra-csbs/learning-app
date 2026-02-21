import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MagneticEffectPuzzle.css';

const MagneticEffectPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentValue, setCurrentValue] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, victory
    const [feedback, setFeedback] = useState("Increase current to amplify the magnetic field!");

    const TARGET_CURRENT = 80;

    const handleCheck = () => {
        if (currentValue >= TARGET_CURRENT) {
            setGameState('victory');
            setFeedback("Hurray 🎉 Woohoo! You are a Magnetism Master!");
            canvasConfetti({ particleCount: 200 });
        } else {
            setFeedback("Don’t feel bad 😊 Try more current for a stronger field!");
        }
    };

    return (
        <div className="effect-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="back-btn">⬅️ MAP</button>
                <div className="title">LEVEL 7: ELECTROMAGNETIC PULSE</div>
            </header>

            <main className="effect-arena">
                <div className="visualization-bench">
                    <div className="coil-frame">
                        <div className="wire-loop"></div>
                        {/* Dynamic Field Lines */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="field-line"
                                animate={{
                                    scale: currentValue / 10,
                                    opacity: currentValue / 100,
                                    strokeWidth: currentValue / 20
                                }}
                                style={{
                                    width: 100 + i * 40,
                                    height: 100 + i * 40,
                                    border: '2px solid rgba(59, 130, 246, 0.5)'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="control-panel">
                    <div className="meter">
                        <label>CURRENT INTENSITY (Amperes)</label>
                        <div className="display">{currentValue} A</div>
                        <div className="bar">
                            <motion.div className="fill" animate={{ width: `${currentValue}%` }} />
                        </div>
                    </div>

                    <div className="controls">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentValue}
                            onChange={(e) => setCurrentValue(Number(e.target.value))}
                        />
                        <button className="engage-btn" onClick={handleCheck}>TEST FIELD STRENGTH</button>
                    </div>
                    <p className="status-text">{feedback}</p>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="win-badge">⚡</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are a Magnetism Master!</h1>
                        <p>You've successfully controlled the magnetic effect! Your understanding of electromagnetism is complete.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic%20Effects%20of%20Electric%20Current`)} className="next-level-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagneticEffectPuzzle;
