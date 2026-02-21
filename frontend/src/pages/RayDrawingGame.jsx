import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RayDrawingGame.css';

const RayDrawingGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    // Game State
    const [gameState, setGameState] = useState('intro'); // intro, playing, success
    const [levelIndex, setLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [hint, setHint] = useState("");
    const [userRay, setUserRay] = useState(null); // { x1, y1, x2, y2 }
    const [isDrawing, setIsDrawing] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

    const svgRef = useRef(null);

    const levels = [
        {
            title: "Reflection: Plane Mirror",
            description: "An incident ray hits a plane mirror. Draw the reflected ray!",
            hint: "The angle of incidence is equal to the angle of reflection.",
            type: 'reflection',
            object: { type: 'plane-mirror', x: 400, y1: 100, y2: 500 },
            incidentRay: { x1: 100, y1: 200, x2: 400, y2: 300 },
            normal: { x1: 300, y1: 300, x2: 500, y2: 300 } // Normal at point of incidence
        },
        {
            title: "Refraction: Glass Slab",
            description: "Light enters a denser medium (glass). Draw the refracted ray!",
            hint: "Light bends towards the normal when entering a denser medium.",
            type: 'refraction',
            object: { type: 'glass-slab', x: 400, width: 200, y1: 100, y2: 500 },
            incidentRay: { x1: 100, y1: 200, x2: 400, y2: 300 },
            normal: { x1: 300, y1: 300, x2: 500, y2: 300 }
        }
    ];

    const currentLevel = levels[levelIndex];

    const getMousePos = (e) => {
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse());
    };

    const handleMouseDown = (e) => {
        if (gameState !== 'playing' || feedback === 'correct') return;
        const pos = getMousePos(e);
        setUserRay({ x1: currentLevel.incidentRay.x2, y1: currentLevel.incidentRay.y2, x2: pos.x, y2: pos.y });
        setIsDrawing(true);
        setFeedback(null);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        setUserRay(prev => ({ ...prev, x2: pos.x, y2: pos.y }));
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        checkRay();
    };

    const checkRay = () => {
        if (!userRay) return;

        const { x1, y1, x2, y2 } = userRay;
        const { x1: ix1, y1: iy1, x2: ix2, y2: iy2 } = currentLevel.incidentRay;

        // Calculate angles relative to normal
        // Normal is horizontal (y = 300), point of incidence is (400, 300)
        const incidentAngle = Math.atan2(iy2 - iy1, ix2 - ix1); // Incident ray vector
        const userAngle = Math.atan2(y2 - y1, x2 - x1); // User ray vector

        // Simple plane mirror logic for Level 0
        if (currentLevel.type === 'reflection') {
            const normalAngle = 0; // Horizontal normal
            // Correct reflection: incident y swap if normal is horizontal at x=400
            // Angle of incidence relative to normal (x-axis)
            const angleI = Math.atan2(iy2 - iy1, ix2 - ix1);
            const targetAngle = -angleI; // Reflection across normal

            const diff = Math.abs(userAngle - targetAngle);
            if (diff < 0.15) { // Tolerance
                handleCorrect();
            } else {
                handleWrong();
            }
        } else if (currentLevel.type === 'refraction') {
            // Glass slab bends TOWARDS normal (smaller angle relative to x-axis)
            const angleI = Math.atan2(iy2 - iy1, ix2 - ix1);
            const targetAngle = angleI * 0.6; // Approximation for bending

            const diff = Math.abs(userAngle - targetAngle);
            if (diff < 0.2) {
                handleCorrect();
            } else {
                handleWrong();
            }
        }
    };

    const handleCorrect = () => {
        setFeedback('correct');
        setScore(score + 100);
        setHint("Perfect! Law of Reflection verified. ✅");
        canvasConfetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

        setTimeout(() => {
            if (levelIndex < levels.length - 1) {
                setLevelIndex(levelIndex + 1);
                setFeedback(null);
                setUserRay(null);
                setHint("");
            } else {
                setGameState('success');
            }
        }, 2000);
    };

    const handleWrong = () => {
        setFeedback('wrong');
        setHint(`Try again! Remember: ${currentLevel.hint}`);
    };

    const startGame = () => {
        setGameState('playing');
        setLevelIndex(0);
        setScore(0);
        setUserRay(null);
        setFeedback(null);
    };

    return (
        <div className="ray-game-container">
            <div className="game-overlay"></div>

            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ BACK</button>
                <div className="game-stats">
                    <span className="score-badge">SCORE: {score}</span>
                    <span className="level-badge">LEVEL: {levelIndex + 1}/{levels.length}</span>
                </div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'intro' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="game-card intro-card"
                        >
                            <h1>Ray Drawing Challenge ✏️</h1>
                            <p>Master the laws of Light! Draw incident, reflected, and refracted rays to complete the mission.</p>
                            <button onClick={startGame} className="start-btn">START MISSION 🚀</button>
                        </motion.div>
                    )}

                    {gameState === 'playing' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="drawing-board"
                        >
                            <div className="instruction-box">
                                <h2>{currentLevel.title}</h2>
                                <p>{currentLevel.description}</p>
                                {hint && <p className={`hint-text ${feedback}`}>{hint}</p>}
                            </div>

                            <svg
                                ref={svgRef}
                                viewBox="0 0 800 600"
                                className="optics-svg"
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                            >
                                {/* Grid Background */}
                                <defs>
                                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />

                                {/* Normal Line */}
                                <line
                                    x1={currentLevel.normal.x1} y1={currentLevel.normal.y1}
                                    x2={currentLevel.normal.x2} y2={currentLevel.normal.y2}
                                    className="normal-line"
                                    strokeDasharray="8,8"
                                />
                                <text x={currentLevel.normal.x2} y={currentLevel.normal.y2 - 10} fill="rgba(255,255,255,0.4)" fontSize="12">NORMAL</text>

                                {/* Optics Object */}
                                {currentLevel.object.type === 'plane-mirror' && (
                                    <g>
                                        <rect x={currentLevel.object.x - 5} y={currentLevel.object.y1} width="10" height={currentLevel.object.y2 - currentLevel.object.y1} fill="#4cc9f0" opacity="0.5" />
                                        <line x1={currentLevel.object.x} y1={currentLevel.object.y1} x2={currentLevel.object.x} y2={currentLevel.object.y2} stroke="#4cc9f0" strokeWidth="4" />
                                        {/* Mirror markings */}
                                        {[...Array(10)].map((_, i) => (
                                            <line
                                                key={i}
                                                x1={currentLevel.object.x} y1={currentLevel.object.y1 + i * 40}
                                                x2={currentLevel.object.x + 10} y2={currentLevel.object.y1 + i * 40 - 10}
                                                stroke="#4cc9f0" strokeWidth="1" opacity="0.5"
                                            />
                                        ))}
                                    </g>
                                )}

                                {currentLevel.object.type === 'glass-slab' && (
                                    <rect
                                        x={currentLevel.object.x} y={currentLevel.object.y1}
                                        width={currentLevel.object.width} height={currentLevel.object.y2 - currentLevel.object.y1}
                                        fill="rgba(76, 201, 240, 0.1)"
                                        stroke="#4cc9f0"
                                        strokeWidth="2"
                                    />
                                )}

                                {/* Incident Ray */}
                                <line
                                    x1={currentLevel.incidentRay.x1} y1={currentLevel.incidentRay.y1}
                                    x2={currentLevel.incidentRay.x2} y2={currentLevel.incidentRay.y2}
                                    className="incident-ray"
                                />
                                <circle cx={currentLevel.incidentRay.x2} cy={currentLevel.incidentRay.y2} r="6" fill="#f72585" />

                                {/* Arrows for incident ray */}
                                <path d={`M ${currentLevel.incidentRay.x1 + 150} ${currentLevel.incidentRay.y1 + 50} l -10 5 l 2 -5 l -2 -5 z`} fill="#f72585" transform={`rotate(${Math.atan2(currentLevel.incidentRay.y2 - currentLevel.incidentRay.y1, currentLevel.incidentRay.x2 - currentLevel.incidentRay.x1) * 180 / Math.PI}, ${currentLevel.incidentRay.x1 + 150}, ${currentLevel.incidentRay.y1 + 50})`} />

                                {/* User Drawn Ray */}
                                {userRay && (
                                    <line
                                        x1={userRay.x1} y1={userRay.y1}
                                        x2={userRay.x2} y2={userRay.y2}
                                        className={`user-ray ${feedback}`}
                                    />
                                )}
                            </svg>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="game-card success-card"
                        >
                            <div className="stars">⭐ ⭐ ⭐</div>
                            <h1>Mission Accomplished! 🏆</h1>
                            <p>You've mastered the basics of Ray Optics. Your accuracy is impressive!</p>
                            <div className="final-score">TOTAL SCORE: {score}</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">BACK TO WORLD MAP 🗺️</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default RayDrawingGame;
