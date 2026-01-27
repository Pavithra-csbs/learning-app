import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const { user } = useAuth();
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [standard, setStandard] = useState(user?.standard || 6);
    const [topicId, setTopicId] = useState('');

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                let url = `/leaderboard/${standard}`;
                if (topicId) url += `?topic_id=${topicId}`;

                const res = await axios.get(url);
                setRankings(res.data);
            } catch (err) {
                console.error("Failed to fetch rankings");
                setRankings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRankings();
    }, [standard, topicId]);

    const top3 = rankings.slice(0, 3);
    const rest = rankings.slice(3);

    return (
        <div className="leaderboard-container">
            {/* Header */}
            <div className="leaderboard-header">
                <Link to="/map" className="absolute left-6 top-6 text-2xl no-underline">
                    🔙
                </Link>
                <h1 className="text-3xl font-black text-pink-500 uppercase tracking-widest mt-2">
                    Champions 🏆
                </h1>

                <div className="filter-bar flex justify-center gap-4 mt-4">
                    <select
                        className="p-2 rounded-xl border-2 border-pink-200 outline-none font-bold"
                        value={standard}
                        onChange={e => setStandard(e.target.value)}
                    >
                        <option value="6">Class 6</option>
                        <option value="7">Class 7</option>
                        <option value="8">Class 8</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                    </select>
                </div>

                <p className="text-gray-500 font-bold text-sm mt-2">Top Students of the Year</p>
            </div>

            {/* Podium */}
            {!loading && (
                <div className="podium-section">
                    {/* 2nd Place */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="podium-step step-2"
                    >
                        <img className="podium-avatar" src={`https://api.dicebear.com/7.x/${top3[1]?.avatar.includes('=') ? top3[1]?.avatar : 'fun-emoji/svg?seed=' + top3[1]?.avatar}`} alt="2nd" />
                        <div className="podium-block">
                            <span className="rank-number">2</span>
                            <span className="text-sm font-bold truncate w-full px-1">{top3[1]?.name}</span>
                            <span className="text-xs bg-white/20 px-2 rounded-full mt-1">⭐ {top3[1]?.stars}</span>
                        </div>
                    </motion.div>

                    {/* 1st Place */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="podium-step step-1"
                    >
                        <div className="crown">👑</div>
                        <img className="podium-avatar" src={`https://api.dicebear.com/7.x/${top3[0]?.avatar.includes('=') ? top3[0]?.avatar : 'fun-emoji/svg?seed=' + top3[0]?.avatar}`} alt="1st" />
                        <div className="podium-block">
                            <span className="rank-number">1</span>
                            <span className="text-sm font-bold truncate w-full px-1">{top3[0]?.name}</span>
                            <span className="text-xs bg-white/20 px-2 rounded-full mt-1">⭐ {top3[0]?.stars}</span>
                        </div>
                    </motion.div>

                    {/* 3rd Place */}
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="podium-step step-3"
                    >
                        <img className="podium-avatar" src={`https://api.dicebear.com/7.x/${top3[2]?.avatar.includes('=') ? top3[2]?.avatar : 'fun-emoji/svg?seed=' + top3[2]?.avatar}`} alt="3rd" />
                        <div className="podium-block">
                            <span className="rank-number">3</span>
                            <span className="text-sm font-bold truncate w-full px-1">{top3[2]?.name}</span>
                            <span className="text-xs bg-white/20 px-2 rounded-full mt-1">⭐ {top3[2]?.stars}</span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* List */}
            <div className="ranking-list">
                {rest.map((user, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + (idx * 0.1) }}
                        className="rank-item"
                    >
                        <div className="rank-position">#{idx + 4}</div>
                        <div className="rank-info">
                            <img className="rank-avatar-small" src={`https://api.dicebear.com/7.x/${user.avatar.includes('=') ? user.avatar : 'fun-emoji/svg?seed=' + user.avatar}`} alt="Avatar" />
                            <div className="font-bold text-gray-700">{user.name}</div>
                        </div>
                        <div className="rank-score">
                            ⭐ {user.score}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Nav */}
            <nav className="bottom-nav">
                <Link to="/map" className="text-center cursor-pointer text-gray-400 hover:text-pink-500">
                    <div className="text-2xl">🗺️</div>
                    <div className="text-xs font-bold">Map</div>
                </Link>
                <Link to="/leaderboard" className="text-center cursor-pointer text-pink-500">
                    <div className="text-2xl">🏆</div>
                    <div className="text-xs font-bold">Rank</div>
                </Link>
                <Link to="/settings" className="text-center cursor-pointer text-gray-400 hover:text-pink-500">
                    <div className="text-2xl">⚙️</div>
                    <div className="text-xs font-bold">Settings</div>
                </Link>
            </nav>
        </div>
    );
};
export default Leaderboard;
