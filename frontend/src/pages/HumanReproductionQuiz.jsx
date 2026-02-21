import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './HumanReproductionQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Where are sperms produced in the human male reproductive system?",
        options: ["Vas deferens", "Prostate gland", "Testes", "Urethra"],
        answer: "Testes",
        explanation: "Testes produce sperms and the hormone testosterone."
    },
    {
        id: 2,
        question: "Which part of the female reproductive system produces eggs (ova)?",
        options: ["Fallopian Tube", "Ovary", "Uterus", "Cervix"],
        answer: "Ovary",
        explanation: "Ovaries are the primary female reproductive organs that produce eggs."
    },
    {
        id: 3,
        question: "Where does fertilization usually take place in humans?",
        options: ["Vagina", "Uterus", "Fallopian Tube (Oviduct)", "Ovary"],
        answer: "Fallopian Tube (Oviduct)",
        explanation: "Fertilization occurs when sperm meets the egg in the fallopian tube."
    },
    {
        id: 4,
        question: "What is the common passage for both sperms and urine in human males?",
        options: ["Ureter", "Urethra", "Vas deferens", "Ejaculatory duct"],
        answer: "Urethra",
        explanation: "In males, the urethra serves as a common passage. It is connected to both the bladder and the vas deferens."
    },
    {
        id: 5,
        question: "The period during which the body reaches sexual maturity is called:",
        options: ["Adulthood", "Puberty", "Gestation", "Menopause"],
        answer: "Puberty",
        explanation: "Puberty involves hormonal changes leading to maturity of reproductive organs."
    },
    {
        id: 6,
        question: "The placenta is a special tissue that provides nutrition to the embryo from:",
        options: ["Amniotic fluid", "Mother's blood", "Yolk sac", "Uterine wall directly"],
        answer: "Mother's blood",
        explanation: "Placenta allows glucose, oxygen, and other substances to pass from mother to embryo."
    }
];

const HumanReproductionQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(15);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [gameState, setGameState] = useState('playing'); // playing | finished

    useEffect(() => {
        if (gameState !== 'playing' || showExplanation) return;

        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    handleAnswer(null); // Time out
                    return 15;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, currentIdx, showExplanation]);

    const handleAnswer = (option) => {
        if (showExplanation) return;

        setSelectedOption(option);
        if (option === QUESTIONS[currentIdx].answer) {
            setScore(s => s + 15 + timer); // Speed bonus
            toast.success('Correct! 🧠');
        } else {
            toast.error('Incorrect. ❌');
        }
        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentIdx < QUESTIONS.length - 1) {
            setCurrentIdx(c => c + 1);
            setTimer(15);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setGameState('finished');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_How do Organisms Reproduce?') || '4');
        if (curLevel < 5) localStorage.setItem('completed_levels_How do Organisms Reproduce?', '5');
        navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`);
    };

    if (gameState === 'finished') {
        const stars = score > 150 ? 3 : score > 80 ? 2 : 1;
        return (
            <div className="hrq-finish-screen">
                <motion.div className="hrq-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Quiz Completed! 🎓</h2>
                    <div className="stars-row">{'⭐'.repeat(stars)}</div>
                    <p className="final-score">Final Score: {score}</p>
                    <p className="motivational-text">
                        {stars === 3 ? "Hurray 🎉 You are a Reproduction Champion!" :
                            stars === 2 ? "Good job 👍 Try for full score!" :
                                "Don't worry 😊 Learning takes time!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Menstrual Cycle Puzzle →</button>
                </motion.div>
            </div>
        );
    }

    const q = QUESTIONS[currentIdx];

    return (
        <div className="repro-quiz-container">
            <header className="hrq-header">
                <button className="hrq-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🧠 Human Reproduction Quiz</h1>
                <div className="hrq-timer">⏱️ {timer}s</div>
            </header>

            <main className="hrq-game-area">
                <div className="hrq-progress-bar">
                    <div className="hrq-progress-fill" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}></div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={currentIdx} className="hrq-question-card"
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <h2 className="hrq-question-text">{q.question}</h2>

                        <div className="hrq-options-grid">
                            {q.options.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`hrq-option-btn ${selectedOption === opt ? (opt === q.answer ? 'correct' : 'wrong') : ''} ${showExplanation && opt === q.answer ? 'correct' : ''}`}
                                    disabled={showExplanation}
                                    onClick={() => handleAnswer(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div className="hrq-explanation-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <p><strong>💡 Explanation:</strong> {q.explanation}</p>
                            <button className="hrq-next-btn" onClick={nextQuestion}>Next Question →</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="hrq-footer">
                <div className="hrq-score-display">Score: {score}</div>
                <div className="hrq-q-counter">Question {currentIdx + 1} / {QUESTIONS.length}</div>
            </footer>
        </div>
    );
};

export default HumanReproductionQuiz;
