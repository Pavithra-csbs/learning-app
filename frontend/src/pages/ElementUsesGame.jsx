import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ElementUsesGame.css';

const USES_DATA = [
    { symbol: 'Au', name: 'Gold', use: 'Jewellery & Electronics', icon: '💍', hint: 'Does not tarnish, highly malleable' },
    { symbol: 'Si', name: 'Silicon', use: 'Computer Chips & Solar Cells', icon: '💻', hint: 'Semiconductor metalloid' },
    { symbol: 'Fe', name: 'Iron', use: 'Steel Construction', icon: '🏗️', hint: 'Most widely used metal, strong and abundant' },
    { symbol: 'Cu', name: 'Copper', use: 'Electrical Wiring', icon: '⚡', hint: 'Excellent conductor of electricity' },
    { symbol: 'Al', name: 'Aluminium', use: 'Aircraft & Packaging Foil', icon: '✈️', hint: 'Lightweight and corrosion-resistant' },
    { symbol: 'Ag', name: 'Silver', use: 'Photography & Mirrors', icon: '📷', hint: 'Best reflector of visible light' },
    { symbol: 'Cl', name: 'Chlorine', use: 'Water Purification', icon: '💧', hint: 'Kills bacteria and pathogens' },
    { symbol: 'I', name: 'Iodine', use: 'Thyroid Medicine (Antiseptic)', icon: '💊', hint: 'Essential trace element for thyroid' },
    { symbol: 'He', name: 'Helium', use: 'Balloons & MRI Machines', icon: '🎈', hint: 'Lightest noble gas, non-flammable' },
    { symbol: 'Li', name: 'Lithium', use: 'Rechargeable Batteries', icon: '🔋', hint: 'Lightest metal, high charge density' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const ElementUsesGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [pairs] = useState(shuffle(USES_DATA).slice(0, 6));
    const [selectedEl, setSelectedEl] = useState(null);
    const [matched, setMatched] = useState(new Set());
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState({});
    const [shuffledUses] = useState(() => shuffle(pairs.map(p => ({ use: p.use, symbol: p.symbol, icon: p.icon }))));

    const handleElementClick = (sym) => {
        if (matched.has(sym)) return;
        setSelectedEl(sym);
    };

    const handleUseClick = (use) => {
        if (!selectedEl) { toast('Select an element first! 👈', { icon: '💡' }); return; }
        const pair = pairs.find(p => p.symbol === selectedEl);
        const correct = pair?.use === use;
        if (correct) {
            setMatched(prev => new Set([...prev, selectedEl, use]));
            setScore(s => s + 10);
            setFeedback(prev => ({ ...prev, [selectedEl]: 'correct', [use]: 'correct' }));
            toast.success(`${pair.name} → ${use} ✅`);
            canvasConfetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
            setSelectedEl(null);
            if (matched.size + 2 >= pairs.length * 2) setTimeout(() => setGameState('done'), 1200);
        } else {
            const correctUse = pair?.use;
            setFeedback(prev => ({ ...prev, [selectedEl]: 'wrong', [use]: 'wrong' }));
            toast.error(`Wrong! Hint: ${pair?.hint} 💡`);
            setTimeout(() => {
                setFeedback(prev => { const n = { ...prev }; delete n[selectedEl]; delete n[use]; return n; });
                setSelectedEl(null);
            }, 1000);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (cur < 8) localStorage.setItem('completed_levels_Periodic Classification of Elements', '8');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / (pairs.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="ug-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div>🏆</div>
                <h2>Uses Matched!</h2>
                <div className="final-score">{score} / {pairs.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (pairs.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="ug-container">
            <header className="ug-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>🏭 Element Uses Game</h1>
                <div className="ug-stats"><span>🏆 {score}</span><span>Matched: {matched.size / 2}/{pairs.length}</span></div>
            </header>
            <div className="ug-body">
                <p className="instruction">Click an <strong>element</strong>, then click its <strong>use</strong>!</p>
                <div className="match-arena">
                    <div className="elements-col">
                        {pairs.map(p => (
                            <motion.button
                                key={p.symbol}
                                className={`el-btn ${selectedEl === p.symbol ? 'selected' : ''} ${matched.has(p.symbol) ? 'matched' : ''} ${feedback[p.symbol] === 'wrong' ? 'wrong' : ''}`}
                                onClick={() => handleElementClick(p.symbol)}
                                whileHover={{ scale: 1.03 }}
                            >
                                <span className="el-btn-sym">{p.symbol}</span>
                                <span className="el-btn-name">{p.name}</span>
                            </motion.button>
                        ))}
                    </div>
                    <div className="divider">→</div>
                    <div className="uses-col">
                        {shuffledUses.map(u => (
                            <motion.button
                                key={u.use}
                                className={`use-btn ${matched.has(u.use) ? 'matched' : ''} ${feedback[u.use] === 'correct' ? 'correct' : ''} ${feedback[u.use] === 'wrong' ? 'wrong' : ''}`}
                                onClick={() => handleUseClick(u.use)}
                                whileHover={{ scale: 1.03 }}
                            >
                                <span className="use-icon">{u.icon}</span>
                                <span className="use-text">{u.use}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElementUsesGame;
