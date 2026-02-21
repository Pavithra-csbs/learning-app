import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/DashboardSidebar';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        class: '',
        subject: '',
        chapter: ''
    });

    const standards = ['6', '7', '8', '9', '10'];
    const subjects = ['Biology', 'Physics', 'Chemistry'];

    useEffect(() => {
        fetchLeaderboard();
    }, [filters]);

    const fetchLeaderboard = async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.class) queryParams.append('class', filters.class);
            if (filters.subject) queryParams.append('subject', filters.subject);
            if (filters.chapter) queryParams.append('chapter', filters.chapter);

            const url = filters.class || filters.subject || filters.chapter
                ? `/api/leaderboard/filter?${queryParams.toString()}`
                : `/api/leaderboard/global`;

            const response = await fetch(url);
            const data = await response.json();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLeaderboard([]);
        } finally {
            setIsLoading(false);
        }
    };

    const getTrophy = (rank) => {
        if (rank === 1) return '🏆';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return rank;
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return 'rank-gold';
        if (rank === 2) return 'rank-silver';
        if (rank === 3) return 'rank-bronze';
        return 'rank-normal';
    };

    return (
        <div className="leaderboard-full-container">
            <DashboardSidebar />
            <div className="leaderboard-content">
                <header className="leaderboard-header">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Global Hall of Fame 🌟
                    </motion.h1>
                    <p>Rise to the top and become the ultimate LearnQuest Master!</p>
                </header>

                <div className="leaderboard-filters">
                    <div className="filter-group">
                        <label>Standard</label>
                        <select
                            value={filters.class}
                            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
                        >
                            <option value="">Global Rank</option>
                            {standards.map(s => <option key={s} value={s}>Class {s}</option>)}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Subject</label>
                        <select
                            value={filters.subject}
                            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <button className="reset-filter" onClick={() => setFilters({ class: '', subject: '', chapter: '' })}>
                        Clear Filters
                    </button>
                </div>

                <div className="leaderboard-list-container">
                    {isLoading ? (
                        <div className="leaderboard-loading">
                            <div className="spinner"></div>
                            <p>Consulting the Oracle of Rank...</p>
                        </div>
                    ) : (
                        <div className="leaderboard-table">
                            <div className="table-header">
                                <span>Rank</span>
                                <span>Student</span>
                                <span>Stars ⭐️</span>
                                <span>Score 🎯</span>
                                <span>Total XP</span>
                            </div>
                            <AnimatePresence>
                                {leaderboard.map((student, idx) => (
                                    <motion.div
                                        key={student.name + idx}
                                        className={`leaderboard-row ${getRankBadge(student.rank)}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <div className="rank-cell">
                                            <span className="rank-num">{getTrophy(student.rank)}</span>
                                        </div>
                                        <div className="student-cell">
                                            <div className="student-avatar-wrap">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt={student.name} />
                                                ) : (
                                                    <div className="avatar-fallback">👤</div>
                                                )}
                                            </div>
                                            <span className="student-name">{student.name}</span>
                                        </div>
                                        <div className="stars-cell">{student.stars || 0}</div>
                                        <div className="score-cell">{student.quiz_score || 0}</div>
                                        <div className="total-cell">{student.total_score}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {leaderboard.length === 0 && (
                                <div className="no-data-leaderboard">
                                    No records found. Be the first to claim a spot! 🚀
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {user && (
                    <div className="user-static-rank">
                        <p>Your current global position will appear here as you progress!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;
