import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './ElementPropertyQuiz.css';

const QUESTIONS = [
    { q: "Which property INCREASES across a period (left to right)?", options: ["Atomic size", "Metallic character", "Nuclear charge", "Valence shell electrons only"], ans: 2, explain: "Nuclear charge increases as we move left to right, since more protons are added." },
    { q: "Atomic size (radius) increases as we move DOWN a group. Why?", options: ["Nuclear charge decreases", "New electron shells are added", "Protons decrease", "Electrons are lost"], ans: 1, explain: "Each period adds a new shell, increasing distance from nucleus." },
    { q: "Which group contains elements with valency ZERO?", options: ["Group 1", "Group 14", "Group 17", "Group 18"], ans: 3, explain: "Group 18 are noble gases with completely filled outer shells — valency = 0." },
    { q: "Metallic character DECREASES across a period. Why?", options: ["Electrons increase", "Nuclear charge pulls electrons tighter", "Protons decrease", "New shells are added"], ans: 1, explain: "As nuclear charge increases, atoms hold electrons more tightly and behave less like metals." },
    { q: "Which element has a larger atomic radius: Li or Cs?", options: ["Li", "Cs", "Both same", "Cannot determine"], ans: 1, explain: "Cs (Caesium) is in Period 6, Group 1 — much lower in the group, so it has more shells and is larger." },
    { q: "Which of these is a metalloid?", options: ["Sodium (Na)", "Chlorine (Cl)", "Silicon (Si)", "Calcium (Ca)"], ans: 2, explain: "Silicon is a classic metalloid — it shows properties of both metals and non-metals." },
    { q: "Elements in the same GROUP have the same:", options: ["Atomic mass", "Number of protons", "Valency (combining capacity)", "Number of neutrons"], ans: 2, explain: "Elements in the same group have the same number of valence electrons, giving them the same valency." },
    { q: "Which period 3 element is a noble gas?", options: ["Sulfur (S)", "Phosphorus (P)", "Chlorine (Cl)", "Argon (Ar)"], ans: 3, explain: "Argon (Ar) is in Group 18, Period 3 — a noble gas with complete outer shell." },
    { q: "As we move DOWN Group 1, reactivity of metals:", options: ["Decreases", "Stays the same", "Increases", "First increases then decreases"], ans: 2, explain: "Reactivity increases down Group 1 because the outermost electron is farther from nucleus and easier to lose." },
    { q: "The Modern Periodic Law states properties depend on:", options: ["Atomic mass", "Atomic number", "Melting point", "Number of neutrons"], ans: 1, explain: "The Modern Periodic Law — properties are periodic functions of their ATOMIC NUMBER." },
];

const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

const TIME_PER_Q = 20;

const ElementPropertyQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [questions] = useState(shuffle(QUESTIONS).slice(0, 8));
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
    const [gameState, setGameState] = useState('playing');
    const timerRef = useRef(null);

    const q = questions[current];

    const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    const startTimer = () => {
        clearTimer();
        setTimeLeft(TIME_PER_Q);
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
            setScore(s => s + (timeLeft > 10 ? 15 : 10));
            canvasConfetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
            toast.success('Correct! 🎯');
        } else {
            toast.error(`Wrong! ${q.explain.split('.')[0]}`);
        }
        setTimeout(() => {
            setSelected(null);
            if (current + 1 >= questions.length) {
                setGameState('done');
            } else {
                setCurrent(c => c + 1);
            }
        }, 2500);
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Periodic Classification of Elements') || '1');
        if (cur < 5) localStorage.setItem('completed_levels_Periodic Classification of Elements', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
    };

    const getMotivation = () => {
        const pct = score / (questions.length * 15);
        if (pct >= 0.85) return "🎉 Hurray! You are a Periodic Table Champion!";
        if (pct >= 0.55) return "👍 Good job! Try for full score!";
        return "😊 Don't worry! Explore the table again!";
    };

    if (gameState === 'done') return (
        <div className="epq-container done">
            <motion.div className="result-box" initial={{ scale: 0.7 }} animate={{ scale: 1 }}>
                <div>🏆</div>
                <h2>Quiz Complete!</h2>
                <div className="final-score">{score} pts</div>
                <p className="motivation">{getMotivation()}</p>
                <div className="stars">{'⭐'.repeat(Math.max(1, Math.min(3, Math.ceil(score / (questions.length * 15) * 3))))}</div>
                <button className="next-btn" onClick={handleComplete}>Next Level →</button>
            </motion.div>
        </div>
    );

    const timerPct = (timeLeft / TIME_PER_Q) * 100;
    const timerColor = timeLeft > 10 ? '#22c55e' : timeLeft > 5 ? '#f59e0b' : '#ef4444';

    return (
        <div className="epq-container">
            <header className="epq-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>← Map</button>
                <h1>❓ Element Property Quiz</h1>
                <div className="epq-stats"><span>🏆 {score}</span><span>Q{current + 1}/{questions.length}</span></div>
            </header>

            <div className="epq-body">
                <div className="timer-bar">
                    <div className="timer-fill" style={{ width: `${timerPct}%`, backgroundColor: timerColor }} />
                </div>
                <div className="timer-text" style={{ color: timerColor }}>⏱ {timeLeft}s</div>

                <AnimatePresence mode="wait">
                    <motion.div className="question-card" key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className="q-num">Question {current + 1}</div>
                        <h2>{q.q}</h2>

                        <div className="options">
                            {q.options.map((opt, i) => (
                                <motion.button
                                    key={i}
                                    className={`option ${selected !== null ? (i === q.ans ? 'correct' : i === selected ? 'wrong' : 'dim') : ''}`}
                                    onClick={() => selected === null && handleAnswer(i)}
                                    whileHover={selected === null ? { scale: 1.02 } : {}}
                                >
                                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                                    {opt}
                                </motion.button>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selected !== null && (
                                <motion.div className="explain" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    💡 {q.explain}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ElementPropertyQuiz;
