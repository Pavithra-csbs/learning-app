import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './ImageFormationPuzzle.css';

const ImageFormationPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('intro'); // intro, playing, success
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [selectedSetup, setSelectedSetup] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [matches, setMatches] = useState([]);

    const puzzleData = useMemo(() => [
        {
            id: 1,
            setup: "Concave Mirror: Object at Focus (F)",
            property: "Real, Inverted, Infinity",
            explanation: "Rays from F become parallel after reflection, meeting at infinity."
        },
        {
            id: 2,
            setup: "Concave Mirror: Object between P and F",
            property: "Virtual, Upright, Magnified",
            explanation: "Rays appear to diverge from behind the mirror, forming a virtual image."
        },
        {
            id: 3,
            setup: "Convex Mirror: Object anywhere",
            property: "Virtual, Upright, Diminished",
            explanation: "Convex mirrors always form small virtual images behind the mirror."
        },
        {
            id: 4,
            setup: "Convex Lens: Object beyond 2F",
            property: "Real, Inverted, Diminished",
            explanation: "Rays converge between F and 2F on the other side."
        },
        {
            id: 5,
            setup: "Concave Lens: Object anywhere",
            property: "Virtual, Upright, Diminished",
            explanation: "Diverging lenses always form virtual, small images."
        }
    ], []);

    // Shuffle cards for display
    const shuffledSetups = useMemo(() => [...puzzleData].sort(() => Math.random() - 0.5), [puzzleData]);
    const shuffledProperties = useMemo(() => [...puzzleData].sort(() => Math.random() - 0.5), [puzzleData]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setGameState('success'); // Game over via time
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    const handleMatch = (setupId, propertyId) => {
        if (setupId === propertyId) {
            setMatches(prev => [...prev, setupId]);
            setScore(prev => prev + 150);
            setSelectedSetup(null);
            setSelectedProperty(null);

            if (matches.length + 1 === puzzleData.length) {
                setGameState('success');
                setScore(prev => prev + timeLeft * 10);
                canvasConfetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
            }
        } else {
            // Penalty for mismatch
            setScore(prev => Math.max(0, prev - 50));
            setSelectedSetup(null);
            setSelectedProperty(null);
        }
    };

    return (
        <div className="puzzle-game-container">
            <header className="puzzle-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="puzzle-stats">
                    <div className="timer">⏳ {timeLeft}s</div>
                    <div className="score">✨ {score}</div>
                </div>
            </header>

            <main className="puzzle-arena">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="puzzle-overlay">
                            <div className="puzzle-card intro-modal">
                                <h1>Image Formation Puzzle 🧩</h1>
                                <p>Match the optical setups with their correct image properties! Be quick to earn time bonuses.</p>
                                <button onClick={() => setGameState('playing')} className="start-btn">BEGIN MISSION</button>
                            </div>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="puzzle-overlay">
                            <div className="puzzle-card result-modal">
                                <h1>{timeLeft > 0 ? "Puzzle Mastered! 🏆" : "Time's Up! ⏰"}</h1>
                                <div className="final-stats">
                                    <div className="stat-row">Time Bonus: <span>{timeLeft * 10}</span></div>
                                    <div className="stat-row highlight">Final Score: <span>{score}</span></div>
                                </div>
                                <button onClick={() => navigate('/map')} className="finish-btn">BACK TO WORLD</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="puzzle-grid">
                    <div className="cards-column setups">
                        <h3>OPTICAL SETUPS</h3>
                        {shuffledSetups.map(item => (
                            <motion.div
                                key={`setup-${item.id}`}
                                className={`item-card setup ${selectedSetup === item.id ? 'active' : ''} ${matches.includes(item.id) ? 'matched' : ''}`}
                                onClick={() => !matches.includes(item.id) && setSelectedSetup(item.id)}
                                initial={false}
                                animate={matches.includes(item.id) ? { opacity: 0.5, scale: 0.95 } : {}}
                            >
                                {item.setup}
                            </motion.div>
                        ))}
                    </div>

                    <div className="connector-section">
                        <button
                            className="match-btn"
                            disabled={!selectedSetup || !selectedProperty}
                            onClick={() => handleMatch(selectedSetup, selectedProperty)}
                        >
                            🔗 MATCH
                        </button>
                    </div>

                    <div className="cards-column properties">
                        <h3>IMAGE PROPERTIES</h3>
                        {shuffledProperties.map(item => (
                            <motion.div
                                key={`prop-${item.id}`}
                                className={`item-card property ${selectedProperty === item.id ? 'active' : ''} ${matches.includes(item.id) ? 'matched' : ''}`}
                                onClick={() => !matches.includes(item.id) && setSelectedProperty(item.id)}
                                initial={false}
                                animate={matches.includes(item.id) ? { opacity: 0.5, scale: 0.95 } : {}}
                            >
                                {item.property}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ImageFormationPuzzle;
