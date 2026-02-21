import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MirrorMaze.css';

const MirrorMaze = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [gameState, setGameState] = useState('intro'); // intro, playing, success
    const [mirrors, setMirrors] = useState([
        { id: 1, x: 200, y: 300, angle: 45, type: 'plane' },
        { id: 2, x: 600, y: 150, angle: -45, type: 'plane' }
    ]);
    const [rays, setRays] = useState([]);
    const [targetHit, setTargetHit] = useState(false);
    const [score, setScore] = useState(1000);

    const laserSource = { x: 50, y: 300, angle: 0 };
    const target = { x: 700, y: 500, width: 60, height: 60 };
    const mazeBounds = { width: 800, height: 600 };

    // Ray Casting Logic
    const calculateRays = useCallback(() => {
        let currentRays = [];
        let curX = laserSource.x;
        let curY = laserSource.y;
        let curAngle = laserSource.angle;
        let maxReflections = 10;
        let hitTarget = false;

        for (let i = 0; i < maxReflections; i++) {
            let nextX = curX + Math.cos(curAngle * Math.PI / 180) * 1500;
            let nextY = curY + Math.sin(curAngle * Math.PI / 180) * 1500;

            let closestIntersection = null;
            let closestDist = Infinity;
            let reflectionAngle = 0;

            // Check walls
            const wallIntersections = [
                { x: 0, y: (0 - curX) * Math.tan(curAngle * Math.PI / 180) + curY, type: 'left' },
                { x: mazeBounds.width, y: (mazeBounds.width - curX) * Math.tan(curAngle * Math.PI / 180) + curY, type: 'right' },
                { y: 0, x: (0 - curY) / Math.tan(curAngle * Math.PI / 180) + curX, type: 'top' },
                { y: mazeBounds.height, x: (mazeBounds.height - curY) / Math.tan(curAngle * Math.PI / 180) + curX, type: 'bottom' }
            ];

            wallIntersections.forEach(p => {
                if (p.x >= 0 && p.x <= mazeBounds.width && p.y >= 0 && p.y <= mazeBounds.height) {
                    let d = Math.sqrt((p.x - curX) ** 2 + (p.y - curY) ** 2);
                    if (d > 0.1 && d < closestDist) {
                        // Ensure it's in the direction of the ray
                        let angleToPoint = Math.atan2(p.y - curY, p.x - curX) * 180 / Math.PI;
                        if (Math.abs(angleToPoint - curAngle) < 1 || Math.abs(angleToPoint - curAngle) > 359) {
                            closestDist = d;
                            closestIntersection = p;
                        }
                    }
                }
            });

            // Check Mirrors
            mirrors.forEach(m => {
                // Mirror is a line of length 60
                const halfLen = 30;
                const mX1 = m.x - Math.sin(m.angle * Math.PI / 180) * halfLen;
                const mY1 = m.y + Math.cos(m.angle * Math.PI / 180) * halfLen;
                const mX2 = m.x + Math.sin(m.angle * Math.PI / 180) * halfLen;
                const mY2 = m.y - Math.cos(m.angle * Math.PI / 180) * halfLen;

                // Intersection of two lines: Ray (curX, curY) -> (nextX, nextY) and Mirror (mX1, mY1) -> (mX2, mY2)
                const den = (mY2 - mY1) * (nextX - curX) - (mX2 - mX1) * (nextY - curY);
                if (den === 0) return;

                const ua = ((mX2 - mX1) * (curY - mY1) - (mY2 - mY1) * (curX - mX1)) / den;
                const ub = ((nextX - curX) * (curY - mY1) - (nextY - curY) * (curX - mX1)) / den;

                if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                    const intersectionX = curX + ua * (nextX - curX);
                    const intersectionY = curY + ua * (nextY - curY);
                    let d = Math.sqrt((intersectionX - curX) ** 2 + (intersectionY - curY) ** 2);

                    if (d > 0.1 && d < closestDist) {
                        closestDist = d;
                        closestIntersection = { x: intersectionX, y: intersectionY };
                        // Law of Reflection: Angle of incidence = Angle of reflection
                        // Normal angle is mirror angle + 90
                        reflectionAngle = 2 * m.angle - curAngle;
                    }
                }
            });

            // Check Target
            const tx = target.x;
            const ty = target.y;
            const tw = target.width;
            const th = target.height;

            // Simple box intersection
            const tPoints = [
                { x: tx, y: curY + (tx - curX) * Math.tan(curAngle * Math.PI / 180) },
                { x: tx + tw, y: curY + (tx + tw - curX) * Math.tan(curAngle * Math.PI / 180) },
                { y: ty, x: curX + (ty - curY) / Math.tan(curAngle * Math.PI / 180) },
                { y: ty + th, x: curX + (ty + th - curY) / Math.tan(curAngle * Math.PI / 180) }
            ];

            tPoints.forEach(p => {
                if (p.x >= tx && p.x <= tx + tw && p.y >= ty && p.y <= ty + th) {
                    let d = Math.sqrt((p.x - curX) ** 2 + (p.y - curY) ** 2);
                    if (d > 0.1 && d < closestDist) {
                        closestDist = d;
                        closestIntersection = p;
                        hitTarget = true;
                    }
                }
            });

            if (closestIntersection) {
                currentRays.push({ x1: curX, y1: curY, x2: closestIntersection.x, y2: closestIntersection.y });
                if (hitTarget) break;
                if (reflectionAngle !== 0) {
                    curX = closestIntersection.x;
                    curY = closestIntersection.y;
                    curAngle = reflectionAngle;
                    reflectionAngle = 0;
                } else {
                    break; // Hit a wall
                }
            } else {
                break;
            }
        }

        setRays(currentRays);
        setTargetHit(hitTarget);
    }, [mirrors]);

    useEffect(() => {
        calculateRays();
    }, [calculateRays]);

    useEffect(() => {
        if (targetHit && gameState === 'playing') {
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            setGameState('success');
        }
    }, [targetHit, gameState]);

    const handleRotate = (id) => {
        setMirrors(mirrors.map(m => m.id === id ? { ...m, angle: (m.angle + 15) % 360 } : m));
        setScore(prev => Math.max(0, prev - 10));
    };

    const handleDrag = (id, newX, newY) => {
        setMirrors(mirrors.map(m => m.id === id ? { ...m, x: Math.max(0, Math.min(800, newX)), y: Math.max(0, Math.min(600, newY)) } : m));
    };

    return (
        <div className="maze-container">
            <header className="maze-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ BACK</button>
                <div className="maze-stats">
                    <span className="score">ENERGY: {score}</span>
                    <span className="hint">Tip: Rotate mirrors to guide the light!</span>
                </div>
            </header>

            <main className="maze-arena">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="maze-card">
                            <h1>Mirror Maze Puzzle 🔦</h1>
                            <p>Guide the magic laser beam to the treasure box using reflections!</p>
                            <button onClick={() => setGameState('playing')} className="play-btn">START PUZZLE</button>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div className="maze-card winner-card">
                            <h1>Target Found! 💎</h1>
                            <div className="final-score">SCORE: {score}</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">NEXT MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="svg-wrapper">
                    <svg viewBox="0 0 800 600" className="maze-svg">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Background Grid */}
                        <rect width="800" height="600" fill="#1a1a2e" />

                        {/* Laser Source */}
                        <circle cx={laserSource.x} cy={laserSource.y} r="15" fill="#f72585" />
                        <text x={laserSource.x - 20} y={laserSource.y - 25} fill="white" fontSize="12">SOURCE</text>

                        {/* Target Treasure Box */}
                        <rect x={target.x} y={target.y} width={target.width} height={target.height} fill={targetHit ? "#ffd700" : "#4cc9f0"} rx="10" />
                        <text x={target.x + 5} y={target.y + 35} fontSize="30">💎</text>
                        <text x={target.x} y={target.y - 10} fill="white" fontSize="12">TARGET</text>

                        {/* Rays */}
                        {rays.map((r, i) => (
                            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#f72585" strokeWidth="4" filter="url(#glow)" />
                        ))}

                        {/* Mirrors */}
                        {mirrors.map(m => (
                            <g key={m.id} onMouseDown={() => { }} stroke="#4cc9f0">
                                <line
                                    x1={m.x - Math.sin(m.angle * Math.PI / 180) * 30}
                                    y1={m.y + Math.cos(m.angle * Math.PI / 180) * 30}
                                    x2={m.x + Math.sin(m.angle * Math.PI / 180) * 30}
                                    y2={m.y - Math.cos(m.angle * Math.PI / 180) * 30}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    className="mirror-line"
                                />
                                <circle
                                    cx={m.x} cy={m.y} r="35"
                                    fill="transparent"
                                    className="mirror-hitbox"
                                    onClick={() => handleRotate(m.id)}
                                />
                                <text x={m.x - 20} y={m.y + 50} fill="#4cc9f0" fontSize="10">CLICK TO ROTATE</text>
                            </g>
                        ))}
                    </svg>
                </div>
            </main>
        </div>
    );
};

export default MirrorMaze;
