import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PeriodGroupPuzzle.css';

const ELEMENTS_TO_PLACE = [
    { symbol: 'H', name: 'Hydrogen', period: 1, group: 1 },
    { symbol: 'He', name: 'Helium', period: 1, group: 18 },
    { symbol: 'Li', name: 'Lithium', period: 2, group: 1 },
    { symbol: 'Be', name: 'Beryllium', period: 2, group: 2 },
    { symbol: 'B', name: 'Boron', period: 2, group: 13 },
    { symbol: 'C', name: 'Carbon', period: 2, group: 14 },
    { symbol: 'N', name: 'Nitrogen', period: 2, group: 15 },
    { symbol: 'O', name: 'Oxygen', period: 2, group: 16 },
    { symbol: 'F', name: 'Fluorine', period: 2, group: 17 },
    { symbol: 'Ne', name: 'Neon', period: 2, group: 18 },
    { symbol: 'Na', name: 'Sodium', period: 3, group: 1 },
    { symbol: 'Mg', name: 'Magnesium', period: 3, group: 2 },
    { symbol: 'Al', name: 'Aluminium', period: 3, group: 13 },
    { symbol: 'Si', name: 'Silicon', period: 3, group: 14 },
    { symbol: 'P', name: 'Phosphorus', period: 3, group: 15 },
    { symbol: 'S', name: 'Sulfur', period: 3, group: 16 },
    { symbol: 'Cl', name: 'Chlorine', period: 3, group: 17 },
    { symbol: 'Ar', name: 'Argon', period: 3, group: 18 },
];

const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
const PERIODS = [1, 2, 3];
const QUIZ_ELEMENTS = ELEMENTS_TO_PLACE.slice(0, 8);
const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const PeriodGroupPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [queue, setQueue] = useState(shuffle(QUIZ_ELEMENTS));
    const [current, setCurrent] = useState(0);
    const [feedback, setFeedback] = useState(null); // { period, group, ok }
    const [placed, setPlaced] = useState({}); // key: `p${period}-g${group}` → symbol
    const [gameState, setGameState] = useState('playing');
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const el = queue[current];

    const handleCellClick = (period, group) => {
        if (feedback) return;
        setSelectedPeriod(period);
        setSelectedGroup(group);

        const correct = el.period === period && el.group === group;
        setFeedback({ period, group, ok: correct });

        if (correct) {
            setScore(s => s + 10);
            setPlaced(prev => ({ ...prev, [`p${period}-g${group}`]: el.symbol }));
            toast.success(`Correct! ${el.name} is in Period ${el.period}, Group ${el.group} 🎯`);
            canvasConfetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        } else {
            toast.error(`Wrong! Hint: Period ${el.period}, Group ${el.group} 💡`);
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedPeriod(null);
            setSelectedGroup(null);
            if (current + 1 >= queue.length) {
                setGameState('done');
            } else {
                setCurrent(c => c + 1);
            }
        }, 2000);
    };

    const handleComplete = () => {
        const current2 = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (current2 < 4) localStorage.setItem('completed_levels_Periodic Classification of Elements', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / (queue.length * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="pgp-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div>🧩</div>
                <h2>Puzzle Complete!</h2>
                <div className="final-score">{score} / {queue.length * 10} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (queue.length * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="pgp-container">
            <header className="pgp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>📊 Period & Group Puzzle</h1>
                <div className="pgp-stats"><span>🏆 {score}</span><span>{current + 1}/{queue.length}</span></div>
            </header>

            <div className="pgp-body">
                <AnimatePresence mode="wait">
                    <motion.div className="element-challenge" key={el?.symbol} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <div className="big-element">
                            <div className="el-num-sm">{el?.period * 10 + GROUPS.indexOf(el?.group) + 1}</div>
                            <div className="el-sym-big">{el?.symbol}</div>
                            <div className="el-name-sm">{el?.name}</div>
                        </div>
                        <p className="instruction">Click its correct cell in the grid below!</p>
                    </motion.div>
                </AnimatePresence>

                <div className="grid-wrapper">
                    <div className="group-labels">
                        <div className="corner-label">P\G</div>
                        {GROUPS.map(g => <div key={g} className="group-label">G{g}</div>)}
                    </div>
                    {PERIODS.map(p => (
                        <div key={p} className="grid-row">
                            <div className="period-label">P{p}</div>
                            {GROUPS.map(g => {
                                const key = `p${p}-g${g}`;
                                const isFilled = placed[key];
                                const isCorrect = feedback?.period === p && feedback?.group === g && feedback?.ok;
                                const isWrong = feedback?.period === p && feedback?.group === g && !feedback?.ok;
                                return (
                                    <motion.div
                                        key={key}
                                        className={`grid-cell ${isFilled ? 'filled' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                        onClick={() => !isFilled && handleCellClick(p, g)}
                                        whileHover={!isFilled ? { scale: 1.1, backgroundColor: 'rgba(99,102,241,0.3)' } : {}}
                                    >
                                        {isFilled || (isCorrect ? el?.symbol : '')}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="legend">
                    <span className="legend-item placed">✅ Placed</span>
                    <span className="legend-item correct-l">🟢 Correct</span>
                    <span className="legend-item wrong-l">🔴 Wrong</span>
                </div>
            </div>
        </div>
    );
};

export default PeriodGroupPuzzle;
