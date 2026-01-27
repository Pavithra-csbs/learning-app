import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        standard: '',
        school_name: '',
        bio: '',
        country: '',
        state: '',
        avatar_id: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/student/profile');
                setFormData(response.data);
            } catch (error) {
                toast.error("Failed to load profile 😢");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post('/student/profile', formData);
            toast.success("Profile saved! 🚀");
            setTimeout(() => navigate('/map'), 1500);
        } catch (error) {
            toast.error("Error saving profile 😵");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const selectAvatar = (id) => {
        setFormData({ ...formData, avatar_id: id });
    };

    const avatars = [
        'fun-emoji', 'bottts', 'adventurer', 'avataaars', 'big-ears', 'miniavs'
    ];

    if (loading) return <div className="loading-screen">Loading your adventure... 🌟</div>;

    return (
        <div className="profile-page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="profile-card"
            >
                <div className="profile-header">
                    <h1>My Hero Profile 🦸‍♂️</h1>
                    <p>Customize your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="avatar-selection-section">
                        <h3>Choose Your Avatar</h3>
                        <div className="avatar-grid">
                            {avatars.map((style) => (
                                <div
                                    key={style}
                                    className={`avatar-option ${formData.avatar_id === style ? 'active' : ''}`}
                                    onClick={() => selectAvatar(style)}
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/${style}/svg?seed=${formData.name || 'User'}`}
                                        alt={style}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="input-group">
                            <label>Hero Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="hero@example.com"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Class/Standard</label>
                            <select name="standard" value={formData.standard} onChange={handleChange} required>
                                <option value="">Select your class</option>
                                <option value="6">Class 6</option>
                                <option value="7">Class 7</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>School Name</label>
                            <input
                                type="text"
                                name="school_name"
                                value={formData.school_name}
                                onChange={handleChange}
                                placeholder="Where do you study?"
                            />
                        </div>

                        <div className="input-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Your country"
                            />
                        </div>

                        <div className="input-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Your state"
                            />
                        </div>
                    </div>

                    <div className="input-group full-width">
                        <label>Hero Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/map')} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Profile 🏆'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Profile;
