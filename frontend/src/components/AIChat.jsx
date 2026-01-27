import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AIChat.css';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I am your AI study buddy. Ask me anything about your lessons or even things outside your books! 🤖✨' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('/ai/chat', {
                message: input
            });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! My magic circuits are a bit fuzzy. Try asking again! 😵" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chat-widget">
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '❌' : '🤖'}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="chat-window"
                    >
                        <div className="chat-header">
                            <h3>Study Helper AI</h3>
                        </div>
                        <div className="chat-messages">
                            {messages.map((m, i) => (
                                <div key={i} className={`message ${m.role}`}>
                                    <div className="msg-bubble">{m.content}</div>
                                </div>
                            ))}
                            {loading && <div className="message assistant"><div className="msg-bubble thinking">...</div></div>}
                        </div>
                        <form className="chat-input-area" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder="Ask a question..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                            />
                            <button type="submit">🚀</button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChat;
