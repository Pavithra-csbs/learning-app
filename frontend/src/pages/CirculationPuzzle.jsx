import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './CirculationPuzzle.css';

const CIRCULATORY_PARTS = [
    { id: 'right-atrium', label: 'Right Atrium', icon: '🔵', pos: { top: '25%', left: '30%' }, fact: 'Receives deoxygenated blood from the vena cava (body)', color: '#3b82f6' },
    { id: 'right-ventricle', label: 'Right Ventricle', icon: '🔵', pos: { top: '55%', left: '30%' }, fact: 'Pumps deoxygenated blood to the lungs via pulmonary artery', color: '#2563eb' },
    { id: 'left-atrium', label: 'Left Atrium', icon: '🔴', pos: { top: '25%', right: '30%' }, fact: 'Receives oxygenated blood from the lungs via pulmonary vein', color: '#ef4444' },
    { id: 'left-ventricle', label: 'Left Ventricle', icon: '🔴', pos: { top: '55%', right: '30%' }, fact: 'Pumps oxygenated blood to the body via aorta — thickest walls!', color: '#dc2626' },
    { id: 'aorta', label: 'Aorta', icon: '🩸', pos: { top: '40%', right: '18%' }, fact: 'Largest artery — carries oxygenated blood from left ventricle to body', color: '#f97316' },
    { id: 'pulmonary-artery', label: 'Pulmonary Artery', icon: '🫀', pos: { top: '40%', left: '18%' }, fact: 'Only artery carrying deoxygenated blood — to lungs for oxygenation', color: '#6366f1' },
    { id: 'vena-cava', label: 'Vena Cava', icon: '🔩', pos: { top: '10%', left: '46%' }, fact: 'Largest veins — return deoxygenated blood from body to right atrium', color: '#64748b' },
    { id: 'capillaries', label: 'Capillaries', icon: '🔬', pos: { top: '75%', left: '44%' }, fact: 'Microscopic vessels — site of actual O₂/CO₂ and nutrient exchange', color: '#8b5cf6' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const CirculationPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(shuffle([...CIRCULATORY_PARTS]));
    const [placed, setPlaced] = useState({});
    const [selected, setSelected] = useState(null);
    const [showFact, setShowFact] = useState(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handlePoolClick = (part) => setSelected(part);

    const handleSlotClick = (part) => {
        if (!selected || placed[part.id]) return;
        if (selected.id === part.id) {
            setPlaced(prev => ({ ...prev, [part.id]: true }));
            setPool(prev => prev.filter(p => p.id !== selected.id));
            setScore(s => s + 10);
            setShowFact(part);
            setSelected(null);
            canvasConfetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
            toast.success(`❤️ ${part.label} placed!`);
            if (Object.keys(placed).length + 1 >= CIRCULATORY_PARTS.length) setTimeout(() => setGameState('done'), 1500);
        } else {
            toast.error('Wrong slot! Try again 💡');
            setSelected(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 5) localStorage.setItem('completed_levels_Life Processes', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / (CIRCULATORY_PARTS.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    if (gameState === 'done') return (
        <div className="cp-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>❤️</div>
                <h2>Circulation Mastered!</h2>
                <div className="final-score">{score} / {CIRCULATORY_PARTS.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (CIRCULATORY_PARTS.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="cp-container">
            <header className="cp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>❤️ Circulation Puzzle</h1>
                <div className="cp-stats">🏆 {score} pts | {Object.keys(placed).length}/{CIRCULATORY_PARTS.length} placed</div>
            </header>

            <div className="cp-body">
                <p className="instruction">Select a part from the pool, then click its slot on the heart diagram!</p>

                <div className="cp-main">
                    <div className="heart-diagram">
                        <div className="heart-bg">❤️</div>
                        {CIRCULATORY_PARTS.map(part => (
                            <motion.div
                                key={part.id}
                                className={`heart-slot ${placed[part.id] ? 'placed' : ''} ${selected?.id === part.id ? 'targeted' : ''}`}
                                style={{ ...part.pos, borderColor: part.color, background: placed[part.id] ? `${part.color}30` : 'rgba(0,0,0,0.6)' }}
                                onClick={() => handleSlotClick(part)}
                                whileHover={!placed[part.id] && selected ? { scale: 1.18 } : {}}
                            >
                                <span style={{ fontSize: placed[part.id] ? '1.2rem' : '0.6rem', color: part.color }}>
                                    {placed[part.id] ? part.icon : '?'}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="cp-pool">
                        <h3>🫀 Parts Pool:</h3>
                        {pool.map(part => (
                            <motion.button
                                key={part.id}
                                className={`cp-part-btn ${selected?.id === part.id ? 'selected' : ''}`}
                                style={{ borderColor: part.color, background: selected?.id === part.id ? `${part.color}30` : 'rgba(255,255,255,0.04)' }}
                                onClick={() => handlePoolClick(part)}
                                whileHover={{ scale: 1.04 }}
                            >
                                <span>{part.icon}</span>
                                <div>
                                    <div className="part-label" style={{ color: part.color }}>{part.label}</div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {showFact && (
                        <motion.div className="fact-popup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <span>{showFact.icon} <strong>{showFact.label}:</strong> {showFact.fact}</span>
                            <button onClick={() => setShowFact(null)}>✕</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CirculationPuzzle;
