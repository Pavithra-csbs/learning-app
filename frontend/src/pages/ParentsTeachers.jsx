import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './ParentsTeachers.css';

const ParentsTeachers = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-container">
            <motion.div
                className="pt-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <div className="pt-header">
                    <button onClick={() => navigate('/map')} className="back-btn-pt">◀ Explorer Map</button>
                    <h1>Parents & Teachers Center 🎓</h1>
                </div>

                <div className="pt-sections">
                    <div className="pt-grid">
                        <section className="pt-box">
                            <h2>For Parents 👨‍👩‍👦</h2>
                            <p>Monitor your child's progress and see how they are mastering the basics of Science and Math. Our platform encourages self-paced learning through play.</p>
                            <ul>
                                <li>Weekly progress reports</li>
                                <li>Difficulty adjustment controls</li>
                                <li>Safe, ad-free environment</li>
                            </ul>
                        </section>

                        <section className="pt-box">
                            <h2>For Teachers 🍎</h2>
                            <p>Use LearnQuest in your classroom! Assign chapters, track class-wide performance, and identify areas that need more explanation.</p>
                            <ul>
                                <li>NCERT-aligned question bank</li>
                                <li>Classroom analytics dashboard</li>
                                <li>Printable quiz resources</li>
                            </ul>
                        </section>
                    </div>

                    <section className="pt-full-box">
                        <h2>NCERT Curriculum Alignment 📚</h2>
                        <p>Every question and topic in LearnQuest is meticulously mapped to the latest NCERT textbooks for Classes 6-10. We ensure that the gamified experience directly supports school curriculum goals.</p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default ParentsTeachers;
