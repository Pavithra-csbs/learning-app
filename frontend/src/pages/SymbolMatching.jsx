import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './SymbolMatching.css';

const PAIRS = [
    { name: 'Hydrogen', symbol: 'H' }, { name: 'Helium', symbol: 'He' },
    { name: 'Lithium', symbol: 'Li' }, { name: 'Beryllium', symbol: 'Be' },
    { name: 'Carbon', symbol: 'C' }, { name: 'Nitrogen', symbol: 'N' },
    { name: 'Oxygen', symbol: 'O' }, { name: 'Fluorine', symbol: 'F' },
    { name: 'Neon', symbol: 'Ne' }, { name: 'Sodium', symbol: 'Na' },
    { name: 'Magnesium', symbol: 'Mg' }, { name: 'Aluminium', symbol: 'Al' },
    { name: 'Silicon', symbol: 'Si' }, { name: 'Sulfur', symbol: 'S' },
    { name: 'Chlorine', symbol: 'Cl' }, { name: 'Argon', symbol: 'Ar' },
    { name: 'Potassium', symbol: 'K' }, { name: 'Calcium', symbol: 'Ca' },
    { name: 'Iron', symbol: 'Fe' }, { name: 'Copper', symbol: 'Cu' },
    { name: 'Zinc', symbol: 'Zn' }, { name: 'Silver', symbol: 'Ag' },
    { name: 'Gold', symbol: 'Au' }, { name: 'Lead', symbol: 'Pb' },
    { name: 'Mercury', symbol: 'Hg' }, { name: 'Iodine', symbol: 'I' },
    { name: 'Bromine', symbol: 'Br' }, { name: 'Phosphorus', symbol: 'P' },
    { name: 'Uranium', symbol: 'U' }, { name: 'Titanium', symbol: 'Ti' },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const ROUND_SIZE = 6; // pairs per round

const SymbolMatching = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [pairs, setPairs] = useState([]);
    const [selectedName, setSelectedName] = useState(null);
    const [matched, setMatched] = useState(new Set());
    const [gameState, setGameState] = useState('playing');
    const [feedback, setFeedback] = useState({});
    const TOTAL_ROUNDS = 3;

    const loadRound = (r) => {
        const start = (r * ROUND_SIZE) % PAIRS.length;
        const roundPairs = [...PAIRS.slice(start, start + ROUND_SIZE), ...PAIRS.slice(0, Math.max(0, ROUND_SIZE - (PAIRS.length - start)))].slice(0, ROUND_SIZE);
        setPairs(roundPairs);
        setSelectedName(null);
        setMatched(new Set());
        setFeedback({});
    };

    useEffect(() => { loadRound(round); }, [round]);

    const [shuffledSymbols, setShuffledSymbols] = useState([]);
    useEffect(() => { setShuffledSymbols(shuffle(pairs.map(p => p.symbol))); }, [pairs]);

    const handleNameClick = (name) => {
        if (matched.has(name)) return;
        setSelectedName(name);
    };

    const handleSymbolClick = (symbol) => {
        if (!selectedName) { toast('Select an element name first! 👆', { icon: '💡' }); return; }
        const correct = pairs.find(p => p.name === selectedName)?.symbol === symbol;
        if (correct) {
            setFeedback(prev => ({ ...prev, [symbol]: 'correct', [selectedName]: 'correct' }));
            setMatched(prev => new Set([...prev, selectedName, symbol]));
            setScore(s => s + 10);
            toast.success('Match! 🎯');
            setSelectedName(null);
            if (matched.size + 2 >= pairs.length * 2) {
                canvasConfetti({ particleCount: 100, spread: 80 });
                if (round + 1 >= TOTAL_ROUNDS) {
                    setTimeout(() => setGameState('done'), 1500);
                } else {
                    setTimeout(() => setRound(r => r + 1), 1500);
                }
            }
        } else {
            setFeedback(prev => ({ ...prev, [selectedName]: 'wrong', [symbol]: 'wrong' }));
            toast.error('Not a match! Try again 😊');
            setTimeout(() => {
                setFeedback(prev => { const n = { ...prev }; delete n[selectedName]; delete n[symbol]; return n; });
                setSelectedName(null);
            }, 800);
        }
    };

    const handleComplete = () => {
        const current = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (current < 3) localStorage.setItem('completed_levels_Periodic Classification of Elements', '3');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / (TOTAL_ROUNDS * ROUND_SIZE * 10);
        if (pct >= 0.9) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="sm-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div className="trophy">🏆</div>
                <h2>Symbol Master!</h2>
                <div className="final-score">{score} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (TOTAL_ROUNDS * ROUND_SIZE * 10) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="sm-container">
            <header className="sm-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>🔤 Symbol Matching</h1>
                <div className="sm-stats"><span>🏆 {score}</span><span>Round {round + 1}/{TOTAL_ROUNDS}</span></div>
            </header>

            <div className="sm-body">
                <p className="instruction">Click an element <strong>name</strong>, then click its <strong>symbol</strong>!</p>

                <div className="match-arena">
                    <div className="names-col">
                        {pairs.map(p => (
                            <motion.button
                                key={p.name}
                                className={`name-card ${selectedName === p.name ? 'selected' : ''} ${matched.has(p.name) ? 'matched' : ''} ${feedback[p.name] === 'wrong' ? 'wrong' : ''}`}
                                onClick={() => handleNameClick(p.name)}
                                whileHover={{ scale: 1.03 }}
                            >
                                {p.name}
                            </motion.button>
                        ))}
                    </div>

                    <div className="arrows-col">
                        {pairs.map((_, i) => <div key={i} className="arrow-line">→</div>)}
                    </div>

                    <div className="symbols-col">
                        {shuffledSymbols.map(sym => (
                            <motion.button
                                key={sym}
                                className={`symbol-card ${matched.has(sym) ? 'matched' : ''} ${feedback[sym] === 'correct' ? 'correct' : ''} ${feedback[sym] === 'wrong' ? 'wrong' : ''}`}
                                onClick={() => handleSymbolClick(sym)}
                                whileHover={{ scale: 1.03 }}
                            >
                                {sym}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SymbolMatching;
