import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './BrainPartMatch.css';

const BRAIN_PARTS = [
    { id: 'cerebrum', name: 'Cerebrum', function: 'Thinking, Memory, Voluntary actions', icon: '🧠', color: '#818cf8', pos: { top: '30%', left: '50%' } },
    { id: 'cerebellum', name: 'Cerebellum', function: 'Balance, Posture, Coordination', icon: '🤸', color: '#38bdf8', pos: { bottom: '20%', right: '25%' } },
    { id: 'medulla', name: 'Medulla', function: 'Heartbeat, Breathing, Blood pressure', icon: '💓', color: '#f472b6', pos: { bottom: '15%', left: '45%' } },
    { id: 'hypothalamus', name: 'Hypothalamus', function: 'Hunger, Thirst, Sleep', icon: '🌡️', color: '#fbbf24', pos: { top: '50%', left: '40%' } },
];

const BrainPartMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [matched, setMatched] = useState({});
    const [selectedName, setSelectedName] = useState(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing | done

    const handleNameSelect = (part) => {
        if (matched[part.id]) return;
        setSelectedName(part);
    };

    const handleRegionClick = (regionId) => {
        if (!selectedName) {
            toast('Select a brain part name first! 🏷️', { icon: '💡' });
            return;
        }

        if (selectedName.id === regionId) {
            setMatched(prev => ({ ...prev, [regionId]: true }));
            setScore(s => s + 25);
            setSelectedName(null);
            toast.success(`Correct! ${selectedName.name}: ${selectedName.function}`);

            if (Object.keys(matched).length + 1 === BRAIN_PARTS.length) {
                canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                setTimeout(() => setGameState('done'), 1500);
            }
        } else {
            toast.error('Wrong region! Try again.');
            setSelectedName(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '1');
        if (cur < 2) localStorage.setItem('completed_levels_Control and Coordination', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        const performance = score === 100 ? "Hurray 🎉 You are a Brain Power Champion!" :
            score >= 50 ? "Good job 👍 Try for full score!" :
                "Don't worry 😊 Your brain is learning!";

        return (
            <div className="bpm-container done">
                <motion.div className="bpm-result-card"
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="bpm-star-row">{'⭐'.repeat(score === 100 ? 3 : score >= 50 ? 2 : 1)}</div>
                    <h2>Area Mastered!</h2>
                    <p className="bpm-final-score">Score: {score} pts</p>
                    <p className="bpm-motivational">{performance}</p>
                    <button className="bpm-finish-btn" onClick={handleComplete}>Next Level →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bpm-container">
            <header className="bpm-header">
                <button className="bpm-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>🧠 Brain Part Matching</h1>
                <div className="bpm-score-box">Score: {score}</div>
            </header>

            <div className="bpm-game-layout">
                <div className="bpm-names-bank">
                    <h3>🏷️ Part Names</h3>
                    {BRAIN_PARTS.map(part => (
                        <button
                            key={part.id}
                            className={`bpm-name-btn ${selectedName?.id === part.id ? 'active' : ''} ${matched[part.id] ? 'matched' : ''}`}
                            onClick={() => handleNameSelect(part)}
                            disabled={matched[part.id]}
                        >
                            {part.name}
                        </button>
                    ))}
                    <p className="bpm-hint">Hint: Click a name, then click the correct circular zone on the brain diagram.</p>
                </div>

                <div className="bpm-diagram-view">
                    <div className="brain-diagram-container">
                        <div className="brain-svg-placeholder">
                            {/* In a real project, we'd use an SVG here. Using a styled div-based illustration */}
                            <div className="brain-shape">
                                {BRAIN_PARTS.map(part => (
                                    <motion.div
                                        key={part.id}
                                        className={`brain-zone ${matched[part.id] ? 'filled' : ''} ${selectedName && !matched[part.id] ? 'pulsing' : ''}`}
                                        style={{ ...part.pos, backgroundColor: matched[part.id] ? part.color : 'rgba(255,255,255,0.2)' }}
                                        onClick={() => handleRegionClick(part.id)}
                                        whileHover={{ scale: matched[part.id] ? 1 : 1.2 }}
                                    >
                                        {matched[part.id] ? part.icon : '?'}
                                        {matched[part.id] && <div className="zone-label">{part.name}</div>}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {Object.keys(matched).length > 0 && (
                        <motion.div className="bpm-fact-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h3>🧠 Knowledge Gained</h3>
                            <div className="bpm-facts-list">
                                {BRAIN_PARTS.filter(p => matched[p.id]).map(p => (
                                    <div key={p.id} className="bpm-fact-item">
                                        <strong>{p.name}:</strong> {p.function}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BrainPartMatch;
