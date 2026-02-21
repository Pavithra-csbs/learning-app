import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './SolenoidSupercharger.css';

const SolenoidSupercharger = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [turns, setTurns] = useState(10);
    const [current, setCurrent] = useState(2);
    const [coreType, setCoreType] = useState('AIR'); // AIR, IRON
    const [gameState, setGameState] = useState('playing');

    const intensity = useMemo(() => {
        const base = turns * current;
        return coreType === 'IRON' ? base * 10 : base;
    }, [turns, current, coreType]);

    const TARGET = 1500;

    const handleEngage = () => {
        if (intensity >= TARGET) {
            setGameState('victory');
            canvasConfetti({ particleCount: 200, spread: 100 });
        }
    };

    return (
        <div className="solenoid-container">
            <header className="solenoid-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="goal-meter">
                    TARGET POWER: {TARGET} μT
                </div>
            </header>

            <main className="solenoid-arena">
                <div className="solenoid-visualizer">
                    <div className={`core ${coreType.toLowerCase()}`}>
                        {[...Array(turns)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="turn"
                                animate={{ boxShadow: `0 0 ${intensity / 50}px #3b82f6` }}
                            />
                        ))}
                    </div>
                    <div className="field-lines-overlay">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="field-line"
                                animate={{ opacity: intensity / TARGET, scaleX: 1 + (intensity / TARGET) }}
                            />
                        ))}
                    </div>
                </div>

                <div className="control-panel">
                    <div className="stat-card">
                        <label>MAGNETIC INTENSITY</label>
                        <div className="intensity-value">{Math.round(intensity)} μT</div>
                        <div className="intensity-bar">
                            <motion.div className="intensity-fill" animate={{ width: `${Math.min(100, (intensity / TARGET) * 100)}%` }} />
                        </div>
                    </div>

                    <div className="sliders">
                        <div className="input-group">
                            <label>NUMBER OF TURNS (N): {turns}</label>
                            <input type="range" min="5" max="50" value={turns} onChange={(e) => setTurns(Number(e.target.value))} />
                        </div>
                        <div className="input-group">
                            <label>CURRENT (I): {current}A</label>
                            <input type="range" min="1" max="10" step="0.5" value={current} onChange={(e) => setCurrent(Number(e.target.value))} />
                        </div>
                        <div className="input-group">
                            <label>CORE MATERIAL</label>
                            <div className="core-tabs">
                                <button onClick={() => setCoreType('AIR')} className={coreType === 'AIR' ? 'active' : ''}>AIR CORE</button>
                                <button onClick={() => setCoreType('IRON')} className={coreType === 'IRON' ? 'active' : ''}>SOFT IRON</button>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleEngage} className="engage-btn">ACTIVATE ELECTROMAGNET</button>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🌀</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>You've successfully created a powerful electromagnet using {coreType === 'IRON' ? 'Soft Iron' : 'physics'}!</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolenoidSupercharger;
