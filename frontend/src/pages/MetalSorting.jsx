import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MetalSorting.css';

const ITEMS = [
    { id: 'i1', name: "Iron", type: "metal", icon: "⛓️" },
    { id: 'i2', name: "Copper", type: "metal", icon: "🥉" },
    { id: 'i3', name: "Sulfur", type: "non-metal", icon: "🧪" },
    { id: 'i4', name: "Oxygen", type: "non-metal", icon: "🌬️" },
    { id: 'i5', name: "Aluminium", type: "metal", icon: "🥫" },
    { id: 'i6', name: "Carbon", type: "non-metal", icon: "💎" },
    { id: 'i7', name: "Gold", type: "metal", icon: "💍" },
    { id: 'i8', name: "Nitrogen", type: "non-metal", icon: "❄️" }
];

const MetalSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameState('finished');
        }
    }, [timeLeft, gameState]);

    const handleSort = (category) => {
        const item = ITEMS[currentIndex];
        if (item.type === category) {
            setScore(prev => prev + 50);
            toast.success("Correct! 🎯");
        } else {
            toast.error(`Nope! ${item.name} is a ${item.type}.`);
        }

        if (currentIndex < ITEMS.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setGameState('finished');
            localStorage.setItem('completed_levels_Metals and Non-metals', '2');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 350) return "Awesome 🎉 You are a Metal Master!";
        if (score >= 200) return "Nice work 👍 Try to improve!";
        return "Keep trying 😊 You can do it!";
    };

    return (
        <div className="sorting-game-container metals-dark">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stats">
                    <div className="stat">SCORE: {score}</div>
                    <div className="stat timer">⏳ {timeLeft}s</div>
                </div>
                <div className="title">LEVEL 1: METAL SORTING</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIndex}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ x: -200, opacity: 0 }}
                            className="item-card"
                        >
                            <span className="icon">{ITEMS[currentIndex].icon}</span>
                            <h2>{ITEMS[currentIndex].name}</h2>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === 'playing' && (
                    <div className="drop-zones">
                        <button onClick={() => handleSort('metal')} className="zone metal-zone">METALS 🏗️</button>
                        <button onClick={() => handleSort('non-metal')} className="zone non-metal-zone">NON-METALS 🌬️</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MetalSorting;
