import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Star, Info, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RayOpticsGame = ({ config, onComplete }) => {
    const navigate = useNavigate();
    const [elements, setElements] = useState([]);
    const [rays, setRays] = useState([]);
    const [draggingId, setDraggingId] = useState(null);
    const [level, setLevel] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const containerRef = useRef(null);

    // Default levels configuration if not provided in config
    const levels = config.levels || [
        {
            title: "Reflection 101",
            instruction: "Guide the laser to the target using the mirror!",
            source: { x: 50, y: 300, angle: 0 }, // Angle in degrees
            target: { x: 750, y: 100, radius: 30 },
            availableTools: [{ type: "mirror", count: 1 }],
            obstacles: []
        },
        {
            title: "Refraction Basics",
            instruction: "Use the glass slab to shift the ray path to hit the target.",
            source: { x: 50, y: 200, angle: 15 },
            target: { x: 750, y: 250, radius: 30 },
            availableTools: [{ type: "slab", count: 1 }],
            obstacles: []
        },
        {
            title: "Focus Master",
            instruction: "Use the Convex Lens to focus parallel rays onto the target.",
            source: { x: 50, y: 300, angle: 0, multiRay: true }, // parallel rays
            target: { x: 600, y: 300, radius: 20 },
            availableTools: [{ type: "convex_lens", count: 1 }],
            obstacles: []
        }
    ];

    const currentLevel = levels[level];

    // Initialize level
    useEffect(() => {
        setElements([]);
        setShowSuccess(false);
        // Add tools to workspace initially (simplified for now - just spawn them)
        const initialElements = currentLevel.availableTools.map((tool, idx) => ({
            id: `tool-${idx}`,
            type: tool.type,
            x: 300 + idx * 100, // Initial generic position
            y: 300,
            rotation: 90, // vertical by default
            width: tool.type === 'slab' ? 100 : 10,
            height: 100,
            focalLength: 100 // for lenses
        }));
        setElements(initialElements);
    }, [level]);

    // Physics Engine: Ray Tracing
    useEffect(() => {
        if (!containerRef.current) return;

        const calculateRays = () => {
            let newRays = [];

            // Initial Ray Setup
            // Support single or generic multi-ray (3 parallel rays)
            const sources = currentLevel.source.multiRay
                ? [
                    { ...currentLevel.source, y: currentLevel.source.y - 20 },
                    { ...currentLevel.source, y: currentLevel.source.y },
                    { ...currentLevel.source, y: currentLevel.source.y + 20 }
                ]
                : [currentLevel.source];

            sources.forEach(src => {
                let currentRay = {
                    start: { x: src.x, y: src.y },
                    angle: src.angle * (Math.PI / 180), // convert to radians
                    path: [{ x: src.x, y: src.y }],
                    active: true
                };

                let safetyBreak = 0;
                while (currentRay.active && safetyBreak < 10) {
                    safetyBreak++;

                    // Find closest intersection
                    let closestHit = null;
                    let minBodyDist = Infinity;
                    let hitElement = null;

                    // Check collisions with all elements
                    elements.forEach(el => {
                        // Simple Line-Line Intersection or Line-Rect
                        // Defining element bounds
                        // For simplicity, treating mirrors/lenses as lines mostly

                        // Element Vector (assuming vertical/rotated line segment)
                        const elRad = el.rotation * (Math.PI / 180);
                        const elDx = Math.cos(elRad) * (el.height / 2); // mostly vertical if rotation 90
                        const elDy = Math.sin(elRad) * (el.height / 2);

                        const p1 = { x: el.x - elDx, y: el.y - elDy };
                        const p2 = { x: el.x + elDx, y: el.y + elDy };

                        // Ray Vector
                        const rayDx = Math.cos(currentRay.angle);
                        const rayDy = Math.sin(currentRay.angle);

                        // Ray casting logic (Line Segment Intersection)
                        const intersect = getIntersection(
                            currentRay.start,
                            { x: currentRay.start.x + rayDx * 1000, y: currentRay.start.y + rayDy * 1000 },
                            p1, p2
                        );

                        if (intersect) {
                            const dist = Math.sqrt(
                                Math.pow(intersect.x - currentRay.start.x, 2) +
                                Math.pow(intersect.y - currentRay.start.y, 2)
                            );

                            // Important: ignore intersections extremely close to start (self-intersection)
                            if (dist < minBodyDist && dist > 1) {
                                minBodyDist = dist;
                                closestHit = intersect;
                                hitElement = el;
                            }
                        }
                    });

                    // Check boundaries
                    if (!closestHit) {
                        // Hit screen edge
                        const endX = currentRay.start.x + Math.cos(currentRay.angle) * 1000;
                        const endY = currentRay.start.y + Math.sin(currentRay.angle) * 1000;
                        currentRay.path.push({ x: endX, y: endY });
                        currentRay.active = false;
                    } else {
                        // Process Interaction
                        currentRay.path.push(closestHit);

                        if (hitElement.type === 'mirror') {
                            // Reflection
                            const normalAngle = (hitElement.rotation * (Math.PI / 180)) + (Math.PI / 2);
                            // R = I - 2(N.I)N formula or simple angle math
                            // Angle of Incidence
                            // Simple geometric reflection:
                            // Reflected Angle = 2 * NormalAngle - IncidentAngle - PI
                            let reflectionAngle = 2 * normalAngle - currentRay.angle + Math.PI;
                            currentRay.start = closestHit;
                            currentRay.angle = reflectionAngle;

                        } else if (hitElement.type === 'convex_lens') {
                            // Simple approximation for convex lens refraction
                            // Ray bends towards focal point
                            // Parallel rays (angle 0) meet at focal point

                            // Calculate distance from center of lens
                            const distFromCenter = Math.sqrt(Math.pow(closestHit.x - hitElement.x, 2) + Math.pow(closestHit.y - hitElement.y, 2));
                            const sign = closestHit.y < hitElement.y ? 1 : -1; // above or below principle axis

                            // Bending power based on distance from center (prism approximation)
                            const bendingFactor = 0.5 * (distFromCenter / 50); // arbitrary scaling

                            // If coming roughly horizontal
                            let newAngle = currentRay.angle;
                            if (Math.abs(Math.sin(currentRay.angle)) < 0.1) {
                                // Parallel -> Focus
                                const focalPoint = {
                                    x: hitElement.x + hitElement.focalLength,
                                    y: hitElement.y
                                };
                                newAngle = Math.atan2(focalPoint.y - closestHit.y, focalPoint.x - closestHit.x);
                            } else {
                                // Through Focus -> Parallel (Reverse)
                                // Simplified: just bend towards normal
                                newAngle = currentRay.angle - (sign * 0.1);
                            }

                            currentRay.start = closestHit;
                            currentRay.angle = newAngle;

                        } else if (hitElement.type === 'concave_lens') {
                            // Diverge
                            const distFromCenter = Math.sqrt(Math.pow(closestHit.x - hitElement.x, 2) + Math.pow(closestHit.y - hitElement.y, 2));
                            const sign = closestHit.y < hitElement.y ? -1 : 1; // Diverges OUT

                            currentRay.start = closestHit;
                            currentRay.angle = currentRay.angle + (sign * 0.2);
                        }
                        else {
                            // Stop (Absorption/Blocking)
                            currentRay.active = false;
                        }
                    }
                }
                newRays.push(currentRay);
            });

            setRays(newRays);
            checkWinCondition(newRays);
        };

        calculateRays();
    }, [elements, level]);

    const getIntersection = (p1, p2, p3, p4) => {
        // Line-Line intersection formula
        const x1 = p1.x, y1 = p1.y;
        const x2 = p2.x, y2 = p2.y;
        const x3 = p3.x, y3 = p3.y;
        const x4 = p4.x, y4 = p4.y;

        const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denom === 0) return null;

        const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
        const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return {
                x: x1 + ua * (x2 - x1),
                y: y1 + ua * (y2 - y1)
            };
        }
        return null;
    };

    const checkWinCondition = (currentRays) => {
        // Check if any ray hits the target circle
        const target = currentLevel.target;
        let hits = 0;

        currentRays.forEach(ray => {
            // Check last segment or all segments? Usually last segment hits target
            // But let's check distance of all path points to target for simplicity
            // Logic: Is any point on the ray path inside the target circle?

            // Simplified: Check if any segment intersects circle or endpoint is in circle
            // Checking endpoints for now
            ray.path.forEach(pt => {
                const dist = Math.sqrt(Math.pow(pt.x - target.x, 2) + Math.pow(pt.y - target.y, 2));
                if (dist < target.radius) {
                    hits++;
                }
            });
        });

        if (hits > 0) {
            console.log("Target Hit! Hits:", hits, "ShowSuccess:", showSuccess);
            if (!showSuccess) {
                setShowSuccess(true);
            }
        }
    };

    const handleDragStart = (e, id) => {
        setDraggingId(id);
    };

    const handleDrag = (e, id) => {
        e.preventDefault(); // Prevent scrolling on touch
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        // Mouse/Touch logic
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setElements(prev => prev.map(el =>
            el.id === id ? { ...el, x, y } : el
        ));
    };

    const handleDragEnd = () => {
        setDraggingId(null);
    };

    const rotateElement = (id) => {
        setElements(prev => prev.map(el =>
            el.id === id ? { ...el, rotation: (el.rotation + 15) % 360 } : el
        ));
    };

    const handleNextLevel = () => {
        if (level < levels.length - 1) {
            setLevel(l => l + 1);
        } else {
            onComplete && onComplete();
        }
    };

    return (
        <div className="ray-game-container" style={{
            width: '100%',
            height: '100vh',
            background: '#1a1a2e',
            color: 'white',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button onClick={() => navigate(-1)} className="btn-icon"><ArrowLeft /></button>
                <span style={{ marginLeft: 15, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    Ray Master: {currentLevel.title}
                </span>
            </div>

            {/* Hint Area */}
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
                <button onClick={() => setShowHint(!showHint)} className="btn-icon"><Info /></button>
            </div>
            {showHint && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{ position: 'absolute', top: 70, right: 20, background: 'rgba(0,0,0,0.8)', padding: 15, borderRadius: 8, maxWidth: 300, zIndex: 20 }}>
                    {currentLevel.instruction}
                </motion.div>
            )}

            {/* Game Canvas */}
            <div
                ref={containerRef}
                className="game-area"
                style={{ width: '100%', height: '100%', position: 'relative' }}
                onMouseMove={(e) => draggingId && handleDrag(e, draggingId)}
                onMouseUp={handleDragEnd}
                onTouchMove={(e) => draggingId && handleDrag(e, draggingId)}
                onTouchEnd={handleDragEnd}
            >
                {/* Visual Guidelines */}
                <svg width="100%" height="100%" style={{ position: 'absolute', pointerEvents: 'none' }}>
                    <defs>
                        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#f72585" />
                        </marker>
                    </defs>

                    {/* Target Area */}
                    <circle
                        cx={currentLevel.target.x}
                        cy={currentLevel.target.y}
                        r={currentLevel.target.radius}
                        fill="rgba(50, 255, 100, 0.2)"
                        stroke="#0f0"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                    <text x={currentLevel.target.x} y={currentLevel.target.y + 5}
                        textAnchor="middle" fill="#0f0" fontSize="12">TARGET</text>

                    {/* Source */}
                    <circle cx={currentLevel.source.x} cy={currentLevel.source.y} r="10" fill="#f72585" />

                    {/* Light Rays */}
                    {rays.map((ray, idx) => (
                        <polyline
                            key={`ray-${idx}`}
                            points={ray.path.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#f72585"
                            strokeWidth="3"
                            style={{ filter: 'drop-shadow(0 0 5px #f72585)' }}
                            markerEnd="url(#arrow)"
                        />
                    ))}
                </svg>

                {/* Interactive Elements */}
                {elements.map(el => (
                    <div
                        key={el.id}
                        onMouseDown={(e) => handleDragStart(e, el.id)}
                        onTouchStart={(e) => handleDragStart(e, el.id)}
                        onClick={(e) => { e.stopPropagation(); rotateElement(el.id); }} // Click to rotate
                        style={{
                            position: 'absolute',
                            left: el.x,
                            top: el.y,
                            width: 10, // Visual thickness usually small for mirror/lens
                            height: el.height,
                            transform: `translate(-50%, -50%) rotate(${el.rotation}deg)`,
                            cursor: 'grab',
                            background: el.type === 'mirror' ? 'linear-gradient(90deg, #aaa, #fff, #aaa)' :
                                el.type.includes('lens') ? 'rgba(100, 200, 255, 0.3)' : 'white',
                            border: '2px solid white',
                            borderRadius: el.type.includes('lens') ? '50%' : '2px', // Ellipse for lens
                            // Specialized shapes
                            borderRight: el.type === 'mirror' ? '3px dashed #555' : 'none', // Mirror back
                        }}
                    >
                        {/* Visual representation helper */}
                        {el.type === 'convex_lens' && (
                            <div style={{
                                width: 20, height: el.height,
                                background: 'rgba(130, 200, 255, 0.4)',
                                border: '1px solid #fff',
                                borderRadius: '50%',
                                transform: 'translateX(-5px)'
                            }} />
                        )}
                        {el.type === 'concave_lens' && (
                            <div style={{
                                width: 20, height: el.height,
                                // css hourglass shape approximation? 
                                // simplified: just a box with standard opacity for now
                                background: 'rgba(130, 200, 255, 0.2)',
                                borderTop: '2px solid white',
                                borderBottom: '2px solid white',
                                borderLeft: '1px solid transparent',
                                borderRight: '1px solid transparent',
                                transform: 'translateX(-5px)'
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="success-modal"
                        style={{
                            position: 'absolute',
                            top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(0, 20, 40, 0.95)',
                            border: '2px solid #4cc9f0',
                            padding: 30,
                            borderRadius: 20,
                            textAlign: 'center',
                            zIndex: 100
                        }}
                    >
                        <Star size={60} color="#ffd700" fill="#ffd700" />
                        <h2>Target Hit! 🎯</h2>
                        <p>Brilliant Ray Tracing!</p>
                        <button
                            onClick={handleNextLevel}
                            style={{
                                marginTop: 20,
                                padding: '10px 30px',
                                fontSize: '1.2rem',
                                background: '#4cc9f0',
                                border: 'none',
                                borderRadius: 30,
                                color: '#000',
                                cursor: 'pointer'
                            }}
                        >
                            {level < levels.length - 1 ? "Next Level ➡️" : "Finish Lab 🏆"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RayOpticsGame;
