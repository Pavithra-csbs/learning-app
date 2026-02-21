import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CarbonFootprint.css';

const SCENARIOS = [
    {
        title: "Going to School",
        options: [
            { id: 'car', label: "Go by Car", carbon: 50, icon: '🚗', points: 0 },
            { id: 'cycle', label: "Cycle/Walk", carbon: 0, icon: '🚲', points: 100 },
            { id: 'bus', label: "School Bus", carbon: 15, icon: '🚌', points: 50 }
        ]
    },
    {
        title: "Using Electronics",
        options: [
            { id: 'desktop', label: "Old Desktop", carbon: 30, icon: '🖥️', points: 0 },
            { id: 'laptop', label: "Efficient Laptop", carbon: 10, icon: '💻', points: 50 },
            { id: 'book', label: "Read a Book", carbon: 0, icon: '📖', points: 100 }
        ]
    },
    {
        title: "Dinner Time",
        options: [
            { id: 'beef', label: "Beef Burger", carbon: 60, icon: '🍔', points: 0 },
            { id: 'chicken', label: "Chicken Curry", carbon: 20, icon: '🍛', points: 50 },
            { id: 'veg', label: "Vegetable Salad", carbon: 5, icon: '🥗', points: 100 }
        ]
    }
];

const CarbonFootprint = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [carbon, setCarbon] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const handleChoice = (option) => {
        setCarbon(prev => prev + option.carbon);
        setScore(prev => prev + option.points);

        if (currentStep < SCENARIOS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 250) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (score >= 150) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="footprint-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 5: FOOTPRINT FIGHTER</div>
            </header>

            <main className="game-arena">
                <div className="meter-container">
                    <div className="meter-header">
                        <span>CARBON FOOTPRINT METER</span>
                        <span>{carbon} kg CO2</span>
                    </div>
                    <div className="meter-bg">
                        <motion.div
                            className="meter-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((carbon / 170) * 100, 100)}%` }}
                            style={{
                                backgroundColor: carbon > 100 ? '#ef4444' : carbon > 50 ? '#fbbf24' : '#10b981'
                            }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentStep}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            className="scenario-view"
                        >
                            <h1>{SCENARIOS[currentStep].title}</h1>
                            <div className="options-list">
                                {SCENARIOS[currentStep].options.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleChoice(opt)}
                                        className="choice-btn"
                                    >
                                        <span className="choice-icon">{opt.icon}</span>
                                        <span className="choice-label">{opt.label}</span>
                                        <span className="choice-carbon">+{opt.carbon}kg CO2</span>
                                    </button>
                                ))}
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
                                    <span key={i} className={i < (score / 100) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Impact: {carbon}kg CO2</h1>
                            <p className="impact-info">
                                Your choices saved approximately <b>{170 - carbon}kg</b> of CO2 compared to the least efficient options!
                            </p>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CarbonFootprint;
