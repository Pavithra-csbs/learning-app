import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './GeneratorSim.css';

const GeneratorSim = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [rotationSpeed, setRotationSpeed] = useState(0);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const TARGET_VOLTAGE = 220;

    useEffect(() => {
        // Simple AC generator logic: output V is proportional to rotation speed
        const output = rotationSpeed * 2.2; // Max speed 100 -> 220V
        setCurrentOutput(output);

        if (output >= TARGET_VOLTAGE) {
            setGameState('victory');
            canvasConfetti({ particleCount: 200 });
        }
    }, [rotationSpeed]);

    return (
        <div className="gen-container">
            <header className="gen-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="target">TARGET VOLTAGE: {TARGET_VOLTAGE}V</div>
            </header>

            <main className="gen-arena">
                <div className="generator-machine">
                    <motion.div
                        className="armature"
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: rotationSpeed > 0 ? (10 / (rotationSpeed / 10 + 0.1)) : Infinity,
                            ease: 'linear'
                        }}
                    >
                        <div className="coil-face">🌀</div>
                    </motion.div>
                    <div className="magnet-frame">
                        <div className="pole-n">N</div>
                        <div className="pole-s">S</div>
                    </div>
                </div>

                <div className="output-panel">
                    <div className="meter-card">
                        <label>VOLTAGE OUTPUT (V)</label>
                        <div className="volts-display">{Math.round(currentOutput)}V</div>
                        <div className="v-bar">
                            <motion.div className="v-fill" animate={{ height: `${(currentOutput / TARGET_VOLTAGE) * 100}%` }} />
                        </div>
                    </div>

                    <div className="control-group">
                        <label>TURBINE SPEED</label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={rotationSpeed}
                            onChange={(e) => setRotationSpeed(Number(e.target.value))}
                        />
                        <p className="hint">Spin up the turbine to generate high-voltage electricity!</p>
                    </div>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🔌</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>Stable voltage achieved! You've successfully converted mechanical work into electrical power.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">FINAL MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneratorSim;
