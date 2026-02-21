import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './LiveQuizPlayer.css';

const socket = io('/');

const LiveQuizPlayer = () => {
    const { roomCode } = useParams();
    const { user } = useAuth();
    const [gameState, setGameState] = useState('lobby'); // lobby, question, cooldown, finish
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isCorrect, setIsCorrect] = useState(null);
    const [startTime, setStartTime] = useState(null);

    useEffect(() => {
        socket.emit('join_room', { room_code: roomCode, student_name: user?.name || 'Guest' });

        socket.on('quiz_started', () => {
            setGameState('waiting');
        });

        socket.on('new_question', (data) => {
            setCurrentQuestion(data);
            setGameState('question');
            setTimeLeft(data.time_limit);
            setSelectedOption(null);
            setIsCorrect(null);
            setStartTime(Date.now());
        });

        return () => {
            socket.off('quiz_started');
            socket.off('new_question');
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'question') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'question') {
            setGameState('cooldown');
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (option) => {
        if (selectedOption || gameState !== 'question') return;

        setSelectedOption(option);
        const responseTime = (Date.now() - startTime) / 1000;

        socket.emit('submit_live_answer', {
            room_code: roomCode,
            student_id: user?.id,
            question_id: currentQuestion.id,
            selected_option: option,
            response_time: responseTime
        });
    };

    if (gameState === 'lobby') {
        return (
            <div className="player-container lobby">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                    <h1>You're in! 🎮</h1>
                </motion.div>
                <p>Waiting for the teacher to start the quiz...</p>
                <div className="player-avatar-lobby">👤</div>
                <h2>{user?.name}</h2>
            </div>
        );
    }

    if (gameState === 'waiting') {
        return (
            <div className="player-container waiting">
                <h1>Ready? 🚀</h1>
                <p>Focus on your teacher's screen!</p>
            </div>
        );
    }

    return (
        <div className="player-container playing">
            <div className="timer-bar" style={{ width: `${(timeLeft / (currentQuestion?.time_limit || 1)) * 100}%` }}></div>

            <div className="options-buttons">
                {['A', 'B', 'C', 'D'].map((opt, idx) => (
                    <button
                        key={opt}
                        className={`opt-btn btn-${idx} ${selectedOption === opt ? 'selected' : ''}`}
                        onClick={() => handleAnswer(opt)}
                        disabled={selectedOption !== null || timeLeft === 0}
                    >
                        <span className="shape">{['🔺', '🔷', '🟡', '🟩'][idx]}</span>
                    </button>
                ))}
            </div>

            {selectedOption && (
                <div className="answer-status">
                    <h2>Answer Submitted!</h2>
                    <p>Wait for results...</p>
                </div>
            )}
        </div>
    );
};

export default LiveQuizPlayer;
