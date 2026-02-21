import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './LightBossLevel.css';

const LightBossLevel = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('intro'); // intro, playing, feedback, victory, defeat
    const [bossHealth, setBossHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(3);
    const [currentScenario, setCurrentScenario] = useState(0);
    const [timer, setTimer] = useState(45);
    const [stars, setStars] = useState(0);

    const scenarios = useMemo(() => [
        {
            id: 1,
            title: "The Mirror Trap",
            description: "Dr. Shadow has placed a hidden mirror. Where will the ray reflect if the incident angle is 30°?",
            options: ["30° to the normal", "60° to the normal", "90° to the normal", "0°"],
            correct: 0,
            explanation: "Law of Reflection: Angle i = Angle r. So, if i=30°, r=30°.",
            bossDamage: 34,
            diagram: (
                <svg viewBox="0 0 400 300" className="boss-svg">
                    <line x1="50" y1="250" x2="350" y2="250" stroke="white" strokeWidth="4" />
                    <line x1="200" y1="100" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeDasharray="5,5" />
                    <motion.line
                        x1="100" y1="100" x2="200" y2="250"
                        stroke="#f72585" strokeWidth="4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    />
                    <text x="120" y="240" fill="#f72585" fontSize="14">30°</text>
                </svg>
            )
        },
        {
            id: 2,
            title: "The Glass Barrier",
            description: "A ray enters a glass block (n=1.5) from air. Predict its behavior!",
            options: ["Bends towards Normal", "Bends away from Normal", "Stays straight", "Reflects back"],
            correct: 0,
            explanation: "Snell's Law: Moving from rarer (Air) to denser (Glass) medium makes light bend towards the normal.",
            bossDamage: 33,
            diagram: (
                <svg viewBox="0 0 400 300" className="boss-svg">
                    <rect x="50" y="150" width="300" height="100" fill="rgba(76, 201, 240, 0.2)" stroke="#4cc9f0" />
                    <line x1="200" y1="50" x2="200" y2="250" stroke="rgba(255,255,255,0.3)" strokeDasharray="5,5" />
                    <line x1="120" y1="50" x2="200" y2="150" stroke="#f72585" strokeWidth="4" />
                    <text x="210" y="220" fill="#4cc9f0" fontSize="14">GLASS</text>
                </svg>
            )
        },
        {
            id: 3,
            title: "The Focal Point",
            description: "An object is at 2F of a convex lens. Where is the image?",
            options: ["At 2F", "At F", "Between F and 2F", "At Infinity"],
            correct: 0,
            explanation: "When an object is at 2F, the image is formed at 2F on the other side, real and inverted.",
            bossDamage: 33,
            diagram: (
                <svg viewBox="0 0 400 300" className="boss-svg">
                    <ellipse cx="200" cy="150" rx="20" ry="100" fill="rgba(76, 201, 240, 0.3)" stroke="#4cc9f0" />
                    <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="1" opacity="0.5" />
                    <circle cx="100" cy="150" r="5" fill="#f72585" />
                    <text x="90" y="180" fill="#f72585" fontSize="14">2F</text>
                </svg>
            )
        }
    ], []);

    useEffect(() => {
        let interval;
        if (gameState === 'playing' && timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        } else if (timer === 0 && gameState === 'playing') {
            setGameState('defeat');
        }
        return () => clearInterval(interval);
    }, [gameState, timer]);

    const handleAnswer = (index) => {
        if (index === scenarios[currentScenario].correct) {
            setBossHealth(prev => Math.max(0, prev - scenarios[currentScenario].bossDamage));
            if (currentScenario < scenarios.length - 1) {
                setCurrentScenario(prev => prev + 1);
            } else {
                calculateStars();
                setGameState('victory');
                canvasConfetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
            }
        } else {
            setPlayerHealth(prev => {
                if (prev <= 1) {
                    setGameState('defeat');
                    return 0;
                }
                return prev - 1;
            });
        }
    };

    const calculateStars = () => {
        let s = 1;
        if (playerHealth === 3) s++;
        if (timer > 20) s++;
        setStars(s);
    };

    return (
        <div className="boss-level-container">
            <header className="boss-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ ABANDON MISSION</button>
                <div className="boss-hud">
                    <div className="hp-bar player">
                        <div className="hp-label">MASTER LEROY</div>
                        <div className="hearts">
                            {[...Array(3)].map((_, i) => (
                                <span key={i} className={i < playerHealth ? 'heart active' : 'heart'}>❤️</span>
                            ))}
                        </div>
                    </div>
                    <div className="hp-bar boss">
                        <div className="hp-label">DR. SHADOW</div>
                        <div className="health-track">
                            <motion.div
                                className="health-fill"
                                animate={{ width: `${bossHealth}%` }}
                                style={{ background: bossHealth < 30 ? '#ff0000' : '#f72585' }}
                            />
                        </div>
                    </div>
                </div>
                <div className="timer-box">⏱️ {timer}s</div>
            </header>

            <main className="boss-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div key="intro" className="boss-card intro" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="boss-avatar">👤</div>
                            <h1>Dr. Shadow's Optical Labyrinth</h1>
                            <p>"You think you've mastered light? Let's see how you handle my ultimate simulations!"</p>
                            <button onClick={() => setGameState('playing')} className="start-btn">CHALLENGE ACCEPTED</button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <motion.div key={currentScenario} className="battle-area" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }}>
                            <div className="scenario-diagram">
                                {scenarios[currentScenario].diagram}
                            </div>
                            <div className="scenario-content">
                                <h2>{scenarios[currentScenario].title}</h2>
                                <p>{scenarios[currentScenario].description}</p>
                                <div className="options-grid">
                                    {scenarios[currentScenario].options.map((opt, i) => (
                                        <button key={i} onClick={() => handleAnswer(i)} className="option-btn">
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'victory' && (
                        <motion.div key="victory" className="boss-card victory" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="badge-icon">🎖️</div>
                            <h1>LIGHT MASTER!</h1>
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < stars ? 'star active' : 'star'}>⭐</span>
                                ))}
                            </div>
                            <p>You have defeated Dr. Shadow and mastered the laws of Optics!</p>
                            <div className="reward-badge">Earned: "Light Master" Badge</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">RETURN AS CHAMPION</button>
                        </motion.div>
                    )}

                    {gameState === 'defeat' && (
                        <motion.div key="defeat" className="boss-card defeat" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <div className="defeat-icon">💀</div>
                            <h1>MISSION FAILED</h1>
                            <p>Dr. Shadow's darkness prevails. Study the laws of light and try again!</p>
                            <button onClick={() => window.location.reload()} className="retry-btn">RETRY MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default LightBossLevel;
