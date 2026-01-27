import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const [notifEnabled, setNotifEnabled] = useState(true);

    const handleLogout = () => {
        if (confirm("Are you sure you want to log out? 🥺")) {
            logout();
            navigate('/');
        }
    };

    return (
        <div className="settings-container">
            {/* Background Decorations */}
            <div className="settings-bg-circle" style={{ top: '-10%', left: '-10%', width: '300px', height: '300px' }}></div>
            <div className="settings-bg-circle" style={{ bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: '#FF9A9E' }}></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="settings-card"
            >
                <div className="settings-header">
                    <h1 className="settings-title">Settings ⚙️</h1>
                    <p className="settings-subtitle">Customize your adventure</p>
                </div>

                {/* Profile Section */}
                <div className="profile-edit-section">
                    <div className="relative">
                        <img
                            src={`https://api.dicebear.com/7.x/${user?.avatar_id || 'fun-emoji'}/svg?seed=${user?.name || 'User'}`}
                            alt="Profile"
                            className="profile-avatar-large"
                        />
                        <div
                            className="absolute bottom-2 right-0 bg-yellow-400 p-1 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition"
                            onClick={() => navigate('/profile')}
                        >
                            ✏️
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-700">{user?.name || 'Super Student'}</h2>
                    <p className="text-gray-400 text-sm">Class {user?.standard || '6'} • Level 5</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-200 transition"
                    >
                        Edit Profile 📝
                    </button>
                </div>

                <div className="section-divider"></div>

                {/* Options List */}
                <div className="settings-list">

                    <div className="setting-item">
                        <div className="setting-label">
                            <span className="setting-icon">🔊</span>
                            <span>Sound Effects</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={() => setSoundEnabled(!soundEnabled)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span className="setting-icon">🎵</span>
                            <span>Background Music</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={musicEnabled}
                                onChange={() => setMusicEnabled(!musicEnabled)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    <div className="setting-item">
                        <div className="setting-label">
                            <span className="setting-icon">🔔</span>
                            <span>Notifications</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={notifEnabled}
                                onChange={() => setNotifEnabled(!notifEnabled)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                </div>

                <button onClick={handleLogout} className="logout-btn">
                    <span>🚪</span>
                    <span>Log Out</span>
                </button>

                <Link to="/map" className="back-link">
                    Go Back to Map
                </Link>

            </motion.div>
        </div>
    );
};
export default Settings;
