import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './LiveQuizJoin.css';

const LiveQuizJoin = () => {
    const [roomCode, setRoomCode] = useState('');
    const [isJoining, setIsJoining] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();
        if (roomCode.length !== 6) return;

        setIsJoining(true);
        try {
            const response = await fetch('/api/live-quiz/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_code: roomCode, student_id: user?.id })
            });
            const data = await response.json();
            if (response.ok) {
                navigate(`/live-quiz/play/${roomCode}`);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Connection error");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="join-container">
            <motion.div
                className="join-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="join-logo">🏆</div>
                <h1>Enter Room Code</h1>
                <form onSubmit={handleJoin}>
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
                        required
                    />
                    <button type="submit" disabled={isJoining || roomCode.length !== 6}>
                        {isJoining ? 'Joining...' : 'Enter Arena'}
                    </button>
                </form>
                <div className="join-footer">
                    <p>Playing as <strong>{user?.name || 'Guest'}</strong></p>
                </div>
            </motion.div>
        </div>
    );
};

export default LiveQuizJoin;
