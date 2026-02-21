import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './NervousSystemQuiz.css';

const QUESTIONS = [
    {
        id: 1,
        question: "Which part of the neuron receives signals from other neurons?",
        options: ["Axon", "Dendrite", "Cell Body", "Synapse"],
        correct: 1,
        explanation: "Dendrites are branch-like structures that receive chemical signals and convert them into electrical impulses."
    },
    {
        id: 2,
        question: "The gap between two neurons is called:",
        options: ["Synapse", "Axon hillock", "Node of Ranvier", "Dendrite cap"],
        correct: 0,
        explanation: "A synapse is the junction where signals pass from the axon of one neuron to the dendrite of another."
    },
    {
        id: 3,
        question: "Reflex actions are primarily controlled by which organ?",
        options: ["Brain", "Spinal Cord", "Heart", "Liver"],
        correct: 1,
        explanation: "Spinal cord controls reflex actions to provide a faster response without involving the brain's thinking process initially."
    },
    {
        id: 4,
        question: "Which part of the brain is responsible for precision and balance?",
        options: ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"],
        correct: 1,
        explanation: "The cerebellum (hindbrain) coordinates voluntary movements like posture, balance, and speech."
    },
    {
        id: 5,
        question: "What is the direction of an impulse in a neuron?",
        options: ["Axon → Dendrite", "Dendrite → Cell Body → Axon", "Cell Body → Dendrite", "Axon → Cell Body"],
        correct: 1,
        explanation: "Impulses travel from dendrites to the cell body and then along the axon to the next synapse."
    },
    {
        id: 6,
        question: "The Central Nervous System (CNS) consists of:",
        options: ["Brain and Nerves", "Spinal Cord and Nerves", "Brain and Spinal Cord", "Only Brain"],
        correct: 2,
        explanation: "The CNS is made up of the brain and the spinal cord."
    },
    {
        id: 7,
        question: "Involuntary actions like salivation and vomiting are controlled by:",
        options: ["Cerebrum", "Cerebellum", "Medulla in Hindbrain", "Hypothalamus"],
        correct: 2,
        explanation: "The Medulla controls involuntary functions such as breathing, heart rate, and blood pressure."
    },
    {
        id: 8,
        question: "The chemical used to transmit signals across a synapse is called:",
        options: ["Hormone", "Neurotransmitter", "Enzyme", "Blood"],
        correct: 1,
        explanation: "Neurotransmitters are chemical messengers released at the synapse to relay the signal to the next neuron."
    }
];

const NervousSystemQuiz = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(15);
    const [gameState, setGameState] = useState('playing'); // playing | done
    const timerRef = useRef(null);

    useEffect(() => {
        if (gameState === 'playing' && !showExplanation) {
            timerRef.current = setInterval(() => {
                setTimer(t => {
                    if (t <= 1) {
                        handleAnswer(-1); // Time out
                        return 15;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [currentQ, showExplanation, gameState]);

    const handleAnswer = (idx) => {
        clearInterval(timerRef.current);
        setSelectedOption(idx);
        const correct = idx === QUESTIONS[currentQ].correct;

        if (correct) {
            setScore(s => s + 10 + timer); // Speed bonus
            toast.success('Correct! ⚡');
        } else {
            toast.error(idx === -1 ? 'Time Out! ⏰' : 'Incorrect! ❌');
        }

        setShowExplanation(true);
    };

    const nextQuestion = () => {
        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(c => c + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            setTimer(15);
        } else {
            setGameState('done');
            canvasConfetti({ particleCount: 150, spread: 70 });
        }
    };

    const handleComplete = () => {
        const cur = parseInt(localStorage.getItem('completed_levels_Control and Coordination') || '4');
        if (cur < 5) localStorage.setItem('completed_levels_Control and Coordination', '5');
        navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`);
    };

    if (gameState === 'done') {
        const percentage = (score / 200) * 100; // max possible is around 200 with bonuses
        const stars = percentage > 80 ? 3 : percentage > 50 ? 2 : 1;
        const msg = stars === 3 ? "Hurray 🎉 You are a Brain Power Champion!" :
            stars === 2 ? "Good job 👍 Try for full score!" :
                "Don't worry 😊 Your brain is learning!";

        return (
            <div className="nsq-container done">
                <motion.div className="nsq-result-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Nervous System Mastered!</h2>
                    <div className="nsq-stars">{'⭐'.repeat(stars)}</div>
                    <p className="nsq-score">Total Score: {score}</p>
                    <p className="nsq-msg">{msg}</p>
                    <button className="nsq-btn" onClick={handleComplete}>Join Endocrine Puzzle →</button>
                </motion.div>
            </div>
        );
    }

    const q = QUESTIONS[currentQ];

    return (
        <div className="nsq-container">
            <header className="nsq-header">
                <button className="nsq-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Map</button>
                <div className="nsq-progress">Question {currentQ + 1} / {QUESTIONS.length}</div>
                <div className="nsq-score">Score: {score}</div>
            </header>

            <main className="nsq-main">
                <div className="nsq-top">
                    <div className={`nsq-timer ${timer < 5 ? 'danger' : ''}`}>⏱️ {timer}s</div>
                    <div className="nsq-q-box">
                        <motion.h2 key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>{q.question}</motion.h2>
                    </div>
                </div>

                <div className="nsq-options">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`nsq-opt-btn ${selectedOption === i ? (i === q.correct ? 'correct' : 'wrong') : ''} ${showExplanation && i === q.correct ? 'correct' : ''}`}
                            onClick={() => !showExplanation && handleAnswer(i)}
                            disabled={showExplanation}
                        >
                            <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div className="nsq-explanation" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <div className="expl-text">
                                <strong>{selectedOption === q.correct ? '✅ Amazing!' : '❌ Learning Moment:'}</strong>
                                <p>{q.explanation}</p>
                            </div>
                            <button className="nsq-next-btn" onClick={nextQuestion}>Next →</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default NervousSystemQuiz;
