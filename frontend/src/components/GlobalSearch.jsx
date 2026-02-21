import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './GlobalSearch.css';

const GlobalSearch = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedWorld] = useState(localStorage.getItem('selectedWorld') || 'science');

    const handleSearch = (topic) => {
        if (!topic) return;
        // Search leads to Theory Missions again
        navigate(`/learn/search?chapterName=General&topic=${encodeURIComponent(topic)}`);
    };

    const fetchSuggestions = async (val) => {
        if (val.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            // Reusing get-topics logic or a dedicated search endpoint
            const res = await axios.post('/api/get-topics', {
                subject: selectedWorld === 'math' ? 'Math' : 'Science',
                chapter: 'all', // Backend modification needed to support 'all'
                standard: user?.standard || user?.student_profile?.standard || 6
            });
            const filtered = (res.data.topics || []).filter(t =>
                t.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) fetchSuggestions(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="global-search-container">
            <div className="search-bar-inner">
                <input
                    type="text"
                    placeholder={`🔍 Search any ${selectedWorld} topic...`}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                />
                <button className="search-pulse-btn" onClick={() => handleSearch(query)}>GO</button>
            </div>

            <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                        className="global-suggestions-dropdown"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {suggestions.map((s, idx) => (
                            <div
                                key={idx}
                                className="suggestion-row"
                                onClick={() => {
                                    setQuery(s);
                                    handleSearch(s);
                                }}
                            >
                                {s}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {showSuggestions && <div className="dropdown-overlay" onClick={() => setShowSuggestions(false)} />}
        </div>
    );
};

export default GlobalSearch;
