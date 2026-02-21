import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './NeuroMasterBoss.css';

const BOSS_QUESTIONS = [
    { q: "Which hormone is responsible for 'Fight or Flight' response?", a: "Adrenaline", options: ["Insulin", "Adrenaline", "Thyroxine", "Auxin"] },
    { q: "Master gland of the endocrine system?", a: "Pituitary", options: ["Thyroid", "Adrenal", "Pituitary", "Pancreas"] },
    { q: "Gap between two neurons?", a: "Synapse", options: ["Axon", "Synapse", "Dendrite", "Node"] },
    { q: "Part of brain for thinking and memory?", a: "Cerebrum", options: ["Medulla", "Cerebrum", "Cerebellum", "Pons"] },
    { q: "Sudden involuntary response to stimulus?", a: "Reflex Action", options: ["Thinking", "Reflex Action", "Walking", "Sleeping"] },
    { q: "Coordination in plants is done by?", a: "Hormones", options: ["Nerves", "Hormones", "Muscles", "Blood"] },
    { q: "Plant hormone responsible for cell elongation?", a: "Auxin", options: ["Cytokinin", "Auxin", "Abscisic Acid", "Gibberellin"] },
    { q: "Main function of sensory neurons?", a: "Receptor to CNS", options: ["CNS to Muscle", "Receptor to CNS", "Muscle to CNS", "CNS to Brain"] },
    { q: "Part of brain controlling breathing?", a: "Medulla", options: ["Cerebellum", "Medulla", "Cerebrum", "Pons"] },
    { q: "What travels as an electrical impulse?", a: "Information in Nerves", options: ["Hormones", "Information in Nerves", "Blood", "Oxygen"] },
    { q: "Hormone that lowers blood sugar?", a: "Insulin", options: ["Glucagon", "Insulin", "Growth Hormone", "Thyroxine"] },
    { q: "Bending of plant shoot towards light?", a: "Phototropism", options: ["Geotropism", "Phototropism", "Hydrotropism", "Chemotropism"] },
    { q: "Gland found at the base of the brain?", a: "Pituitary", options: ["Thyroid", "Pituitary", "Pancreas", "Adrenal"] },
    { q: "Spinal cord is protected by?", a: "Vertebral Column", options: ["Skull", "Ribs", "Vertebral Column", "Humerus"] },
    { q: "Hindbrain consists of?", a: "Cerebellum, Pons, Medulla", options: ["Cerebrum, Pons", "Cerebellum, Pons, Medulla", "Midbrain, Pons", "Thalamus"] },
    { q: "Abscisic acid is a?", a: "Growth Inhibitor", options: ["Growth Promoter", "Growth Inhibitor", "Fertilizer", "Sugar"] },
    { q: "Cytokinins are concentrated in?", a: "Fruits and Seeds", options: ["Roots", "Leaves", "Fruits and Seeds", "Stems"] },
    { q: "Reflex arc begins with?", a: "Receptor", options: ["Effector", "Spinal Cord", "Receptor", "Motor Neuron"] },
    { q: "Outer part of cerebrum is?", a: "Grey Matter", options: ["White Matter", "Grey Matter", "Black Matter", "Red Matter"] },
    { q: "Maximum growth occurs in?", a: "Auxin Rich Zones", options: ["Shadow Zones", "Light Zones", "Auxin Rich Zones", "Roots"] }
];

const NeuroMasterBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [qIdx, setQIdx] = useState(0);
    const [userHP, setUserHP] = useState(100);
    const [bossHP, setBossHP] = useState(100);
    const [gameState, setGameState] = useState('playing'); // playing | win | lose
    const [combo, setCombo] = useState(0);

    const handleAnswer = (opt) => {
        const correct = opt === BOSS_QUESTIONS[qIdx].a;
        if (correct) {
            const damage = 10 + (combo * 2);
            setBossHP(h => Math.max(0, h - damage));
            setCombo(c => c + 1);
            toast.success(`CRITICAL HIT! -${damage} HP 🧠`, { duration: 1000 });
            if (bossHP - damage <= 0) {
                setGameState('win');
                canvasConfetti({ particleCount: 200, spread: 80 });
            }
        } else {
            setUserHP(h => Math.max(0, h - 20));
            setCombo(0);
            toast.error('OUCH! Neuro Master hits back! -20 HP 💥');
            if (userHP - 20 <= 0) setGameState('lose');
        }

        if (qIdx < BOSS_QUESTIONS.length - 1) {
            setQIdx(q => q + 1);
        } else {
            setQIdx(0); // Loop questions if not finished
        }
    };

    const handleComplete = () => {
        if (gameState === 'win') {
            localStorage.setItem('completed_levels_Control and Coordination', '9'); // Max unlocked
        }
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState !== 'playing') {
        const isWin = gameState === 'win';
        return (
            <div className={`nb-battle-container ${gameState}`}>
                <motion.div className="nb-result-card" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h1>{isWin ? '🏆 NEURO MASTER DEFEATED!' : '💀 YOU FADED OUT...'}</h1>
                    <div className="nb-stars">{isWin ? '⭐⭐⭐' : '🥚'}</div>
                    <p>{isWin ? 'You have mastered the coordination of your own brain!' : 'Try again! Your neurons need more training.'}</p>
                    {isWin && <div className="nb-badge">🏅 Coordination Champion</div>}
                    <button className="nb-btn" style={{ background: isWin ? '#22c55e' : '#ef4444' }} onClick={handleComplete}>
                        {isWin ? 'Collect Rewards' : 'Back to Training'}
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="nb-battle-container">
            <header className="nb-header">
                <div className="hp-bar-cont user">
                    <div className="hp-label">YOUNG NEURO: {userHP} HP</div>
                    <div className="hp-track"><motion.div className="hp-fill" initial={{ width: '100%' }} animate={{ width: `${userHP}%` }} /></div>
                </div>
                <div className="battle-vs">VS</div>
                <div className="hp-bar-cont boss">
                    <div className="hp-label">NEURO MASTER: {bossHP} HP</div>
                    <div className="hp-track boss"><motion.div className="hp-fill boss" initial={{ width: '100%' }} animate={{ width: `${bossHP}%` }} /></div>
                </div>
            </header>

            <main className="nb-arena">
                <div className="nb-visuals">
                    <motion.div className="character user-char" animate={combo > 0 ? { x: [0, 20, 0] } : {}}>🧑‍🎓</motion.div>
                    <div className="combo-meter">Combo: {combo}x</div>
                    <motion.div className="character boss-char" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🧙‍♂️</motion.div>
                </div>

                <div className="nb-quiz-area">
                    <div className="nb-question-box">
                        <h2>{BOSS_QUESTIONS[qIdx].q}</h2>
                    </div>
                    <div className="nb-options-grid">
                        {BOSS_QUESTIONS[qIdx].options.map((opt, i) => (
                            <button key={i} className="nb-opt" onClick={() => handleAnswer(opt)}>{opt}</button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NeuroMasterBoss;
