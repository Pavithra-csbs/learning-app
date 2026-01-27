import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import DashboardSidebar from '../components/DashboardSidebar';
import WorldMap from '../components/WorldMap';
import './Dashboard.css';

const socket = io('http://127.0.0.1:5000');

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        socket.on('quiz_started', (data) => {
            navigate(`/quiz/${data.topic_id}?live=true&room=${data.room_code}`);
        });
        return () => socket.off('quiz_started');
    }, [navigate]);

    return (
        <div className="dashboard-app-container">
            <DashboardSidebar />
            <WorldMap user={user} />
        </div>
    );
};
export default Dashboard;
