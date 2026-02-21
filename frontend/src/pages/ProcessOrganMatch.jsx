import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ProcessOrganMatch.css';

const PROCESSES = [
    { id: 'digestion', label: '🍎 Digestion', color: '#f59e0b' },
    { id: 'respiration', label: '🫁 Respiration', color: '#06b6d4' },
    { id: 'transportation', label: '❤️ Transportation', color: '#ef4444' },
    { id: 'excretion', label: '🚽 Excretion', color: '#8b5cf6' },
];

const ORGANS = [
    { id: 'stomach', label: 'Stomach', process: 'digestion', icon: '🫃', fact: 'Produces HCl and pepsin to break down proteins' },
    { id: 'small-intestine-m', label: 'Small Intestine', process: 'digestion', icon: '🌀', fact: 'Absorbs nutrients via villi' },
    { id: 'alveoli', label: 'Alveoli (Lungs)', process: 'respiration', icon: '🫁', fact: 'Gas exchange: O₂ in, CO₂ out' },
    { id: 'trachea', label: 'Trachea', process: 'respiration', icon: '💨', fact: 'Windpipe carrying air to bronchi' },
    { id: 'heart-m', label: 'Heart', process: 'transportation', icon: '❤️', fact: 'Pumps blood through double circulation' },
    { id: 'arteries-m', label: 'Arteries', process: 'transportation', icon: '🩸', fact: 'Carry oxygenated blood from heart' },
    { id: 'kidneys-m', label: 'Kidneys', process: 'excretion', icon: '🫘', fact: 'Filter blood and produce urine' },
    { id: 'skin-m', label: 'Skin', process: 'excretion', icon: '👋', fact: 'Excretes sweat: water + salts + urea' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const ProcessOrganMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [organs] = useState(shuffle(ORGANS));
    const [matched, setMatched] = useState({});
    const [selectedOrgan, setSelectedOrgan] = useState(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleOrganClick = (organ) => {
        if (matched[organ.id]) return;
        setSelectedOrgan(organ);
    };

    const handleProcessClick = (process) => {
        if (!selectedOrgan) { toast('Select an organ first! 👈', { icon: '💡' }); return; }
        const correct = selectedOrgan.process === process.id;
        if (correct) {
            setMatched(prev => ({ ...prev, [selectedOrgan.id]: process.id }));
            setScore(s => s + 10);
            toast.success(`✅ ${selectedOrgan.label} → ${process.label.replace(/^./, '')}!`);
            canvasConfetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            setSelectedOrgan(null);
            if (Object.keys(matched).length + 1 >= ORGANS.length) setTimeout(() => setGameState('done'), 1000);
        } else {
            toast.error(`Wrong! ${selectedOrgan.label} is not part of ${process.label.replace(/^./, '')} 💡`);
            setSelectedOrgan(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 7) localStorage.setItem('completed_levels_Life Processes', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / (ORGANS.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    if (gameState === 'done') return (
        <div className="pom-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>🔄</div>
                <h2>Process Master!</h2>
                <div className="final-score">{score} / {ORGANS.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (ORGANS.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    const processColors = Object.fromEntries(PROCESSES.map(p => [p.id, p.color]));

    return (
        <div className="pom-container">
            <header className="pom-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>🔄 Process-Organ Match</h1>
                <div className="pom-stats">🏆 {score} | {Object.keys(matched).length}/{ORGANS.length} matched</div>
            </header>
            <div className="pom-body">
                <p className="instruction">Select an <strong>organ</strong>, then click its <strong>life process</strong>!</p>
                <div className="pom-arena">
                    <div className="organs-grid">
                        <h3>🫀 Organs</h3>
                        {organs.map(organ => {
                            const isMatched = matched[organ.id];
                            const processColor = isMatched ? processColors[organ.process] : '#64748b';
                            return (
                                <motion.button key={organ.id}
                                    className={`organ-btn ${selectedOrgan?.id === organ.id ? 'selected' : ''} ${isMatched ? 'matched' : ''}`}
                                    style={{ borderColor: isMatched ? processColor : 'rgba(255,255,255,0.15)', background: isMatched ? `${processColor}20` : 'rgba(255,255,255,0.04)' }}
                                    onClick={() => !isMatched && handleOrganClick(organ)}
                                    whileHover={{ scale: isMatched ? 1 : 1.04 }}
                                >
                                    <span className="o-icon">{organ.icon}</span>
                                    <span className="o-label">{organ.label}</span>
                                    {isMatched && <span className="o-check">✅</span>}
                                </motion.button>
                            );
                        })}
                    </div>
                    <div className="arrow-divider">→</div>
                    <div className="processes-col">
                        <h3>⚙️ Life Processes</h3>
                        {PROCESSES.map(proc => (
                            <motion.button key={proc.id}
                                className="process-btn"
                                style={{ borderColor: proc.color, background: `${proc.color}15`, color: proc.color }}
                                onClick={() => handleProcessClick(proc)}
                                whileHover={{ scale: 1.05, background: `${proc.color}30` }}
                            >
                                {proc.label}
                                <span className="match-count">
                                    {Object.values(matched).filter(v => v === proc.id).length}/{ORGANS.filter(o => o.process === proc.id).length} ✓
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
                {selectedOrgan && (
                    <div className="selected-banner">Selected: <strong>{selectedOrgan.icon} {selectedOrgan.label}</strong> → click its process!</div>
                )}
            </div>
        </div>
    );
};

export default ProcessOrganMatch;
