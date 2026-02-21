import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ReproductionSorting.css';

const ORGANISMS = [
    { id: 'amoeba', name: 'Amoeba', type: 'asexual', icon: '🧫', explanation: 'Reproduces by simple Binary Fission!' },
    { id: 'human', name: 'Human', type: 'sexual', icon: '🧑', explanation: 'Involves fusion of male and female gametes!' },
    { id: 'hydra', name: 'Hydra', type: 'asexual', icon: '🐙', explanation: 'Reproduces by Budding!' },
    { id: 'breadmould', name: 'Bread Mould', type: 'asexual', icon: '🍞', explanation: 'Reproduces by Spore Formation!' },
    { id: 'hibiscus', name: 'Hibiscus', type: 'sexual', icon: '🌺', explanation: 'Flowers are the sexual organs of plants!' },
    { id: 'yeast', name: 'Yeast', type: 'asexual', icon: '🧪', explanation: 'A tiny microscopic fungus that buds!' },
    { id: 'dog', name: 'Dog', type: 'sexual', icon: '🐕', explanation: 'Complex multicellular animals reproduce sexually!' },
    { id: 'spirogyra', name: 'Spirogyra', type: 'asexual', icon: '🌿', explanation: 'Breaks into fragments which grow into new individuals!' }
].sort(() => Math.random() - 0.5);

const ReproductionSorting = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const currentOrganism = ORGANISMS[currentIdx];

    const handleSort = (boxType) => {
        if (showExplanation) return;

        if (currentOrganism.type === boxType) {
            setScore(s => s + 10);
            toast.success('Correct! ✅');
            setShowExplanation(true);
        } else {
            setMistakes(m => m + 1);
            toast.error('Oops! Think about its structure. ❌');
        }
    };

    const nextOrganism = () => {
        setShowExplanation(false);
        if (currentIdx < ORGANISMS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '1');
        if (curLevel < 2) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '2');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        const percentage = (score / (ORGANISMS.length * 10)) * 100;
        const stars = percentage === 100 ? 3 : percentage >= 60 ? 2 : 1;
        const motivational = stars === 3 ? "Hurray 🎉 You are a Reproduction Champion!" :
            stars === 2 ? "Good job 👍 Try for full score!" :
                "Don't worry 😊 Learning takes time!";

        return (
            <div className="rs-finish-screen">
                <motion.div className="rs-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Sorting Mastered!</h2>
                    <div className="stars-row">{'⭐'.repeat(stars)}</div>
                    <p className="final-score">Score: {score} pts</p>
                    <p className="motivational-text">{motivational}</p>
                    <button className="finish-btn" onClick={handleComplete}>Next Level →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="repro-sort-container">
            <header className="rs-header">
                <button className="rs-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🌱 Sexual / Asexual Sorting</h1>
                <div className="rs-stats">
                    <div className="rs-score">Points: {score}</div>
                    <div className="rs-lives">Mistakes: {mistakes}</div>
                </div>
            </header>

            <main className="rs-game-area">
                <div className="rs-boxes">
                    <motion.div className="rs-box asexual"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSort('asexual')}
                    >
                        <h3>Asexual</h3>
                        <p>Single Parent</p>
                    </motion.div>

                    <div className="rs-organism-card-slot">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentOrganism.id}
                                className="rs-organism-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                            >
                                <span className="rs-icon">{currentOrganism.icon}</span>
                                <h4>{currentOrganism.name}</h4>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div className="rs-box sexual"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSort('sexual')}
                    >
                        <h3>Sexual</h3>
                        <p>Two Parents</p>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div className="rs-explanation-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="rs-explanation-modal">
                                <h3>{currentOrganism.name}</h3>
                                <p>{currentOrganism.explanation}</p>
                                <button className="rs-next-btn" onClick={nextOrganism}>Got it! Next →</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="rs-footer">
                <p>Drag the organism to the correct box or click the box to sort!</p>
            </footer>
        </div>
    );
};

export default ReproductionSorting;
