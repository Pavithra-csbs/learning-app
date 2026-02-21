import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './WorldMap.css';

const WorldMap = ({ user }) => {
    const selectedWorld = localStorage.getItem('selectedWorld') || 'science';
    const isMath = selectedWorld === 'math';

    // Level coordinates (percentages to keep it responsive)
    const levels = [
        { id: 1, x: 20, y: 35, label: 'LEVEL 1', animals: '🚀 Pyramids' },
        { id: 2, x: 28, y: 65, label: 'LEVEL 2', animals: '🐘 Elephant' },
        { id: 3, x: 45, y: 80, label: 'LEVEL 3', animals: '🦒 Giraffe' },
        { id: 4, x: 48, y: 20, label: 'LEVEL 4', animals: '🏰 Big Ben' },
        { id: 5, x: 62, y: 30, label: 'LEVEL 5', animals: '🎎 Matryoshka' },
        { id: 6, x: 72, y: 45, label: 'LEVEL 6', animals: '🐼 Panda' },
        { id: 7, x: 82, y: 60, label: 'LEVEL 7', animals: '🐨 Koala' },
        { id: 8, x: 92, y: 85, label: 'LEVEL 8', animals: '🦘 Kangaroo' },
    ];

    // Decorative illustrations from the image
    const decors = [
        { icon: '🏔️', x: 25, y: 20 }, // Mountains
        { icon: '🌵', x: 22, y: 50 }, // Desert
        { icon: '🏛️', x: 55, y: 40 }, // Europe/Greece
        { icon: '💻', x: 78, y: 35 }, // Asia Tech
        { icon: '🐧', x: 70, y: 92 }, // Antarctica
        { icon: '🌊', x: 10, y: 15 }, // Ocean waves
        { icon: '🌊', x: 85, y: 10 },
        { icon: '🚢', x: 15, y: 80 }, // Buoy/Ship
    ];

    return (
        <div className="world-map-wrapper">
            <div className="map-header">
                <div className="science-world-title">
                    {isMath ? (
                        <>
                            <span className="char color-1">M</span>
                            <span className="char color-2">A</span>
                            <span className="char color-3">T</span>
                            <span className="char color-4">H</span>
                        </>
                    ) : (
                        <>
                            <span className="char color-1">S</span>
                            <span className="char color-2">C</span>
                            <span className="char color-3">I</span>
                            <span className="char color-4">E</span>
                            <span className="char color-5">N</span>
                            <span className="char color-1">C</span>
                            <span className="char color-2">E</span>
                        </>
                    )}
                    <span className="space"> </span>
                    <span className="char color-3">W</span>
                    <span className="char color-4">O</span>
                    <span className="char color-5">R</span>
                    <span className="char color-1">L</span>
                    <span className="char color-2">D</span>
                </div>
            </div>

            <div className="map-canvas">
                {/* World Map Backdrop */}
                <div className="map-continents">
                    {/* Placeholder for landmass shapes - using CSS blobs for now */}
                    <div className="landmass na" style={{ left: '10%', top: '20%', width: '25%', height: '30%' }}></div>
                    <div className="landmass sa" style={{ left: '25%', top: '55%', width: '15%', height: '35%' }}></div>
                    <div className="landmass af" style={{ left: '50%', top: '45%', width: '18%', height: '40%' }}></div>
                    <div className="landmass eu" style={{ left: '52%', top: '25%', width: '15%', height: '20%' }}></div>
                    <div className="landmass as" style={{ left: '65%', top: '25%', width: '30%', height: '40%' }}></div>
                    <div className="landmass oc" style={{ left: '85%', top: '75%', width: '12%', height: '15%' }}></div>
                    <div className="landmass an" style={{ left: '40%', top: '90%', width: '50%', height: '8%' }}></div>
                </div>

                {/* Path Connection */}
                <svg className="map-connection-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                    <path
                        d="M 200 350 Q 240 500 280 650 T 450 800 T 480 200 T 620 300 T 720 450 T 820 600 T 920 850"
                        fill="none"
                        stroke="#ff9e00"
                        strokeWidth="3"
                        strokeDasharray="8,8"
                        className="path-line"
                    />
                </svg>

                {/* Grade Badge Buoy */}
                <div className="grade-buoy" style={{ left: '18%', top: '38%' }}>
                    <div className="buoy-content">
                        <span className="grade-text">GRADE {user?.standard || '6'}</span>
                        <span className="change-link">Change</span>
                    </div>
                </div>

                {/* Decorations */}
                {decors.map((d, i) => (
                    <div key={i} className="map-decor" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
                        {d.icon}
                    </div>
                ))}

                {/* Start Marker */}
                <div className="start-badge" style={{ left: '12%', top: '35%' }}>
                    START HERE!
                </div>

                {/* Level Markers */}
                {levels.map((level) => (
                    <Link key={level.id} to={`/learn/${level.id}`} className="level-btn-container" style={{ left: `${level.x}%`, top: `${level.y}%` }}>
                        <motion.div
                            className="level-marker"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <span className="level-num">{level.id}</span>
                        </motion.div>
                        <div className="level-label">LEVEL {level.id}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default WorldMap;
