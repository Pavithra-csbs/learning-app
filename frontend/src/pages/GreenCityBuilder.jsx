import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './GreenCityBuilder.css';

const BUILDING_TYPES = [
    { id: 'solar', name: 'Solar Farm', icon: '☀️', score: 20, description: 'Clean energy source.' },
    { id: 'trees', name: 'Forest Park', icon: '🌳', score: 15, description: 'Absorbs CO2.' },
    { id: 'recycle', name: 'Recycle Plant', icon: '♻️', score: 25, description: 'Reduces waste.' },
    { id: 'metro', name: 'Electric Metro', icon: '🚆', score: 20, description: 'Zero emission transport.' },
    { id: 'bicycle', name: 'Cycle Lanes', icon: '🚲', score: 10, description: 'Eco-friendly commute.' },
    { id: 'ev', name: 'EV Station', icon: '🔌', score: 15, description: 'Support electric cars.' }
];

const POLLUTANTS = [
    { id: 'coal', name: 'Coal Plant', icon: '🏭', score: -30, description: 'High air pollution!' },
    { id: 'traffic', name: 'Giant Highway', icon: '🚗', score: -20, description: 'Noise & air pollution!' }
];

const GreenCityBuilder = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [city, setCity] = useState(Array(9).fill(null));
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handlePlace = (idx, building) => {
        if (city[idx]) return;

        const newCity = [...city];
        newCity[idx] = building;
        setCity(newCity);
        setScore(prev => prev + building.score);

        if (building.score > 0) {
            toast.success(`Placed ${building.name}! +${building.score}`, { icon: '🏗️' });
        } else {
            toast.error(`Warning: ${building.name} polluted the city! ${building.score}`, { icon: '⚠️' });
        }
    };

    const handleFinish = () => {
        const filled = city.filter(c => c !== null).length;
        if (filled < 5) {
            toast("Place at least 5 things to finish!", { icon: '👷' });
            return;
        }

        setGameState('finished');
        if (score >= 80) canvasConfetti({ particleCount: 150, spread: 70 });
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 6) localStorage.setItem('completed_levels_Our Environment', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        const stars = score >= 90 ? '⭐⭐⭐' : score >= 60 ? '⭐⭐' : '⭐';
        return (
            <div className="gcb-finish-screen">
                <motion.div className="gcb-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>City Completed! 🏙️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Sustainability Index: {score}</p>
                    <p className="motivational-text">
                        {score >= 90 ? "Hurray 🎉 You built a Green Paradise!" :
                            score >= 60 ? "Good job 👍 Your city is quite eco-friendly!" :
                                "Don't worry 😊 Try adding more renewable energy next time!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Pollution Sources Game →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="gcb-container">
            <header className="gcb-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>🏙️ Green City Builder</h1>
                <div className="sustainability-meter">
                    Sustainability: <span className="score-val" style={{ color: score > 50 ? '#10b981' : '#f43f5e' }}>{score}</span>
                </div>
            </header>

            <main className="gcb-main">
                <div className="builder-dashboard">
                    <div className="building-section">
                        <h3>Construct Eco-Assets</h3>
                        <div className="building-grid">
                            {BUILDING_TYPES.map(b => (
                                <button key={b.id} className="build-btn" onClick={() => toast(`Drag to city grid! (Coming soon) or click slot`, { icon: '🖱️' })}>
                                    <span className="build-icon">{b.icon}</span>
                                    <span className="build-name">{b.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pollution-section">
                        <h3>Warning: Pollution Risks</h3>
                        <div className="building-grid">
                            {POLLUTANTS.map(b => (
                                <div key={b.id} className="build-btn pollutant">
                                    <span className="build-icon">{b.icon}</span>
                                    <span className="build-name">{b.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="city-grid">
                    {city.map((cell, idx) => (
                        <div key={idx} className="city-slot" onClick={() => {
                            if (!cell) {
                                // For now, just cycle through building types for simple selection
                                const randomBuilding = BUILDING_TYPES[Math.floor(Math.random() * BUILDING_TYPES.length)];
                                handlePlace(idx, randomBuilding);
                            }
                        }}>
                            {cell ? (
                                <motion.div
                                    className="placed-building"
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                >
                                    <span className="placed-icon">{cell.icon}</span>
                                    <span className="placed-name">{cell.name}</span>
                                </motion.div>
                            ) : (
                                <div className="empty-slot">+</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="gcb-controls">
                    <button className="finish-btn-main" onClick={handleFinish}>Confirm City Design ✅</button>
                    <button className="reset-btn" onClick={() => { setCity(Array(9).fill(null)); setScore(0); }}>Reset City 🔄</button>
                </div>
            </main>
        </div>
    );
};

export default GreenCityBuilder;
