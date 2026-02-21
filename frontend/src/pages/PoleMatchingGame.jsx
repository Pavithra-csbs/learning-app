import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './PoleMatchingGame.css';

const PoleMatchingGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, victory
    const [feedback, setFeedback] = useState("Drag the floating pole to match the fixed magnet!");
    const [currentCase, setCurrentCase] = useState(0);
    const [isVibrating, setIsVibrating] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const CASES = [
        { type: 'ATTRACTION', target: 'S', fixed: 'N', desc: 'Unlike poles attract each other.' },
        { type: 'REPULSION', target: 'N', fixed: 'N', desc: 'Like poles repel each other.' },
        { type: 'ATTRACTION', target: 'N', fixed: 'S', desc: 'Unlike poles attract each other.' },
        { type: 'REPULSION', target: 'S', fixed: 'S', desc: 'Like poles repel each other.' }
    ];

    const handleDrop = (pole) => {
        const goal = CASES[currentCase];
        const isCorrect = (goal.type === 'ATTRACTION' && pole !== goal.fixed) ||
            (goal.type === 'REPULSION' && pole === goal.fixed);

        if (isCorrect) {
            setIsGlowing(true);
            setFeedback("CORRECT! ✨ " + goal.desc);
            setTimeout(() => {
                setIsGlowing(false);
                if (currentCase < CASES.length - 1) {
                    setCurrentCase(prev => prev + 1);
                    setFeedback("Next Case: Match for " + CASES[currentCase + 1].type);
                } else {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                    setShowPopup(true);
                }
            }, 2000);
        } else {
            setIsVibrating(true);
            setFeedback("WRONG! ❌ Remember the rule: " + goal.desc);
            setTimeout(() => setIsVibrating(false), 500);
        }
    };

    return (
        <div className="pole-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ BACK</button>
                <div className="title-area">
                    <h1>POLE MATCHING CHALLENGE</h1>
                    <div className="mission-tag">CASE {currentCase + 1} / {CASES.length}</div>
                </div>
                <div className="score-badge">XP: {currentCase * 100}</div>
            </header>

            <main className="game-arena">
                <div className="objective-panel">
                    <h2>Goal: Show {CASES[currentCase].type}</h2>
                    <p>{feedback}</p>
                </div>

                <div className="simulation-zone">
                    <div className={`fixed-magnet ${isGlowing ? 'glow-green' : ''} ${isVibrating ? 'vibrate' : ''}`}>
                        <div className={`pole ${CASES[currentCase].fixed === 'N' ? 'north' : 'south'}`}>
                            {CASES[currentCase].fixed}
                        </div>
                        <div className={`pole ${CASES[currentCase].fixed === 'N' ? 'south' : 'north'}`}>
                            {CASES[currentCase].fixed === 'N' ? 'S' : 'N'}
                        </div>
                        <span className="label">FIXED</span>
                    </div>

                    <div className="drop-zone">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCase}
                                className="draggable-poles"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                            >
                                <motion.div
                                    className="pole north drag-pole"
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => {
                                        if (info.point.x < 600) handleDrop('N');
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileDrag={{ scale: 1.2, zIndex: 100 }}
                                >
                                    N
                                </motion.div>
                                <motion.div
                                    className="pole south drag-pole"
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => {
                                        if (info.point.x < 600) handleDrop('S');
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                    whileDrag={{ scale: 1.2, zIndex: 100 }}
                                >
                                    S
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                        <p className="drag-hint">Drag a pole towards the fixed magnet!</p>
                    </div>
                </div>
            </main>

            {showPopup && (
                <div className="explanation-overlay">
                    <motion.div
                        className="explanation-popup"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <h2>Mission Accomplished! 🏆</h2>
                        <div className="rule-box">
                            <h3>The Fundamental Law of Magnetism</h3>
                            <p><strong>Like Poles:</strong> North-North or South-South ➡️ <strong>REPEL</strong> (Push away)</p>
                            <p><strong>Unlike Poles:</strong> North-South or South-North ➡️ <strong>ATTRACT</strong> (Pull together)</p>
                        </div>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="next-btn">CONTINUE MISSION</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default PoleMatchingGame;
