import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ResourceMatch.css';

const MATCHES = [
    { id: 1, resource: 'Coal', use: 'Thermal Power Plant', icon: '🪨', useIcon: '🏭', explanation: 'Coal is primarily burnt in plants to generate electricity.' },
    { id: 2, resource: 'Iron Ore', use: 'Construction & Tools', icon: '⛓️', useIcon: '🏗️', explanation: 'Iron is essential for making steel for buildings and machinery.' },
    { id: 3, resource: 'Solar Energy', use: 'Water Heaters & Lights', icon: '☀️', useIcon: '🚿', explanation: 'Solar energy can be converted to heat or electricity for homes.' },
    { id: 4, resource: 'Forests', use: 'Furniture & Paper', icon: '🌳', useIcon: '🪑', explanation: 'Timber and pulp from forests are used for wood products.' },
    { id: 5, resource: 'Petroleum', use: 'Vehicle Fuel', icon: '⛽', useIcon: '🚗', explanation: 'Petroleum products like petrol and diesel power transport.' },
    { id: 6, resource: 'Water', use: 'Irrigation', icon: '💧', useIcon: '🌾', explanation: 'Water is the most vital resource for agriculture and crops.' }
].sort(() => Math.random() - 0.5);

const ResourceMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState({}); // {resourceId: boolean}
    const [selectedResource, setSelectedResource] = useState(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const handleResourceClick = (item) => {
        if (matches[item.id]) return;
        setSelectedResource(item);
    };

    const handleUseClick = (useItem) => {
        if (!selectedResource) {
            toast('Select a resource first! 💎', { icon: '💡' });
            return;
        }

        if (selectedResource.id === useItem.id) {
            setMatches(prev => ({ ...prev, [useItem.id]: true }));
            setScore(s => s + 20);
            setSelectedResource(null);
            toast.success(`Correct! ${useItem.explanation}`);

            if (Object.keys(matches).length + 1 === MATCHES.length) {
                setTimeout(() => {
                    setGameState('finished');
                    canvasConfetti({ particleCount: 150, spread: 70 });
                }, 1000);
            }
        } else {
            toast.error("Mismatch! Try again. ❌");
            setSelectedResource(null);
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 7) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
    };

    if (gameState === 'finished') {
        const stars = score === 120 ? '⭐⭐⭐' : score >= 80 ? '⭐⭐' : '⭐';
        return (
            <div className="rm-finish-screen">
                <motion.div className="rm-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>All Resources Matched! 🏷️</h2>
                    <div className="stars-row">{stars}</div>
                    <p className="final-score">Utility Score: {score}</p>
                    <p className="motivational-text">Excellent 🎉 You are a Smart Resource Manager!</p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Level 7: Crossword →</button>
                </motion.div>
            </div>
        );
    }

    const resourcesList = [...MATCHES].sort((a, b) => a.resource.localeCompare(b.resource));
    const usesList = [...MATCHES].sort((a, b) => a.use.localeCompare(b.use));

    return (
        <div className="resource-match-container">
            <header className="rm-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Map</button>
                <h1>🧠 Resource & Use Match</h1>
                <div className="rm-score">Points: {score}</div>
            </header>

            <main className="rm-main">
                <div className="match-grid">
                    <div className="resources-column">
                        <h3>Natural Resources</h3>
                        {resourcesList.map(item => (
                            <motion.button
                                key={item.id}
                                className={`match-btn res ${selectedResource?.id === item.id ? 'active' : ''} ${matches[item.id] ? 'matched' : ''}`}
                                whileHover={{ scale: matches[item.id] ? 1 : 1.05 }}
                                onClick={() => handleResourceClick(item)}
                                disabled={matches[item.id]}
                            >
                                <span className="m-icon">{item.icon}</span>
                                <span className="m-label">{item.resource}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="uses-column">
                        <h3>Primary Uses</h3>
                        {usesList.map(item => (
                            <motion.button
                                key={item.id}
                                className={`match-btn use ${matches[item.id] ? 'matched' : ''}`}
                                whileHover={{ scale: matches[item.id] ? 1 : 1.05 }}
                                onClick={() => handleUseClick(item)}
                                disabled={matches[item.id]}
                            >
                                <span className="m-icon">{item.useIcon}</span>
                                <span className="m-label">{item.use}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
                <p className="hint-text">Click a resource on the left, then click its matching use on the right!</p>
            </main>
        </div>
    );
};

export default ResourceMatch;
