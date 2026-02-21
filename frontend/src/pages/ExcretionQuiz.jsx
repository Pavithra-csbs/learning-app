import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ExcretionQuiz.css';

const QUESTIONS = [
    { q: "What is the functional unit of the kidney?", opts: ["Neuron", "Nephron", "Alveolus", "Villi"], ans: 1, explain: "The nephron is the microscopic filtering unit. Each kidney has about 1 million nephrons." },
    { q: "Which organ filters blood to form urine?", opts: ["Liver", "Lungs", "Kidneys", "Skin"], ans: 2, explain: "Kidneys filter ~180 L of blood daily and produce about 1.5 L of urine." },
    { q: "What process first filters blood in the nephron?", opts: ["Reabsorption", "Secretion", "Ultrafiltration", "Dialysis"], ans: 2, explain: "Ultrafiltration in the glomerulus forces small molecules (water, salts, glucose, urea) into Bowman's capsule." },
    { q: "Urea is a waste product of:", opts: ["Fat digestion", "Carbohydrate breakdown", "Protein breakdown", "Photosynthesis"], ans: 2, explain: "Amino acids from protein breakdown are deaminated in the liver, producing urea." },
    { q: "Which substance is fully reabsorbed by healthy kidneys?", opts: ["Urea", "Glucose", "Some salts", "Creatinine"], ans: 1, explain: "Glucose is completely reabsorbed in the proximal tubule. Its presence in urine indicates diabetes." },
    { q: "The path of urine is:", opts: ["Kidney → Bladder → Ureter → Urethra", "Kidney → Ureter → Bladder → Urethra", "Bladder → Ureter → Kidney → Urethra", "Urethra → Bladder → Kidney → Ureter"], ans: 1, explain: "Urine: Kidney → Ureter → Bladder (stored) → Urethra (expelled)" },
    { q: "Which organ converts ammonia to urea?", opts: ["Kidney", "Pancreas", "Liver", "Spleen"], ans: 2, explain: "The liver converts toxic ammonia (from protein breakdown) into less toxic urea." },
    { q: "How do plants excrete excess oxygen?", opts: ["Through roots", "Through stomata", "Through bark", "Through flowers"], ans: 1, explain: "Plants release excess O₂ (from photosynthesis) through stomata in leaves." },
    { q: "Dialysis is a procedure that replaces the function of:", opts: ["Heart", "Lungs", "Kidneys", "Liver"], ans: 2, explain: "Dialysis artificially filters blood when kidneys fail — it mimics the nephron's filtration." },
    { q: "What does the Bowman's capsule collect?", opts: ["Only blood cells", "Filtrate from glomerulus", "Urine ready for ureter", "Bile"], ans: 1, explain: "Bowman's capsule surrounds the glomerulus and catches the filtrate — a plasma-like fluid minus large proteins." },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const ROUND_TIME = 18;

const ExcretionQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [questions] = useState(shuffle(QUESTIONS).slice(0, 8));
    const [qIdx, setQIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [gameState, setGameState] = useState('playing');
    const timerRef = useRef(null);

    const startTimer = () => {
        clearInterval(timerRef.current);
        setTimeLeft(ROUND_TIME);
        timerRef.current = setInterval(() =>
            setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 0; } return t - 1; }), 1000);
    };

    useEffect(() => { if (gameState === 'playing') startTimer(); return () => clearInterval(timerRef.current); }, [qIdx, gameState]);

    const handleAnswer = (idx) => {
        clearInterval(timerRef.current);
        setSelected(idx);
        const q = questions[qIdx];
        const correct = idx === q.ans;
        const bonus = timeLeft > 12 ? 5 : 0;
        if (correct) { setScore(s => s + 10 + bonus); toast.success(`+${10 + bonus} pts! ✅`); }
        else toast.error(`❌ ${q.explain}`);
        setTimeout(() => {
            setSelected(null);
            if (qIdx + 1 >= questions.length) setGameState('done');
            else setQIdx(i => i + 1);
        }, 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 6) localStorage.setItem('completed_levels_Life Processes', '6');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const getMotivation = () => {
        const pct = score / (questions.length * 15);
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    const maxScore = questions.length * 15;
    const timerColor = timeLeft > 9 ? '#22c55e' : timeLeft > 5 ? '#f59e0b' : '#ef4444';
    const q = questions[qIdx];

    if (gameState === 'done') return (
        <div className="eq-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                {score === maxScore && canvasConfetti({ particleCount: 200, spread: 100 })}
                <div style={{ fontSize: '4rem' }}>🚽</div>
                <h2>Excretion Expert!</h2>
                <div className="final-score">{score} / {maxScore} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / maxScore * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    return (
        <div className="eq-container">
            <header className="eq-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>🚽 Excretion Quiz</h1>
                <div className="eq-stats">🏆 {score} | Q{qIdx + 1}/{questions.length}</div>
            </header>
            <div className="eq-body">
                <div className="eq-timer-bar"><div className="eq-timer-fill" style={{ width: `${(timeLeft / ROUND_TIME) * 100}%`, background: timerColor }} /></div>
                <div className="eq-timer" style={{ color: timerColor }}>⏱ {timeLeft}s {timeLeft > 12 ? '⚡ Speed Bonus!' : ''}</div>
                <AnimatePresence mode="wait">
                    <motion.div key={qIdx} className="eq-q-card" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="eq-q-num">Q {qIdx + 1} of {questions.length}</div>
                        <h2>{q.q}</h2>
                        <div className="eq-options">
                            {q.opts.map((opt, i) => (
                                <motion.button key={i}
                                    className={`eq-opt ${selected !== null ? (i === q.ans ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`}
                                    onClick={() => selected === null && handleAnswer(i)} whileHover={selected === null ? { scale: 1.03 } : {}}>
                                    <span className="opt-l">{String.fromCharCode(65 + i)}</span> {opt}
                                </motion.button>
                            ))}
                        </div>
                        {selected !== null && <div className={`eq-explain ${selected === q.ans ? 'good' : 'bad'}`}>{q.explain}</div>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ExcretionQuiz;
