import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './CircuitBuilder.css';

const COMPONENTS = [
    { id: 'battery', name: 'Battery', icon: '🔋', type: 'source', voltage: 9, resistance: 0.5 },
    { id: 'bulb', name: 'Bulb', icon: '💡', type: 'load', resistance: 10 },
    { id: 'switch', name: 'Switch', icon: '⏻', type: 'control', resistance: 0 },
    { id: 'resistor', name: 'Resistor', icon: '〰️', type: 'load', resistance: 20 },
    { id: 'ammeter', name: 'Ammeter', icon: '⏲️', type: 'measure', resistance: 0.1 },
    { id: 'voltmeter', name: 'Voltmeter', icon: '📟', type: 'measure', resistance: 1000000 },
];

const CircuitBuilder = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const workspaceRef = useRef(null);

    const [placedComponents, setPlacedComponents] = useState([]);
    const [connections, setConnections] = useState([]); // [{from: {id, term}, to: {id, term}}]
    const [isSwitchClosed, setIsSwitchClosed] = useState(false);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');
    const [hint, setHint] = useState("");
    const [wiringMode, setWiringMode] = useState(null); // {compId, terminal}
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Physics State
    const [circuitStats, setCircuitStats] = useState({ current: 0, totalResistance: 0 });

    // Calculate Circuit Physics
    useEffect(() => {
        // Simplified loop detection for educational simulation
        const hasBattery = placedComponents.some(c => c.id === 'battery');
        const hasBulb = placedComponents.some(c => c.id === 'bulb');
        const hasSwitch = placedComponents.some(c => c.id === 'switch');

        // We require at least 3 connections for a minimal loop
        const isClosed = connections.length >= 3 && isSwitchClosed && hasBattery && hasBulb;

        if (isClosed) {
            let totalR = placedComponents.reduce((acc, c) => acc + c.resistance, 0);
            let totalV = placedComponents.find(c => c.id === 'battery')?.voltage || 0;
            const current = totalV / totalR;
            setCircuitStats({ current, totalResistance: totalR });
        } else {
            setCircuitStats({ current: 0, totalResistance: 0 });
        }
    }, [connections, isSwitchClosed, placedComponents]);

    const handleDrop = (id, x, y) => {
        const component = COMPONENTS.find(c => c.id === id);
        const rect = workspaceRef.current.getBoundingClientRect();
        const localX = x - rect.left;
        const localY = y - rect.top;

        setPlacedComponents([...placedComponents, {
            ...component,
            x: localX,
            y: localY,
            instanceId: `comp-${Date.now()}`
        }]);
        setHint("");
    };

    const startWiring = (compId, terminal) => {
        if (wiringMode) {
            // Complete connection
            if (wiringMode.compId !== compId) {
                setConnections([...connections, { from: wiringMode, to: { compId, terminal } }]);
            }
            setWiringMode(null);
        } else {
            setWiringMode({ compId, terminal });
        }
    };

    const toggleSwitch = (instanceId) => {
        setIsSwitchClosed(!isSwitchClosed);
    };

    const resetCircuit = () => {
        setPlacedComponents([]);
        setConnections([]);
        setIsSwitchClosed(false);
        setGameState('playing');
        setHint("");
    };

    const verifyCircuit = () => {
        if (circuitStats.current > 0) {
            setScore(prev => prev + 100);
            setGameState('success');
            canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        } else {
            if (placedComponents.length === 0) setHint("Drag components to the bench first!");
            else if (connections.length < 3) setHint("Use the terminals (dots) to connect components with wires!");
            else if (!isSwitchClosed) setHint("Flip the switch to close the circuit!");
            else setHint("Make sure you have a Battery and a Load (Bulb) in a loop!");
        }
    };

    const getTerminalPos = (compId, terminal) => {
        const comp = placedComponents.find(c => c.instanceId === compId);
        if (!comp) return { x: 0, y: 0 };
        return {
            x: comp.x + (terminal === 'left' ? 0 : 80),
            y: comp.y + 40
        };
    };

    return (
        <div className="circuit-builder-v2">
            <header className="circuit-header">
                <div className="header-left">
                    <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                    <h1>ADVANCED CIRCUIT LAB</h1>
                </div>
                <div className="circuit-stats-display">
                    <div className="stat-pill">AMPS: {circuitStats.current.toFixed(2)}A</div>
                    <div className="stat-pill">OHMS: {circuitStats.totalResistance.toFixed(1)}Ω</div>
                    <div className="energy-badge">XP: {score}</div>
                </div>
            </header>

            <main className="lab-layout">
                <aside className="toolbox">
                    <h3>COMPONENTS</h3>
                    <div className="tools-grid">
                        {COMPONENTS.map(comp => (
                            <motion.div
                                key={comp.id}
                                className="tool-card"
                                drag
                                dragSnapToOrigin
                                onDragEnd={(e, info) => handleDrop(comp.id, info.point.x, info.point.y)}
                            >
                                <span className="tool-icon">{comp.icon}</span>
                                <span className="tool-name">{comp.name}</span>
                            </motion.div>
                        ))}
                    </div>
                    <button className="help-btn" onClick={() => setHint("Connect Battery -> Switch -> Bulb -> Battery in a loop.")}>💡 NEED A HINT?</button>
                    <button className="reset-lab-btn" onClick={resetCircuit}>CLEAR BENCH</button>
                </aside>

                <div
                    className="workbench"
                    ref={workspaceRef}
                    onMouseMove={(e) => {
                        const rect = workspaceRef.current.getBoundingClientRect();
                        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                >
                    <div className="grid-overlay"></div>

                    <svg className="connections-layer">
                        {connections.map((conn, idx) => {
                            const p1 = getTerminalPos(conn.from.compId, conn.from.terminal);
                            const p2 = getTerminalPos(conn.to.compId, conn.to.terminal);
                            return (
                                <motion.path
                                    key={idx}
                                    d={`M ${p1.x} ${p1.y} C ${(p1.x + p2.x) / 2} ${p1.y}, ${(p1.x + p2.x) / 2} ${p2.y}, ${p2.x} ${p2.y}`}
                                    stroke={circuitStats.current > 0 ? "#fbbf24" : "#475569"}
                                    strokeWidth="4"
                                    fill="none"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    className={circuitStats.current > 0 ? 'flowing-wire' : ''}
                                />
                            );
                        })}
                        {wiringMode && (
                            <path
                                d={`M ${getTerminalPos(wiringMode.compId, wiringMode.terminal).x} ${getTerminalPos(wiringMode.compId, wiringMode.terminal).y} L ${mousePos.x} ${mousePos.y}`}
                                stroke="#fbbf24"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                fill="none"
                            />
                        )}
                    </svg>

                    <AnimatePresence>
                        {placedComponents.map((comp) => (
                            <motion.div
                                key={comp.instanceId}
                                className={`component-node ${comp.id}`}
                                style={{ left: comp.x, top: comp.y }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="terminals">
                                    <button
                                        className={`terminal left ${wiringMode?.compId === comp.instanceId && wiringMode.terminal === 'left' ? 'active' : ''}`}
                                        onClick={() => startWiring(comp.instanceId, 'left')}
                                    />
                                    <button
                                        className={`terminal right ${wiringMode?.compId === comp.instanceId && wiringMode.terminal === 'right' ? 'active' : ''}`}
                                        onClick={() => startWiring(comp.instanceId, 'right')}
                                    />
                                </div>
                                <div className="component-body">
                                    {comp.id === 'bulb' ? (
                                        <div className={`bulb-visual ${circuitStats.current > 0 ? 'on' : ''}`} style={{ opacity: 0.3 + (circuitStats.current * 0.7) }}>
                                            💡
                                        </div>
                                    ) : comp.id === 'switch' ? (
                                        <div className="switch-visual" onClick={toggleSwitch}>
                                            <div className={`lever ${isSwitchClosed ? 'closed' : 'open'}`}></div>
                                            <span>{isSwitchClosed ? 'CLOSED' : 'OPEN'}</span>
                                        </div>
                                    ) : comp.id === 'ammeter' ? (
                                        <div className="meter-visual">
                                            <span className="value">{(circuitStats.current).toFixed(2)}</span>
                                            <span className="unit">A</span>
                                        </div>
                                    ) : comp.id === 'voltmeter' ? (
                                        <div className="meter-visual volt">
                                            <span className="value">{(circuitStats.current * comp.resistance / 100000).toFixed(1)}</span>
                                            <span className="unit">V</span>
                                        </div>
                                    ) : (
                                        <span className="large-icon">{comp.icon}</span>
                                    )}
                                    <div className="name-tag">{comp.name}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="floating-controls">
                        {hint && <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lab-hint">🚀 {hint}</motion.div>}
                        <button className="simulate-btn" onClick={verifyCircuit}>TEST CIRCUIT ⚡</button>
                    </div>
                </div>

                <AnimatePresence>
                    {gameState === 'success' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-modal">
                            <div className="modal-content">
                                <h2>PHASE 1 COMPLETE! 🔗</h2>
                                <p>You've mastered basic circuit connectivity. You successfully calculated the current as <b>{circuitStats.current.toFixed(2)} Amperes</b> using Ohm's Law!</p>
                                <div className="lab-report">
                                    <div className="report-item">Voltage: 9V</div>
                                    <div className="report-item">Resistance: {circuitStats.totalResistance.toFixed(1)}Ω</div>
                                    <div className="report-item">Efficiency: Optimal</div>
                                </div>
                                <button onClick={() => navigate('/map')} className="next-btn">CONTINUE MISSION</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CircuitBuilder;
