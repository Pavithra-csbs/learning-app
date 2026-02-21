import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-container">
            <motion.div
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="about-header">
                    <button onClick={() => navigate('/map')} className="back-btn-about">◀ Back to Adventure</button>
                    <h1>About LearnQuest 🧩</h1>
                </div>

                <div className="about-content">
                    <section>
                        <h2>Our Mission 🚀</h2>
                        <p>LearnQuest is a gamified learning platform designed to make NCERT education fun, engaging, and rewarding for kids. We believe that learning should feel like an adventure!</p>
                    </section>

                    <section>
                        <h2>What We Offer ✨</h2>
                        <ul>
                            <li>Interactive <strong>Science & Math Worlds</strong> based on the NCERT syllabus.</li>
                            <li><strong>Quiz Arena</strong> where you can test your knowledge and win stars.</li>
                            <li><strong>Leaderboards</strong> to compete with friends and become a Top Explorer.</li>
                            <li><strong>AI-Powered Learning</strong> that adapts to your needs.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>For Future Explorers 🌟</h2>
                        <p>We are constantly expanding our universe with new chapters, puzzles, and features. Join us on this journey to make education a game everyone loves to win!</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
