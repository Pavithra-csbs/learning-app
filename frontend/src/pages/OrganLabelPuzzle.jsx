import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './OrganLabelPuzzle.css';

const ORGANS = [
    { id: 'heart', label: 'Heart', icon: '❤️', x: 42, y: 38, system: 'circulatory', fact: 'Pumps blood through double circulation — 100,000 beats per day!' },
    { id: 'lungs', label: 'Lungs', icon: '🫁', x: 35, y: 32, system: 'respiratory', fact: 'Alveoli provide huge surface area (≈70 m²) for gas exchange.' },
    { id: 'stomach', label: 'Stomach', icon: '🫃', x: 42, y: 52, system: 'digestive', fact: 'Produces HCl (pH 2) and pepsin to digest proteins.' },
    { id: 'liver', label: 'Liver', icon: '🟤', x: 50, y: 48, system: 'digestive', fact: 'Largest internal organ — produces bile and detoxifies blood.' },
    { id: 'kidneys', label: 'Kidneys', icon: '🫘', x: 55, y: 55, system: 'excretory', fact: 'Filter 180 L of blood daily; contain ~1 million nephrons each.' },
    { id: 'small-intestine', label: 'Small Intestine', icon: '🌀', x: 42, y: 62, system: 'digestive', fact: '6-7 m long — site of digestion completion and nutrient absorption.' },
    { id: 'large-intestine', label: 'Large Intestine', icon: '🔄', x: 50, y: 65, system: 'digestive', fact: 'Absorbs water and forms faeces for egestion.' },
    { id: 'brain', label: 'Brain', icon: '🧠', x: 42, y: 12, system: 'nervous', fact: 'Controls all body functions — uses 20% of total body energy.' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const OrganLabelPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(shuffle([...ORGANS]));
    const [selected, setSelected] = useState(null);
    const [placed, setPlaced] = useState({});
    const [score, setScore] = useState(0);
    const [showFact, setShowFact] = useState(null);
    const [gameState, setGameState] = useState('playing');

    const handleOrganClick = (organ) => setSelected(organ);

    const handleSlotClick = (slotOrgan) => {
        if (!selected || placed[slotOrgan.id]) return;
        if (selected.id === slotOrgan.id) {
            setPlaced(prev => ({ ...prev, [slotOrgan.id]: true }));
            setPool(prev => prev.filter(o => o.id !== selected.id));
            setScore(s => s + 10);
            setShowFact(slotOrgan);
            setSelected(null);
            canvasConfetti({ particleCount: 40, spread: 50, origin: { y: 0.5 } });
            toast.success(`✅ ${slotOrgan.label} placed!`);
            if (Object.keys(placed).length + 1 >= ORGANS.length) {
                setTimeout(() => setGameState('done'), 2000);
            }
        } else {
            toast.error(`Wrong! Try another organ 💡`);
            setSelected(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 2) localStorage.setItem('completed_levels_Life Processes', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / (ORGANS.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    const systemColors = { circulatory: '#ef4444', respiratory: '#06b6d4', digestive: '#eab308', excretory: '#8b5cf6', nervous: '#f97316' };

    if (gameState === 'done') return (
        <div className="olp-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>🏆</div>
                <h2>Organ Expert!</h2>
                <div className="final-score">{score} / {ORGANS.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (ORGANS.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="olp-container">
            <header className="olp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>🧩 Organ Label Puzzle</h1>
                <div className="olp-stats">🏆 {score} pts | Placed: {Object.keys(placed).length}/{ORGANS.length}</div>
            </header>

            <div className="olp-body">
                <p className="instruction">Click an organ from the list, then click its position on the body diagram!</p>

                <div className="olp-main">
                    <div className="body-diagram">
                        <div className="body-silhouette">
                            <div className="body-outline">🧍</div>
                            {ORGANS.map(organ => (
                                <motion.div
                                    key={organ.id}
                                    className={`organ-slot ${placed[organ.id] ? 'placed' : ''} ${selected?.id === organ.id ? 'targeted' : ''}`}
                                    style={{
                                        left: `${organ.x}%`, top: `${organ.y}%`,
                                        borderColor: systemColors[organ.system],
                                        backgroundColor: placed[organ.id] ? `${systemColors[organ.system]}30` : 'rgba(0,0,0,0.5)'
                                    }}
                                    onClick={() => !placed[organ.id] && handleSlotClick(organ)}
                                    whileHover={!placed[organ.id] && selected ? { scale: 1.2 } : {}}
                                >
                                    {placed[organ.id] ? (
                                        <span title={organ.label}>{organ.icon}</span>
                                    ) : (
                                        <span className="slot-label" style={{ fontSize: '0.55rem', color: systemColors[organ.system] }}>?</span>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="organ-pool">
                        <h3>🫁 Organ Pool</h3>
                        {pool.map(organ => (
                            <motion.button
                                key={organ.id}
                                className={`pool-organ ${selected?.id === organ.id ? 'selected' : ''}`}
                                style={{ borderColor: systemColors[organ.system] }}
                                onClick={() => handleOrganClick(organ)}
                                whileHover={{ scale: 1.04 }}
                            >
                                <span>{organ.icon}</span> {organ.label}
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

export default OrganLabelPuzzle;
