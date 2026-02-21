import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './TraitMatching.css';

const TRAITS = [
    { id: 'tall', name: 'Tall Height', type: 'inherited', icon: '📏', explanation: 'Determined by DNA passed from parents.' },
    { id: 'muscles', name: 'Large Muscles', type: 'acquired', icon: '💪', explanation: 'Developed through exercise during lifetime.' },
    { id: 'earlobe', name: 'Free Earlobe', type: 'inherited', icon: '👂', explanation: 'A classic example of genetic inheritance.' },
    { id: 'scar', name: 'Injury Scar', type: 'acquired', icon: '🩹', explanation: 'Result of an accidental injury, not genetic.' },
    { id: 'eyes', name: 'Blue Eyes', type: 'inherited', icon: '👁️', explanation: 'Pigmentation genes inherited from parents.' },
    { id: 'knowledge', name: 'Knowing French', type: 'acquired', icon: '📚', explanation: 'Skills and knowledge are learned, not inherited.' },
    { id: 'dimples', name: 'Cheek Dimples', type: 'inherited', icon: '😊', explanation: 'A dominant genetic trait.' },
    { id: 'cycling', name: 'Riding a Bike', type: 'acquired', icon: '🚲', explanation: 'A physical skill practiced and mastered.' }
].sort(() => Math.random() - 0.5);

const TraitMatching = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    const currentTrait = TRAITS[currentIdx];

    const handleMatch = (type) => {
        if (showExplanation) return;

        if (currentTrait.type === type) {
            setScore(s => s + 10);
            toast.success('Correct! ✅');
            setShowExplanation(true);
        } else {
            setMistakes(m => m + 1);
            toast.error('Oops! Think about its origin. ❌');
        }
    };

    const nextTrait = () => {
        setShowExplanation(false);
        if (currentIdx < TRAITS.length - 1) {
            setCurrentIdx(c => c + 1);
        } else {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '1');
        if (curLevel < 2) localStorage.setItem('completed_levels_Heredity and Evolution', '2');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        const stars = score >= 70 ? 3 : score >= 40 ? 2 : 1;
        return (
            <div className="tm-finish-screen">
                <motion.div className="tm-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Traits Sorted!</h2>
                    <div className="stars-row">{'⭐'.repeat(stars)}</div>
                    <p className="final-score">Score: {score} pts</p>
                    <p className="motivational-text">
                        {stars === 3 ? "Hurray 🎉 You are a Genetics Champion!" :
                            stars === 2 ? "Good job 👍 Aim for full score!" :
                                "Don't worry 😊 Genetics is fun, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Next Level →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="trait-match-container">
            <header className="tm-header">
                <button className="tm-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>🧬 Trait Matching</h1>
                <div className="tm-stats">
                    <span>Points: {score}</span>
                    <span>Lives: {3 - mistakes} ❤️</span>
                </div>
            </header>

            <main className="tm-game-area">
                <div className="tm-bins">
                    <motion.div className="tm-bin inherited" whileHover={{ scale: 1.05 }} onClick={() => handleMatch('inherited')}>
                        <h3>Inherited</h3>
                        <p>From Parents (DNA)</p>
                    </motion.div>

                    <div className="tm-card-slot">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTrait.id}
                                className="tm-trait-card"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                            >
                                <span className="tm-icon">{currentTrait.icon}</span>
                                <h4>{currentTrait.name}</h4>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div className="tm-bin acquired" whileHover={{ scale: 1.05 }} onClick={() => handleMatch('acquired')}>
                        <h3>Acquired</h3>
                        <p>During Life (Skills)</p>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div className="tm-explanation-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="tm-explanation-modal">
                                <h3>{currentTrait.name}</h3>
                                <p>{currentTrait.explanation}</p>
                                <button className="tm-next-btn" onClick={nextTrait}>Next Trait →</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default TraitMatching;
