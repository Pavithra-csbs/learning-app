import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './EnergySaver.css';

const ROOMS = [
    {
        name: 'Living Room',
        items: [
            { id: 'tv', name: 'TV in Standby', action: 'Switch Off', saved: 50, icon: '📺' },
            { id: 'light', name: 'Old Bulb', action: 'Replace with LED', saved: 100, icon: '💡' },
            { id: 'ac', name: 'AC at 18°C', action: 'Set to 24°C', saved: 150, icon: '❄️' }
        ]
    },
    {
        name: 'Kitchen',
        items: [
            { id: 'fridge', name: 'Fridge Door Ajar', action: 'Close Door', saved: 80, icon: '🧊' },
            { id: 'tap', name: 'Dripping Hot Tap', action: 'Repair Leak', saved: 120, icon: '🚰' }
        ]
    }
];

const EnergySaver = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentRoom, setCurrentRoom] = useState(0);
    const [doneItems, setDoneItems] = useState([]);
    const [totalSaved, setTotalSaved] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const itemsInRoom = ROOMS[currentRoom].items;

    const handleAction = (item) => {
        if (doneItems.includes(item.id)) return;

        setDoneItems([...doneItems, item.id]);
        setTotalSaved(prev => prev + item.saved);

        const allItemsInCurrentRoom = itemsInRoom.every(i => [...doneItems, item.id].includes(i.id));
        if (allItemsInCurrentRoom) {
            if (currentRoom < ROOMS.length - 1) {
                setTimeout(() => setCurrentRoom(currentRoom + 1), 1000);
            } else {
                setGameState('finished');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        }
    };

    const getMotivationalMessage = () => {
        if (totalSaved >= 500) return "Hurray 🎉 Woohoo! You are an Energy Hero!";
        if (totalSaved >= 300) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="saving-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">ENERGY SAVED: {totalSaved} kWh</div>
                <div className="title">LEVEL 4: CONSERVATION CHAMP</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentRoom}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="room-view"
                        >
                            <h1>Location: {ROOMS[currentRoom].name}</h1>
                            <div className="items-grid">
                                {itemsInRoom.map(item => (
                                    <div key={item.id} className={`item-card ${doneItems.includes(item.id) ? 'fixed' : ''}`}>
                                        <div className="item-icon">{item.icon}</div>
                                        <h3>{item.name}</h3>
                                        <button
                                            disabled={doneItems.includes(item.id)}
                                            onClick={() => handleAction(item)}
                                            className="action-btn"
                                        >
                                            {doneItems.includes(item.id) ? 'FIXED! ✅' : item.action}
                                        </button>
                                        <div className="savings-label">+{item.saved} Energy</div>
                                    </div>
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
                                    <span key={i} className={i < (totalSaved / 200) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Total Saved: {totalSaved} kWh</h1>
                            <div className="tips">
                                <h3>Eco Tips:</h3>
                                <ul>
                                    <li>Switch to LED bulbs (save 80% energy)</li>
                                    <li>Keep AC at 24°C for optimum efficiency</li>
                                    <li>Unplug devices in standby mode</li>
                                </ul>
                            </div>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EnergySaver;
