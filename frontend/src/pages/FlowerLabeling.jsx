import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './FlowerLabeling.css';

const FLOWER_PARTS = [
    { id: 'stigma', name: 'Stigma', target: 'top-pistil', color: '#f472b6', desc: 'Sticky top part of the carpel that receives pollen grains.' },
    { id: 'anther', name: 'Anther', target: 'top-stamen', color: '#fcd34d', desc: 'Part of the stamen where pollen grains are produced.' },
    { id: 'ovary', name: 'Ovary', target: 'base-pistil', color: '#fb7185', desc: 'Swollen bottom part containing ovules; becomes the fruit.' },
    { id: 'petal', name: 'Petal', target: 'colorful-part', color: '#c084fc', desc: 'Colorful part that attracts insects for pollination.' },
    { id: 'sepal', name: 'Sepal', target: 'base-green', color: '#4ade80', desc: 'Green leaf-like part that protects the flower in bud stage.' }
];

const FlowerLabeling = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [placed, setPlaced] = useState({});
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleLabelClick = (part) => {
        if (placed[part.id]) return;
        setSelectedLabel(part);
    };

    const handleTargetClick = (targetId) => {
        if (!selectedLabel) {
            toast('Select a label first! 🏷️', { icon: '💡' });
            return;
        }

        if (selectedLabel.target === targetId) {
            setPlaced(prev => ({ ...prev, [selectedLabel.id]: true }));
            setScore(s => s + 20);
            toast.success(`Correct! ${selectedLabel.name}: ${selectedLabel.desc}`, { duration: 3000 });
            setSelectedLabel(null);

            if (Object.keys(placed).length + 1 === FLOWER_PARTS.length) {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('finished'), 1500);
            }
        } else {
            toast.error('Not there! Check the flower structure again.');
            setSelectedLabel(null);
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '2');
        if (curLevel < 3) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '3');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        return (
            <div className="fl-finish-screen">
                <motion.div className="fl-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Botanist Badge Earned! 🏅</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Perfect Score: {score} pts</p>
                    <p className="motivational-text">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Go to Pollination →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flower-label-container">
            <header className="fl-header">
                <button className="fl-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🌸 Flower Parts Labeling</h1>
                <div className="fl-score">Points: {score}</div>
            </header>

            <main className="fl-game-area">
                <div className="fl-labels-bank">
                    <h3>🏷️ Part Labels</h3>
                    <div className="fl-label-list">
                        {FLOWER_PARTS.map(part => (
                            <button
                                key={part.id}
                                className={`fl-label-btn ${selectedLabel?.id === part.id ? 'active' : ''} ${placed[part.id] ? 'placed' : ''}`}
                                onClick={() => handleLabelClick(part)}
                                disabled={placed[part.id]}
                                style={{ borderColor: placed[part.id] ? part.color : 'rgba(255,255,255,0.2)' }}
                            >
                                {part.name}
                            </button>
                        ))}
                    </div>
                    <p className="fl-hint">Click a label then click the matching box on the diagram!</p>
                </div>

                <div className="fl-diagram-view">
                    <div className="flower-schematic">
                        {/* Recursive Styled Components for a simple SVG-like flower */}
                        <div className="flower-core">
                            <div className={`drop-zone stigma-zone ${placed['stigma'] ? 'filled' : ''}`} onClick={() => handleTargetClick('top-pistil')}>
                                {placed['stigma'] ? 'Stigma' : '?'}
                            </div>
                            <div className="pistil-tube"></div>
                            <div className={`drop-zone ovary-zone ${placed['ovary'] ? 'filled' : ''}`} onClick={() => handleTargetClick('base-pistil')}>
                                {placed['ovary'] ? 'Ovary' : '?'}
                            </div>
                        </div>

                        <div className="flower-stamen-left">
                            <div className={`drop-zone anther-zone ${placed['anther'] ? 'filled' : ''}`} onClick={() => handleTargetClick('top-stamen')}>
                                {placed['anther'] ? 'Anther' : '?'}
                            </div>
                            <div className="stamen-filament"></div>
                        </div>

                        <div className="flower-petals">
                            <div className={`drop-zone petal-zone ${placed['petal'] ? 'filled' : ''}`} onClick={() => handleTargetClick('colorful-part')}>
                                {placed['petal'] ? 'Petal' : '?'}
                            </div>
                        </div>

                        <div className="flower-base">
                            <div className={`drop-zone sepal-zone ${placed['sepal'] ? 'filled' : ''}`} onClick={() => handleTargetClick('base-green')}>
                                {placed['sepal'] ? 'Sepal' : '?'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fl-info-panel">
                    <h3>🔍 Knowledge Panel</h3>
                    <div className="fl-info-content">
                        {selectedLabel ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h4>{selectedLabel.name}</h4>
                                <p>{selectedLabel.desc}</p>
                            </motion.div>
                        ) : (
                            <p>Select a label to see its function!</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FlowerLabeling;
