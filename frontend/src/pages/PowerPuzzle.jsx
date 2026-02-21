import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './PowerPuzzle.css';

const MISSIONS = [
    {
        id: 1,
        mission: "Calculate the power consumed by a bulb with 12V and 2A current.",
        given: { V: 12, I: 2 },
        target: 'P',
        formula: 'P = V × I',
        answer: 24,
        unit: 'W',
        explanation: "P = 12V × 2A = 24W"
    },
    {
        id: 2,
        mission: "A heater has a resistance of 10Ω and carries a current of 3A. What is the power?",
        given: { R: 10, I: 3 },
        target: 'P',
        formula: 'P = I²R',
        answer: 90,
        unit: 'W',
        explanation: "P = (3A)² × 10Ω = 9 × 10 = 90W"
    },
    {
        id: 3,
        mission: "Find the power of a motor connected to 220V with a resistance of 44Ω.",
        given: { V: 220, R: 44 },
        target: 'P',
        formula: 'P = V² / R',
        answer: 1100,
        unit: 'W',
        explanation: "P = (220V)² / 44Ω = 48400 / 44 = 1100W"
    },
    {
        id: 4,
        mission: "An appliance consumes 1000W at 250V. Calculate the current it draws.",
        given: { P: 1000, V: 250 },
        target: 'I',
        formula: 'I = P / V',
        answer: 4,
        unit: 'A',
        explanation: "I = 1000W / 250V = 4A"
    },
    {
        id: 5,
        mission: "A 60W bulb is connected to a 12V supply. Find its resistance.",
        given: { P: 60, V: 12 },
        target: 'R',
        formula: 'R = V² / P',
        answer: 2.4,
        unit: 'Ω',
        explanation: "R = (12V)² / 60W = 144 / 60 = 2.4Ω"
    }
];

const PowerPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [calcValue, setCalcValue] = useState('');

    const mission = MISSIONS[currentMissionIdx];

    const handleCheck = () => {
        const val = parseFloat(userInput);
        if (Math.abs(val - mission.answer) < 0.1) {
            setFeedback({ type: 'success', message: `CORRECT! ${mission.explanation}` });
            canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

            setTimeout(() => {
                if (currentMissionIdx < MISSIONS.length - 1) {
                    setCurrentMissionIdx(prev => prev + 1);
                    setUserInput('');
                    setFeedback(null);
                } else {
                    setGameState('finished');
                }
            }, 3000);
        } else {
            setFeedback({ type: 'error', message: "That's not quite right. Check your calculation!" });
            setTimeout(() => setFeedback(null), 2000);
        }
    };

    const addToCalc = (val) => {
        if (val === 'C') setCalcValue('');
        else if (val === '=') {
            try {
                // eslint-disable-next-line no-eval
                setCalcValue(eval(calcValue).toString());
            } catch {
                setCalcValue('Error');
            }
        } else {
            setCalcValue(prev => prev + val);
        }
    };

    return (
        <div className="power-puzzle-container">
            <header className="puzzle-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="formula-bar">
                    <span className="formula">P = V × I</span>
                    <span className="divider">|</span>
                    <span className="formula">P = I²R</span>
                    <span className="divider">|</span>
                    <span className="formula">P = V² / R</span>
                </div>
                <div className="progress">MISSION {currentMissionIdx + 1}/{MISSIONS.length}</div>
            </header>

            <main className="puzzle-arena">
                <div className="mission-control">
                    <motion.div
                        key={currentMissionIdx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mission-card"
                    >
                        <h3>MISSION BRIEFING</h3>
                        <p className="mission-text">{mission.mission}</p>

                        <div className="given-data">
                            {Object.entries(mission.given).map(([key, val]) => (
                                <div key={key} className="data-pill">
                                    <span className="key">{key}</span>
                                    <span className="val">{val}{key === 'V' ? 'V' : key === 'I' ? 'A' : key === 'R' ? 'Ω' : 'W'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="input-zone">
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder="Enter calculated value"
                                    className="power-input"
                                />
                                <span className="unit-label">{mission.unit}</span>
                            </div>
                            <button onClick={handleCheck} className="check-btn">ENGAGE POWER</button>
                        </div>

                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`feedback-msg ${feedback.type}`}
                                >
                                    {feedback.message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <div className="utility-calculator">
                        <div className="calc-display">{calcValue || '0'}</div>
                        <div className="calc-grid">
                            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+', '='].map(btn => (
                                <button key={btn} onClick={() => addToCalc(btn)} className={`calc-btn ${btn === '=' ? 'equal' : ''}`}>
                                    {btn === '*' ? '×' : btn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="visual-feedback-area">
                    <div className="circuit-schematic">
                        <svg viewBox="0 0 400 300" className="power-svg">
                            <rect x="50" y="50" width="300" height="200" fill="none" stroke="#1e293b" strokeWidth="4" rx="20" />
                            {/* Energy Glow based on target power */}
                            <motion.circle
                                cx="200" cy="50" r="40"
                                fill="url(#energyGrad)"
                                animate={{
                                    scale: feedback?.type === 'success' ? [1, 1.5, 1.2] : 1,
                                    opacity: feedback?.type === 'success' ? [0.3, 0.8, 0.5] : 0.2
                                }}
                            />
                            <defs>
                                <radialGradient id="energyGrad">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>
                            {/* Component Icons */}
                            <text x="185" y="55" fontSize="24">💡</text>
                            <text x="40" y="160" fontSize="20" transform="rotate(-90, 40, 160)">🔋</text>
                            <rect x="340" y="130" width="20" height="40" fill="#334155" rx="4" />
                            <text x="350" y="155" textAnchor="middle" fill="white" fontSize="10">Res</text>
                        </svg>
                    </div>
                    <div className="power-tips">
                        <div className="tip">💡 Joule's Law of Heating ($H = I^2Rt$) is related to Power ($P = I^2R$).</div>
                        <div className="tip">⚡ Power is the rate at which electrical energy is consumed.</div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {gameState === 'finished' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="finish-overlay">
                        <div className="victory-modal">
                            <div className="star-burst">🎉</div>
                            <h1>Hurray 🎉 Woohoo!</h1>
                            <p className="champion-msg">You are an Electricity Champion!</p>
                            <div className="stars-row">
                                ⭐⭐⭐
                            </div>
                            <p>Calculating wattage and efficiency is now second nature to you. You've powered up the entire district!</p>
                            <div className="result-stats">
                                <span>MISSIONS: 5/5</span>
                                <span>TOTAL XP: +400</span>
                            </div>
                            <button onClick={() => navigate('/map')} className="done-btn">FINISH CHAPTER</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PowerPuzzle;
