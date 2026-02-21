import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ControlLabeling.css';

const LABELS = [
    { id: 'cns', text: 'Central Nervous System (CNS)', target: 'box-cns', color: '#818cf8', desc: 'Consists of the Brain and Spinal Cord.' },
    { id: 'pns', text: 'Peripheral Nervous System (PNS)', target: 'box-pns', color: '#b4f4a1', desc: 'Contains all the nerves outside the CNS.' },
    { id: 'hormonal', text: 'Hormonal Control', target: 'box-hormones', color: '#fbbf24', desc: 'Slower, long-lasting chemical coordination.' },
    { id: 'neuron', text: 'Sensory Neuron', target: 'box-neuron', color: '#f472b6', desc: 'Transmits impulses from receptors to CNS.' },
    { id: 'effector', text: 'Effector (Muscle/Gland)', target: 'box-effector', color: '#38bdf8', desc: 'Part of the body that responds to stimulus.' }
];

const ControlLabeling = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [placed, setPlaced] = useState({});
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleLabelClick = (label) => {
        if (placed[label.id]) return;
        setSelectedLabel(label);
    };

    const handleTargetClick = (targetId) => {
        if (!selectedLabel) {
            toast('Select a label first! 🏷️', { icon: '💡' });
            return;
        }

        if (selectedLabel.target === targetId) {
            setPlaced(prev => ({ ...prev, [selectedLabel.id]: true }));
            setScore(s => s + 20);
            toast.success(`Correct! ${selectedLabel.text}`);
            setSelectedLabel(null);

            if (Object.keys(placed).length + 1 === LABELS.length) {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('done'), 1500);
            }
        } else {
            toast.error('Wrong box! Read the coordination flow carefully.');
            setSelectedLabel(null);
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '6');
        if (cur < 7) localStorage.setItem('completed_levels_Control and Coordination', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        const msg = score === 100 ? "Hurray 🎉 You are a Brain Power Champion!" : "Good job 👍!";
        return (
            <div className="cl-container done">
                <motion.div className="cl-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Labels Mastered! 🏷️</h2>
                    <div className="cl-stars">⭐⭐⭐</div>
                    <p className="cl-final-score">Score: {score} pts</p>
                    <p className="cl-motto">{msg}</p>
                    <button className="cl-btn" onClick={handleComplete}>Go to Crossword →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="cl-container">
            <header className="cl-header">
                <button className="cl-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <h1>🏷️ Control System Labeling</h1>
                <div className="cl-score">Score: {score}</div>
            </header>

            <div className="cl-layout">
                <div className="cl-labels-bank">
                    <h3>🏷️ Drag-Drop Labels</h3>
                    <div className="cl-label-list">
                        {LABELS.map(label => (
                            <button
                                key={label.id}
                                className={`cl-label-btn ${selectedLabel?.id === label.id ? 'active' : ''} ${placed[label.id] ? 'placed' : ''}`}
                                onClick={() => handleLabelClick(label)}
                                disabled={placed[label.id]}
                            >
                                {label.text}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="cl-diagram-view">
                    <div className="control-diagram-container">
                        <div className="diagram-box flow-top">
                            <h4>Nervous Control</h4>
                            <div className="diagram-flow">
                                <div className={`drop-zone box-cns ${placed['cns'] ? 'filled' : ''}`} onClick={() => handleTargetClick('box-cns')}>
                                    {placed['cns'] ? 'CNS' : '??'}
                                </div>
                                <div className="flow-arrow">↔</div>
                                <div className={`drop-zone box-pns ${placed['pns'] ? 'filled' : ''}`} onClick={() => handleTargetClick('box-pns')}>
                                    {placed['pns'] ? 'PNS' : '??'}
                                </div>
                            </div>
                        </div>

                        <div className="diagram-box flow-bottom">
                            <h4>Coordination Link</h4>
                            <div className="diagram-flow flex-col">
                                <div className={`drop-zone box-neuron ${placed['neuron'] ? 'filled' : ''}`} onClick={() => handleTargetClick('box-neuron')}>
                                    {placed['neuron'] ? 'Sensory Input' : '??'}
                                </div>
                                <div className="flow-arrow">⬇</div>
                                <div className={`drop-zone box-effector ${placed['effector'] ? 'filled' : ''}`} onClick={() => handleTargetClick('box-effector')}>
                                    {placed['effector'] ? 'Effector' : '??'}
                                </div>
                                <div className="flow-arrow">⬇</div>
                                <div className={`drop-zone box-hormones ${placed['hormonal'] ? 'filled' : ''}`} onClick={() => handleTargetClick('box-hormones')}>
                                    {placed['hormonal'] ? 'Chemical Response' : '??'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cl-info-panel">
                    <AnimatePresence mode="wait">
                        {selectedLabel ? (
                            <motion.div key="hint" className="cl-hint-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h4>Clue for {selectedLabel.text}:</h4>
                                <p>{selectedLabel.desc}</p>
                                <span className="cl-clue-label">Find where it belongs!</span>
                            </motion.div>
                        ) : (
                            <motion.div key="waiting" className="cl-waiting-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <p>Select a label to see its description and find its box!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ControlLabeling;
