import React, { useState, useEffect } from 'react';
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose, userEmail, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: userEmail || '',
        age: '',
        country: '',
        avatar_url: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            setFormData({
                ...formData,
                ...initialData
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    avatar_url: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.name || !formData.email || !formData.age || !formData.country) {
            setError('Please fill in all required fields.');
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            setIsLoading(false);
            return;
        }

        if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
            setError('Please enter a valid age.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5020/api/create-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userProfileCreated', 'true');
                localStorage.setItem('userProfile', JSON.stringify(data.profile));
                alert('Profile saved successfully! 🎉');
                onClose(data.profile);
            } else {
                setError(data.message || 'Error saving profile.');
            }
        } catch (err) {
            console.error('Profile submission error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="profile-modal-overlay">
            <div className="profile-modal-glass">
                <div className="profile-modal-header">
                    <h2>{initialData.id ? 'Edit Your Profile' : 'Welcome! Set Up Your Profile'}</h2>
                    <p>Tell us a bit about yourself to get started on your quest!</p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group-avatar">
                        <div className="avatar-preview">
                            <img
                                src={formData.avatar_url || 'https://via.placeholder.com/100?text=👤'}
                                alt="Avatar Preview"
                            />
                        </div>
                        <label className="avatar-upload-label">
                            Choose Avatar
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Your age"
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Where are you from?"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">⚠️ {error}</div>}

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={() => onClose(null)}>
                            Cancel
                        </button>
                        <button type="submit" className="save-btn" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
