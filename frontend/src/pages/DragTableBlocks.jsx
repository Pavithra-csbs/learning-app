import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './DragTableBlocks.css';

const ELEMENT_TYPES = {
    metal: { label: '⚙️ Metal', color: '#eab308', bg: 'rgba(234,179,8,0.2)' },
    nonmetal: { label: '💨 Non-metal', color: '#06b6d4', bg: 'rgba(6,182,212,0.2)' },
    metalloid: { label: '◈ Metalloid', color: '#6366f1', bg: 'rgba(99,102,241,0.2)' },
    noble: { label: '💜 Noble Gas', color: '#ec4899', bg: 'rgba(236,72,153,0.2)' },
};

const BLOCKS = [
    { symbol: 'Na', name: 'Sodium', type: 'metal', group: 1, period: 3 },
    { symbol: 'Si', name: 'Silicon', type: 'metalloid', group: 14, period: 3 },
    { symbol: 'Cl', name: 'Chlorine', type: 'nonmetal', group: 17, period: 3 },
    { symbol: 'Ar', name: 'Argon', type: 'noble', group: 18, period: 3 },
    { symbol: 'K', name: 'Potassium', type: 'metal', group: 1, period: 4 },
    { symbol: 'Br', name: 'Bromine', type: 'nonmetal', group: 17, period: 4 },
    { symbol: 'Kr', name: 'Krypton', type: 'noble', group: 18, period: 4 },
    { symbol: 'Ge', name: 'Germanium', type: 'metalloid', group: 14, period: 4 },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const DragTableBlocks = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [pool, setPool] = useState(shuffle(BLOCKS));
    const [slots, setSlots] = useState(BLOCKS.map(b => ({ ...b, filled: null })));
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [correct, setCorrect] = useState(new Set());
    const [gameState, setGameState] = useState('playing');

    const handlePoolClick = (el) => setSelected(el);

    const handleSlotClick = (slotEl) => {
        if (!selected || correct.has(slotEl.symbol)) return;
        if (selected.symbol === slotEl.symbol) {
            setCorrect(prev => new Set([...prev, slotEl.symbol]));
            setPool(prev => prev.filter(e => e.symbol !== selected.symbol));
            setScore(s => s + 10);
            toast.success(`Placed ${selected.name}! 🎯`);
            setSelected(null);
            canvasConfetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
            if (correct.size + 1 >= BLOCKS.length) {
                setTimeout(() => setGameState('done'), 1000);
            }
        } else {
            toast.error(`Wrong slot! ${selected.name} doesn't go here 💡`);
            setSelected(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (cur < 7) localStorage.setItem('completed_levels_Periodic Classification of Elements', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / (BLOCKS.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="dtb-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div>🏆</div>
                <h2>Table Complete!</h2>
                <div className="final-score">{score} / {BLOCKS.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (BLOCKS.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="dtb-container">
            <header className="dtb-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>🧲 Drag Table Blocks</h1>
                <div className="dtb-stats"><span>🏆 {score}</span><span>Placed: {correct.size}/{BLOCKS.length}</span></div>
            </header>

            <div className="dtb-body">
                <p className="instruction">
                    {selected ? `Selected: <strong>${selected.name} (${selected.symbol})</strong> — Click its slot!` : 'Click a block from the pool, then click its slot in the table.'}
                </p>

                <div className="type-legend">
                    {Object.entries(ELEMENT_TYPES).map(([k, v]) => (
                        <div key={k} className="legend-pill" style={{ borderColor: v.color, background: v.bg, color: v.color }}>{v.label}</div>
                    ))}
                </div>

                <div className="table-grid">
                    {slots.map(el => {
                        const placed = correct.has(el.symbol);
                        const typeInfo = ELEMENT_TYPES[el.type];
                        return (
                            <motion.div
                                key={el.symbol}
                                className={`table-slot ${placed ? 'placed' : 'empty'} ${selected?.symbol === el.symbol ? 'hovering' : ''}`}
                                style={{ borderColor: typeInfo.color, background: placed ? typeInfo.bg : 'rgba(255,255,255,0.03)' }}
                                onClick={() => !placed && handleSlotClick(el)}
                                whileHover={!placed ? { scale: 1.05 } : {}}
                            >
                                {placed ? (
                                    <>
                                        <div className="ts-symbol" style={{ color: typeInfo.color }}>{el.symbol}</div>
                                        <div className="ts-name">{el.name}</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="ts-hint">G{el.group} · P{el.period}</div>
                                        <div className="ts-type" style={{ color: typeInfo.color }}>{typeInfo.label}</div>
                                    </>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <div className="pool-area">
                    <h3>🧪 Element Pool:</h3>
                    <div className="pool-blocks">
                        {pool.map(el => {
                            const typeInfo = ELEMENT_TYPES[el.type];
                            return (
                                <motion.button
                                    key={el.symbol}
                                    className={`pool-block ${selected?.symbol === el.symbol ? 'selected' : ''}`}
                                    style={{ borderColor: typeInfo.color, background: selected?.symbol === el.symbol ? typeInfo.bg : 'rgba(255,255,255,0.05)' }}
                                    onClick={() => handlePoolClick(el)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="pb-symbol" style={{ color: typeInfo.color }}>{el.symbol}</div>
                                    <div className="pb-name">{el.name}</div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DragTableBlocks;
