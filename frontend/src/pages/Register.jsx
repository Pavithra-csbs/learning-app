import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGraduationCap } from 'react-icons/fa';
import './AuthStyles.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [standard, setStandard] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/auth/register', {
                name,
                email,
                password,
                standard
            });
            // Redirect to login after successful registration
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed ❌');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-card"
            >
                <div className="auth-left">
                    <motion.h1
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="welcome-text"
                    >
                        WELCOME!
                    </motion.h1>
                    <div className="welcome-sub">Join the learning quest today</div>
                </div>

                <div className="auth-right">
                    <h2 className="auth-title">Register</h2>
                    {error && <div className="error-msg" style={{ color: '#ff4b2b', marginBottom: '15px', fontSize: '0.9rem' }}>{error}</div>}
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <FaUser className="field-icon" />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            <FaEnvelope className="field-icon" />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <FaLock className="field-icon" />
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
                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>
                    <div className="auth-switch">
                        Already have an account?
                        <span onClick={() => navigate('/')}>Sign In</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
