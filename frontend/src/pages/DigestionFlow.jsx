import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './DigestionFlow.css';

const CORRECT_ORDER = [
    { id: 1, step: '👄 Mouth', detail: 'Mechanical chewing + saliva (amylase breaks starch)', color: '#f59e0b' },
    { id: 2, step: '🗣️ Oesophagus', detail: 'Peristalsis moves food down (no digestion here)', color: '#f97316' },
    { id: 3, step: '🫃 Stomach', detail: 'HCl (pH 2) + Pepsin breaks proteins; churns food into chyme', color: '#ef4444' },
    { id: 4, step: '🟤 Liver / Pancreas', detail: 'Bile (emulsifies fats) + Pancreatic juice (enzymes for all)', color: '#8b5cf6' },
    { id: 5, step: '🌀 Small Intestine', detail: 'Final digestion + absorption of glucose, amino acids, fatty acids via villi', color: '#06b6d4' },
    { id: 6, step: '🔄 Large Intestine', detail: 'Water absorbed; undigested matter forms faeces', color: '#16a34a' },
    { id: 7, step: '🚽 Anus', detail: 'Egestion — removal of undigested waste from body', color: '#64748b' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const DigestionFlow = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(shuffle([...CORRECT_ORDER]));
    const [arranged, setArranged] = useState([]);
    const [selected, setSelected] = useState(null);
    const [checked, setChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handlePoolClick = (step) => setSelected(step);

    const handleAddToArranged = () => {
        if (!selected) return;
        setArranged(prev => [...prev, selected]);
        setPool(prev => prev.filter(s => s.id !== selected.id));
        setSelected(null);
    };

    const handleRemoveFromArranged = (step) => {
        setArranged(prev => prev.filter(s => s.id !== step.id));
        setPool(prev => shuffle([...prev, step]));
    };

    const handleCheck = () => {
        let correct = 0;
        arranged.forEach((step, i) => {
            if (step.id === CORRECT_ORDER[i]?.id) correct++;
        });
        setChecked(true);
        const pts = arranged.length === CORRECT_ORDER.length ? Math.round((correct / CORRECT_ORDER.length) * 70) : 0;
        setScore(pts);
        if (correct === CORRECT_ORDER.length) {
            canvasConfetti({ particleCount: 200, spread: 100 });
            toast.success('Perfect digestion flow! 🎉');
        } else {
            toast(`${correct}/${CORRECT_ORDER.length} steps correct! 💡`, { icon: '🍎' });
        }
        setTimeout(() => setGameState('done'), 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 3) localStorage.setItem('completed_levels_Life Processes', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / 70;
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    if (gameState === 'done') return (
        <div className="df-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>🍎</div>
                <h2>Digestion Complete!</h2>
                <div className="final-score">{score} / 70 pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / 70 * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="df-container">
            <header className="df-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>🍎 Digestion Flow Game</h1>
                <div className="df-stats">Placed: {arranged.length}/{CORRECT_ORDER.length}</div>
            </header>

            <div className="df-body">
                <p className="instruction">Arrange the <strong>digestion steps</strong> in the correct order by clicking steps from the pool below!</p>

                <div className="flow-canvas">
                    <div className="flow-slots">
                        {CORRECT_ORDER.map((_, i) => {
                            const filled = arranged[i];
                            const isCorrect = checked && filled && filled.id === CORRECT_ORDER[i].id;
                            const isWrong = checked && filled && filled.id !== CORRECT_ORDER[i].id;
                            return (
                                <div key={i} className="flow-slot-row">
                                    <div className={`flow-slot ${filled ? 'filled' : 'empty'} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                        style={filled ? { borderColor: filled.color, background: `${filled.color}20` } : {}}>
                                        <div className="slot-num">{i + 1}</div>
                                        {filled ? (
                                            <div className="slot-content">
                                                <div className="slot-step" style={{ color: filled.color }}>{filled.step}</div>
                                                <div className="slot-detail">{filled.detail}</div>
                                            </div>
                                        ) : (
                                            <div className="slot-placeholder">Click pool below → then Add Step</div>
                                        )}
                                        {filled && !checked && <button className="remove-btn" onClick={() => handleRemoveFromArranged(filled)}>✕</button>}
                                    </div>
                                    {i < CORRECT_ORDER.length - 1 && <div className="flow-connector">↓</div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pool-section">
                    <h3>🔬 Step Pool:</h3>
                    <div className="pool-steps">
                        {pool.map(step => (
                            <motion.button
                                key={step.id}
                                className={`pool-step ${selected?.id === step.id ? 'selected' : ''}`}
                                style={{ borderColor: step.color }}
                                onClick={() => handlePoolClick(step)}
                                whileHover={{ scale: 1.04 }}
                            >
                                {step.step}
                            </motion.button>
                        ))}
                    </div>
                    <div className="df-actions">
                        {selected && <motion.button className="add-btn" onClick={handleAddToArranged} whileHover={{ scale: 1.05 }}>Add "{selected.step}" →</motion.button>}
                        {arranged.length === CORRECT_ORDER.length && !checked && (
                            <motion.button className="check-btn" onClick={handleCheck} whileHover={{ scale: 1.05 }}>✅ Check Order!</motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigestionFlow;
