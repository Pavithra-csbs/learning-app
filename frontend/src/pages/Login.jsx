import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGraduationCap, FaPaperPlane } from 'react-icons/fa';
import './AuthStyles.css';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [standard, setStandard] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/auth/verify-otp', {
                email,
                name: name || 'Student',
                standard: parseInt(standard) || 10
            });
            login(response.data.user, response.data.token);
            navigate('/world-selection');
        } catch (err) {
            setError("Login Failed ❌. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="auth-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="welcome-text">WELCOME <br /> BACK!</h1>
                        <p className="welcome-sub">Continue your learning adventure</p>
                    </motion.div>
                </div>

                <div className="auth-right">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="auth-title">Enter Universe</h2>
                            {error && <div className="error-msg" style={{ color: '#ff4b82', marginBottom: '1rem' }}>{error}</div>}
                            <form onSubmit={handleLogin} className="auth-form">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                    />
                                    <FaUser className="field-icon" />
                                </div>
                                <div className="input-group">
                                    <select
                                        value={standard}
                                        onChange={e => setStandard(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Class</option>
                                        <option value="6">Class 6</option>
                                        <option value="7">Class 7</option>
                                        <option value="8">Class 8</option>
                                        <option value="9">Class 9</option>
                                        <option value="10">Class 10</option>
                                    </select>
                                    <FaGraduationCap className="field-icon" />
                                </div>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                    <FaEnvelope className="field-icon" />
                                </div>
                                <button type="submit" className="auth-btn" disabled={loading}>
                                    {loading ? 'Initializing...' : 'START ADVENTURE 🚀'}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
