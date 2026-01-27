import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css';

const DashboardSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useAuth();

    const menuItems = [
        { icon: 'ℹ️', label: 'About Science World' },
        { icon: '👨‍👩‍👧', label: 'Parents & teachers' },
        { icon: '🤝', label: 'Partners' },
        { icon: '👥', label: 'About us' },
        { icon: '❤️', label: 'Donate' },
        { icon: '📧', label: 'Contact' },
        { icon: '💬', label: 'Share your feedback' },
    ];

    const utilityItems = [
        { icon: '🔀', label: 'Start a random lesson' },
        { icon: '📋', label: 'Open list view' },
    ];

    return (
        <motion.div
            className={`dashboard-sidebar ${isCollapsed ? 'collapsed' : ''}`}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', damping: 20 }}
        >
            <div className="sidebar-header">
                <div className="logo-section">
                    <div className="logo-icon">🧩</div>
                    {!isCollapsed && (
                        <div className="logo-text">
                            <span className="brand">LearnQuest</span>
                            <span className="subbrand">for kids</span>
                            <span className="tagline">Founding Dreams</span>
                        </div>
                    )}
                </div>
                <button
                    className="collapse-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? '▶' : '◀'}
                </button>
            </div>

            <div className="sidebar-content">
                <nav className="main-nav">
                    {menuItems.map((item, idx) => (
                        <div key={idx} className="nav-item">
                            <span className="nav-icon">{item.icon}</span>
                            {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-divider"></div>

                <nav className="utility-nav">
                    {utilityItems.map((item, idx) => (
                        <div key={idx} className="nav-item utility">
                            <span className="nav-icon">{item.icon}</span>
                            {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        </div>
                    ))}
                </nav>

                {!isCollapsed && (
                    <div className="sidebar-controls">
                        <div className="search-section">
                            <label>SEARCH LESSON</label>
                            <div className="search-box">
                                <input type="text" placeholder="Search for..." />
                                <span className="search-icon">🔍</span>
                            </div>
                        </div>

                        <div className="dropdown-section">
                            <label>SELECT YOUR WORLD</label>
                            <select
                                value={localStorage.getItem('selectedWorld') || 'science'}
                                onChange={(e) => {
                                    localStorage.setItem('selectedWorld', e.target.value);
                                    window.location.reload();
                                }}
                            >
                                <option value="science">🌎 Science World</option>
                                <option value="math">🧮 Math World</option>
                            </select>
                        </div>

                        <div className="dropdown-section">
                            <label>LANGUAGE</label>
                            <select defaultValue="en">
                                <option value="en">🇺🇸 English</option>
                                <option value="hi">🇮🇳 Hindi</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default DashboardSidebar;
