import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './MendeleevBoss.css';

const BOSS_QUESTIONS = [
    { q: "Atomic number of Oxygen?", options: ["6", "7", "8", "9"], ans: 2 },
    { q: "Symbol for Potassium?", options: ["P", "Po", "K", "Pt"], ans: 2 },
    { q: "Which is NOT in Group 1?", options: ["Li", "Na", "Mg", "K"], ans: 2 },
    { q: "Noble gases are in Group:", options: ["1", "17", "18", "16"], ans: 2 },
    { q: "Moving down Group 17, reactivity:", options: ["Increases", "Decreases", "Same", "Unpredictable"], ans: 1 },
    { q: "Atomic radius: which is LARGER?", options: ["F", "Cl", "Br", "I"], ans: 3 },
    { q: "Period 2 has how many elements?", options: ["2", "18", "8", "32"], ans: 2 },
    { q: "Valency of Carbon (Group 14)?", options: ["2", "4", "1", "0"], ans: 1 },
    { q: "Which is a metalloid?", options: ["Si", "Na", "Cl", "Fe"], ans: 0 },
    { q: "Modern Periodic Table has how many groups?", options: ["7", "8", "16", "18"], ans: 3 },
    { q: "Symbol of Gold?", options: ["Go", "Gd", "Au", "Ag"], ans: 2 },
    { q: "Alkali metals are in Group:", options: ["2", "1", "17", "18"], ans: 1 },
    { q: "Which element was predicted by Mendeleev but not yet discovered?", options: ["Helium", "Eka-silicon", "Neon", "Argon"], ans: 1 },
    { q: "Metallic character in a period (left → right):", options: ["Increases", "Decreases", "Same", "First increases then decreases"], ans: 1 },
    { q: "Symbol of Iron?", options: ["Ir", "In", "Fe", "F"], ans: 2 },
    { q: "Which has the smallest atomic radius in Period 3?", options: ["Na", "Mg", "Al", "Ar"], ans: 3 },
    { q: "Halogens are in Group:", options: ["16", "17", "18", "1"], ans: 1 },
    { q: "Number of periods in the modern table?", options: ["6", "7", "8", "18"], ans: 1 },
    { q: "Valency of elements in Group 18?", options: ["8", "1", "2", "0"], ans: 3 },
    { q: "Silicon's group and period?", options: ["14, Period 3", "16, Period 3", "14, Period 2", "18, Period 3"], ans: 0 },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const BOSS_HP_MAX = 10;
const PLAYER_HP_MAX = 5;
const ROUND_TIME = 12;

const MendeleevBoss = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [questions] = useState(shuffle(BOSS_QUESTIONS).slice(0, 15));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [bossHp, setBossHp] = useState(BOSS_HP_MAX);
    const [playerHp, setPlayerHp] = useState(PLAYER_HP_MAX);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [gameState, setGameState] = useState('intro'); // intro, playing, done
    const [winner, setWinner] = useState(null);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [bossAnim, setBossAnim] = useState('idle');
    const [playerAnim, setPlayerAnim] = useState('idle');
    const timerRef = useRef(null);

    const q = questions[current];

    const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    const startTimer = () => {
        clearTimer();
        setTimeLeft(ROUND_TIME);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearTimer(); handleAnswer(-1); return 0; }
                return t - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        if (gameState === 'playing') startTimer();
        return clearTimer;
    }, [current, gameState]);

    const handleAnswer = (idx) => {
        clearTimer();
        setSelected(idx);
        const correct = idx === q.ans;

        if (correct) {
            const newCombo = combo + 1;
            setCombo(newCombo);
            const pts = newCombo >= 3 ? 20 : 10;
            setScore(s => s + pts);
            const dmg = newCombo >= 3 ? 2 : 1;
            setBossHp(h => {
                const newHp = Math.max(0, h - dmg);
                if (newHp <= 0) { endGame('player'); }
                return newHp;
            });
            setBossAnim('hurt');
            setPlayerAnim('attack');
            if (newCombo >= 3) toast.success(`🔥 ${newCombo}x COMBO! +${pts} pts!`);
            else toast.success('Hit! ⚡');
        } else {
            setCombo(0);
            setPlayerHp(h => {
                const newHp = Math.max(0, h - 1);
                if (newHp <= 0) { endGame('boss'); }
                return newHp;
            });
            setBossAnim('attack');
            setPlayerAnim('hurt');
            toast.error(`Wrong! Dr. M attacks! 💥`);
        }

        setTimeout(() => {
            setBossAnim('idle');
            setPlayerAnim('idle');
            setSelected(null);
            if (current + 1 >= questions.length) {
                endGame(bossHp > playerHp ? 'boss' : 'player');
            } else {
                setCurrent(c => c + 1);
            }
        }, 1800);
    };

    const endGame = (w) => {
        clearTimer();
        setWinner(w);
        setGameState('done');
        if (w === 'player') {
            canvasConfetti({ particleCount: 250, spread: 120 });
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (cur < 9) localStorage.setItem('completed_levels_Periodic Classification of Elements', '9');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const stars = () => {
        const pct = score / (questions.length * 20);
        if (winner === 'boss') return 1;
        return pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
    };

    const getMotivation = () => {
        if (winner === 'boss') return "😊 Don't worry! Explore the table again!";
        const pct = score / (questions.length * 15);
        if (pct >= 0.85) return "🎉 Hurray! You are a Periodic Table Champion!";
        return "👍 Good job! Try for full score!";
    };

    if (gameState === 'intro') return (
        <div className="boss-container intro">
            <motion.div className="intro-box" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <div className="boss-sprite idle">🤖</div>
                <h1>Dr. Mendeleev AI</h1>
                <p>"You dare challenge the creator of the Periodic Table?<br />Rapid-fire questions await you, young chemist!"</p>
                <div className="intro-rules">
                    <div>⚡ Answer in {ROUND_TIME}s or lose HP</div>
                    <div>🔥 3+ Streaks = COMBO bonus</div>
                    <div>🏆 Defeat Dr. M to become Periodic Master!</div>
                </div>
                <motion.button className="start-btn" onClick={() => setGameState('playing')} whileHover={{ scale: 1.05 }}>
                    ⚔️ Start Battle!
                </motion.button>
            </motion.div>
        </div>
    );

    if (gameState === 'done') return (
        <div className="boss-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div className="boss-sprite">{winner === 'player' ? '🏆' : '💀'}</div>
                <h2>{winner === 'player' ? 'VICTORY! Dr. Mendeleev Defeated!' : 'Defeated... Try again!'}</h2>
                <div className="final-score">{score} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(stars())}</div>
                {winner === 'player' && (
                    <div className="badge">🏅 Periodic Table Master Badge Earned!</div>
                )}
                <div className="done-buttons">
                    <button className="next-btn" onClick={handleComplete}>Return to Map</button>
                </div>
            </motion.div>
        </div>
    );

    const timerColor = timeLeft > 6 ? '#22c55e' : timeLeft > 3 ? '#f59e0b' : '#ef4444';

    return (
        <div className="boss-container">
            <header className="boss-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>⚔️ Boss Battle: Dr. Mendeleev AI</h1>
                <div className="boss-score">🏆 {score} {combo >= 3 ? `🔥 ${combo}x COMBO!` : ''}</div>
            </header>

            <div className="battle-arena">
                <div className="combatant player-side">
                    <div className={`fighter-sprite ${playerAnim}`}>🧑‍🔬</div>
                    <div className="combatant-name">You</div>
                    <div className="hp-bar">
                        {Array.from({ length: PLAYER_HP_MAX }).map((_, i) => (
                            <div key={i} className={`hp-heart ${i < playerHp ? 'full' : 'empty'}`}>❤️</div>
                        ))}
                    </div>
                </div>

                <div className="vs-badge">VS</div>

                <div className="combatant boss-side">
                    <div className={`fighter-sprite ${bossAnim}`}>🤖</div>
                    <div className="combatant-name">Dr. Mendeleev AI</div>
                    <div className="hp-bar-boss">
                        <div className="hp-fill" style={{ width: `${(bossHp / BOSS_HP_MAX) * 100}%` }} />
                    </div>
                    <div className="hp-text">{bossHp}/{BOSS_HP_MAX} HP</div>
                </div>
            </div>

            <div className="question-arena">
                <div className="timer-bar">
                    <div className="timer-fill" style={{ width: `${(timeLeft / ROUND_TIME) * 100}%`, background: timerColor }} />
                </div>
                <div className="timer-text" style={{ color: timerColor }}>⏱ {timeLeft}s</div>

                <AnimatePresence mode="wait">
                    <motion.div className="q-card" key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="q-round">Q {current + 1}/{questions.length}</div>
                        <h2>{q.q}</h2>
                        <div className="boss-options">
                            {q.options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    className={`boss-option ${selected !== null ? (i === q.ans ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`}
                                    onClick={() => selected === null && handleAnswer(i)}
                                    whileHover={selected === null ? { scale: 1.03 } : {}}
                                >
                                    <span className="opt-l">{String.fromCharCode(65 + i)}</span>
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MendeleevBoss;
