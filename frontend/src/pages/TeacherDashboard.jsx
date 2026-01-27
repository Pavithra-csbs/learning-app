import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TeacherDashboard.css';

const socket = io('http://127.0.0.1:5000');

const TeacherDashboard = () => {
    const { token, user } = useAuth();
    const [step, setStep] = useState('setup'); // setup, waiting, active, results
    const [roomCode, setRoomCode] = useState('');
    const [players, setPlayers] = useState([]);
    const [config, setConfig] = useState({ standard: '6', subject: 'Science', topic: '1' });
    const [liveScores, setLiveScores] = useState({});

    useEffect(() => {
        socket.on('player_joined', (data) => {
            setPlayers(prev => [...prev, data.name]);
        });

        socket.on('update_score', (data) => {
            setLiveScores(prev => ({ ...prev, [data.student_name]: data.score }));
        });

        return () => {
            socket.off('player_joined');
            socket.off('update_score');
        };
    }, []);

    const handleCreateQuiz = async () => {
        try {
            const res = await axios.post('/teacher/live-quiz/create', {
                host_id: user.id,
                topic_id: config.topic
            });
            setRoomCode(res.data.room_code);
            setStep('waiting');
            socket.emit('join_quiz', { room_code: res.data.room_code, student_name: "Teacher (Host)" });
        } catch (err) {
            alert("Error creating live quiz");
        }
    };

    const handleStartQuiz = () => {
        socket.emit('start_quiz', { room_code: roomCode, topic_id: config.topic });
        setStep('active');
    };

    return (
        <div className="teacher-container">
            <div className="bg-decor-teacher"></div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="teacher-card"
            >
                <h1 className="teacher-title">Teacher Command Center 🧑‍🏫</h1>

                {step === 'setup' && (
                    <div className="setup-view">
                        <p className="description">Host a LIVE quiz battle! ⚔️</p>
                        <div className="form-group-teacher">
                            <label>Standard</label>
                            <select value={config.standard} onChange={e => setConfig({ ...config, standard: e.target.value })}>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                            </select>

                            <label>Subject</label>
                            <select value={config.subject} onChange={e => setConfig({ ...config, subject: e.target.value })}>
                                <option value="Science">Science</option>
                                <option value="Maths">Maths</option>
                            </select>
                        </div>
                        <button className="create-live-btn" onClick={handleCreateQuiz}>
                            Generate Room Code 🆔
                        </button>
                    </div>
                )}

                {step === 'waiting' && (
                    <div className="waiting-view">
                        <div className="room-code-display">
                            <span>Room Code:</span>
                            <h2 className="code-text pulse">{roomCode}</h2>
                        </div>

                        <div className="players-list">
                            <h3>Ready to Rumble ({players.length}):</h3>
                            <div className="players-grid">
                                {players.map((p, i) => (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} key={i} className="player-tag">
                                        {p}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="start-live-btn"
                            onClick={handleStartQuiz}
                            disabled={players.length === 0}
                        >
                            {players.length > 0 ? 'START BATTLE 🚀' : 'Waiting for Students...'}
                        </button>
                    </div>
                )}

                {step === 'active' && (
                    <div className="active-view">
                        <h2>LIVE BATTLE IN PROGRESS ⚔️</h2>
                        <div className="live-leaderboard">
                            {Object.entries(liveScores).sort((a, b) => b[1] - a[1]).map(([name, score], i) => (
                                <div key={i} className="live-rank-item">
                                    <span className="name">{name}</span>
                                    <div className="score-bar" style={{ width: `${(score / 8) * 100}%` }}></div>
                                    <span className="score">{score}/8</span>
                                </div>
                            ))}
                        </div>
                        <button className="finish-btn" onClick={() => setStep('results')}>End Session</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TeacherDashboard;
