import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Feedback.css';

const Feedback = () => {
    const { token } = useAuth();
    const [msg, setMsg] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/feedback/submit', { message: msg });
            setSubmitted(true);
        } catch (err) {
            alert("Error sending feedback");
        }
    };

    return (
        <div className="feedback-container">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="feedback-card"
            >
                {!submitted ? (
                    <>
                        <h2>What do you think? 💭</h2>
                        <p>How can we make your learning even more fun?</p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                placeholder="Your cool ideas here..."
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                required
                            ></textarea>
                            <button type="submit" className="send-btn">Send My Magic Ideas! ✨</button>
                        </form>
                    </>
                ) : (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="success-view">
                        <span className="big-emoji">🌈</span>
                        <h2>Thank You!</h2>
                        <p>Your feedback helps us make the Saga Map even better!</p>
                        <button onClick={() => window.history.back()} className="back-home-btn">Back to Adventure</button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Feedback;
