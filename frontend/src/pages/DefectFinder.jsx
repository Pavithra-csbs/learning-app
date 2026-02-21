import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './DefectFinder.css';

const DEFECTS = [
    {
        id: 'myopia',
        name: 'Myopia',
        fullName: 'Myopia (Near-sightedness)',
        symptoms: ['Blurry distance vision', 'Perfect close vision', 'Squinting'],
        description: 'Light rays from distant objects converge IN FRONT of the retina.',
        cause: 'Elongated eyeball or excessive curvature of the lens.',
        visualTest: { type: 'far', image: '🏠', label: 'Distant Object' }
    },
    {
        id: 'hypermetropia',
        name: 'Hypermetropia',
        fullName: 'Hypermetropia (Far-sightedness)',
        symptoms: ['Blurry near vision', 'Distances are clear', 'Eye strain during reading'],
        description: 'Light rays from nearby objects converge BEHIND the retina.',
        cause: 'Eyeball is too short or focal length of the lens is too long.',
        visualTest: { type: 'near', image: '📖', label: 'Close-up Reading' }
    }
];

const DefectFinder = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [stage, setStage] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, clinic, results
    const [selectedId, setSelectedId] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const patient = DEFECTS[stage % DEFECTS.length];

    const handleDiagnose = (id) => {
        setSelectedId(id);
        if (id === patient.id) {
            setScore(prev => prev + 100);
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            setShowExplanation(true);
        } else {
            setScore(prev => Math.max(0, prev - 20));
        }
    };

    const nextPatient = () => {
        if (stage < DEFECTS.length - 1) {
            setStage(prev => prev + 1);
            setSelectedId(null);
            setShowExplanation(false);
        } else {
            setGameState('results');
        }
    };

    return (
        <div className="defect-game-container">
            <header className="defect-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT CLINIC</button>
                <div className="clinic-stats">
                    <div className="score-badge">CLINICAL SCORE: {score}</div>
                </div>
            </header>

            <main className="defect-arena">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="clinic-overlay">
                            <div className="medical-icon">🩺</div>
                            <h1>VISION DIAGNOSTIC LAB</h1>
                            <p>Examine the patient's symptoms and visual acuity to diagnose their condition.</p>
                            <button onClick={() => setGameState('clinic')} className="start-btn">BEGIN EVALUATION</button>
                        </motion.div>
                    )}

                    {gameState === 'results' && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="clinic-overlay victory">
                            <div className="medical-icon">🎓</div>
                            <h1>TOP OPTOMETRIST</h1>
                            <p>All patients have been successfully diagnosed and treated!</p>
                            <div className="final-score">FINAL SCORE: {score}</div>
                            <button onClick={() => navigate('/map')} className="start-btn">CHAPTER COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === 'clinic' && (
                    <div className="clinic-ui">
                        <div className="patient-monitor">
                            <div className="monitor-header">PATIENT SCREENING #{stage + 1}</div>

                            <div className="visual-test-zone">
                                <div className="test-monitor">
                                    <div className="monitor-label">RETINA PROJECTION ({patient.visualTest.label})</div>
                                    <div className="retina-display">
                                        <motion.div
                                            className="retina-content"
                                            animate={{ filter: 'blur(10px)' }}
                                        >
                                            {patient.visualTest.image}
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="ray-diagram-monitor">
                                    <div className="monitor-label">OCULAR RAY TRACING</div>
                                    <svg viewBox="0 0 300 200" className="ray-svg">
                                        <ellipse cx="200" cy="100" rx="80" ry="70" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1" />
                                        <ellipse cx="150" cy="100" rx="10" ry="25" fill="#4cc9f0" opacity="0.4" />

                                        {/* Rays */}
                                        <line x1="20" y1="80" x2="150" y2="80" stroke="white" strokeDasharray="4" />
                                        <line x1="20" y1="120" x2="150" y2="120" stroke="white" strokeDasharray="4" />

                                        {/* Defect Specific Rays */}
                                        {patient.id === 'myopia' ? (
                                            <>
                                                <line x1="150" y1="80" x2="230" y2="100" stroke="#f72585" strokeWidth="2" />
                                                <line x1="150" y1="120" x2="230" y2="100" stroke="#f72585" strokeWidth="2" />
                                                <circle cx="230" cy="100" r="4" fill="#f72585" />
                                                <text x="210" y="150" fill="#f72585" fontSize="10">FOCUS SHORT</text>
                                            </>
                                        ) : (
                                            <>
                                                <line x1="150" y1="80" x2="310" y2="100" stroke="#f72585" strokeWidth="2" />
                                                <line x1="150" y1="120" x2="310" y2="100" stroke="#f72585" strokeWidth="2" />
                                                <circle cx="310" cy="100" r="4" fill="#f72585" />
                                                <text x="210" y="150" fill="#f72585" fontSize="10">FOCUS LONG</text>
                                            </>
                                        )}
                                        <line x1="275" y1="50" x2="275" y2="150" stroke="gray" strokeWidth="4" />
                                        <text x="260" y="40" fill="gray" fontSize="8">RETINA</text>
                                    </svg>
                                </div>
                            </div>

                            <div className="symptoms-panel">
                                <h3>REPORTED SYMPTOMS</h3>
                                <div className="symptom-tags">
                                    {patient.symptoms.map((s, i) => (
                                        <span key={i} className="symptom-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="diagnosis-controls">
                            <h3>SELECT DIAGNOSIS</h3>
                            <div className="diag-buttons">
                                {DEFECTS.map(d => (
                                    <button
                                        key={d.id}
                                        className={`diag-option ${selectedId === d.id ? (d.id === patient.id ? 'correct' : 'wrong') : ''}`}
                                        onClick={() => handleDiagnose(d.id)}
                                        disabled={showExplanation}
                                    >
                                        {d.fullName}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence>
                                {showExplanation && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="explanation-box">
                                        <h4>MEDICAL INSIGHT</h4>
                                        <p><strong>Definition:</strong> {patient.description}</p>
                                        <p><strong>Biological Cause:</strong> {patient.cause}</p>
                                        <button onClick={nextPatient} className="next-btn">NEXT PATIENT ➡️</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DefectFinder;
