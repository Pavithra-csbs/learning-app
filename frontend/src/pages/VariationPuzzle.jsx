import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './VariationPuzzle.css';

const VARIATIONS = [
    { id: 'eye_color', name: 'Eye Color', type: 'genetic', icon: '👁️', explanation: 'Determined by parents\' genes.' },
    { id: 'muscles', name: 'Muscle Mass', type: 'environmental', icon: '💪', explanation: 'Result of exercise and diet.' },
    { id: 'height', name: 'Average Height', type: 'genetic', icon: '📏', explanation: 'Primarily determined by growth genes.' },
    { id: 'scar', name: 'Injury Scar', type: 'environmental', icon: '🩹', explanation: 'Caused by external injury during life.' },
    { id: 'blood_group', name: 'Blood Group', type: 'genetic', icon: '🩸', explanation: 'A permanent trait fixed by inheritance.' },
    { id: 'tan', name: 'Skin Tanning', type: 'environmental', icon: '☀️', explanation: 'Change in skin color due to sun exposure.' },
    { id: 'dimples', name: 'Cheek Dimples', type: 'genetic', icon: '😊', explanation: 'A specific inherited facial feature.' },
    { id: 'language', name: 'Speaking Hindi', type: 'environmental', icon: '🗣️', explanation: 'A skill learned from the environment.' }
].sort(() => Math.random() - 0.5);

const VariationPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [showExplanation, setShowExplanation] = useState(false);

    const currentVariation = VARIATIONS[currentIdx];

    const handleClassify = (type) => {
        if (showExplanation) return;

        if (currentVariation.type === type) {
            setScore(s => s + 10);
            toast.success('Correct! 🌈');
            setShowExplanation(true);
        } else {
            toast.error('Not quite. Think about its source! ❌');
        }
    };

    const nextVariation = () => {
        setShowExplanation(false);
        if (currentIdx < VARIATIONS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '4');
        if (curLevel < 5) localStorage.setItem('completed_levels_Heredity and Evolution', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        return (
            <div className="vp-finish-screen">
                <motion.div className="vp-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Variation Master! 🌈</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Score: {score} pts</p>
                    <p className="motivational-text">Hurray 🎉 You are a Genetics Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Evolution Timeline →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="variation-puzzle-container">
            <header className="vp-header">
                <button className="vp-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>🌈 Variation Puzzle</h1>
                <div className="vp-score">Points: {score}</div>
            </header>

            <main className="vp-game-area">
                <div className="vp-bins">
                    <motion.div className="vp-bin genetic" whileHover={{ scale: 1.05 }} onClick={() => handleClassify('genetic')}>
                        <h3>Genetic</h3>
                        <p>Inherited via DNA</p>
                    </motion.div>

                    <div className="vp-card-slot">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentVariation.id}
                                className="vp-variation-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                            >
                                <span className="vp-icon">{currentVariation.icon}</span>
                                <h4>{currentVariation.name}</h4>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div className="vp-bin environmental" whileHover={{ scale: 1.05 }} onClick={() => handleClassify('environmental')}>
                        <h3>Environmental</h3>
                        <p>Acquired during life</p>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div className="vp-explanation-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="vp-explanation-modal">
                                <h3>{currentVariation.name}</h3>
                                <p>{currentVariation.explanation}</p>
                                <button className="vp-next-btn" onClick={nextVariation}>Next Case →</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default VariationPuzzle;
