import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import { playSFX } from '../utils/audio';
import './ResourceBoss.css';

const BOSS_QUESTIONS = [
    {
        q: "What is the primary objective of Watershed Management?",
        options: ["Store more coal", "Increase biomass production", "Build more dams", "Save electricity"],
        a: "Increase biomass production",
        impact: "Forests restored!"
    },
    {
        q: "Which gas is the main contributor to global warming from fossil fuels?",
        options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"],
        a: "Carbon Dioxide",
        impact: "Smog cleared!"
    },
    {
        q: "The '3Rs' have expanded to 5Rs. Which 'R' means fixing broken items?",
        options: ["Reduce", "Reuse", "Recycle", "Repair"],
        a: "Repair",
        impact: "Resources saved!"
    },
    {
        q: "Which resource is commonly called 'Black Gold'?",
        options: ["Coal", "Petroleum", "Soil", "Iron"],
        a: "Petroleum",
        impact: "Energy efficient!"
    },
    {
        q: "What is the result of excessive groundwater extraction?",
        options: ["Floods", "Depletion of water table", "Clean water", "Sea level rise"],
        a: "Depletion of water table",
        impact: "Aquifers recharged!"
    }
];

const ResourceBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [qIdx, setQIdx] = useState(0);
    const [bossHp, setBossHp] = useState(100);
    const [heroHp, setHeroHp] = useState(100);
    const [gameState, setGameState] = useState('playing'); // playing | win | lose

    const handleAction = (option) => {
        const correct = option === BOSS_QUESTIONS[qIdx].a;

        if (correct) {
            setBossHp(prev => Math.max(0, prev - 25));
            playSFX('correct');
            toast.success(`Power Hit! ${BOSS_QUESTIONS[qIdx].impact} ⚡`);
        } else {
            setHeroHp(prev => Math.max(0, prev - 20));
            playSFX('wrong');
            toast.error("Smog King attacks! Waste is increasing! 💨");
        }

        if (qIdx < BOSS_QUESTIONS.length - 1) {
            setQIdx(prev => prev + 1);
        } else {
            // Check final state
            setTimeout(() => {
                if (bossHp <= 25 && correct) setGameState('win');
                else if (heroHp <= 20 && !correct) setGameState('lose');
                else if (bossHp < heroHp) setGameState('win');
                else setGameState('lose');
            }, 500);
        }
    };

    useEffect(() => {
        if (gameState === 'win') {
            playSFX('levelUp');
            canvasConfetti({ particleCount: 200, spread: 80 });
        } else if (gameState === 'lose') {
            playSFX('wrong');
        }
    }, [gameState]);

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Sustainable Management of Natural Resources') || '0');
        if (curLevel < 9) localStorage.setItem('completed_levels_Sustainable Management of Natural Resources', '9');
        navigate(`/chapters`);
    };

    if (gameState === 'win') {
        return (
            <div className="rb-finish-screen win">
                <motion.div className="rb-result-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <span className="badge-icon">🏅</span>
                    <h2>Smart Resource Manager Champion!</h2>
                    <div className="stars">⭐⭐⭐</div>
                    <p>Smog King has been defeated! The Earth is breathing again.</p>
                    <button className="finish-btn" onClick={handleComplete}>Back to Chapters 🏠</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'lose') {
        return (
            <div className="rb-finish-screen lose">
                <motion.div className="rb-result-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <h2>Mission Failed... 🌧️</h2>
                    <p>Resources are depleted and pollution has won. Let's try once more!</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>Retry Challenge 🔄</button>
                </motion.div>
            </div>
        );
    }

    const currentQ = BOSS_QUESTIONS[qIdx];

    return (
        <div className="resource-boss-container">
            <header className="rb-header">
                <div className="hp-bar hero">
                    <div className="hp-fill" style={{ width: `${heroHp}%` }}></div>
                    <span className="hp-label">Captain Eco: {heroHp} HP</span>
                </div>
                <h1>Boss Level: VS Smog King ☁️</h1>
                <div className="hp-bar boss">
                    <div className="hp-fill" style={{ width: `${bossHp}%` }}></div>
                    <span className="hp-label">Smog King: {bossHp} HP</span>
                </div>
            </header>

            <main className="rb-main">
                <div className="battle-arena">
                    <div className="characters">
                        <motion.div className="char hero" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity }}>
                            <span className="char-icon">🦸‍♂️</span>
                            <div className="char-name">Captain Resource Saver</div>
                        </motion.div>
                        <motion.div className="char boss" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                            <span className="char-icon">💨</span>
                            <div className="char-name">Smog King</div>
                        </motion.div>
                    </div>

                    <div className="question-ui">
                        <h3 className="q-text">{currentQ.q}</h3>
                        <div className="options-row">
                            {currentQ.options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAction(opt)}
                                    className="battle-opt-btn"
                                >
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResourceBoss;
