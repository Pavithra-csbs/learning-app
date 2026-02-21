import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './RespirationPath.css';

const PATH_STEPS = [
    { id: 1, label: '👃 Nose / Mouth', detail: 'Air enters; nose filters, warms, and moistens air', color: '#06b6d4' },
    { id: 2, label: '🗣️ Pharynx & Larynx', detail: 'Air passes to voice box (larynx); epiglottis prevents food entry', color: '#0891b2' },
    { id: 3, label: '💨 Trachea', detail: 'Windpipe reinforced with C-shaped cartilage rings to stay open', color: '#0e7490' },
    { id: 4, label: '🔀 Bronchi', detail: 'Trachea splits into left and right bronchi entering each lung', color: '#155e75' },
    { id: 5, label: '🫁 Bronchioles & Alveoli', detail: 'Alveoli (air sacs) have thin walls for O₂/CO₂ diffusion', color: '#164e63' },
    { id: 6, label: '🩸 Blood (Capillaries)', detail: 'O₂ diffuses into blood; CO₂ diffuses from blood into alveoli', color: '#ef4444' },
    { id: 7, label: '🫀 Heart (Left side)', detail: 'Oxygenated blood pumped to all body cells', color: '#dc2626' },
    { id: 8, label: '🔬 Body Cells', detail: 'Cells use O₂ for respiration → produce CO₂ + water + energy (ATP)', color: '#16a34a' },
];

const QUIZ_QS = [
    { q: "What do alveoli do?", opts: ["Digest food", "Exchange gases", "Pump blood", "Filter urine"], ans: 1, explain: "Alveoli are thin-walled air sacs that allow O₂ to enter blood and CO₂ to leave." },
    { q: "Which carries O₂ in blood?", opts: ["Plasma", "Platelets", "White blood cells", "Haemoglobin"], ans: 3, explain: "Haemoglobin in red blood cells binds O₂ and carries it to cells." },
    { q: "Aerobic respiration produces:", opts: ["Only CO₂", "CO₂ + H₂O + ATP", "Lactic acid", "Ethanol + CO₂"], ans: 1, explain: "Full equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP" },
    { q: "Anaerobic respiration in muscles produces:", opts: ["CO₂ + H₂O", "Ethanol", "Lactic acid", "O₂"], ans: 2, explain: "Without O₂, muscles produce lactic acid causing cramps." },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
const ROUND_TIME = 15;

const RespirationPath = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [phase, setPhase] = useState('path'); // path | quiz
    const [pathPool, setPathPool] = useState(shuffle([...PATH_STEPS]));
    const [pathArranged, setPathArranged] = useState([]);
    const [pathSelected, setPathSelected] = useState(null);
    const [pathChecked, setPathChecked] = useState(false);
    const [pathScore, setPathScore] = useState(0);

    const [qIdx, setQIdx] = useState(0);
    const [qSelected, setQSelected] = useState(null);
    const [quizScore, setQuizScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [stars, setStars] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const timerRef = useRef(null);

    useEffect(() => {
        if (phase === 'quiz' && gameState === 'playing') {
            setTimeLeft(ROUND_TIME);
            timerRef.current = setInterval(() => setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current); handleQuizAnswer(-1); return 0; }
                return t - 1;
            }), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [qIdx, phase]);

    const handlePathAdd = () => {
        if (!pathSelected) return;
        setPathArranged(prev => [...prev, pathSelected]);
        setPathPool(prev => prev.filter(s => s.id !== pathSelected.id));
        setPathSelected(null);
    };

    const handlePathCheck = () => {
        let correct = 0;
        pathArranged.forEach((s, i) => { if (s.id === PATH_STEPS[i]?.id) correct++; });
        setPathChecked(true);
        const pts = Math.round((correct / PATH_STEPS.length) * 40);
        setPathScore(pts);
        if (correct === PATH_STEPS.length) { canvasConfetti({ particleCount: 150, spread: 90 }); toast.success('Perfect oxygen path! 🎉'); }
        else toast(`${correct}/${PATH_STEPS.length} steps correct!`, { icon: '🫁' });
        setTimeout(() => setPhase('quiz'), 2500);
    };

    const handleQuizAnswer = (idx) => {
        clearInterval(timerRef.current);
        setQSelected(idx);
        const q = QUIZ_QS[qIdx];
        const correct = idx === q.ans;
        if (correct) { setQuizScore(s => s + 15); toast.success('Correct! ✅'); }
        else toast.error(`Wrong! ${q.explain}`);
        setTimeout(() => {
            setQSelected(null);
            if (qIdx + 1 >= QUIZ_QS.length) {
                setStars(Math.max(1, Math.min(3, Math.ceil((quizScore + (correct ? 15 : 0)) / (QUIZ_QS.length * 15) * 3))));
                setGameState('done');
            } else { setQIdx(i => i + 1); }
        }, 2000);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Life Processes') || '1');
        if (cur < 4) localStorage.setItem('completed_levels_Life Processes', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Life Processes`);
    };

    const totalScore = pathScore + quizScore;
    const maxScore = 40 + QUIZ_QS.length * 15;
    const getMotivation = () => {
        const pct = totalScore / maxScore;
        if (pct >= 0.9) return "🎉 Hurray! You are a Human Body Champion!";
        if (pct >= 0.6) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Your body is still learning!";
    };

    if (gameState === 'done') return (
        <div className="rp-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div style={{ fontSize: '4rem' }}>🫁</div>
                <h2>Respiration Mastered!</h2>
                <div className="final-score">{totalScore} / {maxScore} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, stars))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    if (phase === 'quiz') {
        const q = QUIZ_QS[qIdx];
        const timerPct = (timeLeft / ROUND_TIME) * 100;
        const timerColor = timeLeft > 8 ? '#22c55e' : timeLeft > 4 ? '#f59e0b' : '#ef4444';
        return (
            <div className="rp-container">
                <header className="rp-header">
                    <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                    <h1>🫁 Respiration Quiz</h1>
                    <div className="rp-stats">🏆 {totalScore} | Q{qIdx + 1}/{QUIZ_QS.length}</div>
                </header>
                <div className="rp-quiz-body">
                    <div className="rp-timer-bar"><div className="rp-timer-fill" style={{ width: `${timerPct}%`, background: timerColor }} /></div>
                    <div className="rp-timer-text" style={{ color: timerColor }}>⏱ {timeLeft}s</div>
                    <AnimatePresence mode="wait">
                        <motion.div key={qIdx} className="rp-q-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h2>{q.q}</h2>
                            <div className="rp-options">
                                {q.opts.map((opt, i) => (
                                    <motion.button key={i} className={`rp-option ${qSelected !== null ? (i === q.ans ? 'correct' : i === qSelected ? 'wrong' : 'dim') : ''}`}
                                        onClick={() => qSelected === null && handleQuizAnswer(i)} whileHover={qSelected === null ? { scale: 1.03 } : {}}>
                                        <span className="opt-l">{String.fromCharCode(65 + i)}</span> {opt}
                                    </motion.button>
                                ))}
                            </div>
                            {qSelected !== null && <div className={`rp-explain ${qSelected === q.ans ? 'good' : 'bad'}`}>{q.explain}</div>}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="rp-container">
            <header className="rp-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Map</button>
                <h1>🫁 Respiration Path Game</h1>
                <div className="rp-stats">Placed: {pathArranged.length}/{PATH_STEPS.length}</div>
            </header>
            <div className="rp-body">
                <p className="instruction">Arrange the <strong>oxygen path</strong> through the body in the correct order!</p>
                <div className="rp-rows">
                    {PATH_STEPS.map((_, i) => {
                        const f = pathArranged[i];
                        const isCorrect = pathChecked && f && f.id === PATH_STEPS[i].id;
                        const isWrong = pathChecked && f && f.id !== PATH_STEPS[i].id;
                        return (
                            <div key={i} className="rp-row">
                                <div className={`rp-slot ${f ? 'filled' : 'empty'} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                                    style={f ? { borderColor: f.color, background: `${f.color}20` } : {}}>
                                    <span className="slot-n">{i + 1}</span>
                                    {f ? <span style={{ color: f.color }}>{f.label}: <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{f.detail}</span></span>
                                        : <span className="slot-ph">Step {i + 1}…</span>}
                                    {f && !pathChecked && <button className="rem-btn" onClick={() => { setPathArranged(prev => prev.filter(s => s.id !== f.id)); setPathPool(prev => [...prev, f]); }}>✕</button>}
                                </div>
                                {i < PATH_STEPS.length - 1 && <div className="path-arrow" style={{ color: PATH_STEPS[i]?.color || '#06b6d4' }}>↓</div>}
                            </div>
                        );
                    })}
                </div>
                <div className="rp-pool-area">
                    <h3>🔬 Step Pool:</h3>
                    <div className="rp-pool">{pathPool.map(s => (
                        <motion.button key={s.id} className={`rp-pool-btn ${pathSelected?.id === s.id ? 'sel' : ''}`} style={{ borderColor: s.color }}
                            onClick={() => setPathSelected(s)} whileHover={{ scale: 1.04 }}>{s.label}</motion.button>
                    ))}</div>
                    <div className="rp-actions">
                        {pathSelected && <button className="add-btn" onClick={handlePathAdd}>Add "{pathSelected.label}" ↑</button>}
                        {pathArranged.length === PATH_STEPS.length && !pathChecked && <button className="check-btn" onClick={handlePathCheck}>✅ Check Path!</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RespirationPath;
