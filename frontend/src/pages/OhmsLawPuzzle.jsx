import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './OhmsLawPuzzle.css';

const CHALLENGES = [
    {
        id: 1,
        mission: "Calculate the current (I) flowing through the resistor.",
        given: { V: 10, R: 5 },
        target: 'I',
        targetValue: 2,
        hint: "Ohm's Law: I = V / R"
    },
    {
        id: 2,
        mission: "The circuit needs a Voltage (V) to push 3A through 4Ω.",
        given: { I: 3, R: 4 },
        target: 'V',
        targetValue: 12,
        hint: "Ohm's Law: V = I × R"
    },
    {
        id: 3,
        mission: "Find the Resistance (R) if 6V produces 0.5A of current.",
        given: { V: 6, I: 0.5 },
        target: 'R',
        targetValue: 12,
        hint: "Ohm's Law: R = V / I"
    }
];

const OhmsLawPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, success
    const [values, setValues] = useState({ V: 5, I: 1, R: 5 });
    const [feedback, setFeedback] = useState(null);

    const challenge = CHALLENGES[currentStep];

    // Reset values when challenge changes
    useEffect(() => {
        if (challenge) {
            const initialValues = { ...challenge.given };
            // Set a default for the target value that isn't the correct answer
            initialValues[challenge.target] = challenge.targetValue / 2;
            setValues(initialValues);
            setFeedback(null);
        }
    }, [currentStep, challenge]);

    const handleValueChange = (key, val) => {
        setValues(prev => ({ ...prev, [key]: parseFloat(val) }));
    };

    const checkAnswer = () => {
        const userVal = values[challenge.target];
        const isCorrect = Math.abs(userVal - challenge.targetValue) < 0.1;

        if (isCorrect) {
            let explanationStr = "";
            if (challenge.target === 'I') explanationStr = `Correct! I = V / R = ${values.V}V / ${values.R}Ω = ${challenge.targetValue}A.`;
            else if (challenge.target === 'V') explanationStr = `Correct! V = I × R = ${values.I}A × ${values.R}Ω = ${challenge.targetValue}V.`;
            else if (challenge.target === 'R') explanationStr = `Correct! R = V / I = ${values.V}V / ${values.I}A = ${challenge.targetValue}Ω.`;

            setFeedback({ type: 'success', message: `EXACT! ${explanationStr}` });
            setTimeout(() => {
                if (currentStep < CHALLENGES.length - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    setGameState('success');
                    canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
                }
            }, 3000);
        } else {
            setFeedback({ type: 'error', message: 'NOT QUITE! Check the formula triangle above.' });
        }
    };

    return (
        <div className="ohms-puzzle-container">
            <header className="puzzle-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ MAP</button>
                <div className="formula-display">
                    <span className={challenge.target === 'V' ? 'target' : ''}>V</span> =
                    <span className={challenge.target === 'I' ? 'target' : ''}> I</span> ×
                    <span className={challenge.target === 'R' ? 'target' : ''}> R</span>
                </div>
                <div className="step-counter">MISSION {currentStep + 1}/{CHALLENGES.length}</div>
            </header>

            <main className="puzzle-arena">
                <div className="simulation-board">
                    <div className="visual-split">
                        <div className="physics-diagram">
                            <svg viewBox="0 0 400 200" className="circuit-svg">
                                {/* Circuit Loop */}
                                <rect x="50" y="50" width="300" height="100" fill="none" stroke="#64748b" strokeWidth="4" rx="10" />

                                {/* Battery (V) */}
                                <g transform="translate(50, 100) rotate(90)">
                                    <line x1="-15" y1="0" x2="15" y2="0" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                                    <line x1="-8" y1="8" x2="8" y2="8" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
                                    <text x="25" y="5" fill="#fbbf24" fontSize="14" fontWeight="bold" className="val-text">{values.V}V</text>
                                </g>

                                {/* Resistor (R) */}
                                <path d="M 350 75 l 0 10 l -10 5 l 20 10 l -20 10 l 20 10 l -10 5 l 0 10" fill="none" stroke="#f87171" strokeWidth="3" />
                                <text x="365" y="105" fill="#f87171" fontSize="14" fontWeight="bold" className="val-text">{values.R}Ω</text>

                                {/* Current Animation (I) */}
                                <motion.circle
                                    r="5"
                                    fill="#38bdf8"
                                    animate={{
                                        cx: [50, 350, 350, 50, 50],
                                        cy: [50, 50, 150, 150, 50]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: Math.max(0.3, 3 / (values.I || 0.1)),
                                        ease: "linear"
                                    }}
                                    style={{ filter: "drop-shadow(0 0 5px #38bdf8)" }}
                                />
                                <text x="180" y="40" fill="#38bdf8" fontSize="16" fontWeight="bold" className="val-text">I = {values.I}A</text>
                            </svg>
                        </div>

                        <div className="formula-triangle-container">
                            <svg viewBox="0 0 120 100" className="formula-triangle">
                                <path d="M 60 5 L 115 95 L 5 95 Z" fill="none" stroke="#334155" strokeWidth="2" />
                                <line x1="15" y1="55" x2="105" y2="55" stroke="#334155" strokeWidth="2" />
                                <line x1="60" y1="55" x2="60" y2="95" stroke="#334155" strokeWidth="2" />

                                <text x="60" y="38" textAnchor="middle" fill={challenge.target === 'V' ? '#fbbf24' : '#94a3b8'} fontWeight="900" fontSize="20" className={challenge.target === 'V' ? 'glow-target' : ''}>V</text>
                                <text x="35" y="82" textAnchor="middle" fill={challenge.target === 'I' ? '#38bdf8' : '#94a3b8'} fontWeight="900" fontSize="18" className={challenge.target === 'I' ? 'glow-target' : ''}>I</text>
                                <text x="85" y="82" textAnchor="middle" fill={challenge.target === 'R' ? '#f87171' : '#94a3b8'} fontWeight="900" fontSize="18" className={challenge.target === 'R' ? 'glow-target' : ''}>R</text>
                            </svg>
                            <div className="triangle-label">TRIANGLE METHOD</div>
                        </div>
                    </div>

                    <div className="mission-card">
                        <h3>OBJECTIVE</h3>
                        <p>{challenge.mission}</p>
                        <div className="hint-text">💡 {challenge.hint}</div>
                    </div>
                </div>

                <div className="controls-board">
                    <div className="stat-sliders">
                        <div className={`slider-group ${challenge.target === 'V' ? 'is-target' : ''}`}>
                            <div className="slider-header">
                                <label>VOLTAGE (V)</label>
                                <span className="value-badge voltage">{values.V}V</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="24" step="0.5"
                                value={values.V}
                                onChange={(e) => handleValueChange('V', e.target.value)}
                                disabled={challenge.target !== 'V' && challenge.given.V !== undefined}
                            />
                        </div>

                        <div className={`slider-group ${challenge.target === 'I' ? 'is-target' : ''}`}>
                            <div className="slider-header">
                                <label>CURRENT (I)</label>
                                <span className="value-badge current">{values.I}A</span>
                            </div>
                            <input
                                type="range"
                                min="0.1" max="10" step="0.1"
                                value={values.I}
                                onChange={(e) => handleValueChange('I', e.target.value)}
                                disabled={challenge.target !== 'I' && challenge.given.I !== undefined}
                            />
                        </div>

                        <div className={`slider-group ${challenge.target === 'R' ? 'is-target' : ''}`}>
                            <div className="slider-header">
                                <label>RESISTANCE (R)</label>
                                <span className="value-badge resistance">{values.R}Ω</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="50" step="1"
                                value={values.R}
                                onChange={(e) => handleValueChange('R', e.target.value)}
                                disabled={challenge.target !== 'R' && challenge.given.R !== undefined}
                            />
                        </div>
                    </div>

                    <div className="action-zone">
                        <motion.button
                            className="check-btn"
                            onClick={checkAnswer}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            VERIFY CALCULATION ⚡
                        </motion.button>
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`feedback-msg ${feedback.type}`}
                                >
                                    <div className="f-icon">
                                        {feedback.type === 'success' ? '✅' : '❌'}
                                    </div>
                                    <div className="f-text">{feedback.message}</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-overlay">
                            <div className="success-card">
                                <div className="trophy">🏆</div>
                                <h1>OHM MASTER!</h1>
                                <p>You have a deep understanding of electrical proportions. Ohm's Law is now your second nature.</p>
                                <div className="final-stats">
                                    <div className="f-stat">COMPLETED: 3/3</div>
                                    <div className="f-stat">XP EARNED: 150</div>
                                </div>
                                <button onClick={() => navigate('/map')} className="finish-btn">BACK TO CHAPTER MAP</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default OhmsLawPuzzle;
