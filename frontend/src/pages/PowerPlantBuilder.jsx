import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './PowerPlantBuilder.css';

const PLANTS = [
    {
        id: 'thermal',
        name: 'Thermal Power Plant',
        components: ['Boiler', 'Turbine', 'Generator'],
        description: 'Fossil fuels are burnt to heat water and produce steam.',
        icon: '🔥'
    },
    {
        id: 'hydro',
        name: 'Hydro Power Plant',
        components: ['Reservoir', 'Dam', 'Turbine', 'Generator'],
        description: 'Falling water turns the turbine to generate electricity.',
        icon: '🌊'
    },
    {
        id: 'solar',
        name: 'Solar Power Plant',
        components: ['Silicon Panels', 'Inverter', 'Battery'],
        description: 'Sunlight is directly converted into electricity.',
        icon: '☀️'
    }
];

const PowerPlantBuilder = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPlantIndex, setCurrentPlantIndex] = useState(0);
    const [assembled, setAssembled] = useState([]);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const currentPlant = PLANTS[currentPlantIndex];

    const addComponent = (comp) => {
        if (assembled.includes(comp)) return;

        const expectedNext = currentPlant.components[assembled.length];
        if (comp === expectedNext) {
            setAssembled([...assembled, comp]);
            setScore(s => s + 50);

            if (assembled.length + 1 === currentPlant.components.length) {
                if (currentPlantIndex < PLANTS.length - 1) {
                    setTimeout(() => {
                        setCurrentPlantIndex(prev => prev + 1);
                        setAssembled([]);
                    }, 1500);
                } else {
                    setGameState('finished');
                    const currentProgress = parseInt(localStorage.getItem('completed_levels_Sources of Energy') || '0');
                    if (currentProgress < 3) localStorage.setItem('completed_levels_Sources of Energy', '3');
                    canvasConfetti({ particleCount: 150, spread: 70 });
                }
            }
        } else {
            setScore(s => Math.max(0, s - 10));
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 400) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (score >= 200) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="builder-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 3: PLANT ARCHITECT</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentPlantIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="build-view"
                        >
                            <div className="plant-info">
                                <h1>{currentPlant.icon} {currentPlant.name}</h1>
                                <p>{currentPlant.description}</p>
                            </div>

                            <div className="blueprint">
                                {currentPlant.components.map((c, i) => (
                                    <div key={i} className={`slot ${assembled.includes(c) ? 'filled' : ''}`}>
                                        {assembled.includes(c) ? c : '???'}
                                    </div>
                                ))}
                            </div>

                            <div className="component-tray">
                                {currentPlant.components
                                    .sort(() => Math.random() - 0.5)
                                    .map((c, i) => (
                                        <button
                                            key={i}
                                            onClick={() => addComponent(c)}
                                            className={`comp-btn ${assembled.includes(c) ? 'used' : ''}`}
                                        >
                                            {c}
                                        </button>
                                    ))
                                }
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 150) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PowerPlantBuilder;
