import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, Reorder } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './CleanEarthPuzzle.css';

const PIECES = [
    { id: 'p1', text: 'Healthy Forests', icon: '🌳', desc: 'Planting trees restores the lungs of the Earth.' },
    { id: 'p2', text: 'Clean Oceans', icon: '🌊', desc: 'Removing plastic helps marine life thrive.' },
    { id: 'p3', text: 'Renewable Energy', icon: '☀️', desc: 'Solar and wind reduce harmful emissions.' },
    { id: 'p4', text: 'Protected Species', icon: '🐘', desc: 'Conservation prevents biodiversity loss.' }
];

const CleanEarthPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    useEffect(() => {
        // Shuffle pieces
        setItems([...PIECES].sort(() => Math.random() - 0.5));
    }, []);

    const checkOrder = () => {
        const isCorrect = items.every((item, idx) => item.id === PIECES[idx].id);

        if (isCorrect) {
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("Earth Restored! 🌍✨");
            setTimeout(() => setGameState('finished'), 2000);
        } else {
            toast.error("Not quite right! Try swapping pieces.");
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 4) localStorage.setItem('completed_levels_Our Environment', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'finished') {
        return (
            <div className="cep-finish-screen">
                <motion.div className="cep-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="earth-glow">🌍</div>
                    <h2>The Earth is Smiling! 😊</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="motivational-text">Hurray 🎉 You are an Eco Hero! Your restoration efforts fixed the environment.</p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Reduce-Reuse-Recycle →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="clean-earth-container">
            <header className="cep-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Map</button>
                <h1>🧩 Clean Earth Puzzle</h1>
            </header>

            <main className="cep-main">
                <div className="puzzle-intro">
                    <p>Drag the environmental restoration steps into the correct order to fix our planet!</p>
                </div>

                <div className="puzzle-area">
                    <div className="earth-background">
                        <div className="polluted-vibe">🌫️☠️⛓️</div>
                    </div>

                    <Reorder.Group axis="y" values={items} onReorder={setItems} className="puzzle-pieces">
                        {items.map(piece => (
                            <Reorder.Item key={piece.id} value={piece} className="piece-item">
                                <span className="piece-icon">{piece.icon}</span>
                                <div className="piece-text">
                                    <h4>{piece.text}</h4>
                                    <p>{piece.desc}</p>
                                </div>
                                <div className="drag-handle">☰</div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </div>

                <button className="check-btn" onClick={checkOrder}>Verify Restoration ✅</button>
            </main>
        </div>
    );
};

export default CleanEarthPuzzle;
