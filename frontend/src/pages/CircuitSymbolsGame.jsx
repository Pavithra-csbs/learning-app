import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CircuitSymbolsGame.css';

const SYMBOLS = [
    { id: 'battery', label: 'Battery', icon: '🔋', symbol: 'battery', description: 'Provides potential difference to the circuit.' },
    { id: 'bulb', label: 'Bulb', icon: '💡', symbol: 'bulb', description: 'Converts electrical energy into light.' },
    { id: 'switch', label: 'Switch', icon: '🔌', symbol: 'switch', description: 'Controls the flow of current (Opens/Closes).' },
    { id: 'resistor', label: 'Resistor', icon: '〰️', symbol: 'resistor', description: 'Provides resistance to the flow of current.' },
    { id: 'ammeter', label: 'Ammeter', icon: '🅰️', symbol: 'ammeter', description: 'Measures current in amperes.' },
    { id: 'voltmeter', label: 'Voltmeter', icon: '🆅', symbol: 'voltmeter', description: 'Measures potential difference in volts.' }
];

const SLOTS = [
    { id: 'slot-1', expected: 'battery', x: 200, y: 300, label: 'Power Source' },
    { id: 'slot-2', expected: 'switch', x: 400, y: 300, label: 'Control' },
    { id: 'slot-3', expected: 'ammeter', x: 550, y: 150, label: 'Current Meter' },
    { id: 'slot-4', expected: 'bulb', x: 400, y: 50, label: 'Load' },
    { id: 'slot-5', expected: 'resistor', x: 200, y: 50, label: 'Resistance' },
    { id: 'slot-6', expected: 'voltmeter', x: 400, y: 120, label: 'Voltage Meter' }
];

const CircuitSymbolsGame = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [placedSymbols, setPlacedSymbols] = useState({}); // { slotId: symbolId }
    const [hint, setHint] = useState(null);
    const [gameState, setGameState] = useState('playing'); // playing, finished

    const handleDrop = (slotId, symbolId) => {
        const slot = SLOTS.find(s => s.id === slotId);
        if (slot.expected === symbolId) {
            const newPlaced = { ...placedSymbols, [slotId]: symbolId };
            setPlacedSymbols(newPlaced);

            if (Object.keys(newPlaced).length === SLOTS.length) {
                setGameState('finished');
                canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            }
        } else {
            // Shake effect or feedback could go here
        }
    };

    const renderSymbolSVG = (type, x, y, size = 40) => {
        const half = size / 2;
        switch (type) {
            case 'battery':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <line x1="10" y1="20" x2="30" y2="20" stroke="white" strokeWidth="4" />
                        <line x1="15" y1="10" x2="15" y2="30" stroke="white" strokeWidth="2" />
                        <line x1="25" y1="15" x2="25" y2="25" stroke="white" strokeWidth="2" />
                    </g>
                );
            case 'bulb':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" />
                        <path d="M 10 30 L 30 10 M 10 10 L 30 30" stroke="white" strokeWidth="2" />
                    </g>
                );
            case 'switch':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <circle cx="10" cy="20" r="3" fill="white" />
                        <circle cx="30" cy="20" r="3" fill="white" />
                        <line x1="10" y1="20" x2="25" y2="10" stroke="white" strokeWidth="2" />
                    </g>
                );
            case 'resistor':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <path d="M 5 20 L 10 10 L 15 30 L 20 10 L 25 30 L 30 10 L 35 20" fill="none" stroke="white" strokeWidth="2" />
                    </g>
                );
            case 'ammeter':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" />
                        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">A</text>
                    </g>
                );
            case 'voltmeter':
                return (
                    <g transform={`translate(${x - half}, ${y - half})`}>
                        <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" />
                        <text x="20" y="25" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">V</text>
                    </g>
                );
            default: return null;
        }
    };

    return (
        <div className="symbols-game-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="game-title">
                    <h1>CIRCUIT SCHEMATIC LAB</h1>
                    <p>Drag symbols to their correct schematic positions</p>
                </div>
                <div className="progress-counter">
                    COMPLETED: {Object.keys(placedSymbols).length} / {SLOTS.length}
                </div>
            </header>

            <main className="game-arena">
                <aside className="toolbox">
                    <h3>TOOLBOX</h3>
                    <div className="symbols-grid">
                        {SYMBOLS.map(symbol => (
                            <motion.div
                                key={symbol.id}
                                className={`symbol-card ${Object.values(placedSymbols).includes(symbol.id) ? 'placed' : ''}`}
                                drag={!Object.values(placedSymbols).includes(symbol.id)}
                                dragSnapToOrigin
                                onDragEnd={(e, info) => {
                                    // Basic hit detection for slots
                                    SLOTS.forEach(slot => {
                                        const slotEl = document.getElementById(slot.id);
                                        const rect = slotEl.getBoundingClientRect();
                                        if (
                                            info.point.x > rect.left &&
                                            info.point.x < rect.right &&
                                            info.point.y > rect.top &&
                                            info.point.y < rect.bottom
                                        ) {
                                            handleDrop(slot.id, symbol.id);
                                        }
                                    });
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="symbol-icon">{symbol.icon}</div>
                                <div className="symbol-info">
                                    <span className="label">{symbol.label}</span>
                                    <button className="info-btn" onClick={() => setHint(symbol)}>❓</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </aside>

                <div className="circuit-board">
                    <svg viewBox="0 0 800 400" className="circuit-svg">
                        {/* Connecting Wires */}
                        <path
                            d="M 200 300 H 400 M 400 300 H 550 V 150 M 550 150 V 50 H 400 M 400 50 H 200 V 150 M 200 150 V 300"
                            fill="none" stroke="#1e293b" strokeWidth="4"
                        />
                        {/* Voltmeter connection lines */}
                        <path d="M 350 50 V 120 M 450 50 V 120 H 350" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="5,5" />

                        {/* Drop Zones / Slots */}
                        {SLOTS.map(slot => (
                            <g key={slot.id} id={slot.id} className="slot-group">
                                <circle
                                    cx={slot.x} cy={slot.y} r="30"
                                    className={`slot-target ${placedSymbols[slot.id] ? 'filled' : ''}`}
                                />
                                {placedSymbols[slot.id] ? (
                                    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        {renderSymbolSVG(placedSymbols[slot.id], slot.x, slot.y)}
                                    </motion.g>
                                ) : (
                                    <text x={slot.x} y={slot.y + 45} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
                                        {slot.label}
                                    </text>
                                )}
                            </g>
                        ))}
                    </svg>
                </div>
            </main>

            <AnimatePresence>
                {hint && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="hint-overlay"
                        onClick={() => setHint(null)}
                    >
                        <motion.div
                            initial={{ y: 50 }} animate={{ y: 0 }}
                            className="hint-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="hint-header">
                                <span className="hint-icon">{hint.icon}</span>
                                <h2>{hint.label}</h2>
                            </div>
                            <p>{hint.description}</p>
                            <div className="schematic-preview">
                                <svg width="100" height="60">
                                    <rect width="100" height="60" fill="#0f172a" rx="10" />
                                    {renderSymbolSVG(hint.symbol, 50, 30)}
                                </svg>
                                <span>Schematic Symbol</span>
                            </div>
                            <button className="close-hint" onClick={() => setHint(null)}>GOT IT</button>
                        </motion.div>
                    </motion.div>
                )}

                {gameState === 'finished' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="victory-overlay">
                        <div className="victory-card">
                            <div className="medal">🎉</div>
                            <h1>Hurray 🎉 Woohoo!</h1>
                            <p className="champion-title">You are an Electricity Champion!</p>
                            <div className="stars-celebration">⭐⭐⭐</div>
                            <p>You have successfully identified and placed all key circuit components into the laboratory blueprint.</p>
                            <div className="rewards">
                                <span>XP EARNED: +300</span>
                                <span>UNITS: ELECTRICITY BASICS</span>
                            </div>
                            <button onClick={() => navigate('/map')} className="finish-btn">COLLECT BADGE</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CircuitSymbolsGame;
