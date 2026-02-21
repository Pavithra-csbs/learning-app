import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import './LiveQuizHost.css';

const socket = io('/'); // Let proxy handle it

const LiveQuizHost = () => {
    const { quizId } = useParams();
    const [sessionData, setSessionData] = useState(null);
    const [players, setPlayers] = useState([]);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [scoreboard, setScoreboard] = useState([]);
    const [showPodium, setShowPodium] = useState(false);

    useEffect(() => {
        startNewSession();
        fetchQuizDetails();

        socket.on('player_joined', (data) => {
            setPlayers(prev => [...prev, data.name]);
        });

        socket.on('response_received', (data) => {
            setResponses(prev => {
                const newRes = { ...prev };
                const qId = questions[currentQuestionIdx]?.id;
                if (!newRes[qId]) newRes[qId] = { A: 0, B: 0, C: 0, D: 0 };
                newRes[qId][data.option]++;
                return newRes;
            });
        });

        return () => {
            socket.off('player_joined');
            socket.off('response_received');
        };
    }, []);

    const startNewSession = async () => {
        try {
            const res = await fetch('/api/teacher/start-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quiz_id: quizId })
            });
            const data = await res.json();
            setSessionData(data);
            socket.emit('join_room', { room_code: data.room_code, student_name: "HOST" });
        } catch (error) {
            console.error("Error starting session:", error);
        }
    };

    const fetchQuizDetails = async () => {
        try {
            const res = await fetch(`/api/teacher/get-quiz/${quizId}`);
            const data = await res.json();
            if (res.ok) {
                setQuestions(data.questions);
            }
        } catch (error) {
            console.error("Error fetching quiz details:", error);
        }
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        nextQuestion();
    };

    const nextQuestion = () => {
        const nextIdx = currentQuestionIdx + 1;
        if (nextIdx < questions.length) {
            setCurrentQuestionIdx(nextIdx);
            socket.emit('next_question', {
                room_code: sessionData.room_code,
                question_id: questions[nextIdx].id
            });
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setShowPodium(true);
        // Fetch final scoreboard
        const res = await fetch(`/api/teacher/scoreboard/${sessionData.session_id}`);
        const data = await res.json();
        setScoreboard(data);
    };

    if (!sessionData) return <div className="host-loading">Initializing Session...</div>;

    return (
        <div className="live-host-container">
            {!quizStarted ? (
                <div className="lobby-view">
                    <div className="room-info">
                        <h1>Join at <span>LearnQuest.com</span></h1>
                        <div className="room-code-display">{sessionData.room_code}</div>
                    </div>

                    <div className="player-count">
                        <h2>{players.length} Players Joined</h2>
                    </div>

                    <div className="player-grid">
                        <AnimatePresence>
                            {players.map((p, i) => (
                                <motion.div
                                    key={i}
                                    className="player-name-tag"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                >
                                    {p}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {players.length > 0 && (
                        <button className="start-game-btn" onClick={handleStartQuiz}>Start Quiz</button>
                    )}
                </div>
            ) : showPodium ? (
                <div className="podium-view">
                    <Confetti />
                    <h1>Winners Podium 🏆</h1>
                    <div className="podium-display">
                        {scoreboard.slice(0, 3).map((s, i) => (
                            <div key={i} className={`podium-place place-${i + 1}`}>
                                <div className="avatar-large">👤</div>
                                <div className="podium-name">{s.name}</div>
                                <div className="podium-score">{s.score} XP</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="question-view">
                    <div className="question-header">
                        <h2>Question {currentQuestionIdx + 1}</h2>
                        <button onClick={nextQuestion}>Next Question ➡️</button>
                    </div>
                    {questions[currentQuestionIdx] && (
                        <div className="question-content">
                            <h1>{questions[currentQuestionIdx].question_text}</h1>

                            <div className="options-display-grid">
                                <div className="host-option opt-a">
                                    <span className="shape">🔺</span> {questions[currentQuestionIdx].option_a}
                                </div>
                                <div className="host-option opt-b">
                                    <span className="shape">🔷</span> {questions[currentQuestionIdx].option_b}
                                </div>
                                <div className="host-option opt-c">
                                    <span className="shape">🟡</span> {questions[currentQuestionIdx].option_c}
                                </div>
                                <div className="host-option opt-d">
                                    <span className="shape">🟩</span> {questions[currentQuestionIdx].option_d}
                                </div>
                            </div>

                            <div className="charts-container">
                                {['A', 'B', 'C', 'D'].map(opt => (
                                    <div key={opt} className="chart-bar-wrap">
                                        <div
                                            className={`chart-bar bar-${opt.toLowerCase()}`}
                                            style={{ height: `${(responses[questions[currentQuestionIdx].id]?.[opt] || 0) * 20}px` }}
                                        ></div>
                                        <span>Option {opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LiveQuizHost;
