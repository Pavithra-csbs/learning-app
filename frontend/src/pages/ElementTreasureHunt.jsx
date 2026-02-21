import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ElementTreasureHunt.css';

const ELEMENTS = [
    { symbol: 'H', name: 'Hydrogen', atomicNum: 1, group: 1, period: 1, fact: 'Lightest element! Found in stars.', type: 'nonmetal' },
    { symbol: 'He', name: 'Helium', atomicNum: 2, group: 18, period: 1, fact: 'Noble gas - used in balloons!', type: 'noble' },
    { symbol: 'Li', name: 'Lithium', atomicNum: 3, group: 1, period: 2, fact: 'Used in batteries & medicines.', type: 'metal' },
    { symbol: 'Be', name: 'Beryllium', atomicNum: 4, group: 2, period: 2, fact: 'Strong, lightweight metal.', type: 'metal' },
    { symbol: 'B', name: 'Boron', atomicNum: 5, group: 13, period: 2, fact: 'Metalloid - used in glass & ceramics.', type: 'metalloid' },
    { symbol: 'C', name: 'Carbon', atomicNum: 6, group: 14, period: 2, fact: 'Basis of all organic life!', type: 'nonmetal' },
    { symbol: 'N', name: 'Nitrogen', atomicNum: 7, group: 15, period: 2, fact: 'Makes up 78% of air.', type: 'nonmetal' },
    { symbol: 'O', name: 'Oxygen', atomicNum: 8, group: 16, period: 2, fact: 'Essential for breathing & burning.', type: 'nonmetal' },
    { symbol: 'F', name: 'Fluorine', atomicNum: 9, group: 17, period: 2, fact: 'Most reactive non-metal.', type: 'halogen' },
    { symbol: 'Ne', name: 'Neon', atomicNum: 10, group: 18, period: 2, fact: 'Glows in neon signs!', type: 'noble' },
    { symbol: 'Na', name: 'Sodium', atomicNum: 11, group: 1, period: 3, fact: 'Reacts vigorously with water.', type: 'metal' },
    { symbol: 'Mg', name: 'Magnesium', atomicNum: 12, group: 2, period: 3, fact: 'Burns with a bright white flame.', type: 'metal' },
    { symbol: 'Al', name: 'Aluminium', atomicNum: 13, group: 13, period: 3, fact: 'Most abundant metal in Earth\'s crust.', type: 'metal' },
    { symbol: 'Si', name: 'Silicon', atomicNum: 14, group: 14, period: 3, fact: 'Used in computer chips.', type: 'metalloid' },
    { symbol: 'P', name: 'Phosphorus', atomicNum: 15, group: 15, period: 3, fact: 'Essential for DNA and bones.', type: 'nonmetal' },
    { symbol: 'S', name: 'Sulfur', atomicNum: 16, group: 16, period: 3, fact: 'Known since ancient times.', type: 'nonmetal' },
    { symbol: 'Cl', name: 'Chlorine', atomicNum: 17, group: 17, period: 3, fact: 'Used to purify drinking water.', type: 'halogen' },
    { symbol: 'Ar', name: 'Argon', atomicNum: 18, group: 18, period: 3, fact: 'Used in light bulbs.', type: 'noble' },
    { symbol: 'K', name: 'Potassium', atomicNum: 19, group: 1, period: 4, fact: 'Essential for nerve function.', type: 'metal' },
    { symbol: 'Ca', name: 'Calcium', atomicNum: 20, group: 2, period: 4, fact: 'Builds bones and teeth.', type: 'metal' },
    { symbol: 'Fe', name: 'Iron', atomicNum: 26, group: 8, period: 4, fact: 'Most used metal in the world.', type: 'metal' },
    { symbol: 'Cu', name: 'Copper', atomicNum: 29, group: 11, period: 4, fact: 'Best conductor after silver.', type: 'metal' },
    { symbol: 'Zn', name: 'Zinc', atomicNum: 30, group: 12, period: 4, fact: 'Used to galvanize iron.', type: 'metal' },
    { symbol: 'Br', name: 'Bromine', atomicNum: 35, group: 17, period: 4, fact: 'Only liquid non-metal at room temp.', type: 'halogen' },
    { symbol: 'Kr', name: 'Krypton', atomicNum: 36, group: 18, period: 4, fact: 'Used in flash photography.', type: 'noble' },
    { symbol: 'Ag', name: 'Silver', atomicNum: 47, group: 11, period: 5, fact: 'Best electrical conductor.', type: 'metal' },
    { symbol: 'I', name: 'Iodine', atomicNum: 53, group: 17, period: 5, fact: 'Essential for thyroid gland.', type: 'halogen' },
    { symbol: 'Au', name: 'Gold', atomicNum: 79, group: 11, period: 6, fact: 'Does not tarnish or corrode.', type: 'metal' },
    { symbol: 'Pb', name: 'Lead', atomicNum: 82, group: 14, period: 6, fact: 'Heaviest stable element.', type: 'metal' },
    { symbol: 'U', name: 'Uranium', atomicNum: 92, group: 3, period: 7, fact: 'Radioactive - used in nuclear energy.', type: 'metal' },
];

const CLUE_TYPES = [
    el => ({ clue: `Find the element with atomic number ${el.atomicNum}`, answer: el }),
    el => ({ clue: `Find the element in Group ${el.group}, Period ${el.period}`, answer: el }),
    el => ({ clue: `Find the ${el.type === 'metal' ? '⚙️ metal' : el.type === 'nonmetal' ? '💨 non-metal' : el.type === 'halogen' ? '🌡️ halogen' : el.type === 'noble' ? '💜 noble gas' : '◈ metalloid'} whose symbol is "${el.symbol}"`, answer: el }),
    el => ({ clue: `"${el.fact.split('.')[0]}" — Find this element!`, answer: el }),
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const ElementTreasureHunt = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [currentClue, setCurrentClue] = useState(null);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [gameState, setGameState] = useState('playing'); // playing, done
    const [showFact, setShowFact] = useState(false);
    const TOTAL_ROUNDS = 8;

    const generateRound = () => {
        const el = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
        const clueGen = CLUE_TYPES[Math.floor(Math.random() * CLUE_TYPES.length)];
        const { clue, answer } = clueGen(el);

        // Generate wrong options
        const others = shuffle(ELEMENTS.filter(e => e.symbol !== answer.symbol)).slice(0, 3);
        const allOptions = shuffle([answer, ...others]);

        setCurrentClue({ clue, answer });
        setOptions(allOptions);
        setFeedback(null);
        setShowFact(false);
    };

    useEffect(() => {
        generateRound();
    }, [round]);

    const handleAnswer = (selected) => {
        if (feedback) return;
        if (selected.symbol === currentClue.answer.symbol) {
            setFeedback('correct');
            setScore(s => s + 10);
            canvasConfetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            toast.success('Found it! 🎉');
        } else {
            setFeedback('wrong');
            toast.error(`Wrong! It was ${currentClue.answer.name} (${currentClue.answer.symbol}) 💡`);
        }
        setShowFact(true);
        setTimeout(() => {
            if (round + 1 >= TOTAL_ROUNDS) {
                setGameState('done');
            } else {
                setRound(r => r + 1);
            }
        }, 2500);
    };

    const handleComplete = () => {
        const current = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (current < 2) localStorage.setItem('completed_levels_Periodic Classification of Elements', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = (score / (TOTAL_ROUNDS * 10)) * 100;
        if (pct >= 90) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 60) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    const typeColor = { metal: '#eab308', nonmetal: '#06b6d4', halogen: '#a855f7', noble: '#ec4899', metalloid: '#6366f1' };

    if (gameState === 'done') {
        return (
            <div className="eth-container done">
                <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                    <div className="treasure-icon">🏆</div>
                    <h2>Hunt Complete!</h2>
                    <div className="final-score">{score} / {TOTAL_ROUNDS * 10} pts</div>
                    <p className="motivation">{getMotivation()}</p>
                    <div className="stars">
                        {'⭐'.repeat(Math.ceil((score / (TOTAL_ROUNDS * 10)) * 3))}
                    </div>
                    <button className="next-btn" onClick={handleComplete}>Next Level →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="eth-container">
            <header className="eth-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>🗺️ Element Treasure Hunt</h1>
                <div className="eth-stats">
                    <span>🏆 {score} pts</span>
                    <span>Round {round + 1}/{TOTAL_ROUNDS}</span>
                </div>
            </header>

            <div className="eth-body">
                <motion.div className="clue-card" key={round} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className="clue-icon">🔍</div>
                    <p className="clue-text">{currentClue?.clue}</p>
                </motion.div>

                <div className="options-grid">
                    {options.map(el => (
                        <motion.button
                            key={el.symbol}
                            className={`element-option ${feedback ? (el.symbol === currentClue?.answer.symbol ? 'correct' : 'wrong') : ''}`}
                            onClick={() => handleAnswer(el)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ borderColor: typeColor[el.type] || '#6366f1' }}
                        >
                            <div className="el-symbol" style={{ color: typeColor[el.type] || '#6366f1' }}>{el.symbol}</div>
                            <div className="el-name">{el.name}</div>
                            <div className="el-num">#{el.atomicNum}</div>
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence>
                    {showFact && currentClue && (
                        <motion.div
                            className={`fact-popup ${feedback}`}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        >
                            💡 {currentClue.answer.fact}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ElementTreasureHunt;
