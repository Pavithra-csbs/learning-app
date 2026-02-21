import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './ElectricityBossLevel.css';

const BOSS_PHASES = [
    {
        id: 1,
        type: 'theory',
        title: 'THEORETICAL DUEL',
        description: "Answer Professor Electron's lightning-fast questions to weaken his shield!",
        questions: [
            { q: "What is the equivalent resistance of two 10Ω resistors in parallel?", o: ["20Ω", "5Ω", "10Ω", "2.5Ω"], a: 1, e: "Parallel: 1/Req = 1/10 + 1/10 = 2/10 -> Req = 5Ω" },
            { q: "If voltage is doubled and resistance is halved, what happens to current?", o: ["Stays same", "Doubles", "Quartered", "Quadrupled"], a: 3, e: "I = V/R -> (2V)/(0.5R) = 4(V/R)" },
            { q: "Which meter must be connected in parallel to a component?", o: ["Ammeter", "Voltmeter", "Galvanometer", "Multimeter in series"], a: 1, e: "Voltmeters measure potential difference across components." }
        ]
    },
    {
        id: 2,
        type: 'simulation',
        title: 'SABOTAGE REPAIR',
        description: "The Professor has sabotaged the city's power grid! Fix the circuit to restore power.",
        task: "Connect the correct components to achieve exactly 120W of power with a 24V source.",
        targetPower: 120,
        voltage: 24,
        components: [
            { id: 'res-1', type: 'resistor', val: 4.8, label: 'High Res (4.8Ω)' },
            { id: 'res-2', type: 'resistor', val: 12, label: 'Mid Res (12Ω)' },
            { id: 'res-3', type: 'resistor', val: 2.4, label: 'Low Res (2.4Ω)' }
        ]
    }
];

const ElectricityBossLevel = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [phaseIdx, setPhaseIdx] = useState(0);
    const [theoryIdx, setTheoryIdx] = useState(0);
    const [bossHealth, setBossHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [dialogue, setDialogue] = useState("Greetings, novice! I am Professor Electron. Let's see if your brain is properly grounded!");
    const [gameState, setGameState] = useState('intro'); // intro, playing, phaseTransition, victory, defeat
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [timer, setTimer] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const currentPhase = BOSS_PHASES[phaseIdx];

    // Timer effect
    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const handleAnswer = (idx) => {
        const q = currentPhase.questions[theoryIdx];
        if (idx === q.a) {
            setBossHealth(h => Math.max(0, h - 20));
            setDialogue("Argh! A correct deduction? Pure luck!");
            setFeedback({ type: 'success', msg: q.e });

            setTimeout(() => {
                setFeedback(null);
                if (theoryIdx < currentPhase.questions.length - 1) {
                    setTheoryIdx(prev => prev + 1);
                } else {
                    transitionToPhase(1);
                }
            }, 2500);
        } else {
            setPlayerHealth(h => Math.max(0, h - 25));
            setDialogue("Inaccurate! Your knowledge is high-resistance!");
            setFeedback({ type: 'error', msg: "Incorrect! Shield damaged." });
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    const toggleComponent = (comp) => {
        if (selectedComponents.find(c => c.id === comp.id)) {
            setSelectedComponents(prev => prev.filter(c => c.id !== comp.id));
        } else {
            setSelectedComponents(prev => [...prev, comp]);
        }
    };

    const checkSimulation = () => {
        // Assume parallel connection for simplicity in this boss task
        if (selectedComponents.length === 0) return;

        let totalConductance = 0;
        selectedComponents.forEach(c => totalConductance += (1 / c.val));
        const totalResistance = 1 / totalConductance;
        const current = currentPhase.voltage / totalResistance;
        const power = currentPhase.voltage * current;

        if (Math.abs(power - currentPhase.targetPower) < 1) {
            setBossHealth(0);
            setDialogue("UNCLE! The grid is stable! You truly are a Master of Electrons!");
            canvasConfetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
            setTimeout(() => setGameState('victory'), 2000);
        } else {
            setPlayerHealth(h => Math.max(0, h - 30));
            setDialogue(`Current Power: ${Math.round(power)}W. That's not enough to break my shield!`);
            setFeedback({ type: 'error', msg: `Output: ${Math.round(power)}W. Try a different combination!` });
            setTimeout(() => setFeedback(null), 2500);
        }
    };

    const transitionToPhase = (idx) => {
        setGameState('phaseTransition');
        setDialogue("Impressive... but can you apply that theory to a live circuit?");
        setTimeout(() => {
            setPhaseIdx(idx);
            setGameState('playing');
        }, 3000);
    };

    const calculateStars = () => {
        if (timer < 60) return 3;
        if (timer < 120) return 2;
        return 1;
    };

    const getVictoryFeedback = () => {
        const stars = calculateStars();
        if (stars === 3) return {
            msg: "Hurray 🎉 Woohoo! You are an Electricity Champion!",
            sub: "Professor Electron has been completely demagnetized!"
        };
        if (stars === 2) return {
            msg: "Good job 👍 Try for full score!",
            sub: "You defeated him, but he might return for a rematch!"
        };
        return {
            msg: "Don’t feel bad 😊 Try again!",
            sub: "A narrow victory! Can you do it faster next time?"
        };
    };

    const victoryInfo = getVictoryFeedback();

    if (gameState === 'intro') {
        return (
            <div className="boss-intro-container">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="boss-profile">
                    <div className="boss-avatar">👨‍🔬⚡</div>
                    <h1>PROFESSOR ELECTRON</h1>
                    <p className="boss-quote">"Static thinking won't save you here!"</p>
                    <button onClick={() => setGameState('playing')} className="start-boss-btn">ENTER THE ARENA</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="boss-arena-container">
            <header className="boss-hud">
                <div className="player-stats">
                    <div className="health-bar-container">
                        <label>STUDENT STAMINA</label>
                        <div className="health-bar"><motion.div className="health-fill" animate={{ width: `${playerHealth}%` }} /></div>
                    </div>
                </div>
                <div className="timer-display">⏱️ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
                <div className="boss-stats">
                    <div className="health-bar-container">
                        <label>PROFESSOR'S SHIELD</label>
                        <div className="health-bar boss"><motion.div className="health-fill boss" animate={{ width: `${bossHealth}%` }} /></div>
                    </div>
                </div>
            </header>

            <main className="boss-main">
                <div className="professor-area">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="professor-sprite"
                    >
                        👨‍🔬
                        <div className="electric-aura" />
                    </motion.div>
                    <div className="dialogue-cloud">
                        {dialogue}
                    </div>
                </div>

                <div className="challenge-area">
                    <AnimatePresence mode="wait">
                        {gameState === 'playing' && (
                            <motion.div
                                key={phaseIdx}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="phase-card"
                            >
                                <h2>{currentPhase.title}</h2>
                                <p className="phase-desc">{currentPhase.description}</p>

                                {currentPhase.type === 'theory' ? (
                                    <div className="theory-challenge">
                                        <div className="question-text">{currentPhase.questions[theoryIdx].q}</div>
                                        <div className="options-grid">
                                            {currentPhase.questions[theoryIdx].o.map((opt, i) => (
                                                <button key={i} onClick={() => handleAnswer(i)} className="option-btn">{opt}</button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="sim-challenge">
                                        <div className="task-text">{currentPhase.task}</div>
                                        <div className="circuit-designer">
                                            <div className="source-info">Source: {currentPhase.voltage}V</div>
                                            <div className="components-palette">
                                                {currentPhase.components.map(comp => (
                                                    <button
                                                        key={comp.id}
                                                        onClick={() => toggleComponent(comp)}
                                                        className={`comp-btn ${selectedComponents.find(c => c.id === comp.id) ? 'active' : ''}`}
                                                    >
                                                        {comp.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <button onClick={checkSimulation} className="engage-btn">RESTOR POWER</button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {feedback && (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`boss-feedback ${feedback.type}`}>
                            {feedback.msg}
                        </motion.div>
                    )}
                </div>
            </main>

            <AnimatePresence>
                {gameState === 'victory' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="victory-overlay">
                        <div className="victory-card">
                            <div className="badge-logo">🏅</div>
                            <h1>{victoryInfo.msg}</h1>
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: i < calculateStars() ? 1.2 : 0.5 }}
                                        transition={{ delay: 0.5 + (i * 0.2) }}
                                    >
                                        ⭐
                                    </motion.span>
                                ))}
                            </div>
                            <p>{victoryInfo.sub}</p>
                            <div className="reward-badge">
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="45" fill="#fcd34d" />
                                    <path d="M50 20 L60 80 L30 50 L70 50 L40 80 Z" fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
                                    <text x="50" y="90" textAnchor="middle" fontSize="10" fontWeight="bold">MASTER</text>
                                </svg>
                                <span>Electricity Master Badge Earned!</span>
                            </div>
                            <button onClick={() => navigate('/map')} className="finish-btn">CONFIRM MISSION SUCCESS</button>
                        </div>
                    </motion.div>
                )}

                {playerHealth <= 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="defeat-overlay">
                        <div className="defeat-card">
                            <h1>SHORT CIRCUIT!</h1>
                            <p>Don’t feel bad 😊 Try again! Your knowledge needs recharging!</p>
                            <button onClick={() => window.location.reload()} className="retry-btn">RETRY CHALLENGE</button>
                            <button onClick={() => navigate('/map')} className="quit-btn">RETREAT</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ElectricityBossLevel;
