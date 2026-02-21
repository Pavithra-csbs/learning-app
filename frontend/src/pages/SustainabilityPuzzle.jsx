import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './SustainabilityPuzzle.css';

const PUZZLE_PIECES = [
    { id: 'solar', label: 'Install Solar Panels', icon: '☀️', type: 'energy', explanation: 'Replace fossil fuels with renewable energy sources.' },
    { id: 'train', label: 'Boost Public Transport', icon: '🚆', type: 'transport', explanation: 'Reduce vehicle emissions and fossil fuel consumption.' },
    { id: 'water', label: 'Rainwater Harvesting', icon: '🌧️', type: 'water', explanation: 'Recharge groundwater stores and manage water sustainably.' },
    { id: 'forest', label: 'Afforestation', icon: '🌳', explanation: 'Planting trees helps absorb CO2 and maintains biodiversity.' },
    { id: 'recycle', label: 'Zero Waste Systems', icon: '♻️', type: 'waste', explanation: 'Implement 5R principles to minimize landfill waste.' }
];

const SustainabilityPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([...PUZZLE_PIECES].sort(() => Math.random() - 0.5));
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const handleCheck = () => {
        // Correct order is the original PUZZLE_PIECES order (conceptually representing the steps to sustainability)
        // However, for a "building" puzzle, we can just check if they have arranged them.
        // Let's make it a "Select the most important steps" or just an "Order of priority" game.
        // Actually, a simpler "Match the transformation" is better.
        // Let's go with a Reorder game where the goal is to align icons with their sustainable impact.

        const isCorrect = items.every((item, idx) => item.id === PUZZLE_PIECES[idx].id);

        if (isCorrect) {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("Sustainable City Built! 🏙️");
        } else {
            toast.error("Not quite! Try arranging them by priority (Energy -> Transport -> Water -> Forests -> Waste)");
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 4) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        return (
            <div className="sp-finish-screen">
                <motion.div className="sp-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Sustainable Development Mastered! 🌍</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Perfect Alignment!</p>
                    <p className="motivational-text">Excellent 🎉 You are a Smart Resource Manager!</p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 4: 5R Logic →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="sustainability-puzzle-container">
            <header className="sp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>🧩 Sustainable City Puzzle</h1>
                <p>Drag the puzzle pieces to arrange the city transformation steps in order!</p>
            </header>

            <main className="sp-main">
                <div className="sp-arena">
                    <div className="city-transformation-preview">
                        <div className="impact-indicator">
                            <span className="label">Sustainability Index</span>
                            <div className="bar"><div className="fill" style={{ width: '100%' }}></div></div>
                        </div>
                    </div>

                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="puzzle-list">
                        {items.map(item => (
                            <Reorder.Item key={item.id} value={item} className="puzzle-item">
                                <span className="item-icon">{item.icon}</span>
                                <div className="item-details">
                                    <h3>{item.label}</h3>
                                    <p>{item.explanation}</p>
                                </div>
                                <div className="drag-handle">☰</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <button className="check-btn" onClick={handleCheck}>Construct Sustainable City 🚀</button>
                    <p className="hint-text">Hint: Prioritize core needs: Energy ➡️ Transport ➡️ Water ➡️ Forests ➡️ Waste Management</p>
                </div>
            </main>
        </div>
    );
};

export default SustainabilityPuzzle;
