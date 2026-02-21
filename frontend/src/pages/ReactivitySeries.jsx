import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReactivitySeries.css';

const INITIAL_METALS = [
    { id: 'au', name: 'Gold (Au)', rank: 7 },
    { id: 'ag', name: 'Silver (Ag)', rank: 6 },
    { id: 'cu', name: 'Copper (Cu)', rank: 5 },
    { id: 'fe', name: 'Iron (Fe)', rank: 4 },
    { id: 'ca', name: 'Calcium (Ca)', rank: 3 },
    { id: 'na', name: 'Sodium (Na)', rank: 2 },
    { id: 'k', name: 'Potassium (K)', rank: 1 }
];

// Shuffle for the start
const SHUFFLED = [...INITIAL_METALS].sort(() => Math.random() - 0.5);

const ReactivitySeries = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState(SHUFFLED);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);

    const checkOrder = () => {
        const sorted = [...items].every((item, index) => item.rank === index + 1);
        if (sorted) {
            setIsCorrect(true);
            setScore(100);
            toast.success("Perfect Ranking! 👑 Metals are properly ordered.");
            localStorage.setItem('completed_levels_Metals and Non-metals', '3');
            canvasConfetti({ particleCount: 150, spread: 70 });
        } else {
            toast.error("Not quite right. Remember: Potassium is the most reactive!");
            setScore(prev => Math.max(0, prev - 10));
        }
    };

    return (
        <div className="reactivity-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 2: REACTIVITY RANKING</div>
            </header>

            <main className="game-arena">
                {!isCorrect ? (
                    <div className="puzzle-view">
                        <div className="instructions">
                            Drag to reorder from <strong>Most Reactive (Top)</strong> to <strong>Least Reactive (Bottom)</strong>
                        </div>

                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="metal-list">
                            {items.map((item) => (
                                <Reorder.Item key={item.id} value={item} className="metal-card">
                                    <div className="drag-handle">☰</div>
                                    <span className="metal-name">{item.name}</span>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <button onClick={checkOrder} className="check-btn">VALIDATE ORDER 🏁</button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="victory-card"
                    >
                        <div className="stars">⭐ ⭐ ⭐</div>
                        <h2>Awesome 🎉 You are a Metal Master!</h2>
                        <h1>Final Score: {score}</h1>
                        <p className="explanation">
                            The Reactivity Series helps us predict how metals will react with water, acids, and oxygen.
                            Highly reactive metals like Potassium (K) react vigorously, while Gold (Au) is inert.
                        </p>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default ReactivitySeries;
