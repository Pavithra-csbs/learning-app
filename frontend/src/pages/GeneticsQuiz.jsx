import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './GeneticsQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "In Mendel's experiments, which trait was dominant in pea plants?",
        options: ["Short Height", "Tall Height", "White Flower", "Wrinkled Seed"],
        answer: "Tall Height",
        explanation: "Tallness (T) is dominant over shortness (t) in pea plants."
    },
    {
        id: 2,
        question: "A child inherits one 'T' allele and one 't' allele. What will be the phenotype?",
        options: ["Short", "Tall", "Medium", "Dwarf"],
        answer: "Tall",
        explanation: "Since 'T' is dominant, even one copy makes the plant tall (Tt)."
    },
    {
        id: 3,
        question: "Which of these is a homozygous recessive genotype?",
        options: ["TT", "Tt", "tt", "tT"],
        answer: "tt",
        explanation: "Homozygous means identical alleles. Recessive traits express only in 'tt' form."
    },
    {
        id: 4,
        question: "What did Mendel use to study inheritance?",
        options: ["Rose plants", "Fruit flies", "Garden Peas", "Snapdragons"],
        answer: "Garden Peas",
        explanation: "Mendel chose Pisum sativum due to its clear contrasting traits."
    },
    {
        id: 5,
        question: "The range of phenotypes you see in a cross between Tt x Tt is:",
        options: ["3 Tall : 1 Short", "1 Tall : 3 Short", "All Tall", "All Short"],
        answer: "3 Tall : 1 Short",
        explanation: "The phenotypic ratio for a monohybrid cross is 3:1."
    }
];

const GeneticsQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(15);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [gameState, setGameState] = useState('playing');

    useEffect(() => {
        if (gameState !== 'playing' || showExplanation) return;

        const interval = setInterval(() => {
            setTimer(t => {
                if (t <= 1) {
                    handleAnswer(null);
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
            setScore(s => s + 20 + timer);
            toast.success('Excellent! 🧬');
        } else {
            toast.error('Not quite! ❌');
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
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '3');
        if (curLevel < 4) localStorage.setItem('completed_levels_Heredity and Evolution', '4');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        const stars = score > 150 ? 3 : score > 80 ? 2 : 1;
        return (
            <div className="gq-finish-screen">
                <motion.div className="gq-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Quiz Completed! 🎓</h2>
                    <div className="stars-row">{'⭐'.repeat(stars)}</div>
                    <p className="final-score">Final Score: {score}</p>
                    <p className="motivational-text">
                        {stars === 3 ? "Hurray 🎉 You are a Genetics Champion!" :
                            stars === 2 ? "Good job 👍 Aim for full score!" :
                                "Don't worry 😊 Genetics is fun, try again!"}
                    </p>
                    <button className="finish-btn" onClick={handleComplete}>Unlock Variation Puzzle →</button>
                </motion.div>
            </div>
        );
    }

    const q = QUESTIONS[currentIdx];

    return (
        <div className="genetics-quiz-container">
            <header className="gq-header">
                <button className="gq-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>📝 Genetic Mastery Quiz</h1>
                <div className="gq-timer">⏱️ {timer}s</div>
            </header>

            <main className="gq-game-area">
                <div className="gq-progress">
                    <div className="gq-progress-bar" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={currentIdx} className="gq-card"
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <h2 className="gq-question">{q.question}</h2>
                        <div className="gq-options">
                            {q.options.map((opt, i) => (
                                <button
                                    key={i}
                                    className={`gq-opt-btn ${selectedOption === opt ? (opt === q.answer ? 'correct' : 'wrong') : ''} ${showExplanation && opt === q.answer ? 'correct' : ''}`}
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
                        <motion.div className="gq-explanation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <p><strong>💡 Explanation:</strong> {q.explanation}</p>
                            <button className="gq-next-btn" onClick={nextQuestion}>Next Question →</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default GeneticsQuiz;
