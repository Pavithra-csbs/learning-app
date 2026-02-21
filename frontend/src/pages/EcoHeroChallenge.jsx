import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './EcoHeroChallenge.css';

const BOSS_QUESTIONS = [
    { q: "What is the primary function of decomposers?", a: "Break down dead matter", options: ["Produce food", "Consume energy", "Break down dead matter", "Fix Nitrogen"], expl: "Decomposers recycle nutrients by breaking down dead plants and animals." },
    { q: "Energy transfer in a food chain is always:", a: "Unidirectional", options: ["Bidirectional", "Unidirectional", "Cyclical", "Random"], expl: "Energy flows from producers to higher trophic levels and is never returned." },
    { q: "Which chemical is mainly responsible for ozone depletion?", a: "CFCs", options: ["CO2", "CFCs", "SO2", "O2"], expl: "Chlorofluorocarbons release chlorine atoms that destroy ozone molecules." },
    { q: "A food web is more stable than a food chain because it has:", a: "Multiple paths", options: ["Single path", "Multiple paths", "Less energy", "Fewer organisms"], expl: "Interconnected chains allow for alternative food sources if one population declines." },
    { q: "What percentage of energy is passed to the next trophic level?", a: "10%", options: ["1%", "10%", "50%", "90%"], expl: "According to the 10% Law, only a small fraction of energy reaches the next level." },
    { q: "Biological Magnification is highest in which organisms?", a: "Top Consumers", options: ["Producers", "Herbivores", "Top Consumers", "Decomposers"], expl: "Chemicals accumulate at increasing concentrations as we go up the food chain." }
];

const EcoHeroChallenge = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('intro'); // intro | battle | won | lost
    const [bossHp, setBossHp] = useState(100);
    const [playerHp, setPlayerHp] = useState(100);
    const [currentQIdx, setCurrentQIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [showExpl, setShowExpl] = useState(false);
    const [lastCorrect, setLastCorrect] = useState(false);

    useEffect(() => {
        if (gameState !== 'battle' || showExpl) return;

        if (timeLeft === 0) {
            handleAnswer(null);
            return;
        }

        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameState, showExpl]);

    const startBattle = () => {
        setGameState('battle');
        setTimeLeft(10);
    };

    const handleAnswer = (option) => {
        const q = BOSS_QUESTIONS[currentQIdx];
        const correct = option === q.a;
        setLastCorrect(correct);

        if (correct) {
            setBossHp(prev => Math.max(0, prev - 20));
            toast.success("Eco Blast! Direct Hit!", { icon: '⚡' });
        } else {
            setPlayerHp(prev => Math.max(0, prev - 25));
            toast.error("Pollution Strike! You took damage.", { icon: '💨' });
        }

        setShowExpl(true);
    };

    const nextStep = () => {
        setShowExpl(false);
        setTimeLeft(10);

        if (bossHp <= 0) {
            setGameState('won');
            canvasConfetti({ particleCount: 200, spread: 80 });
            return;
        }

        if (playerHp <= 0) {
            setGameState('lost');
            return;
        }

        if (currentQIdx < BOSS_QUESTIONS.length - 1) {
            setCurrentQIdx(prev => prev + 1);
        } else {
            // Cycle back through questions if battle isn't over
            setCurrentQIdx(0);
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Our Environment') || '0');
        if (curLevel < 9) localStorage.setItem('completed_levels_Our Environment', '9');
        navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
    };

    if (gameState === 'intro') {
        return (
            <div className="ehc-screen intro">
                <motion.div className="ehc-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className="hero-avatar">🦸‍♂️</div>
                    <h2>Captain Eco vs The Smog King!</h2>
                    <p>Answer rapid-fire questions to defeat the Smog King and restore the Earth's balance. You have 10 seconds per attack!</p>
                    <button className="start-btn" onClick={startBattle}>Begin Final Battle! ⚔️</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="ehc-screen won">
                <motion.div className="ehc-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <div className="medal-icon">🥇</div>
                    <h2>Eco Hero Champion!</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p>The Smog King has been defeated! The environment is safe once again thanks to your knowledge.</p>
                    <div className="badge-unlocked">🏆 Environmental Master Badge Unlocked!</div>
                    <button className="finish-btn" onClick={handleComplete}>Finish Chapter 🎉</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="ehc-screen lost">
                <motion.div className="ehc-card">
                    <div className="lost-icon">🌫️</div>
                    <h2>Defeated by Pollution!</h2>
                    <p>Oh no! The Smog King was too strong. Don't worry, the Earth still needs you. Try again!</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>Retry Battle 🔄</button>
                    <button className="back-btn-lost" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>Return to Map 🗺️</button>
                </motion.div>
            </div>
        );
    }

    const currentQ = BOSS_QUESTIONS[currentQIdx];

    return (
        <div className="ehc-battle-container">
            <div className="battle-hud">
                <div className="stat-bars">
                    <div className="hp-container">
                        <label>CAPTAIN ECO (YOU)</label>
                        <div className="hp-bar"><div className="hp-fill player" style={{ width: `${playerHp}%` }}></div></div>
                    </div>
                    <div className="hp-container">
                        <label>SMOG KING (BOSS)</label>
                        <div className="hp-bar"><div className="hp-fill boss" style={{ width: `${bossHp}%` }}></div></div>
                    </div>
                </div>
                <div className="timer-ring" style={{ borderColor: timeLeft < 4 ? '#f43f5e' : '#10b981' }}>{timeLeft}s</div>
            </div>

            <main className="battle-arena">
                <AnimatePresence mode="wait">
                    {!showExpl ? (
                        <motion.div
                            key={currentQIdx}
                            className="boss-quiz-card"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                        >
                            <div className="boss-sprite">👹</div>
                            <h3>{currentQ.q}</h3>
                            <div className="boss-options">
                                {currentQ.options.map((opt, i) => (
                                    <button key={i} onClick={() => handleAnswer(opt)} className="boss-opt-btn">{opt}</button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className={`boss-expl-view ${lastCorrect ? 'correct' : 'incorrect'}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            <div className="combat-label">{lastCorrect ? "⚡ CRITICAL HIT!" : "💥 YOU TOOK DAMAGE!"}</div>
                            <p>{currentQ.expl}</p>
                            <button className="battle-next-btn" onClick={nextStep}>Resume Battle →</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EcoHeroChallenge;
