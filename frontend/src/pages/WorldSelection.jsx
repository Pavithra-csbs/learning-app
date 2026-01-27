import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './WorldSelection.css';

const WorldSelection = () => {
    const navigate = useNavigate();

    const worlds = [
        { id: 'math', title: 'MATH WORLD', icon: '🧮', color: '#00b4d8', label: 'Visit our Math World portal' },
        { id: 'science', title: 'SCIENCE WORLD', icon: '🧪', color: '#4361ee', label: 'Visit our Science World portal' },
        { id: 'teachers', title: 'Parents & Teachers', icon: '👩‍🏫', color: '#b5179e', label: 'Start here' },
        { id: 'partners', title: 'Partners', icon: '🤝', color: '#7209b7', label: 'Start here' },
    ];

    const handleSelect = (id) => {
        if (id === 'science' || id === 'math') {
            // Save selection to local storage or state
            localStorage.setItem('selectedWorld', id);
            navigate('/map');
        } else {
            alert("This portal is coming soon! 🚀");
        }
    };

    return (
        <div className="world-selection-container">
            {/* Top Bar */}
            <header className="selection-header">
                <div className="logo-section">
                    <span className="logo-icon">🧩</span>
                    <div className="logo-text">
                        <span className="brand">LearnQuest</span>
                        <span className="subbrand">for kids</span>
                        <span className="tagline">Founding Dreams</span>
                    </div>
                </div>
                <nav className="header-nav">
                    <span>ABOUT</span>
                    <span>CONTACT</span>
                    <button className="donate-btn">DONATE</button>
                </nav>
            </header>

            {/* Pattern Banner */}
            <div className="banner-pattern">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="banner-text"
                >
                    Free and fun digital education<br />for all children worldwide
                </motion.h1>
            </div>

            {/* World Grid */}
            <main className="worlds-grid">
                {worlds.map((world, idx) => (
                    <motion.div
                        key={world.id}
                        className="world-card-wrapper"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleSelect(world.id)}
                    >
                        <div className="world-circle" style={{ backgroundColor: world.color }}>
                            <div className="world-icon">{world.icon}</div>
                            <div className="world-title-overlay">{world.title}</div>
                        </div>
                        <button className="world-entry-btn">
                            {world.label}
                        </button>
                    </motion.div>
                ))}
            </main>

            <footer className="selection-footer">
                <p>Our vision is to be the source for childhood learning on the internet available from anywhere and without charge.</p>
            </footer>
        </div>
    );
};

export default WorldSelection;
