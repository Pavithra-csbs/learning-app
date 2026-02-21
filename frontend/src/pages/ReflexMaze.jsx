import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReflexMaze.css';

const STEPS = [
    { id: 1, label: 'Receptor (Skin)', desc: 'Detects the stimulus (heat/pain)' },
    { id: 2, label: 'Sensory Neuron', desc: 'Carries signal to spinal cord' },
    { id: 3, label: 'Relay Neuron (Spinal Cord)', desc: 'Processes signal instantly' },
    { id: 4, label: 'Motor Neuron', desc: 'Carries command to muscle' },
    { id: 5, label: 'Effector (Muscle)', desc: 'Contract muscle to pull away' }
];

const ReflexMaze = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing | done
    const [timer, setTimer] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
        return () => clearInterval(timerRef.current);
    }, []);

    const handleStepClick = (idx) => {
        if (idx === currentStep) {
            setScore(s => s + 20);
            if (currentStep < STEPS.length - 1) {
                setCurrentStep(c => c + 1);
                toast.success(`Success! ${STEPS[idx].label} activated!`);
            } else {
                clearInterval(timerRef.current);
                canvasConfetti({ particleCount: 100, spread: 70 });
                setGameState('done');
            }
        } else if (idx > currentStep) {
            toast.error('Wrong sequence! Follow the reflex arc path.');
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '2');
        if (cur < 3) localStorage.setItem('completed_levels_Control and Coordination', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        const stars = timer < 15 ? 3 : timer < 30 ? 2 : 1;
        return (
            <div className="rm-container done">
                <motion.div className="rm-result-card" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h2>Reflex Mastered! ⚡</h2>
                    <div className="rm-stars">{'⭐'.repeat(stars)}</div>
                    <p>Time Taken: {timer}s</p>
                    <p className="rm-motto">{stars === 3 ? "Hurray 🎉 You are a Brain Power Champion!" : "Good job 👍 Try for full score!"}</p>
                    <button className="rm-btn" onClick={handleComplete}>Continue Level 3 →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="rm-container">
            <header className="rm-header">
                <button className="rm-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>⚡ Reflex Path Maze</h1>
                <div className="rm-stats">
                    <span>⏱️ {timer}s</span>
                    <span>⭐ {score}</span>
                </div>
            </header>

            <main className="rm-main">
                <div className="rm-theory">
                    <h3>Reflex Arc Sequence:</h3>
                    <ul>
                        {STEPS.map((s, i) => (
                            <li key={s.id} className={i <= currentStep ? 'active' : ''}>
                                {i < currentStep ? '✅ ' : i === currentStep ? '➡️ ' : '🔘 '}
                                {s.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="rm-maze-grid">
                    <div className="maze-path">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="maze-connector">
                                <motion.button
                                    className={`maze-node ${idx === currentStep ? 'current' : ''} ${idx < currentStep ? 'done' : ''}`}
                                    onClick={() => handleStepClick(idx)}
                                    whileHover={idx === currentStep ? { scale: 1.1 } : {}}
                                    animate={idx === currentStep ? { boxShadow: "0 0 20px rgba(255, 255, 0, 0.5)" } : {}}
                                >
                                    {idx + 1}
                                </motion.button>
                                <div className="node-content">
                                    <h4>{step.label}</h4>
                                    <p>{step.desc}</p>
                                </div>
                                {idx < STEPS.length - 1 && <div className={`maze-line ${idx < currentStep ? 'active' : ''}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReflexMaze;
