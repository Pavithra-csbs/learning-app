import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ResourcePlanner.css';

const OPTIONS = {
    energy: [
        { id: 'coal', label: 'Coal Plant', cost: 10, sustainability: -20, energy: 50, icon: '🏭' },
        { id: 'solar', label: 'Solar Farm', cost: 30, sustainability: 20, energy: 40, icon: '☀️' },
        { id: 'wind', label: 'Wind Turbines', cost: 25, sustainability: 15, energy: 35, icon: '🌬️' }
    ],
    water: [
        { id: 'river', label: 'River Extraction', cost: 10, sustainability: -10, water: 50, icon: '🌊' },
        { id: 'harvest', label: 'Rainwater Harvesting', cost: 20, sustainability: 25, water: 40, icon: '🌧️' },
        { id: 'dam', label: 'Large Dam', cost: 40, sustainability: -5, water: 80, icon: '🏗️' }
    ],
    waste: [
        { id: 'landfill', label: 'Open Landfill', cost: 5, sustainability: -25, capacity: 50, icon: '🗑️' },
        { id: 'recycle', label: 'Recycling Unit', cost: 25, sustainability: 20, capacity: 40, icon: '♻️' },
        { id: 'compost', label: 'Compost Plant', cost: 15, sustainability: 15, capacity: 30, icon: '🍎' }
    ]
};

const ResourcePlanner = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [budget, setBudget] = useState(100);
    const [sustainability, setSustainability] = useState(50);
    const [cityStats, setCityStats] = useState({ energy: 0, water: 0, waste: 0 });
    const [selections, setSelections] = useState({ energy: null, water: null, waste: null });
    const [gameState, setGameState] = useState('planning'); // planning | finished

    const handleSelect = (category, option) => {
        if (selections[category]?.id === option.id) {
            // Deselect
            setBudget(b => b + option.cost);
            setSustainability(s => s - option.sustainability);
            setCityStats(prev => ({ ...prev, [category]: 0 }));
            setSelections(prev => ({ ...prev, [category]: null }));
        } else {
            // Check budget
            const currentCost = selections[category]?.cost || 0;
            if (budget + currentCost < option.cost) {
                toast.error("Not enough budget! 💸");
                return;
            }

            // Apply new selection
            setBudget(b => b + currentCost - option.cost);
            setSustainability(s => s - (selections[category]?.sustainability || 0) + option.sustainability);
            setCityStats(prev => ({ ...prev, [category]: option.energy || option.water || option.capacity }));
            setSelections(prev => ({ ...prev, [category]: option }));
        }
    };

    const handleFinish = () => {
        if (!selections.energy || !selections.water || !selections.waste) {
            toast.error("Please plan all systems! 🏙️");
            return;
        }

        if (sustainability >= 75) {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
        } else {
            toast.error("Sustainability is too low! Try using renewable resources. 🌍");
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 6) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        const stars = sustainability >= 90 ? '⭐⭐⭐' : sustainability >= 80 ? '⭐⭐' : '⭐';
        return (
            <div className="rp-finish-screen">
                <motion.div className="rp-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Sustainable City Planned! 🏙️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Sustainability Index: {sustainability}%</p>
                    <p className="motivational-text">
                        {sustainability >= 90 ? "Excellent 🎉 You are a Smart Resource Manager!" :
                            "Good job 👍 Building a greener future!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 6: Uses Match →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="resource-planner-container">
            <header className="rp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>🏙️ Smart City Resource Planner</h1>
                <div className="rp-dashboard">
                    <div className="stat active">💰 Budget: {budget}</div>
                    <div className={`stat ${sustainability > 70 ? 'good' : 'bad'}`}>🌍 Earth Health: {sustainability}%</div>
                </div>
            </header>

            <main className="rp-main">
                <div className="planning-grid">
                    {Object.entries(OPTIONS).map(([category, items]) => (
                        <div key={category} className="category-section">
                            <h3 className="category-title">{category.toUpperCase()} SYSTEM</h3>
                            <div className="options-row">
                                {items.map(item => (
                                    <motion.button
                                        key={item.id}
                                        className={`option-card ${selections[category]?.id === item.id ? 'selected' : ''}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSelect(category, item)}
                                    >
                                        <span className="opt-icon">{item.icon}</span>
                                        <span className="opt-label">{item.label}</span>
                                        <span className="opt-cost">Budget: {item.cost}</span>
                                        <span className={`opt-impact ${item.sustainability > 0 ? 'pos' : 'neg'}`}>
                                            Health: {item.sustainability > 0 ? '+' : ''}{item.sustainability}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="planner-summary">
                    <div className="city-stats">
                        <div className="city-stat-item">⚡ Energy: {cityStats.energy} units</div>
                        <div className="city-stat-item">💧 Water: {cityStats.water} units</div>
                        <div className="city-stat-item">♻️ Waste Cap: {cityStats.waste} units</div>
                    </div>
                    <button className="finish-plan-btn" onClick={handleFinish}>Launch Smart City 🚀</button>
                    <p className="hint-text">Goal: Keep Earth Health above 75% to win!</p>
                </div>
            </main>
        </div>
    );
};

export default ResourcePlanner;
