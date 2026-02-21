import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './BioReproductionBoss.css';

const BOSS_QUESTIONS = [
    { q: "Binary fission is common in which organism?", a: "Amoeba", options: ["Amoeba", "Hydra", "Plasmodium", "Yeast"] },
    { q: "Which part of the flower develops into a fruit?", a: "Ovary", options: ["Stigma", "Style", "Ovary", "Ovule"] },
    { q: "The zygote is implanted in the wall of which organ?", a: "Uterus", options: ["Ovary", "Fallopian Tube", "Uterus", "Cervix"] },
    { q: "Which hormone triggers changes in girls during puberty?", a: "Oestrogen", options: ["Testosterone", "Oestrogen", "Insulin", "Thyroxine"] },
    { q: "Asexual reproduction involves how many parents?", a: "One", options: ["One", "Two", "Three", "Four"] },
    { q: "What is the common term for the breakdown of uterine lining?", a: "Menstruation", options: ["Ovulation", "Menstruation", "Gestation", "Fertilization"] },
    { q: "Where does the pollen grain land during pollination?", a: "Stigma", options: ["Anther", "Filament", "Stigma", "Styles"] },
    { q: "Sperm production occurs at a lower temperature in the:", a: "Scrotum", options: ["Vas deferens", "Urethra", "Scrotum", "Penis"] },
    { q: "Vegetative propagation in Bryophyllum occurs via:", a: "Leaves", options: ["Stem", "Root", "Leaves", "Seeds"] },
    { q: "The period of pregnancy in humans is called:", a: "Gestation", options: ["Puberty", "Gestation", "Lactation", "Ovulation"] }
];

const BioReproductionBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentQ, setCurrentQ] = useState(0);
    const [bossHealth, setBossHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [gameState, setGameState] = useState('intro'); // intro | battle | won | lost
    const [animState, setAnimState] = useState('idle'); // idle | attack | hit

    const handleAnswer = (option) => {
        if (gameState !== 'battle') return;

        const isCorrect = option === BOSS_QUESTIONS[currentQ].a;
        if (isCorrect) {
            setAnimState('attack');
            setBossHealth(h => Math.max(0, h - 10));
            toast.success('Direct Hit! ⚡');
        } else {
            setAnimState('hit');
            setPlayerHealth(h => Math.max(0, h - 20));
            toast.error('Ouch! Bio Master countered. 💥');
        }

        setTimeout(() => {
            setAnimState('idle');
            if (currentQ < BOSS_QUESTIONS.length - 1 && bossHealth > 10 && playerHealth > 20) {
                setCurrentQ(c => c + 1);
            } else if (bossHealth <= 10 && isCorrect) {
                setGameState('won');
                canvasConfetti({ particleCount: 200, spread: 90 });
            } else if (playerHealth <= 20 && !isCorrect) {
                setGameState('lost');
            } else if (currentQ === BOSS_QUESTIONS.length - 1) {
                // If ran out of questions but haven't won/lost
                if (bossHealth < playerHealth) setGameState('won');
                else setGameState('lost');
            }
        }, 800);
    };

    const handleComplete = () => {
        // Save overall completion
        localStorage.setItem(`chapter_complete_${topicId}`, 'true');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'intro') {
        return (
            <div className="boss-battle-page intro">
                <motion.div className="boss-intro-card" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h1>⚠️ BOSS DETECTED</h1>
                    <div className="boss-avatar">👨🏼‍🔬</div>
                    <h2>BIO MASTER</h2>
                    <p>He challenges your knowledge of reproduction! Defeat him to become a <strong>Reproduction Expert</strong>.</p>
                    <button className="battle-start-btn" onClick={() => setGameState('battle')}>I'M READY! 🔥</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'won') {
        return (
            <div className="boss-battle-page game-over won">
                <motion.div className="result-card" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <div className="badge-icon">🎖️</div>
                    <h2>REPRODUCTION EXPERT</h2>
                    <p>Bio Master has been defeated! You have mastered Chapter 8.</p>
                    <div className="stats-final">
                        <span>Score: 1000 pts</span>
                        <span>Stars: ⭐⭐⭐</span>
                    </div>
                    <p className="motivational">Hurray 🎉 You are a Reproduction Champion!</p>
                    <button className="final-finish-btn" onClick={handleComplete}>Claim Badge & Finish</button>
                </motion.div>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="boss-battle-page game-over lost">
                <div className="result-card">
                    <h2>DEFEATED! 💀</h2>
                    <p>Bio Master was too strong. Review the lesson and try again!</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>Retry Battle</button>
                </div>
            </div>
        );
    }

    return (
        <div className="boss-battle-page battle">
            <header className="battle-header">
                <div className="health-bar player">
                    <div className="health-label">YOU</div>
                    <div className="bar-bg"><motion.div className="bar-fill" animate={{ width: `${playerHealth}%` }} /></div>
                </div>
                <div className="vs-logo">VS</div>
                <div className="health-bar boss">
                    <div className="health-label">BIO MASTER</div>
                    <div className="bar-bg"><motion.div className="bar-fill" animate={{ width: `${bossHealth}%` }} /></div>
                </div>
            </header>

            <main className="battle-arena">
                <div className="character-view">
                    <motion.div className={`player-char ${animState === 'attack' ? 'attacking' : ''}`}>🛡️</motion.div>
                    <motion.div className={`boss-char ${animState === 'hit' ? 'hurt' : ''}`} animate={animState === 'idle' ? { y: [0, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 2 }}>👨🏼‍🔬</motion.div>
                </div>

                <div className="quiz-combat-zone">
                    <div className="question-box">
                        <h3>Question {currentQ + 1}</h3>
                        <p>{BOSS_QUESTIONS[currentQ].q}</p>
                    </div>
                    <div className="battle-options">
                        {BOSS_QUESTIONS[currentQ].options.map((opt, i) => (
                            <button key={i} className="battle-opt-btn" onClick={() => handleAnswer(opt)}>{opt}</button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BioReproductionBoss;
