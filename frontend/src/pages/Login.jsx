import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [standard, setStandard] = useState('6');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/auth/send-otp', { email });
            console.log("DEBUG: OTP sent", response.data);
            // Assuming toast.success is available, if not, this line will cause an error.
            // For now, I'll comment it out or replace with alert if toast is not imported.
            // toast.success("Magic code sent! Check your email 📧");
            alert(`Magic code sent! Check your email 📧 (Debug OTP: ${response.data.debug_otp})`); // Fallback for toast
            setStep(2);
        } catch (err) {
            console.error(err);
            // Original code had setStep(2) in catch, keeping it for consistency if error occurs
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/auth/verify-otp', {
                email,
                otp: otp, // Using existing 'otp' state variable
                name: name || 'Student', // Keep original logic for name
                standard: parseInt(standard)
            });
            login(response.data.user, response.data.token);
            navigate('/world-selection');
        } catch (err) {
            alert("Verification Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Background Decorations */}
            <div className="bg-element planet-big"></div>
            <div className="bg-element planet-small"></div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="login-card"
            >
                <div className="login-header">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="login-icon"
                    >
                        {step === 1 ? '🚀' : '🔐'}
                    </motion.div>
                    <h1 className="h1-title">
                        {step === 1 ? 'Start Adventure' : 'Secret Code'}
                    </h1>
                    <p className="subtitle">
                        {step === 1 ? 'Enter your details to blast off!' : 'Check your email for the magic key'}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="login-form">
                        <input
                            type="text"
                            placeholder="Your Super Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <select
                            className="login-select"
                            value={standard}
                            onChange={e => setStandard(e.target.value)}
                            required
                        >
                            <option value="">Select your Class</option>
                            <option value="6">Class 6</option>
                            <option value="7">Class 7</option>
                            <option value="8">Class 8</option>
                            <option value="9">Class 9</option>
                            <option value="10">Class 10</option>
                        </select>
                        <input
                            type="email"
                            placeholder="Your Email ID"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Powering Up...' : 'GET MAGIC CODE ✨'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <input
                            type="text"
                            placeholder="1 2 3 4 5 6"
                            maxLength={6}
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="otp-input"
                            required
                        />
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'Checking...' : 'BLAST OFF 🚀'}
                        </button>
                        <button type="button" onClick={() => setStep(1)} className="back-btn">
                            Wait, go back!
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-gray-400 text-sm mb-2">Stuck in a loop?</p>
                    <button
                        onClick={() => { localStorage.clear(); window.location.reload(); }}
                        className="text-purple-400 hover:text-purple-600 font-bold text-sm underline"
                    >
                        ✨ Magic Reset (Clear All Cookies) ✨
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
export default Login;
