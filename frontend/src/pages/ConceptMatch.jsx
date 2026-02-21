import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ConceptMatch.css';

const ConceptMatch = () => {
    const { topicId } = useParams();
    const [searchParams] = useSearchParams();
    const chapterName = searchParams.get('chapterName') || 'NCERT Chapter';
    const topicTitle = searchParams.get('topic') || 'Mission Topic';
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [pairs, setPairs] = useState([]);
    const [meanings, setMeanings] = useState([]);
    const [matchedIds, setMatchedIds] = useState([]);
    const [wrongId, setWrongId] = useState(null);
    const [hint, setHint] = useState(null);
    const [sparkles, setSparkles] = useState([]);

    const fetchPairs = async () => {
        try {
            const subject = localStorage.getItem('selectedWorld') === 'math' ? 'Math' : 'Science';
            const res = await axios.post('/api/match-pairs', {
                subject,
                chapter: chapterName,
                topic: topicTitle,
                standard: user?.student_profile?.standard || "10"
            });

            const rawPairs = res.data.pairs || [];
            // Shuffle meanings for the right column
            const shuffledMeanings = [...rawPairs]
                .map((p, i) => ({ ...p, originalIndex: i }))
                .sort(() => Math.random() - 0.5);

            setPairs(rawPairs);
            setMeanings(shuffledMeanings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchPairs();
    }, [token]);

    const handleDragStart = (e) => {
        setWrongId(null);
        setHint(null);
    };

    const triggerSparkle = (x, y) => {
        const id = Date.now();
        setSparkles(prev => [...prev, { id, x, y }]);
        setTimeout(() => {
            setSparkles(prev => prev.filter(s => s.id !== id));
        }, 800);
    };

    const checkMatch = (conceptIndex, meaningIndex, event) => {
        const concept = pairs[conceptIndex];
        const meaning = meanings[meaningIndex];

        if (meaning.concept === concept.concept) {
            // SUCCESS
            setMatchedIds(prev => [...prev, conceptIndex]);
            triggerSparkle(event.clientX, event.clientY);
        } else {
            // WRONG
            setWrongId(meaningIndex);
            setHint(`Hint: ${concept.concept} is related to ${concept.meaning.split(' ')[0]}...`);
            setTimeout(() => setWrongId(null), 500);
        }
    };

    if (loading) return (
        <div className="match-container">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="loading-icon">🧩</motion.div>
            <h2>Preparing Match Mission...</h2>
        </div>
    );

    return (
        <div className="match-container">
            <div className="match-header">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="match-title">
                    Concept Match 🎯
                </motion.h1>
                <p className="match-subtitle">Drag the concepts from the left to their meanings on the right!</p>
            </div>

            <div className="match-board">
                {/* Concepts (Draggable) */}
                <div className="concepts-column">
                    {pairs.map((item, idx) => (
                        <AnimatePresence key={idx}>
                            {!matchedIds.includes(idx) && (
                                <motion.div
                                    drag
                                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                    dragElastic={0.8}
                                    onDragStart={handleDragStart}
                                    onDragEnd={(e, info) => {
                                        // Simple collision detection
                                        const elements = document.elementsFromPoint(e.clientX, e.clientY);
                                        const dropzone = elements.find(el => el.classList.contains('meaning-dropzone'));
                                        if (dropzone) {
                                            const mIdx = parseInt(dropzone.getAttribute('data-index'));
                                            checkMatch(idx, mIdx, e);
                                        }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileDrag={{ scale: 1.1, zIndex: 100 }}
                                    className="concept-item"
                                >
                                    {item.concept}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ))}
                </div>

                {/* Meanings (Dropzones) */}
                <div className="meanings-column">
                    {meanings.map((item, idx) => {
                        const isMatched = matchedIds.some(mIdx => pairs[mIdx].concept === item.concept);
                        return (
                            <div
                                key={idx}
                                data-index={idx}
                                className={`meaning-dropzone ${isMatched ? 'matched' : ''} ${wrongId === idx ? 'wrong' : ''}`}
                            >
                                {isMatched ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        ✅ {item.concept}: {item.meaning}
                                    </motion.div>
                                ) : item.meaning}
                            </div>
                        );
                    })}
                </div>
            </div>

            {hint && (
                <div className="hint-banner">
                    <span>💡</span> {hint}
                </div>
            )}

            <AnimatePresence>
                {sparkles.map(s => (
                    <motion.div
                        key={s.id}
                        className="sparkle"
                        style={{ left: s.x, top: s.y }}
                    >
                        ✨
                    </motion.div>
                ))}
            </AnimatePresence>

            <div className="match-actions">
                {matchedIds.length === pairs.length && pairs.length > 0 ? (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => navigate('/map')}
                        className="mission-complete-btn"
                    >
                        MISSION COMPLETE! 🏆
                    </motion.button>
                ) : (
                    <button onClick={() => navigate(-1)} className="secondary-btn">Abandon Mission</button>
                )}
            </div>
        </div>
    );
};

export default ConceptMatch;
