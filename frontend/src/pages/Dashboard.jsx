import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import DashboardSidebar from '../components/DashboardSidebar';
import WorldMap from '../components/WorldMap';
import ProfileModal from '../components/ProfileModal';
import AICoach from '../components/AICoach';
import './Dashboard.css';

const socket = io('http://127.0.0.1:5000');

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAICoachOpen, setIsAICoachOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        // Check if profile is already created
        const profileCreated = localStorage.getItem('userProfileCreated');
        const storedProfile = localStorage.getItem('userProfile');

        if (storedProfile) {
            setUserProfile(JSON.parse(storedProfile));
        }

        if (!profileCreated) {
            setIsProfileModalOpen(true);
        }

        socket.on('quiz_started', (data) => {
            navigate(`/quiz/${data.topic_id}?live=true&room=${data.room_code}`);
        });
        return () => socket.off('quiz_started');
    }, [navigate]);

    const handleProfileSaved = (newProfile) => {
        if (newProfile) {
            setUserProfile(newProfile);
        }
        setIsProfileModalOpen(false);
    };

    return (
        <div className="dashboard-app-container">
            <DashboardSidebar />
            <div className="dashboard-main-content">
                <WorldMap user={user} />

                <div className="floating-actions-container">
                    <button
                        className="ai-coach-btn-floating"
                        onClick={() => setIsAICoachOpen(true)}
                        title="AI Learning Coach"
                    >
                        🤖
                        <span className="pulse-aura"></span>
                    </button>

                    <button
                        className="edit-profile-btn-floating"
                        onClick={() => setIsProfileModalOpen(true)}
                        title="Edit Profile"
                    >
                        {userProfile?.avatar_url ? (
                            <img src={userProfile.avatar_url} alt="Profile" className="btn-avatar" />
                        ) : (
                            "👤"
                        )}
                    </button>
                </div>
            </div>

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={handleProfileSaved}
                userEmail={user?.email}
                initialData={userProfile || {}}
            />

            <AICoach
                isOpen={isAICoachOpen}
                onClose={() => setIsAICoachOpen(false)}
                studentId={user?.id}
            />
        </div>
    );
};
export default Dashboard;
