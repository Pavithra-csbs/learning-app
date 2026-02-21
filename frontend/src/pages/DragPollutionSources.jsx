import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './DragPollutionSources.css';

const SOURCES = [
    { id: 1, name: 'Thermal Power Plant', type: 'air', icon: '🏭', expl: 'Releases large amounts of fly ash and sulfur dioxide into the air.' },
    { id: 2, name: 'Dead Livestock', type: 'soil', icon: '🐄', expl: 'If not disposed of properly, it can lead to soil contamination and diseases.' },
    { id: 3, name: 'Industrial Effluents', type: 'water', icon: '☣️', expl: 'Factories often dump chemical waste directly into rivers, poisoning water.' },
    { id: 4, name: 'Jet Engines', type: 'noise', icon: '✈️', expl: 'The high-frequency sound of airplanes contributes significantly to noise pollution.' },
    { id: 5, name: 'Agricultural Runoff', type: 'water', icon: '🚜', expl: 'Pesticides and fertilizers from farms wash into water bodies during rain.' },
    { id: 6, name: 'Open Garbage Dumps', type: 'soil', icon: '🗑️', expl: 'Waste in open landfills seeps into the ground and degrades soil quality.' },
    { id: 7, name: 'Old Diesel Trucks', type: 'air', icon: '🚚', expl: 'Heavy vehicles emit particulate matter 2.5 (PM 2.5) which pollutes the air.' },
    { id: 8, name: 'Honking in Traffic', type: 'noise', icon: '🚗', expl: 'Excessive honking especially in cities is a major source of noise pollution.' }
].sort(() => Math.random() - 0.5);

const CATEGORIES = [
    { id: 'air', label: 'Air', icon: '☁️', color: '#7dd3fc' },
    { id: 'water', label: 'Water', icon: '🌊', color: '#38bdf8' },
    { id: 'soil', label: 'Soil', icon: '🌱', color: '#4ade80' },
    { id: 'noise', label: 'Noise', icon: '🔊', color: '#fb7185' }
];

const DragPollutionSources = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showExpl, setShowExpl] = useState(false);
    const [lastRes, setLastRes] = useState(null); // { correct: bool, expl: string }
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handleIdentify = (type) => {
        const source = SOURCES[currentIdx];
        const isCorrect = source.type === type;

        if (isCorrect) {
            setScore(s => s + 10);
            toast.success("Correct Source Identification!", { icon: '🎯' });
        } else {
            toast.error("That's not the primary pollution type.", { icon: '❌' });
        }

        setLastRes({ correct: isCorrect, expl: source.expl });
        setShowExpl(true);
    };

    const nextSource = () => {
        setShowExpl(false);
        if (currentIdx < SOURCES.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            if (score >= 60) canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 7) localStorage.setItem('completed_levels_Our Environment', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        const stars = score >= 80 ? '⭐⭐⭐' : score >= 50 ? '⭐⭐' : '⭐';
        return (
            <div className="dps-finish-screen">
                <motion.div className="dps-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Pollution Source Expert! 🏷️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Identification Score: {score}</p>
                    <p className="motivational-text">
                        {score >= 80 ? "Hurray 🎉 You are an Eco Hero!" :
                            score >= 50 ? "Good job 👍 Let's make Earth greener!" :
                                "Don't worry 😊 Earth needs you, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Environmental Crossword →</button>
                </motion.div>
            </div>
        );
    }

    const currentSource = SOURCES[currentIdx];

    return (
        <div className="dps-container">
            <header className="dps-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>🏷️ Pollution Source ID</h1>
                <div className="dps-stats">
                    <span>Score: {score}</span>
                    <span>Source: {currentIdx + 1}/{SOURCES.length}</span>
                </div>
            </header>

            <main className="dps-main">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentIdx}
                            className="source-card"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <span className="source-icon">{currentSource.icon}</span>
                            <h3>{currentSource.name}</h3>
                            <p>Identify the main pollution type caused by this source.</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`dps-expl-card ${lastRes?.correct ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="status-label">{lastRes?.correct ? '✅ AWESOME' : '❌ NOT QUITE'}</div>
                            <p className="expl-text">{lastRes?.expl}</p>
                            <button className="next-btn" onClick={nextSource}>Next Source →</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="cat-grid">
                    {CATEGORIES.map(cat => (
                        <motion.button
                            key={cat.id}
                            className="cat-btn"
                            style={{ '--cat-color': cat.color }}
                            whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${cat.color}44` }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => !showExpl && handleIdentify(cat.id)}
                            disabled={showExpl}
                        >
                            <span className="cat-icon">{cat.icon}</span>
                            <span className="cat-label">{cat.label}</span>
                        </motion.button>
                    ))}
                </div>

                <div className="hint-text">Tip: Think about what this source releases most.</div>
            </main>
        </div>
    );
};

export default DragPollutionSources;
