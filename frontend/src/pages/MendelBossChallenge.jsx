import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MendelBossChallenge.css';

const BOSS_QUESTIONS = [
    { q: "What is the ratio of phenotypes in a dihybrid cross F2 generation?", options: ["3:1", "1:2:1", "9:3:3:1", "1:1"], a: "9:3:3:1" },
    { q: "Which part of the cell contains the hereditary information?", options: ["Cytoplasm", "DNA", "Cell Wall", "Ribosome"], a: "DNA" },
    { q: "Homologous organs provide evidence for what?", options: ["Separate Ancestry", "Common Ancestry", "Artificial Selection", "Acquired Traits"], a: "Common Ancestry" },
    { q: "If a heterozygous tall plant (Tt) is crossed with a short plant (tt), what is the % of tall plants?", options: ["25%", "50%", "75%", "100%"], a: "50%" },
    { q: "Variation in species is caused by which of the following?", options: ["Only DNA mutation", "Only environment", "DNA copying errors & Sexual reproduction", "Only exercise"], a: "DNA copying errors & Sexual reproduction" }
].sort(() => Math.random() - 0.5);

const MendelBossChallenge = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [gameState, setGameState] = useState('intro'); // intro | battle | won | lost
    const [currentQ, setCurrentQ] = useState(0);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [bossHealth, setBossHealth] = useState(100);
    const [animState, setAnimState] = useState('idle'); // idle | attack | hit

    const handleAnswer = (option) => {
        if (animState !== 'idle') return;

        if (option === BOSS_QUESTIONS[currentQ].a) {
            setAnimState('attack');
            setBossHealth(h => Math.max(0, h - 20));
            toast.success('Direct Hit! ⚡');
        } else {
            setAnimState('hit');
            setPlayerHealth(h => Math.max(0, h - 25));
            toast.error('The Boss counter-attacked! 🛡️');
        }

        setTimeout(() => {
            setAnimState('idle');
            if (currentQ < BOSS_QUESTIONS.length - 1) {
                setCurrentQ(c => c + 1);
            }
        }, 1000);
    };

    useEffect(() => {
        if (bossHealth === 0) {
            setGameState('won');
            canvasConfetti({ particleCount: 200, spread: 100 });
        } else if (playerHealth === 0 || (currentQ === BOSS_QUESTIONS.length - 1 && bossHealth > 0 && animState === 'idle')) {
            if (bossHealth > 0 && playerHealth > 0) return; // Wait for last question result
            setGameState(bossHealth === 0 ? 'won' : 'lost');
        }
    }, [bossHealth, playerHealth, currentQ, animState]);

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '8');
        if (curLevel < 9) localStorage.setItem('completed_levels_Heredity and Evolution', '9');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'intro') {
        return (
            <div className="boss-intro">
                <motion.div className="boss-card" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <div className="boss-avatar">👨‍🔬</div>
                    <h2>Dr. Mendel Master</h2>
                    <p>“So you think you understand inheritance? Prove your knowledge in this rapid-fire genetics battle!”</p>
                    <button className="start-battle-btn" onClick={() => setGameState('battle')}>Accept Challenge ⚔️</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="boss-win">
                <motion.div className="result-card" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <div className="badge">🏆</div>
                    <h2>Genetics Genius!</h2>
                    <p>You defeated Dr. Mendel Master and mastered Heredity & Evolution!</p>
                    <div className="stars">⭐⭐⭐</div>
                    <button className="finish-btn" onClick={handleComplete}>Finish Module 🎉</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="boss-lose">
                <motion.div className="result-card" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <div className="skull">💀</div>
                    <h2>Trial Failed...</h2>
                    <p>Mendel's patterns are tricky! Study the lesson and try again.</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>Retry Battle 🔄</button>
                </motion.div>
            </div>
        );
    }

    const q = BOSS_QUESTIONS[currentQ];

    return (
        <div className="boss-battle-container">
            <header className="bb-header">
                <div className="player-stats">
                    <span>GENETICS STUDENT</span>
                    <div className="hp-bar"><motion.div className="hp-fill" animate={{ width: `${playerHealth}%` }} /></div>
                </div>
                <div className="vs">VS</div>
                <div className="boss-stats">
                    <span>DR. MENDEL MASTER</span>
                    <div className="hp-bar boss"><motion.div className="hp-fill boss" animate={{ width: `${bossHealth}%` }} /></div>
                </div>
            </header>

            <main className="bb-main">
                <div className="battle-arena">
                    <motion.div className="char student" animate={animState === 'attack' ? { x: 50 } : animState === 'hit' ? { x: [-10, 10, -10] } : {}}>
                        🧑‍🎓
                    </motion.div>
                    <motion.div className="char boss" animate={animState === 'hit' ? { x: -50 } : animState === 'attack' ? { x: [10, -10, 10] } : {}}>
                        👨‍🔬
                    </motion.div>
                </div>

                <div className="quiz-zone">
                    <h3 className="boss-q-text">{q.q}</h3>
                    <div className="boss-options">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                className="boss-opt-btn"
                                onClick={() => handleAnswer(opt)}
                                disabled={animState !== 'idle'}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MendelBossChallenge;
