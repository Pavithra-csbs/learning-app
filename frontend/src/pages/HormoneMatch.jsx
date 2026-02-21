import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './HormoneMatch.css';

const HORMONE_DATA = [
    { id: 1, name: 'Insulin', gland: 'Pancreas', function: 'Regulates blood sugar level' },
    { id: 2, name: 'Adrenaline', gland: 'Adrenal Gland', function: 'Prepares body for emergency (Fight/Flight)' },
    { id: 3, name: 'Thyroxine', gland: 'Thyroid', function: 'Regulates metabolism and growth' },
    { id: 4, name: 'Growth Hormone', gland: 'Pituitary Gland', function: 'Stimulates growth and development' },
    { id: 5, name: 'Testosterone', gland: 'Testes', function: 'Male secondary sexual traits' },
    { id: 6, name: 'Oestrogen', gland: 'Ovaries', function: 'Female secondary sexual traits' }
];

const HormoneMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [selectedHormone, setSelectedHormone] = useState(null);
    const [matches, setMatches] = useState({});
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleHormoneClick = (h) => {
        if (matches[h.id]) return;
        setSelectedHormone(h);
    };

    const handleGlandMatch = (glandName) => {
        if (!selectedHormone) {
            toast('Select a hormone first! 🧬', { icon: '💡' });
            return;
        }

        if (selectedHormone.gland === glandName) {
            setMatches(prev => ({ ...prev, [selectedHormone.id]: true }));
            setScore(s => s + 20);
            toast.success(`Correct! ${selectedHormone.name} is from ${glandName}\nFunction: ${selectedHormone.function}`);
            setSelectedHormone(null);

            if (Object.keys(matches).length + 1 === HORMONE_DATA.length) {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('done'), 1500);
            }
        } else {
            toast.error('Gland mismatch! Try again.');
            setSelectedHormone(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '3');
        if (cur < 4) localStorage.setItem('completed_levels_Control and Coordination', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        return (
            <div className="hm-container done">
                <motion.div className="hm-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Gland Master! 🧠</h2>
                    <div className="hm-stars">⭐⭐⭐</div>
                    <p className="hm-final-score">Score: {score} pts</p>
                    <p className="hm-motto">Hurray 🎉 You are a Brain Power Champion!</p>
                    <button className="hm-btn" onClick={handleComplete}>Next Level: Quiz →</button>
                </motion.div>
            </div>
        );
    }

    const glands = [...new Set(HORMONE_DATA.map(h => h.gland))].sort(() => Math.random() - 0.5);

    return (
        <div className="hm-container">
            <header className="hm-header">
                <button className="hm-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>🧪 Hormone Match Game</h1>
                <div className="hm-score">Points: {score}</div>
            </header>

            <div className="hm-layout">
                <div className="hm-hormones-column">
                    <h3>🧬 Hormones</h3>
                    {HORMONE_DATA.map(h => (
                        <button
                            key={h.id}
                            className={`hm-card ${selectedHormone?.id === h.id ? 'active' : ''} ${matches[h.id] ? 'matched' : ''}`}
                            onClick={() => handleHormoneClick(h)}
                            disabled={matches[h.id]}
                        >
                            {h.name}
                        </button>
                    ))}
                </div>

                <div className="hm-glands-column">
                    <h3>🏢 Endocrine Glands</h3>
                    <div className="hm-gland-grid">
                        {glands.map(g => (
                            <button
                                key={g}
                                className="hm-gland-btn"
                                onClick={() => handleGlandMatch(g)}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hm-info-column">
                    <AnimatePresence mode="wait">
                        {selectedHormone ? (
                            <motion.div key="hint" className="hm-hint-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h4>Clue for {selectedHormone.name}:</h4>
                                <p>{selectedHormone.function}</p>
                                <span className="hm-clue-label">Find its source gland!</span>
                            </motion.div>
                        ) : (
                            <motion.div key="waiting" className="hm-waiting-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <p>Select a hormone to see its function clue!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default HormoneMatch;
