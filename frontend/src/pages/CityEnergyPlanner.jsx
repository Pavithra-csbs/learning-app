import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CityEnergyPlanner.css';

const ENERGY_OPTIONS = [
    { id: 'coal', name: 'Coal Plant', cost: 100, pollution: 80, output: 200, icon: '🏭' },
    { id: 'solar', name: 'Solar Farm', cost: 150, pollution: 0, output: 80, icon: '☀️' },
    { id: 'wind', name: 'Wind Park', cost: 120, pollution: 0, output: 100, icon: '🌬️' },
    { id: 'nuclear', name: 'Nuclear Plant', cost: 300, pollution: 10, output: 500, icon: '⚛️' }
];

const CityEnergyPlanner = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [budget, setBudget] = useState(1000);
    const [pollution, setPollution] = useState(0);
    const [demandMet, setDemandMet] = useState(0);
    const [city, setCity] = useState([]);
    const [gameState, setGameState] = useState('intro'); // intro, planning, results
    const [timeLeft, setTimeLeft] = useState(60);

    const targetDemand = 1000;

    useEffect(() => {
        let timer;
        if (gameState === 'planning' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && gameState === 'planning') {
            setGameState('results');
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const addBuilding = (opt) => {
        if (budget < opt.cost) return;
        setCity([...city, opt]);
        setBudget(prev => prev - opt.cost);
        setPollution(prev => prev + opt.pollution);
        setDemandMet(prev => prev + opt.output);
    };

    const calculateScore = () => {
        let score = (demandMet / targetDemand) * 500;
        score -= pollution * 2;
        score += budget / 2;
        return Math.max(0, Math.floor(score));
    };

    const getFinalRank = () => {
        const score = calculateScore();
        if (score >= 800) return { title: "Green Energy Champion", stars: 3, badge: "🏆" };
        if (score >= 500) return { title: "Urban Architect", stars: 2, badge: "🥈" };
        return { title: "City Planner", stars: 1, badge: "🥉" };
    };

    return (
        <div className="city-planner-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stats-bar">
                    <div className="stat-pill budget">💰 ${budget}</div>
                    <div className="stat-pill pollution">🌫️ {pollution} ppm</div>
                    <div className="stat-pill demand">⚡ {demandMet}/{targetDemand} MW</div>
                </div>
                <div className="timer">{timeLeft}s</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="boss-intro"
                        >
                            <div className="mayor-avatar">🎩</div>
                            <div className="dialogue">
                                <h1>"Greetings, Planner!"</h1>
                                <p>I am the <b>Energy Mayor</b>. Our city is growing fast, but the smog is thick. Balance our budget and energy demand while keeping pollution LOW!</p>
                                <button onClick={() => setGameState('planning')} className="start-btn">START PLANNING</button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'planning' && (
                        <div className="planner-view">
                            <div className="city-grid">
                                {city.length === 0 && <div className="empty-msg">Select sources below to build your city...</div>}
                                {city.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="building"
                                    >
                                        {item.icon}
                                    </motion.div>
                                ))}
                            </div>

                            <div className="options-panel">
                                {ENERGY_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        disabled={budget < opt.cost}
                                        onClick={() => addBuilding(opt)}
                                        className="opt-card"
                                    >
                                        <span className="opt-icon">{opt.icon}</span>
                                        <span className="opt-name">{opt.name}</span>
                                        <div className="opt-stats">
                                            <span>-${opt.cost}</span>
                                            <span>+{opt.output}⚡</span>
                                            <span style={{ color: opt.pollution > 40 ? '#ef4444' : '#10b981' }}>{opt.pollution}🌫️</span>
                                        </div>
                                    </button>
                                ))}
                                <button onClick={() => setGameState('results')} className="finish-btn">FINISH EARLY</button>
                            </div>
                        </div>
                    )}

                    {gameState === 'results' && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="victory-overlay"
                        >
                            <div className="victory-card">
                                <div className="badge-icon">{getFinalRank().badge}</div>
                                <h2>Rank: {getFinalRank().title}</h2>
                                <div className="stars">
                                    {[...Array(3)].map((_, i) => (
                                        <span key={i} className={i < getFinalRank().stars ? 'gold' : ''}>⭐</span>
                                    ))}
                                </div>
                                <div className="result-stats">
                                    <p>Demand Met: {Math.min(100, Math.floor((demandMet / targetDemand) * 100))}%</p>
                                    <p>Final Budget: ${budget}</p>
                                    <p>Efficiency: {pollution < 100 ? 'High' : 'Low'}</p>
                                </div>
                                <h1>SCORE: {calculateScore()}</h1>
                                <button
                                    onClick={() => {
                                        canvasConfetti({ particleCount: 200, spread: 100 });
                                        navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`);
                                    }}
                                    className="next-level-btn"
                                >
                                    MISSION COMPLETE 🚀
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CityEnergyPlanner;
