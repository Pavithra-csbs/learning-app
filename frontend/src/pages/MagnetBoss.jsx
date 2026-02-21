import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MagnetBoss.css';

const BOSS_PHASES = [
    {
        id: 1,
        title: "THE POLARITY PUZZLE",
        desc: "Match the field lines to the Professor's shield polarity!",
        target: 'N-S-N-S'
    },
    {
        id: 2,
        title: "FORCE FIELD DEFENSE",
        desc: "Predict the force direction to deflect the Professor's electron blast!",
        target: 'LEFT'
    }
];

const MagnetBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState(0);
    const [bossHealth, setBossHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [gameState, setGameState] = useState('playing');
    const [dialogue, setDialogue] = useState("Your magnetic personality won't help you here!");

    const handleAction = (isCorrect) => {
        if (isCorrect) {
            setBossHealth(h => Math.max(0, h - 50));
            setDialogue("UNBELIEVABLE! My Magnetron is losing flux!");
            if (bossHealth <= 50) {
                if (phase < BOSS_PHASES.length - 1) {
                    setPhase(p => p + 1);
                    setDialogue("That was just a small induction! Try this!");
                } else {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 300, spread: 120 });
                }
            }
        } else {
            setPlayerHealth(h => Math.max(0, h - 25));
            setDialogue("Ha! Your logic is purely paramagnetic!");
        }
    };

    return (
        <div className="magnet-boss-container">
            <header className="boss-hud">
                <div className="stat">PLAYER: {playerHealth}%</div>
                <div className="boss-name">PROFESSOR ELECTRON: MAGNETRON</div>
                <div className="stat">BOSS: {bossHealth}%</div>
            </header>

            <main className="boss-arena">
                <div className="boss-visual">
                    <motion.div
                        className="boss-avatar"
                        animate={{ y: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        👨‍🔬🧲
                    </motion.div>
                    <div className="speech-bubble">{dialogue}</div>
                </div>

                <div className="battle-zone">
                    <div className="phase-info">
                        <h3>PHASE {phase + 1}: {BOSS_PHASES[phase].title}</h3>
                        <p>{BOSS_PHASES[phase].desc}</p>
                    </div>

                    <div className="action-grid">
                        <button onClick={() => handleAction(true)} className="attack-btn">ENGAGE FIELD</button>
                        <button onClick={() => handleAction(false)} className="attack-btn">REVERSE CURRENT</button>
                    </div>
                </div>
            </main>

            {gameState === 'victory' && (
                <div className="victory-overlay">
                    <div className="victory-card">
                        <div className="badge">🛡️</div>
                        <h2>Hurray 🎉 Woohoo!</h2>
                        <h1>You are an Electricity Champion!</h1>
                        <p>The Magnetron has been neutralized! You've mastered all laws of magnetism.</p>
                        <div className="stars">⭐⭐⭐</div>
                        <button onClick={() => navigate('/map')} className="finish-btn">COMPLETE EXPLORATION</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagnetBoss;
