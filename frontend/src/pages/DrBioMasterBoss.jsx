import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './DrBioMasterBoss.css';

const ALL_BOSS_QUESTIONS = [
    { q: "Which enzyme breaks down starch in the mouth?", opts: ["Pepsin", "Amylase", "Lipase", "Trypsin"], ans: 1, explain: "Salivary amylase in saliva begins starch digestion in the mouth." },
    { q: "Gastric juice (HCl) is secreted by:", opts: ["Small intestine", "Pancreas", "Stomach", "Liver"], ans: 2, explain: "The stomach lining secretes HCl, creating an acidic environment (pH ≈ 2) for pepsin." },
    { q: "What does the small intestine absorb?", opts: ["Water only", "Nutrients: glucose, amino acids, fatty acids", "CO₂", "Urea"], ans: 1, explain: "Villi and microvilli in the small intestine maximise absorption of digested food." },
    { q: "The functional unit of the kidney is the:", opts: ["Alveolus", "Glomerulus", "Nephron", "Neuron"], ans: 2, explain: "The nephron is the basic structural and functional unit of the kidney." },
    { q: "Which blood vessels carry blood AWAY from the heart?", opts: ["Veins", "Capillaries", "Arteries", "Venules"], ans: 2, explain: "Arteries carry blood away from the heart — usually oxygenated (except pulmonary artery)." },
    { q: "Alveoli in the lungs are adapted for:", opts: ["Digestion", "Hormone secretion", "Gas exchange", "Blood filtration"], ans: 2, explain: "Alveoli have thin walls and a rich capillary network for rapid gas diffusion." },
    { q: "In aerobic respiration, where does it occur?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Cell membrane"], ans: 2, explain: "Aerobic respiration (Krebs cycle + electron transport) occurs in mitochondria." },
    { q: "Which process removes O₂ from blood into cells?", opts: ["Osmosis", "Active transport", "Diffusion", "Peristalsis"], ans: 2, explain: "O₂ moves by diffusion from high concentration in blood to low concentration in cells." },
    { q: "Blood type that circulates in pulmonary artery?", opts: ["Oxygenated", "Deoxygenated", "Mixed", "Plasma only"], ans: 1, explain: "The pulmonary artery is the only artery carrying deoxygenated blood — from heart to lungs." },
    { q: "Bile is produced by the __ and stored in the __:", opts: ["Kidney; Bladder", "Liver; Gall Bladder", "Pancreas; Liver", "Stomach; Gall Bladder"], ans: 1, explain: "Bile is synthesized in the liver and stored in the gall bladder." },
    { q: "What is the main nitrogenous waste in humans?", opts: ["Ammonia", "Uric acid", "Urea", "Creatine"], ans: 2, explain: "Urea is formed in the liver by deamination of amino acids and excreted by kidneys." },
    { q: "Anaerobic respiration in yeast produces:", opts: ["Lactic acid + CO₂", "Ethanol + CO₂", "Only CO₂", "Water + ATP"], ans: 1, explain: "Yeast fermentation: glucose → ethanol + CO₂ (used in bread and alcohol production)." },
    { q: "Which organ regulates blood composition?", opts: ["Heart", "Kidney", "Stomach", "Lungs"], ans: 1, explain: "Kidneys maintain blood pH, remove waste, and regulate water/salt balance." },
    { q: "Double circulation means blood passes through the heart:", opts: ["Once per circuit", "Twice per circuit", "Three times", "Only in the pulmonary loop"], ans: 1, explain: "In humans, blood passes through the heart twice per complete body circuit (pulmonary + systemic)." },
    { q: "Photosynthesis is a life process of:", opts: ["Respiration", "Nutrition (autotrophic)", "Excretion", "Transportation"], ans: 1, explain: "Photosynthesis is how plants make their own food — it's a form of autotrophic nutrition." },
    { q: "Stomata in plants help in:", opts: ["Water absorption", "Gas exchange and transpiration", "Seed dispersal", "Photosynthesis only"], ans: 1, explain: "Stomata (guarded by guard cells) allow CO₂ in and O₂/water vapor out." },
    { q: "The heart chamber with the thickest walls is:", opts: ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], ans: 3, explain: "The left ventricle has the thickest walls — it pumps blood to the entire body (via aorta)." },
    { q: "Xylem in plants transports:", opts: ["Food from leaves", "Water and minerals upward", "Hormones", "CO₂"], ans: 1, explain: "Xylem carries water and dissolved minerals from roots to leaves (unidirectional)." },
    { q: "Energy currency in cellular respiration is:", opts: ["ADP", "ATP", "DNA", "Glucose"], ans: 1, explain: "ATP (adenosine triphosphate) is the universal energy currency — made during respiration." },
    { q: "What triggers breathing (inhaling)?", opts: ["CO₂ levels drop", "O₂ levels rise", "CO₂ levels rise", "N₂ levels change"], ans: 2, explain: "Rising CO₂ (not falling O₂) stimulates the brain to trigger inhalation." },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const BOSS_HP_MAX = 12;
const PLAYER_HP_MAX = 5;
const ROUND_TIME = 14;

const DrBioMasterBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [questions] = useState(shuffle(ALL_BOSS_QUESTIONS));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [bossHp, setBossHp] = useState(BOSS_HP_MAX);
    const [playerHp, setPlayerHp] = useState(PLAYER_HP_MAX);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [gameState, setGameState] = useState('intro');
    const [winner, setWinner] = useState(null);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [bossAnim, setBossAnim] = useState('idle');
    const [playerAnim, setPlayerAnim] = useState('idle');
    const timerRef = useRef(null);

    const clearTimer = () => clearInterval(timerRef.current);
    const startTimer = () => {
        clearTimer();
        setTimeLeft(ROUND_TIME);
        timerRef.current = setInterval(() => setTimeLeft(t => {
            if (t <= 1) { clearTimer(); handleAnswer(-1); return 0; }
            return t - 1;
        }), 1000);
    };

    useEffect(() => {
        if (gameState === 'playing') startTimer();
        return clearTimer;
    }, [current, gameState]);

    const endGame = (w) => {
        clearTimer();
        setWinner(w);
        setGameState('done');
        if (w === 'player') canvasConfetti({ particleCount: 250, spread: 120 });
    };

    const handleAnswer = (idx) => {
        clearTimer();
        setSelected(idx);
        const correct = idx === questions[current].ans;

        if (correct) {
            const newCombo = combo + 1;
            setCombo(newCombo);
            const pts = newCombo >= 3 ? 20 : 10;
            setScore(s => s + pts);
            setBossHp(h => {
                const dmg = newCombo >= 3 ? 2 : 1;
                const newHp = Math.max(0, h - dmg);
                if (newHp <= 0) endGame('player');
                return newHp;
            });
            setBossAnim('hurt');
            setPlayerAnim('attack');
            if (newCombo >= 3) toast.success(`🔥 ${newCombo}x COMBO! +${pts} pts!`);
            else toast.success('Direct hit! ⚡');
        } else {
            setCombo(0);
            setPlayerHp(h => {
                const newHp = Math.max(0, h - 1);
                if (newHp <= 0) endGame('boss');
                return newHp;
            });
            setBossAnim('attack');
            setPlayerAnim('hurt');
            toast.error(`Dr. Bio attacks! 💥 ${questions[current].explain}`);
        }

        setTimeout(() => {
            setBossAnim('idle');
            setPlayerAnim('idle');
            setSelected(null);
            if (current + 1 >= questions.length) {
                endGame(bossHp > 0 && playerHp > 0 ? (score > 50 ? 'player' : 'boss') : (bossHp <= 0 ? 'player' : 'boss'));
            } else {
                setCurrent(c => c + 1);
            }
        }, 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 9) localStorage.setItem('completed_levels_Life Processes', '9');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const stars = () => {
        if (winner === 'boss') return 1;
        const pct = score / (questions.length * 15);
        return pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
    };

    const getMotivation = () => {
        if (winner === 'boss') return "😊 Don't worry! Your body is still learning!";
        const pct = score / (questions.length * 15);
        if (pct >= 0.85) return "🎉 Hurray! You are a Human Body Champion!";
        return "👍 Good job! Try for full score!";
    };

    if (gameState === 'intro') return (
        <div className="bio-boss-container intro">
            <motion.div className="intro-box" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="boss-face idle">🧠</div>
                <h1>Dr. Bio Master</h1>
                <p className="intro-quote">"I know every organ in the human body! Can you answer my questions before I defeat you?"</p>
                <div className="intro-rules">
                    <div>⏱ {ROUND_TIME} seconds per question</div>
                    <div>🔥 3+ Correct Streak = Combo Bonus!</div>
                    <div>❤️ You have {PLAYER_HP_MAX} lives</div>
                    <div>🏅 Win to earn: Life Processes Champion Badge!</div>
                </div>
                <motion.button className="start-btn" onClick={() => setGameState('playing')} whileHover={{ scale: 1.05 }}>
                    ⚔️ Begin Challenge!
                </motion.button>
            </motion.div>
        </div>
    );

    if (gameState === 'done') return (
        <div className="bio-boss-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div className="boss-face">{winner === 'player' ? '🏆' : '💀'}</div>
                <h2>{winner === 'player' ? 'Victory! Dr. Bio Defeated!' : 'Defeated… Try again!'}</h2>
                <div className="final-score">{score} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(stars())}</div>
                {winner === 'player' && <div className="winner-badge">🏅 Life Processes Champion!</div>}
                <button className="next-btn" onClick={handleComplete}>Return to Map</button>
            </motion.div>
        </div>
    );

    const q = questions[current];
    const timerColor = timeLeft > 7 ? '#22c55e' : timeLeft > 3 ? '#f59e0b' : '#ef4444';

    return (
        <div className="bio-boss-container">
            <header className="bio-boss-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>⚔️ Dr. Bio Master Boss</h1>
                <div className="boss-score">🏆 {score} {combo >= 3 ? `🔥 ${combo}x` : ''}</div>
            </header>

            <div className="battle-arena">
                <div className="combatant player-side">
                    <div className={`fighter-face ${playerAnim}`}>🧑‍🔬</div>
                    <div className="comb-name">You</div>
                    <div className="hp-hearts">{Array.from({ length: PLAYER_HP_MAX }).map((_, i) => (
                        <span key={i} className={i < playerHp ? 'heart-full' : 'heart-empty'}>❤️</span>
                    ))}</div>
                </div>
                <div className="vs-text">VS</div>
                <div className="combatant boss-side">
                    <div className={`fighter-face ${bossAnim}`}>🧠</div>
                    <div className="comb-name">Dr. Bio Master</div>
                    <div className="boss-hp-bar"><div className="boss-hp-fill" style={{ width: `${(bossHp / BOSS_HP_MAX) * 100}%` }} /></div>
                    <div className="hp-text">{bossHp}/{BOSS_HP_MAX} HP</div>
                </div>
            </div>

            <div className="q-arena">
                <div className="bio-timer-bar"><div className="bio-timer-fill" style={{ width: `${(timeLeft / ROUND_TIME) * 100}%`, background: timerColor }} /></div>
                <div className="bio-timer" style={{ color: timerColor }}>⏱ {timeLeft}s — Q{current + 1}/{questions.length}</div>
                <AnimatePresence mode="wait">
                    <motion.div key={current} className="bio-q-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h2>{q.q}</h2>
                        <div className="bio-options">
                            {q.opts.map((opt, i) => (
                                <motion.button key={i}
                                    className={`bio-opt ${selected !== null ? (i === q.ans ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`}
                                    onClick={() => selected === null && handleAnswer(i)}
                                    whileHover={selected === null ? { scale: 1.03 } : {}}>
                                    <span className="opt-l">{String.fromCharCode(65 + i)}</span> {opt}
                                </motion.button>
                            ))}
                        </div>
                        {selected !== null && <div className={`bio-explain ${selected === q.ans ? 'good' : 'bad'}`}>{q.explain}</div>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DrBioMasterBoss;
