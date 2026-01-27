import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TopicContent.css';

const TopicContent = () => {
    const { topicId } = useParams();
    const { token } = useAuth();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                // For demo, we might fetch from a theory endpoint. 
                // Currently backend doesn't have a specific theory route, 
                // so we use a mock based on topicId.
                setTimeout(() => {
                    setContent({
                        title: `Topic ${topicId} Exploration`,
                        text: "Welcome to this exciting NCERT lesson! In this chapter, we explore how things work in the world of Science. From the tiny atoms to the massive galaxies, everything follows beautiful laws of nature.",
                        image: `https://api.dicebear.com/7.x/bottts/svg?seed=Topic${topicId}`,
                        key_points: ["Observation is key", "Experimentation helps", "Learning is fun"]
                    });
                    setLoading(false);
                }, 1000);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchContent();
    }, [topicId]);

    if (loading) return <div className="theory-loading">Opening the scroll of knowledge... 📜</div>;

    return (
        <div className="theory-container">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="theory-content">
                <Link to="/map" className="back-link">⬅️ Back to Map</Link>
                <h1>{content.title}</h1>

                <div className="theory-visual">
                    <img src={content.image} alt="Lesson Visual" />
                    <p className="caption">Visual representation of the topic</p>
                </div>

                <div className="theory-text">
                    <p>{content.text}</p>
                    <h3>Important Stars for your brain:</h3>
                    <ul>
                        {content.key_points.map((p, i) => <li key={i}>⭐ {p}</li>)}
                    </ul>
                </div>

                <div className="theory-actions">
                    <Link to={`/quiz/${topicId}`} className="ready-btn">I'm Ready for the Quiz! 🚀</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default TopicContent;
