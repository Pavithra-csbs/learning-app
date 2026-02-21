import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './ResistanceMaze.css';

const MAZE_LEVELS = [
    {
        id: 1,
        objective: "LEAST RESISTANCE",
        description: "Find the path that allows maximum current to flow!",
        startNode: 'A',
        targetNode: 'F',
        nodes: {
            'A': { x: 50, y: 150, connections: [{ to: 'B', R: 10 }, { to: 'C', R: 5 }] },
            'B': { x: 200, y: 50, connections: [{ to: 'D', R: 20 }, { to: 'E', R: 10 }] },
            'C': { x: 200, y: 250, connections: [{ to: 'E', R: 5 }, { to: 'F', R: 15 }] },
            'D': { x: 350, y: 50, connections: [{ to: 'F', R: 5 }] },
            'E': { x: 350, y: 150, connections: [{ to: 'F', R: 2 }] },
            'F': { x: 500, y: 150, connections: [] }
        },
        winningCondition: (pathTotal) => pathTotal <= 12 // A -> C -> E -> F = 5 + 5 + 2 = 12
    },
    {
        id: 2,
        objective: "MOST RESISTANCE",
        description: "Find the path that restricts the current the most!",
        startNode: 'A',
        targetNode: 'G',
        nodes: {
            'A': { x: 50, y: 200, connections: [{ to: 'B', R: 20 }, { to: 'C', R: 10 }] },
            'B': { x: 200, y: 100, connections: [{ to: 'D', R: 30 }, { to: 'E', R: 15 }] },
            'C': { x: 200, y: 300, connections: [{ to: 'E', R: 20 }, { to: 'F', R: 10 }] },
            'D': { x: 350, y: 50, connections: [{ to: 'G', R: 50 }] },
            'E': { x: 350, y: 200, connections: [{ to: 'G', R: 40 }] },
            'F': { x: 350, y: 350, connections: [{ to: 'G', R: 10 }] },
            'G': { x: 500, y: 200, connections: [] }
        },
        winningCondition: (pathTotal) => pathTotal >= 100 // A -> B -> D -> G = 20 + 30 + 50 = 100
    }
];

const ResistanceMaze = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, checking, success, fail
    const [currentPath, setCurrentPath] = useState([]);
    const [currentNode, setCurrentNode] = useState(MAZE_LEVELS[0].startNode);
    const [totalResistance, setTotalResistance] = useState(0);
    const [feedback, setFeedback] = useState(null);

    const level = MAZE_LEVELS[currentLevelIdx];

    useEffect(() => {
        // Initialize level
        setCurrentNode(level.startNode);
        setCurrentPath([level.startNode]);
        setTotalResistance(0);
        setGameState('playing');
        setFeedback(null);
    }, [currentLevelIdx, level]);

    const handleNodeClick = (toNode, R) => {
        if (gameState !== 'playing') return;

        const newPath = [...currentPath, toNode];
        const newTotal = totalResistance + R;

        setCurrentPath(newPath);
        setCurrentNode(toNode);
        setTotalResistance(newTotal);

        if (toNode === level.targetNode) {
            validatePath(newTotal);
        }
    };

    const validatePath = (finalTotal) => {
        setGameState('checking');
        const isCorrect = level.winningCondition(finalTotal);

        setTimeout(() => {
            if (isCorrect) {
                setFeedback({ type: 'success', message: `EXCELLENT! Total Resistance: ${finalTotal}Ω. Objective achieved.` });
                canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

                setTimeout(() => {
                    if (currentLevelIdx < MAZE_LEVELS.length - 1) {
                        setCurrentLevelIdx(prev => prev + 1);
                    } else {
                        setGameState('success');
                    }
                }, 2500);
            } else {
                setFeedback({ type: 'error', message: `OOPS! Total Resistance was ${finalTotal}Ω. That wasn't the ${level.objective.toLowerCase()} path. Try again!` });
                setTimeout(() => {
                    // Reset current attempt
                    setCurrentNode(level.startNode);
                    setCurrentPath([level.startNode]);
                    setTotalResistance(0);
                    setGameState('playing');
                    setFeedback(null);
                }, 3000);
            }
        }, 800);
    };

    return (
        <div className="maze-container">
            <header className="maze-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="objective-panel">
                    <span className="obj-label">MISSION:</span>
                    <span className={`obj-target ${level.objective === 'LEAST RESISTANCE' ? 'least' : 'most'}`}>
                        {level.objective}
                    </span>
                </div>
                <div className="live-stats">
                    <div className="stat">ΣR: <span className="val">{totalResistance}Ω</span></div>
                    <div className="stat">LVL: <span className="val">{currentLevelIdx + 1}/2</span></div>
                </div>
            </header>

            <main className="maze-arena">
                <div className="mission-brief">
                    <h2>{level.description}</h2>
                    <p>Click on the nodes to move through the resistors. Plan your route carefully!</p>
                </div>

                <div className="maze-viewport">
                    <svg viewBox="0 0 600 400" className="maze-svg">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Connections (Resistors) */}
                        {Object.entries(level.nodes).map(([nodeId, data]) => (
                            data.connections.map((conn, idx) => {
                                const target = level.nodes[conn.to];
                                const isVisited = currentPath.includes(nodeId) && currentPath.includes(conn.to) &&
                                    currentPath.indexOf(conn.to) === currentPath.indexOf(nodeId) + 1;

                                return (
                                    <g key={`${nodeId}-${conn.to}`} className="maze-edge">
                                        <line
                                            x1={data.x} y1={data.y}
                                            x2={target.x} y2={target.y}
                                            className={`wire ${isVisited ? 'visited' : ''}`}
                                        />
                                        {/* Symbolic Resistor Zig-Zag */}
                                        <g transform={`translate(${(data.x + target.x) / 2}, ${(data.y + target.y) / 2}) rotate(${Math.atan2(target.y - data.y, target.x - data.x) * 180 / Math.PI})`}>
                                            <path
                                                d="M -20 0 L -15 -5 L -5 5 L 5 -5 L 15 5 L 20 0"
                                                fill="none"
                                                stroke={isVisited ? "#38bdf8" : "#475569"}
                                                strokeWidth="3"
                                            />
                                            <rect x="-10" y="-25" width="20" height="15" fill="#0f172a" rx="4" />
                                            <text y="-14" textAnchor="middle" fontSize="10" fill={isVisited ? "#38bdf8" : "#94a3b8"} fontWeight="bold">
                                                {conn.R}Ω
                                            </text>
                                        </g>
                                    </g>
                                );
                            })
                        ))}

                        {/* Nodes */}
                        {Object.entries(level.nodes).map(([id, data]) => {
                            const isCurrent = currentNode === id;
                            const isVisited = currentPath.includes(id);
                            const canMoveTo = level.nodes[currentNode].connections.some(c => c.to === id);

                            return (
                                <g
                                    key={id}
                                    className={`maze-node ${isCurrent ? 'current' : ''} ${canMoveTo ? 'selectable' : ''}`}
                                    onClick={() => {
                                        const conn = level.nodes[currentNode].connections.find(c => c.to === id);
                                        if (conn) handleNodeClick(id, conn.R);
                                    }}
                                >
                                    <circle
                                        cx={data.x} cy={data.y} r="18"
                                        className={`node-outer ${isVisited ? 'visited' : ''}`}
                                    />
                                    <circle
                                        cx={data.x} cy={data.y} r="12"
                                        className="node-inner"
                                    />
                                    <text x={data.x} y={data.y + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="white">
                                        {id}
                                    </text>
                                    {isCurrent && (
                                        <motion.circle
                                            cx={data.x} cy={data.y} r="25"
                                            stroke="#38bdf8" strokeWidth="2" fill="none"
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0, 0.8] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>

                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`maze-feedback ${feedback.type}`}
                            >
                                <span className="icon">{feedback.type === 'success' ? '⚡' : '⚠️'}</span>
                                {feedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <AnimatePresence>
                {gameState === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="maze-overlay">
                        <div className="victory-card">
                            <div className="trophy">🏆</div>
                            <h1>MAZE MASTER!</h1>
                            <p>You navigated the electrical labyrinth with perfect efficiency. The paths of resistance are no longer a mystery to you.</p>
                            <div className="score-summary">
                                <span>UNITS MASTERED: 2</span>
                                <span>TOTAL XP: +250</span>
                            </div>
                            <button onClick={() => navigate('/map')} className="finish-btn">PROCEED TO NEXT MISSION</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ResistanceMaze;
