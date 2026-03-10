import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaGamepad, FaTrophy, FaBrain } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="landing-hero">
                <motion.div 
                    className="hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1 
                        className="hero-title"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Welcome to <span className="gradient-text">LearnQuest</span> 🚀
                    </motion.h1>
                    
                    <motion.p 
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        Turn Learning into an Epic Adventure
                    </motion.p>
                    
                    <motion.p 
                        className="hero-description"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        Master NCERT concepts through interactive games, quizzes, and AI-powered learning
                    </motion.p>

                    <motion.div 
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <button 
                            className="signin-btn"
                            onClick={() => navigate('/login')}
                        >
                            Sign In / Sign Up
                        </button>
                    </motion.div>
                </motion.div>

                {/* Floating Icons */}
                <div className="floating-icons">
                    <motion.div 
                        className="float-icon icon-1"
                        animate={{ 
                            y: [0, -20, 0],
                            rotate: [0, 10, 0]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <FaRocket />
                    </motion.div>
                    <motion.div 
                        className="float-icon icon-2"
                        animate={{ 
                            y: [0, 20, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                        }}
                    >
                        <FaGamepad />
                    </motion.div>
                    <motion.div 
                        className="float-icon icon-3"
                        animate={{ 
                            y: [0, -15, 0],
                            rotate: [0, 15, 0]
                        }}
                        transition={{ 
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                    >
                        <FaTrophy />
                    </motion.div>
                    <motion.div 
                        className="float-icon icon-4"
                        animate={{ 
                            y: [0, 25, 0],
                            rotate: [0, -15, 0]
                        }}
                        transition={{ 
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1.5
                        }}
                    >
                        <FaBrain />
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <motion.div 
                    className="features-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <motion.div 
                        className="feature-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="feature-icon">🎮</div>
                        <h3>Interactive Games</h3>
                        <p>Learn through fun, engaging mini-games and puzzles</p>
                    </motion.div>

                    <motion.div 
                        className="feature-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="feature-icon">🏆</div>
                        <h3>Compete & Win</h3>
                        <p>Climb leaderboards and earn achievements</p>
                    </motion.div>

                    <motion.div 
                        className="feature-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="feature-icon">🤖</div>
                        <h3>AI Learning</h3>
                        <p>Get personalized help from AI tutors</p>
                    </motion.div>

                    <motion.div 
                        className="feature-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="feature-icon">📚</div>
                        <h3>NCERT Aligned</h3>
                        <p>Complete syllabus coverage with quality content</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Landing;
