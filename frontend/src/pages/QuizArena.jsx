import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './QuizArena.css';

// Mock Data
const MOCK_QUESTIONS = [
    { id: 1, question: "What is 5 + 3?", options: ["53", "8", "9", "7"], correct: "8" },
    { id: 2, question: "Which animal says Meow?", options: ["Dog", "Cow", "Cat", "Lion"], correct: "Cat" },
    { id: 3, question: "How many legs does a spider have?", options: ["6", "8", "4", "10"], correct: "8" },
    { id: 4, question: "What color is a banana?", options: ["Red", "Blue", "Yellow", "Purple"], correct: "Yellow" },
    { id: 5, question: "20 - 5 = ?", options: ["15", "10", "25", "0"], correct: "15" },
];

const QuizArena = () => {
    const { topicId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const query = new URLSearchParams(window.location.search);
    const isLive = query.get('live') === 'true';
    const roomCode = query.get('room');

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null); // null, 'correct', 'wrong'

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                console.log("DEBUG: Fetching quiz for", topicId);
                const selectedWorld = localStorage.getItem('selectedWorld') || 'science';
                const subjectName = selectedWorld === 'math' ? 'Math' : 'Science';

                const apiUrl = '/api/generate-quiz';
                console.log("DEBUG: Request URL:", apiUrl);

                const response = await axios.post(apiUrl, {
                    subject: subjectName,
                    chapter: 'Chapter 1',
                    topic: `Topic ${topicId}`,
                    level: parseInt(topicId)
                });

                console.log("DEBUG: Server Response:", response.data);

                if (response.data.questions) {
                    const formatted = response.data.questions.map(q => ({
                        id: q.id,
                        question: q.question,
                        options: Object.values(q.options),
                        correct: q.options[q.correct_answer]
                    }));
                    setQuestions(formatted);
                }
            } catch (error) {
                console.error("DEBUG: Quiz Fetch FAILED:", error);
                const status = error.response?.status;
                const msg = error.response?.data?.error || error.message;
                toast.error(`Sync Failed (${status}): ${msg}. Using Backup Data! 🤖`);
                // Fallback
                setQuestions([
                    { id: 1, question: "What is 5 + 3?", options: ["53", "8", "9", "7"], correct: "8" },
                ]);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchQuiz();
    }, [token, topicId]);

    const handleAnswer = (option) => {
        if (selectedOption) return; // Prevent double clicks

        setSelectedOption(option);
        const currentQ = questions[currentQIndex];
        const correct = currentQ.correct;
        const correctStatus = option === correct;
        const newScore = score + (correctStatus ? 1 : 0);

        setIsCorrect(correctStatus ? 'correct' : 'wrong');
        if (correctStatus) {
            setScore(newScore);
            // Mini POP confetti
            canvasConfetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        }

        if (isLive) {
            import('socket.io-client').then(({ default: io }) => {
                const socket = io('http://localhost:5000');
                socket.emit('submit_answer', {
                    room_code: roomCode,
                    student_name: user?.name || "Student",
                    score: newScore
                });
            });
        }

        setTimeout(() => {
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(currentQIndex + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                finishQuiz(newScore);
            }
        }, 1200);
    };

    const [resultData, setResultData] = useState(null);

    const finishQuiz = async (finalScore) => {
        try {
            const res = await axios.post('/quiz/submit', {
                topic_id: topicId,
                score: finalScore
            });
            setResultData(res.data);
            if (res.data.stars === 3) {
                // Big Confetti
                var duration = 3 * 1000;
                var animationEnd = Date.now() + duration;
                var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                var interval = setInterval(function () {
                    var timeLeft = animationEnd - Date.now();
                    if (timeLeft <= 0) return clearInterval(interval);
                    var particleCount = 50 * (timeLeft / duration);
                    canvasConfetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
                }, 250);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            // Fallback for demo
            setResultData({
                stars: finalScore === questions.length ? 3 : finalScore >= 2 ? 1 : 0,
                message: finalScore === questions.length ? "Hurray 🎉 Woohoo! You got full score!" : "Nice job!",
                score: finalScore,
                total_questions: questions.length
            });
        }
        setShowResult(true);
    };

    if (loading) return <div className="quiz-container"><div className="text-white text-2xl animate-pulse">Consulting the Magic Textbook... 📖✨</div></div>;

    if (showResult) {
        const stars = resultData?.stars || 0;
        const msg = resultData?.message || "Great effort!";

        return (
            <div className="quiz-container">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="quiz-card result-card"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Quiz Completed! 🎉</h1>
                    <p className="text-2xl font-bold text-purple-600 mb-4">{msg}</p>

                    <div className="stars-result">
                        {[1, 2, 3].map(s => (
                            <span key={s} className="star-pop" style={{
                                filter: s <= stars ? 'none' : 'grayscale(100%) opacity(0.3)',
                                animationDelay: `${s * 0.2}s`
                            }}>⭐</span>
                        ))}
                    </div>
                    <p className="text-xl text-gray-600">You scored</p>
                    <div className="score-display">{score} / {questions.length}</div>

                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={() => navigate('/map')} className="restart-btn">
                            Back to Map 🗺️
                        </button>
                    </div>
                </motion.div>
            </div>
        )
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="quiz-container">
            {/* Background elements */}
            <div className="quiz-bg-shape" style={{ top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'white' }}></div>
            <div className="quiz-bg-shape" style={{ bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'yellow' }}></div>

            <motion.div
                key={currentQIndex}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="quiz-card"
            >
                {/* Header / Progress */}
                <div className="flex justify-between text-gray-500 font-bold mb-2">
                    <span>Question {currentQIndex + 1} / {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}></div>
                </div>

                {/* Question */}
                <div className="question-text">
                    {currentQ.question}
                </div>

                {/* Options */}
                <div className="options-grid">
                    {currentQ.options.map((opt, idx) => {
                        let statusClass = '';
                        if (selectedOption === opt) {
                            statusClass = isCorrect; // 'correct' or 'wrong'
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                disabled={selectedOption !== null}
                                className={`option-btn ${statusClass}`}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizArena;
