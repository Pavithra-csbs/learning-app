import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './AILearnTopic.css';

const AILearnTopic = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('Science');
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast.error('Please enter a topic!');
            return;
        }

        setLoading(true);
        setContent(null);

        try {
            const response = await axios.post(
                '/api/generate-text',
                {
                    subject: subject,
                    topic: topic.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.status === 'success') {
                setContent(response.data);
                toast.success('Content generated successfully! 🎉');
            } else {
                toast.error(response.data.error || 'Failed to generate content');
            }
        } catch (error) {
            console.error('Error generating text:', error);
            toast.error(error.response?.data?.error || 'Failed to generate content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGenerate();
        }
    };

    return (
        <div className="ai-learn-container">
            <div className="ai-learn-header">
                <button className="back-btn" onClick={() => navigate('/map')}>
                    ← Back
                </button>
                <h1>🤖 AI Learning Assistant</h1>
                <p className="subtitle">Learn any topic from your NCERT textbooks!</p>
            </div>

            <motion.div 
                className="input-section"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="input-group">
                    <label htmlFor="subject">Subject</label>
                    <select 
                        id="subject"
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)}
                        className="subject-select"
                    >
                        <option value="Science">Science</option>
                        <option value="Math">Math</option>
                        <option value="Social Science">Social Science</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="topic">Topic</label>
                    <input
                        id="topic"
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="e.g., Photosynthesis, Algebra, Democracy..."
                        className="topic-input"
                        disabled={loading}
                    />
                </div>

                <button 
                    onClick={handleGenerate} 
                    className="generate-btn"
                    disabled={loading || !topic.trim()}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Generating...
                        </>
                    ) : (
                        <>
                            <span>✨</span> Generate Content
                        </>
                    )}
                </button>
            </motion.div>

            {loading && (
                <motion.div 
                    className="loading-animation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="loading-content">
                        <div className="loader"></div>
                        <p>🧠 Analyzing NCERT textbooks...</p>
                        <p className="loading-sub">Generating comprehensive explanation for you!</p>
                    </div>
                </motion.div>
            )}

            {content && !loading && (
                <motion.div 
                    className="content-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="content-header">
                        <h2>📚 {content.topic}</h2>
                        <div className="content-meta">
                            <span className="badge">{content.subject}</span>
                            <span className="badge">Class {content.standard}</span>
                            <span className="badge source-badge">📖 {content.source}</span>
                        </div>
                    </div>

                    <div className="content-body">
                        <div className="content-text">
                            {content.content.split('\n\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    <div className="content-actions">
                        <button 
                            className="action-btn primary"
                            onClick={() => {
                                setTopic('');
                                setContent(null);
                            }}
                        >
                            📝 Learn Another Topic
                        </button>
                        <button 
                            className="action-btn secondary"
                            onClick={() => navigate('/map')}
                        >
                            🎮 Go to Dashboard
                        </button>
                    </div>
                </motion.div>
            )}

            {!content && !loading && (
                <div className="example-topics">
                    <h3>💡 Example Topics</h3>
                    <div className="topics-grid">
                        <div className="example-card" onClick={() => setTopic('Photosynthesis')}>
                            <span className="icon">🌱</span>
                            <span>Photosynthesis</span>
                        </div>
                        <div className="example-card" onClick={() => setTopic('Electricity')}>
                            <span className="icon">⚡</span>
                            <span>Electricity</span>
                        </div>
                        <div className="example-card" onClick={() => setTopic('Periodic Table')}>
                            <span className="icon">🧪</span>
                            <span>Periodic Table</span>
                        </div>
                        <div className="example-card" onClick={() => setTopic('Democracy')}>
                            <span className="icon">🗳️</span>
                            <span>Democracy</span>
                        </div>
                        <div className="example-card" onClick={() => setTopic('Algebra')}>
                            <span className="icon">🔢</span>
                            <span>Algebra</span>
                        </div>
                        <div className="example-card" onClick={() => setTopic('Cell Structure')}>
                            <span className="icon">🔬</span>
                            <span>Cell Structure</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AILearnTopic;
