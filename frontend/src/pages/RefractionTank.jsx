import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './RefractionTank.css';

const RefractionTank = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [incidentAngle, setIncidentAngle] = useState(45);
    const [gameState, setGameState] = useState('intro'); // intro, simulation, success
    const [n1] = useState(1.0); // Air
    const [n2] = useState(1.33); // Water
    const [n3] = useState(1.5); // Glass

    const targetPos = { x: 700, y: 500 };
    const tankLayout = {
        air: { height: 200, color: '#000814' },
        water: { height: 150, color: 'rgba(0, 150, 255, 0.15)' },
        glass: { height: 150, color: 'rgba(255, 255, 255, 0.1)' }
    };

    const calculatePath = useMemo(() => {
        const startX = 50;
        const startY = 100;
        const pts = [{ x: startX, y: startY }];

        // 1. Ray through Air to Water Interface (y = 200)
        const angleRad1 = (incidentAngle * Math.PI) / 180;
        const dx1 = (200 - startY) * Math.tan(angleRad1);
        const hit1 = { x: startX + dx1, y: 200 };
        pts.push(hit1);

        // 2. Refraction at Water Surface (Snell's Law: n1*sin(t1) = n2*sin(t2))
        const sinT2 = (n1 * Math.sin(angleRad1)) / n2;
        const angleRad2 = Math.asin(Math.min(1, sinT2));
        const dx2 = 150 * Math.tan(angleRad2);
        const hit2 = { x: hit1.x + dx2, y: 350 };
        pts.push(hit2);

        // 3. Refraction at Glass Surface
        const sinT3 = (n2 * Math.sin(angleRad2)) / n3;
        const angleRad3 = Math.asin(Math.min(1, sinT3));
        const dx3 = 150 * Math.tan(angleRad3);
        const hit3 = { x: hit2.x + dx3, y: 500 };
        pts.push(hit3);

        // 4. Final segment to bottom
        const hit4 = { x: hit3.x + 50 * Math.tan(angleRad3), y: 550 };
        pts.push(hit4);

        return { pts, finalX: hit3.x, finalAngle: (angleRad3 * 180) / Math.PI };
    }, [incidentAngle, n1, n2, n3]);

    useEffect(() => {
        if (gameState === 'simulation') {
            const dist = Math.abs(calculatePath.finalX - targetPos.x);
            if (dist < 20) {
                setGameState('success');
                canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
        }
    }, [calculatePath, gameState]);

    return (
        <div className="tank-game-container">
            <header className="tank-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="math-hud">
                    <div className="formula">
                        <span className="n">n₁</span> sin θ₁ = <span className="n">n₂</span> sin θ₂
                    </div>
                </div>
            </header>

            <main className="simulation-field">
                <AnimatePresence>
                    {gameState === 'intro' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tank-card overlay-card">
                            <h1>Refraction Tank Simulation 🌊</h1>
                            <p>Light bends differently as it travels through different materials. Adjust the incident angle to hit the target!</p>
                            <button onClick={() => setGameState('simulation')} className="start-btn">CALIBRATE LASER</button>
                        </motion.div>
                    )}

                    {gameState === 'success' && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="tank-card success-card">
                            <h1>Target Destroyed! 🎯</h1>
                            <p>You utilized Snell's Law perfectly. Mathematical precision unlocked!</p>
                            <button onClick={() => navigate('/map')} className="finish-btn">MISSION COMPLETE</button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="simulation-wrapper">
                    <svg viewBox="0 0 800 600" className="tank-svg">
                        {/* Tank Layers */}
                        <rect x="0" y="0" width="800" height="200" fill={tankLayout.air.color} />
                        <rect x="0" y="200" width="800" height="150" fill={tankLayout.water.color} stroke="#4cc9f0" strokeWidth="0.5" />
                        <rect x="0" y="350" width="800" height="150" fill={tankLayout.glass.color} stroke="#4cc9f0" strokeWidth="1" />
                        <rect x="0" y="500" width="800" height="100" fill="#02040a" />

                        {/* Labels */}
                        <text x="20" y="30" fill="gray" fontSize="12">AIR (n = {n1})</text>
                        <text x="20" y="230" fill="#4cc9f0" fontSize="12">WATER (n = {n2})</text>
                        <text x="20" y="380" fill="#f72585" fontSize="12">GLASS (n = {n3})</text>

                        {/* Target */}
                        <g transform={`translate(${targetPos.x - 30}, ${targetPos.y - 30})`}>
                            <rect width="60" height="60" fill="rgba(255,0,0,0.1)" stroke="red" strokeDasharray="4,4" />
                            <text x="15" y="40" fontSize="30">🎯</text>
                        </g>

                        {/* Normals */}
                        <line x1={calculatePath.pts[1].x} y1="150" x2={calculatePath.pts[1].x} y2="250" stroke="rgba(255,255,255,0.2)" strokeDasharray="5,5" />
                        <line x1={calculatePath.pts[2].x} y1="300" x2={calculatePath.pts[2].x} y2="400" stroke="rgba(255,255,255,0.2)" strokeDasharray="5,5" />

                        {/* Light Ray Path */}
                        <polyline
                            points={calculatePath.pts.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#f72585"
                            strokeWidth="4"
                            filter="drop-shadow(0 0 8px #f72585)"
                        />

                        {/* Ray Source */}
                        <circle cx="50" cy="100" r="10" fill="#f72585" />
                    </svg>

                    <div className="controls">
                        <label>INCIDENT ANGLE: {incidentAngle}°</label>
                        <input
                            type="range"
                            min="0"
                            max="70"
                            value={incidentAngle}
                            onChange={(e) => setIncidentAngle(parseInt(e.target.value))}
                            className="angle-slider"
                        />
                        <div className="math-display">
                            <div>sin({incidentAngle}°) = {(Math.sin(incidentAngle * Math.PI / 180)).toFixed(3)}</div>
                            <div>θ refracted ≈ {calculatePath.finalAngle.toFixed(1)}°</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RefractionTank;
