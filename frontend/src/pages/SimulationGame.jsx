import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './SimulationGame.css';

const SimulationGame = ({ config, onComplete }) => {
    const { title, goal, simType, initialState, targetState } = config;
    const [simState, setSimState] = useState(initialState || {});
    const [finished, setFinished] = useState(false);
    const [stars, setStars] = useState(0);
    const [hint, setHint] = useState(null);

    // Specific Simulation Logic: SHADOW CATCHER
    const renderShadowCatcher = () => {
        const torchPos = simState.torchX || 50;
        const objectPos = 300; // Fixed object position
        const screenPos = 600; // Fixed screen position

        // Simple Physics: Shadow Size = Object Size * (Screen Dist / Source Dist)
        // Source Dist = Object - Torch
        const sourceDist = Math.max(objectPos - torchPos, 50);
        const screenDist = screenPos - objectPos;
        const shadowSize = 100 * (screenDist / sourceDist);
        const shadowOpacity = Math.min(1, 40 / sourceDist);

        const checkWin = () => {
            // Target: Make shadow size around 200
            if (Math.abs(shadowSize - (targetState?.shadowSize || 200)) < 15) {
                setFinished(true);
                setStars(3);
            } else {
                setHint(shadowSize > (targetState?.shadowSize || 200) ? "Move the torch further back!" : "Move the torch closer!");
            }
        };

        return (
            <div className="sim-workspace shadow-sim">
                <div className="sim-floor" />

                {/* Torch */}
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: objectPos - 50 }}
                    onDrag={(e, info) => setSimState({ torchX: torchPos + info.delta.x })}
                    onDragEnd={checkWin}
                    style={{ left: `${torchPos}px` }}
                    className="sim-torch"
                >
                    <div className="beam" style={{ opacity: shadowOpacity }} />
                    🔦
                </motion.div>

                {/* Object (A small bear or box) */}
                <div className="sim-object" style={{ left: `${objectPos}px` }}>📦</div>

                {/* Screen / Shadow */}
                <div className="sim-screen" style={{ left: `${screenPos}px` }}>
                    <motion.div
                        animate={{ height: shadowSize, width: shadowSize / 2, opacity: shadowOpacity }}
                        className="projected-shadow"
                    />
                </div>

                <div className="sim-ui">
                    <span>Shadow Scale: {(shadowSize / 10).toFixed(1)}x</span>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: PRECISION RULER
    const renderRulerSim = () => {
        const objX = simState.objX || 50;
        const targetX = targetState?.targetX || 400;

        const checkWin = () => {
            if (Math.abs(objX - targetX) < 10) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace ruler-sim">
                <div className="ruler-tool" />
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 50, right: 600 }}
                    onDrag={(e, info) => setSimState({ objX: objX + info.delta.x })}
                    onDragEnd={checkWin}
                    style={{ left: `${objX}px` }}
                    className="sim-draggable-obj"
                >
                    ✏️
                </motion.div>
                <div className="target-marker" style={{ left: `${targetX}px` }}>| Target |</div>
            </div>
        );
    };

    // Specific Simulation Logic: HEAT LAB (Thermometer)
    const renderThermometerSim = () => {
        const currentTemp = simState.temp || 25;
        const targetTemp = targetState?.targetTemp || 75;

        const checkWin = () => {
            if (Math.abs(currentTemp - targetTemp) < 5) {
                setFinished(true);
                setStars(3);
            } else {
                setHint(currentTemp < targetTemp ? "Heat it up more!" : "It's too hot! Cool it down.");
            }
        };

        return (
            <div className="sim-workspace thermometer-sim">
                <div className="thermometer-frame">
                    <motion.div
                        animate={{ height: `${currentTemp}%` }}
                        className="mercury-column"
                    />
                    <div className="temp-display">{currentTemp}°C</div>
                </div>
                <div className="sim-controls">
                    <button onMouseDown={() => {
                        const interval = setInterval(() => {
                            setSimState(prev => ({ ...prev, temp: Math.min(prev.temp + 1, 100) }));
                        }, 50);
                        const stop = () => {
                            clearInterval(interval);
                            window.removeEventListener('mouseup', stop);
                            checkWin();
                        };
                        window.addEventListener('mouseup', stop);
                    }} className="heat-btn">🔥 HEAT</button>
                    <button onMouseDown={() => {
                        const interval = setInterval(() => {
                            setSimState(prev => ({ ...prev, temp: Math.max(prev.temp - 1, 0) }));
                        }, 50);
                        const stop = () => {
                            clearInterval(interval);
                            window.removeEventListener('mouseup', stop);
                            checkWin();
                        };
                        window.addEventListener('mouseup', stop);
                    }} className="cool-btn">❄️ COOL</button>
                </div>
                <div className="target-marker" style={{ bottom: `${targetTemp}%` }}>
                    Target: {targetTemp}°C
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: SPEED RACE
    const renderRaceSim = () => {
        const distance = simState.distance || 100;
        const time = simState.time || 10;
        const speed = (distance / time).toFixed(1);

        const checkWin = () => {
            if (Math.abs(speed - (targetState?.correctSpeed || 10)) < 0.5) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace race-sim">
                <div className="race-track">
                    <motion.div
                        animate={{ x: `${(speed / 20) * 100}%` }}
                        className="race-car"
                    >🏎️</motion.div>
                </div>
                <div className="sim-controls">
                    <label>Time (sec): {time}</label>
                    <input type="range" min="1" max="50" value={time} onChange={(e) => setSimState(prev => ({ ...prev, time: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <div className="calc-box">Speed = {distance} / {time} = {speed} m/s</div>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: BULB SLIDER
    const renderBulbSliderSim = () => {
        const resistance = simState.resistance || 50;
        const brightness = Math.max(0, 100 - resistance);

        const checkWin = () => {
            if (resistance === (targetState?.perfectGlow || 20)) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace bulb-sim">
                <div className="circuit-view">
                    <div className="wire-path" />
                    <motion.div
                        animate={{
                            backgroundColor: brightness > 70 ? "#fde047" : "#4b5563",
                            boxShadow: brightness > 70 ? `0 0 ${brightness / 2}px #fde047` : "none"
                        }}
                        className="sim-bulb"
                    >💡</motion.div>
                </div>
                <div className="sim-controls">
                    <label>Resistance (Ω): {resistance}</label>
                    <input type="range" min="0" max="100" value={resistance} onChange={(e) => setSimState(prev => ({ ...prev, resistance: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: PRESSURE LAB
    const renderPressureSim = () => {
        const force = 100;
        const area = simState.area || 10;
        const pressure = (force / area).toFixed(1);

        const checkWin = () => {
            if (pressure > 20) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace pressure-sim">
                <div className="surface-view">
                    <motion.div
                        style={{ width: `${area * 10}px` }}
                        className="contact-area"
                    >PRESSURE: {pressure} Pa</motion.div>
                </div>
                <div className="sim-controls">
                    <label>Area of Contact: {area}</label>
                    <input type="range" min="1" max="100" value={area} onChange={(e) => setSimState(prev => ({ ...prev, area: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <p>Tip: Smaller area = Higher pressure!</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: PITCH MATCH
    const renderPitchSim = () => {
        const freq = simState.frequency || 200;
        const target = targetState?.targetFreq || 440;

        const checkWin = () => {
            if (Math.abs(freq - target) < 10) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace pitch-sim">
                <div className="wave-viewer">
                    <motion.div
                        animate={{
                            height: [20, 80, 20],
                            transition: { duration: 1 / freq, repeat: Infinity }
                        }}
                        className="sound-wave"
                    />
                </div>
                <div className="sim-controls">
                    <label>Frequency: {freq} Hz</label>
                    <input type="range" min="100" max="1000" value={freq} onChange={(e) => setSimState(prev => ({ ...prev, frequency: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <div className="target-note">Target: {target} Hz</div>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: GRAVITY LAB
    const renderGravitySim = () => {
        const [falling, setFalling] = useState(false);
        const [posY, setPosY] = useState(0);

        const startDrop = () => {
            setFalling(true);
            let p = 0;
            const interval = setInterval(() => {
                p += 5;
                setPosY(p);
                if (p >= 300) {
                    clearInterval(interval);
                    setFalling(false);
                    setFinished(true);
                    setStars(3);
                }
            }, 50);
        };

        return (
            <div className="sim-workspace gravity-sim">
                <div className="drop-zone">
                    <motion.div
                        animate={{ y: posY }}
                        className="falling-obj"
                    >🌕</motion.div>
                    <div className="ground" />
                </div>
                <div className="sim-controls">
                    <button onClick={startDrop} disabled={falling} className="drop-btn">🚀 RELEASE</button>
                    <p>Observe: In vacuum, all objects fall at the same rate!</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: EYE FOCUSER
    const renderEyeFocuserSim = () => {
        const curvature = simState.curvature || 50;
        const target = targetState?.targetFocus || 80;
        const focalLength = 100 - curvature;

        const checkWin = () => {
            if (Math.abs(curvature - target) < 5) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace eye-sim">
                <div className="eye-diagram">
                    <div className="retina" />
                    <motion.div
                        animate={{
                            borderRadius: `${curvature}%`,
                            scaleY: 1 + (curvature / 100)
                        }}
                        className="eye-lens"
                    />
                    <div className="light-beams">
                        <motion.div
                            animate={{ x: 300 - focalLength }}
                            className="focus-point"
                        />
                    </div>
                </div>
                <div className="sim-controls">
                    <label>Ciliary Muscle Tension: {curvature}</label>
                    <input type="range" min="10" max="90" value={curvature} onChange={(e) => setSimState(prev => ({ ...prev, curvature: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <p>Tip: More tension = More curved lens = Near focal point!</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: EYE FOCUS DOCTOR (New)
    const renderEyeDoctorSim = () => {
        const [lensType, setLensType] = useState('none'); // none, convex, concave
        const [lensPower, setLensPower] = useState(50); // 0 to 100
        const defect = initialState?.defect || 'myopia'; // 'myopia' or 'hypermetropia'

        // Calculate focus point based on defect and lens
        // Base focus: 
        // Myopia: Focuses in FRONT of retina (< 100)
        // Hypermetropia: Focuses BEHIND retina (> 100)
        // Target: 100 (Retina)

        let baseFocus = defect === 'myopia' ? 80 : 120;
        let correction = 0;

        if (lensType === 'convex') {
            // Convex converges rays -> moves focus CLOSER (decreases focal length value)
            correction = - (lensPower / 5);
        } else if (lensType === 'concave') {
            // Concave diverges rays -> moves focus FURTHER (increases focal length value)
            correction = + (lensPower / 5);
        }

        const currentFocus = baseFocus + correction;
        const error = Math.abs(currentFocus - 100);

        // Blur amount for the vision image
        const blurAmount = Math.min(10, error / 2);

        const checkWin = () => {
            if (error < 5) {
                // Correct lens and power
                if ((defect === 'myopia' && lensType === 'concave') ||
                    (defect === 'hypermetropia' && lensType === 'convex')) {
                    setFinished(true);
                    setStars(3);
                } else {
                    // Accidentally got focus right with wrong lens? Unlikely with this math, but safe handle
                    setHint("Vision is clear, but using the wrong lens type isn't safe!");
                }
            } else if (error < 15) {
                setHint("Almost clear! Adjust the power slightly.");
            } else {
                // Wrong direction
                if (defect === 'myopia' && currentFocus < 80) {
                    setHint("Oh no! It's getting blurrier. Myopia needs to push focus BACK.");
                } else if (defect === 'hypermetropia' && currentFocus > 120) {
                    setHint("Oops! Hypermetropia needs to pull focus FORWARD.");
                } else {
                    setHint("Try a different lens or adjust power!");
                }
            }
        };

        return (
            <div className="sim-workspace eye-doctor-sim">
                <div className="doctor-view">
                    <div className="patient-vision" style={{ filter: `blur(${blurAmount}px)` }}>
                        <div className="vision-scene">🌲🏠🌲</div>
                        <div className="vision-label">Patient's View</div>
                    </div>

                    <div className="ray-diagram">
                        <div className="eye-ball">
                            <div className="retina-mark" />
                            <div className="lens-graphic" data-type={lensType} />
                            {/* Simplified Ray Lines */}
                            <svg width="300" height="150" className="rays">
                                <line x1="0" y1="40" x2="150" y2="75" stroke="#fbbf24" strokeWidth="2" />
                                <line x1="0" y1="110" x2="150" y2="75" stroke="#fbbf24" strokeWidth="2" />
                                <circle cx={150 + (currentFocus - 100) * 3} cy="75" r="4" fill="#ef4444" />
                            </svg>
                        </div>
                        <div className="defect-label">
                            Diagnosis: {defect === 'myopia' ? "Myopia (Nearsighted)" : "Hypermetropia (Farsighted)"}
                        </div>
                    </div>
                </div>

                <div className="sim-controls doctor-controls">
                    <h3>Prescribe Lens:</h3>
                    <div className="lens-options">
                        <button
                            className={lensType === 'convex' ? 'active' : ''}
                            onClick={() => setLensType('convex')}
                        >Convex (+)</button>
                        <button
                            className={lensType === 'concave' ? 'active' : ''}
                            onClick={() => setLensType('concave')}
                        >Concave (-)</button>
                        <button
                            className={lensType === 'none' ? 'active' : ''}
                            onClick={() => setLensType('none')}
                        >No Lens</button>
                    </div>

                    {lensType !== 'none' && (
                        <div className="power-slider">
                            <label>Lens Power: {lensPower}%</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={lensPower}
                                onChange={(e) => setLensPower(parseInt(e.target.value))}
                                onMouseUp={checkWin}
                            />
                        </div>
                    )}

                    <button className="check-btn" onClick={checkWin}>CHECK VISION 👓</button>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: PROJECTILE LAB
    const renderProjectileSim = () => {
        const angle = simState.angle || 45;
        const velocity = simState.velocity || 20;
        const [flying, setFlying] = useState(false);
        const [path, setPath] = useState([]);

        const launch = () => {
            setFlying(true);
            const rad = (angle * Math.PI) / 180;
            const vx = velocity * Math.cos(rad);
            const vy = velocity * Math.sin(rad);
            const g = 9.8;

            let t = 0;
            const newPath = [];
            const interval = setInterval(() => {
                t += 0.1;
                const x = vx * t;
                const y = vy * t - 0.5 * g * t * t;
                if (y < 0) {
                    clearInterval(interval);
                    setFlying(false);
                    if (Math.abs(x - (targetState?.targetDistance || 40)) < 5) {
                        setFinished(true);
                        setStars(3);
                    }
                } else {
                    newPath.push({ x: x * 10, y: 300 - y * 10 });
                    setPath([...newPath]);
                }
            }, 30);
        };

        return (
            <div className="sim-workspace projectile-sim">
                <div className="launch-zone">
                    <svg width="100%" height="300">
                        {path.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2" fill="#ef4444" />)}
                        <circle cx={(targetState?.targetDistance || 40) * 10} cy="295" r="10" fill="#22c55e" />
                    </svg>
                </div>
                <div className="sim-controls">
                    <label>Angle: {angle}°</label>
                    <input type="range" min="0" max="90" value={angle} onChange={(e) => setSimState(prev => ({ ...prev, angle: parseInt(e.target.value) }))} />
                    <label>Velocity: {velocity} m/s</label>
                    <input type="range" min="1" max="50" value={velocity} onChange={(e) => setSimState(prev => ({ ...prev, velocity: parseInt(e.target.value) }))} />
                    <button onClick={launch} disabled={flying}>🔥 LAUNCH</button>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: PHOTOSYNTHESIS LAB
    const renderPhotosynthesisSim = () => {
        const sunlight = simState.sunlight || 50;
        const water = simState.water || 50;
        const energy = Math.min(100, (sunlight + water));

        const checkWin = () => {
            if (energy >= 100) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace photo-sim">
                <div className="plant-view">
                    <motion.div
                        animate={{ scale: 0.5 + (energy / 100) }}
                        className="green-leaf"
                    >🍃</motion.div>
                </div>
                <div className="sim-controls">
                    <label>Sunlight Intensity: {sunlight}</label>
                    <input type="range" min="0" max="100" value={sunlight} onChange={(e) => setSimState(prev => ({ ...prev, sunlight: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <label>Water Level: {water}</label>
                    <input type="range" min="0" max="100" value={water} onChange={(e) => setSimState(prev => ({ ...prev, water: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: FRICTION RACE
    const renderFrictionSim = () => {
        const friction = simState.friction || 50;
        const ideal = targetState?.idealFriction || 30;

        const checkWin = () => {
            if (Math.abs(friction - ideal) < 5) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace friction-sim">
                <div className="road-view" style={{ opacity: 0.5 + (friction / 100) }}>
                    🏁 ROAD SURFACE 🏁
                </div>
                <div className="sim-controls">
                    <label>Surface Friction: {friction}</label>
                    <input type="range" min="0" max="100" value={friction} onChange={(e) => setSimState(prev => ({ ...prev, friction: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: GRAPH PLOT
    const renderGraphSim = () => {
        const velocity = simState.velocity || 10;

        const checkWin = () => {
            if (velocity === 10) { // Constant velocity
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace graph-sim">
                <div className="graph-view">
                    <svg width="100%" height="200">
                        <line x1="0" y1="200" x2="200" y2={200 - (velocity * 10)} stroke="#3b82f6" strokeWidth="2" />
                    </svg>
                </div>
                <div className="sim-controls">
                    <label>Car Velocity: {velocity}</label>
                    <input type="range" min="0" max="50" value={velocity} onChange={(e) => setSimState(prev => ({ ...prev, velocity: parseInt(e.target.value) }))} onMouseUp={checkWin} />
                    <p>Match the slope of the constant velocity graph!</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: FRACTION BAR
    const renderFractionBarSim = () => {
        const [parts, setParts] = useState(Array(4).fill(false));
        const target = targetState?.targetFraction || 0.75;

        const togglePart = (i) => {
            const newParts = [...parts];
            newParts[i] = !newParts[i];
            setParts(newParts);
        };

        const checkWin = () => {
            const current = parts.filter(p => p).length / parts.length;
            if (current === target) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace fraction-sim">
                <div className="bar-container">
                    {parts.map((p, i) => (
                        <div
                            key={i}
                            className={`bar-part ${p ? 'filled' : ''}`}
                            onClick={() => togglePart(i)}
                        />
                    ))}
                </div>
                <div className="sim-controls">
                    <button onClick={checkWin}>CHECK FRACTION</button>
                    <p>Current: {parts.filter(p => p).length} / {parts.length}</p>
                    <p>Target: {target * 100}%</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: BALANCE SCALE
    const renderBalanceScaleSim = () => {
        const [xValue, setXValue] = useState(0);
        const leftWeight = 2 * xValue + 5;
        const rightWeight = targetState?.right || 15;

        const checkWin = () => {
            if (xValue === (targetState?.correctX || 5)) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace balance-sim">
                <div className="scale-area">
                    <motion.div
                        animate={{ rotate: (rightWeight - leftWeight) * 5 }}
                        className="scale-beam"
                    >
                        <div className="plate left">{leftWeight} kg</div>
                        <div className="plate right">{rightWeight} kg</div>
                    </motion.div>
                </div>
                <div className="sim-controls">
                    <label>Value of X: {xValue}</label>
                    <input type="range" min="0" max="20" value={xValue} onChange={(e) => setXValue(parseInt(e.target.value))} onMouseUp={checkWin} />
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: SHAPE BUILDER
    const renderShapeBuilderSim = () => {
        const [stats, setStats] = useState({ v: 0, e: 0 });
        const targetV = targetState?.vertices || 8;
        const targetE = targetState?.edges || 12;

        const checkWin = () => {
            if (stats.v === targetV && stats.e === targetE) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace shape-sim">
                <div className="shape-display">
                    <div className="cube-wireframe">📦</div>
                    <p>Shape: {simState.shape || 'Cube'}</p>
                </div>
                <div className="sim-controls">
                    <label>Vertices: {stats.v}</label>
                    <input type="number" value={stats.v} onChange={e => setStats({ ...stats, v: parseInt(e.target.value) })} />
                    <label>Edges: {stats.e}</label>
                    <input type="number" value={stats.e} onChange={e => setStats({ ...stats, e: parseInt(e.target.value) })} />
                    <button onClick={checkWin}>VERIFY SHAPE</button>
                    <p>Tip: Vertices are corners, Edges are lines!</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: GRAPH PLOTTER
    const renderGraphPlotterSim = () => {
        const [m, setM] = useState(0);
        const [c, setC] = useState(0);
        const targetM = targetState?.m || 2;
        const targetC = targetState?.c || 1;

        const checkWin = () => {
            if (m === targetM && c === targetC) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace graph-plotter-sim">
                <div className="graph-area">
                    <svg width="100%" height="200" viewBox="-10 -10 20 20">
                        <line x1="-10" y1="0" x2="10" y2="0" stroke="#ccc" strokeWidth="0.1" />
                        <line x1="0" y1="-10" x2="0" y2="10" stroke="#ccc" strokeWidth="0.1" />
                        <line
                            x1="-5" y1={-(m * (-5) + c)}
                            x2="5" y2={-(m * 5 + c)}
                            stroke="#3b82f6"
                            strokeWidth="0.5"
                        />
                    </svg>
                </div>
                <div className="sim-controls">
                    <label>Slope (m): {m}</label>
                    <input type="range" min="-5" max="5" step="0.5" value={m} onChange={e => setM(parseFloat(e.target.value))} />
                    <label>Intercept (c): {c}</label>
                    <input type="range" min="-5" max="5" step="0.5" value={c} onChange={e => setC(parseFloat(e.target.value))} />
                    <button onClick={checkWin}>PLOTS LINE</button>
                    <p>Equation: y = {m}x + {c}</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: TRIG CIRCLE
    const renderTrigCircleSim = () => {
        const angle = simState.angle || 0;
        const rad = (angle * Math.PI) / 180;
        const sinV = Math.sin(rad).toFixed(2);
        const target = targetState?.targetAngle || 30;

        const checkWin = () => {
            if (angle === target) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace trig-sim">
                <div className="circle-view">
                    <svg width="200" height="200" viewBox="-110 -110 220 220">
                        <circle cx="0" cy="0" r="100" fill="none" stroke="#ccc" strokeWidth="2" />
                        <line x1="0" y1="0" x2={100 * Math.cos(rad)} y2={-100 * Math.sin(rad)} stroke="#ef4444" strokeWidth="3" />
                        <text x="10" y="-10" fill="white">θ = {angle}°</text>
                    </svg>
                </div>
                <div className="sim-controls">
                    <label>Angle (θ): {angle}°</label>
                    <input type="range" min="0" max="360" value={angle} onChange={e => setSimState({ ...simState, angle: parseInt(e.target.value) })} onMouseUp={checkWin} />
                    <div className="trig-stats">sin({angle}°) = {sinV}</div>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: LIMIT EXPLORER
    const renderLimitSim = () => {
        const xValue = simState.x || 0;
        const yValue = (xValue * xValue).toFixed(2);
        const target = targetState?.limitValue || 4;

        const checkWin = () => {
            if (Math.abs(xValue - 2) < 0.1) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace limit-sim">
                <div className="graph-view">
                    <motion.div
                        animate={{ x: (xValue - 2) * 50 }}
                        className="limit-point"
                    >📍 (x={xValue}, y={yValue})</motion.div>
                </div>
                <div className="sim-controls">
                    <label>x: {xValue}</label>
                    <input type="range" min="0" max="4" step="0.1" value={xValue} onChange={e => setSimState({ ...simState, x: parseFloat(e.target.value) })} onMouseUp={checkWin} />
                    <div className="limit-stats">lim(x→2) x² = 4</div>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: POLYNOMIAL BUILDER
    const renderPolynomialSim = () => {
        const root1 = simState.root1 || 0;
        const root2 = simState.root2 || 0;
        const target1 = targetState?.root1 || 2;
        const target2 = targetState?.root2 || -3;

        const checkWin = () => {
            if ((root1 === target1 && root2 === target2) || (root1 === target2 && root2 === target1)) {
                setFinished(true);
                setStars(3);
            }
        };

        return (
            <div className="sim-workspace poly-sim">
                <div className="graph-view">
                    <svg width="100%" height="200" viewBox="-10 -10 20 20">
                        {/* Simplified visualization */}
                        <path d={`M -5 ${((-5 - root1) * (-5 - root2))} Q ${(root1 + root2) / 2} ${-(((root1 - root2) / 2) ** 2)} 5 ${((5 - root1) * (5 - root2))}`} fill="none" stroke="#10b981" strokeWidth="0.2" />
                        <circle cx={root1} cy="0" r="0.5" fill="#ef4444" />
                        <circle cx={root2} cy="0" r="0.5" fill="#ef4444" />
                    </svg>
                </div>
                <div className="sim-controls">
                    <label>Root 1: {root1}</label>
                    <input type="range" min="-5" max="5" value={root1} onChange={e => setSimState({ ...simState, root1: parseInt(e.target.value) })} onMouseUp={checkWin} />
                    <label>Root 2: {root2}</label>
                    <input type="range" min="-5" max="5" value={root2} onChange={e => setSimState({ ...simState, root2: parseInt(e.target.value) })} onMouseUp={checkWin} />
                    <p>f(x) = (x - {root1})(x - {root2})</p>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: CIRCUIT PUZZLE LAB (New)
    const renderCircuitPuzzleSim = () => {
        const levels = config.levels || [];
        const [currentLevel, setCurrentLevel] = useState(initialState?.level || 0);
        const levelData = levels[currentLevel] || {};
        const [circuit, setCircuit] = useState([]); // Array of placed components
        const [brightness, setBrightness] = useState(0);

        // Constants
        const BATTERY_VOLTAGE = 10;

        // Circuit Logic Helper
        const calculateCircuit = () => {
            // Simplified Logic for Series/Parallel detection based on slot placement
            // We assume a 2-slot grid for this prototype: 
            // Slot 1 & Slot 2 can be Series (in line) or Parallel (across rails)
            // For now, let's use a "Construction Mode" toggle? 
            // Better: Drag to specific zones.
            // Zone A: Series Path. Zone B: Parallel Path.

            // Actually, let's just sum resistance based on simple rule:
            // If they are in "Series Zone", sum R.
            // If they are in "Parallel Zone", sum 1/R.

            let totalR = 0;
            const resistors = circuit.filter(c => c.type === 'resistor');

            if (resistors.length === 0) {
                setBrightness(0);
                return;
            }

            // Heuristic for the puzzle levels:
            // Level 0 says "Series" -> treat all placed as series
            // Level 1 says "Parallel" -> treat all placed as parallel
            const isParallelLevel = levelData.title.includes("Parallel");

            if (isParallelLevel) {
                const inverseR = resistors.reduce((acc, r) => acc + (1 / r.resistance), 0);
                totalR = 1 / inverseR;
            } else {
                totalR = resistors.reduce((acc, r) => acc + r.resistance, 0);
            }

            // Add Bulb Resistance (fixed small value)
            totalR += 1;

            const current = BATTERY_VOLTAGE / totalR;
            setBrightness(Math.min(100, current * 50)); // Scale for visual

            // Check Win
            if (Math.abs(current - levelData.targetCurrent) < 0.2) {
                if (!finished) {
                    setFinished(true);
                    setStars(3);
                }
            }
        };

        useEffect(() => {
            calculateCircuit();
        }, [circuit]);

        const addToCircuit = (component) => {
            if (circuit.length < 2) { // Limit to 2 components for simplicity
                setCircuit([...circuit, { ...component, id: Date.now() }]);
            } else {
                setHint("Circuit full! Remove a component first.");
            }
        };

        const removeFromCircuit = (id) => {
            setCircuit(circuit.filter(c => c.id !== id));
            setFinished(false);
        };

        const nextLevel = () => {
            if (currentLevel < levels.length - 1) {
                setCurrentLevel(currentLevel + 1);
                setCircuit([]);
                setFinished(false);
                setStars(0);
                setHint(null);
            }
        };

        return (
            <div className="sim-workspace circuit-puzzle-sim">
                <div className="circuit-header">
                    <h3>Level {currentLevel + 1}: {levelData.title}</h3>
                    <p>{levelData.instruction}</p>
                </div>

                <div className="circuit-board">
                    {/* Battery (Fixed) */}
                    <div className="component-fixed battery">🔋 {BATTERY_VOLTAGE}V</div>

                    {/* Wiring Visuals */}
                    <svg className="wires" width="100%" height="100%">
                        <line x1="100" y1="100" x2="100" y2="50" stroke="#fbbf24" strokeWidth="4" />
                        <line x1="100" y1="50" x2="700" y2="50" stroke="#fbbf24" strokeWidth="4" />
                        <line x1="700" y1="50" x2="700" y2="100" stroke="#fbbf24" strokeWidth="4" />
                        {/* Dynamic connections based on slots would go here */}
                    </svg>

                    {/* Circuit Slot Area */}
                    <div className="circuit-slots">
                        {circuit.map((comp) => (
                            <motion.div
                                key={comp.id}
                                layoutId={comp.id}
                                className="component-placed"
                                onClick={() => removeFromCircuit(comp.id)}
                            >
                                {comp.type === 'resistor' ? '🛑' : '💡'}
                                <span>{comp.resistance}Ω</span>
                            </motion.div>
                        ))}
                        {circuit.length === 0 && <div className="empty-slot">Trace Circuit Here</div>}
                    </div>

                    {/* Bulb Output */}
                    <div className="component-fixed bulb">
                        <div className="bulb-glow" style={{ boxShadow: `0 0 ${brightness}px ${brightness / 2}px #fbbf24`, opacity: brightness / 100 }}>💡</div>
                    </div>
                </div>

                <div className="sim-controls">
                    <h4>Toolbox</h4>
                    <div className="toolbox">
                        {levelData.components?.map((comp, idx) => (
                            <button key={idx} onClick={() => addToCircuit(comp)} disabled={circuit.length >= 2}>
                                {comp.type === 'resistor' ? `Resistor ${comp.resistance}Ω` : comp.type}
                            </button>
                        ))}
                    </div>
                    <div className="meter">
                        Current: {(brightness / 50).toFixed(2)}A (Target: {levelData.targetCurrent}A)
                    </div>
                    {finished && currentLevel < levels.length - 1 && (
                        <button className="next-level-btn" onClick={nextLevel}>NEXT LEVEL ⏭️</button>
                    )}
                </div>
            </div>
        );
    };



    // Specific Simulation Logic: MAGNETIC FIELD BUILDER (New Scenario UI)
    const renderMagneticFieldSim = () => {
        const navigate = useNavigate();
        const levels = config.levels || [];
        const [currentLevelIdx, setCurrentLevelIdx] = useState(initialState?.level || 0);
        const [selectedOption, setSelectedOption] = useState(null);
        const [showFeedback, setShowFeedback] = useState(false);
        const [isCorrect, setIsCorrect] = useState(false);

        const currentLevel = levels[currentLevelIdx] || {};
        const totalLevels = levels.length;
        const progress = ((currentLevelIdx + 1) / totalLevels) * 100;

        const handleOptionClick = (option) => {
            if (showFeedback) return; // Prevent multiple clicks
            setSelectedOption(option.id);
            const correct = option.correct === true;
            setIsCorrect(correct);
            setShowFeedback(true);
        };

        const nextLevel = () => {
            if (currentLevelIdx < totalLevels - 1) {
                setCurrentLevelIdx(prev => prev + 1);
                setSelectedOption(null);
                setShowFeedback(false);
                setIsCorrect(false);
            } else {
                setFinished(true);
                setStars(3);
            }
        };

        // Render visual scenario based on type
        const renderVisuals = () => {
            const visual = currentLevel.visual || {};
            // Using a simple canvas or absolute positioning for magnets
            return (
                <div className="mag-visual-container">
                    <p className="mag-scenario-text">{currentLevel.question.split('\n')[0]}</p>

                    <div className="mag-scene">
                        {visual.magnets?.map((mag, idx) => (
                            <div key={idx} className="mag-bar-magnet" style={{
                                left: `calc(50% + ${mag.x}px)`,
                                top: `calc(50% + ${mag.y}px)`
                            }}>
                                {mag.pole === 'bar' ? (
                                    <>
                                        <div className="mag-pole N">N</div>
                                        <div className="mag-pole S">S</div>
                                    </>
                                ) : (
                                    <div className={`mag-pole-single ${mag.color}`}>
                                        {mag.label}
                                        {/* Arrows for repulsion/attraction */}
                                        {visual.arrows && (
                                            <span className={`mag-arrow ${idx === 0 ? 'left' : 'right'}`}>
                                                {idx === 0 ? (visual.arrows[0] === '<-' ? '⬅️' : '➡️') : (visual.arrows[1] === '<-' ? '⬅️' : '➡️')}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {visual.type === 'field_lines' && (
                            <div className="mag-field-lines">
                                {/* SVG curves representing field lines from N (left) to S (right) */}
                                <svg width="400" height="200" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                    <path d="M 140 100 Q 200 20 260 100" stroke="white" fill="none" strokeDasharray="5,5" opacity="0.6" />
                                    <path d="M 140 100 Q 200 180 260 100" stroke="white" fill="none" strokeDasharray="5,5" opacity="0.6" />
                                    <path d="M 130 100 L 270 100" stroke="white" fill="none" strokeDasharray="5,5" opacity="0.3" />
                                    {/* Direction indicator */}
                                    <text x="190" y="60" fill="white" fontSize="12">▶</text>
                                    <text x="190" y="150" fill="white" fontSize="12">▶</text>
                                </svg>
                            </div>
                        )}
                        {visual.magnets?.length === 2 && (
                            <div className="mag-label-text">
                                N {visual.type === 'repulsion' ? '← →' : '→ ←'} {visual.magnets[1].pole}
                            </div>
                        )}
                    </div>
                </div>
            );
        };

        return (
            <div className="mag-sim-wrapper">
                {/* Header */}
                <div className="mag-header">
                    <button className="mag-back-btn" onClick={() => navigate(-1)}>←</button>
                    <div className="mag-title-icon">🧲</div>
                    <h2>Magnetic Field Builder</h2>
                </div>

                {/* Progress */}
                <div className="mag-progress-container">
                    <div className="mag-progress-bar">
                        <div className="mag-progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{currentLevelIdx + 1}/{totalLevels}</span>
                </div>

                {/* Main Card */}
                <div className="mag-card">
                    {renderVisuals()}
                </div>

                {/* Question Section */}
                <div className="mag-interaction-area">
                    <h3>{currentLevel.question.split('\n')[1] || "What happens?"}</h3>

                    <div className="mag-options-grid">
                        {currentLevel.options?.map((opt) => (
                            <button
                                key={opt.id}
                                className={`mag-option-btn ${selectedOption === opt.id ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleOptionClick(opt)}
                                disabled={showFeedback}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>

                    {currentLevel.hint && (
                        <div className="mag-hint">
                            💡 {currentLevel.hint}
                        </div>
                    )}
                </div>

                {/* Feedback Modal */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            className="mag-feedback-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <motion.div
                                className="mag-feedback-card"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                            >
                                <div className="mag-stars">
                                    {isCorrect ? '⭐⭐⭐' : '⭐'}
                                </div>
                                <h2>
                                    {isCorrect ? 'Hurray 🎉 Correct!' : 'Oops! Try Again'}
                                </h2>
                                {isCorrect && <p>You mastered magnetism!</p>}
                                <button className={`mag-next-btn ${isCorrect ? 'success' : 'retry'}`} onClick={isCorrect ? nextLevel : () => { setShowFeedback(false); setSelectedOption(null); }}>
                                    {isCorrect ? 'Next Level →' : 'Try Again ↺'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    // Specific Simulation Logic: ENERGY CITY PLANNER
    const renderEnergyPlannerSim = () => {
        const stats = config.plantStats || {};
        const mechanics = config.mechanics || {};
        const [grid, setGrid] = useState(initialState?.grid || Array(5).fill(null).map(() => Array(5).fill(null)));
        const [selectedPlant, setSelectedPlant] = useState(null);
        const [budget, setBudget] = useState(initialState?.budget || 1000);
        const [power, setPower] = useState(0);
        const [pollution, setPollution] = useState(0);
        const [showWarning, setShowWarning] = useState(null);

        useEffect(() => {
            let totalPower = 0;
            let totalPollution = 0;
            grid.forEach(row => {
                row.forEach(cell => {
                    if (cell && stats[cell]) {
                        totalPower += stats[cell].power;
                        totalPollution += stats[cell].pollution;
                    }
                });
            });
            setPower(totalPower);
            setPollution(totalPollution);

            if (totalPower >= (initialState?.targetPower || 100) && totalPollution <= (mechanics.maxPollution || 100)) {
                setStars(3);
                setFinished(true);
            }
        }, [grid]);

        const handleTileClick = (r, c) => {
            if (grid[r][c]) {
                // Remove plant
                const plantType = grid[r][c];
                setBudget(prev => prev + stats[plantType].cost * 0.5); // 50% refund
                const newGrid = [...grid];
                newGrid[r] = [...newGrid[r]];
                newGrid[r][c] = null;
                setGrid(newGrid);
                return;
            }

            if (!selectedPlant) return;

            const cost = stats[selectedPlant].cost;
            if (budget >= cost) {
                setBudget(prev => prev - cost);
                const newGrid = [...grid];
                newGrid[r] = [...newGrid[r]];
                newGrid[r][c] = selectedPlant;
                setGrid(newGrid);
            } else {
                setShowWarning("Insufficient Budget!");
                setTimeout(() => setShowWarning(null), 2000);
            }
        };

        return (
            <div className="energy-planner-wrapper">
                <div className="energy-stats-panel">
                    <div className="stat-item">
                        <span className="stat-label">💰 Budget</span>
                        <span className="stat-value">${Math.floor(budget)}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">⚡ Power</span>
                        <div className="stat-progress">
                            <div className="stat-bar power" style={{ width: `${Math.min(100, (power / (initialState?.targetPower || 100)) * 100)}%` }} />
                        </div>
                        <span className="stat-value">{power} / {initialState?.targetPower}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">🌫️ Pollution</span>
                        <div className="stat-progress">
                            <div className="stat-bar pollution" style={{ width: `${Math.min(100, (pollution / (mechanics.maxPollution || 100)) * 100)}%` }} />
                        </div>
                        <span className="stat-value">{pollution} / {mechanics.maxPollution}</span>
                    </div>
                </div>

                {showWarning && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="energy-warning">{showWarning}</motion.div>}

                <div className="energy-grid">
                    {grid.map((row, r) => (
                        <div key={r} className="grid-row">
                            {row.map((cell, c) => (
                                <div
                                    key={c}
                                    className={`grid-tile ${cell ? 'has-plant' : ''} ${selectedPlant && !cell ? 'highlight' : ''}`}
                                    onClick={() => handleTileClick(r, c)}
                                >
                                    {cell ? (
                                        <div className="plant-placed">
                                            {stats[cell].icon}
                                            <span className="plant-name-hover">{stats[cell].name}</span>
                                        </div>
                                    ) : (
                                        <div className="tile-empty" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="plant-selector">
                    <h3>Available Plants</h3>
                    <div className="plant-options">
                        {Object.entries(stats).map(([type, data]) => (
                            <button
                                key={type}
                                className={`plant-btn ${selectedPlant === type ? 'active' : ''}`}
                                onClick={() => setSelectedPlant(type)}
                            >
                                <span className="p-icon">{data.icon}</span>
                                <div className="p-info">
                                    <span className="p-name">{data.name}</span>
                                    <span className="p-cost">${data.cost}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Specific Simulation Logic: EQUATION BATTLE
    const renderEquationBattleSim = () => {
        const equations = config.equations || [];
        const [equationIdx, setEquationIdx] = useState(initialState?.equationIdx || 0);
        const [monsterHealth, setMonsterHealth] = useState(equations[equationIdx]?.monsterHealth || 100);
        const [coefficients, setCoefficients] = useState({});
        const [isAttacking, setIsAttacking] = useState(false);
        const [feedback, setFeedback] = useState(null);

        const currentEq = equations[equationIdx];

        const getAtomCounts = (side, coeffs) => {
            const counts = {};
            const items = side === 'reactants' ? currentEq.reactants : currentEq.products;
            items.forEach(item => {
                const coeff = parseInt(coeffs[item.id]) || 0;
                Object.entries(item.atoms).forEach(([atom, count]) => {
                    counts[atom] = (counts[atom] || 0) + count * coeff;
                });
            });
            return counts;
        };

        const handleCheck = () => {
            const reactantCounts = getAtomCounts('reactants', coefficients);
            const productCounts = getAtomCounts('products', coefficients);

            const allAtoms = new Set([...Object.keys(reactantCounts), ...Object.keys(productCounts)]);
            let balanced = true;
            allAtoms.forEach(atom => {
                if (reactantCounts[atom] !== productCounts[atom] || (reactantCounts[atom] || 0) === 0) {
                    balanced = false;
                }
            });

            if (balanced) {
                setIsAttacking(true);
                setMonsterHealth(prev => Math.max(0, prev - currentEq.damage));
                setFeedback({ type: 'success', text: "Perfectly Balanced! Monster takes massive damage!" });
                setTimeout(() => {
                    setIsAttacking(false);
                    if (equationIdx < equations.length - 1) {
                        const nextIdx = equationIdx + 1;
                        setEquationIdx(nextIdx);
                        setMonsterHealth(equations[nextIdx].monsterHealth);
                        setCoefficients({});
                        setFeedback(null);
                    } else {
                        setStars(3);
                        setFinished(true);
                    }
                }, 2000);
            } else {
                setFeedback({ type: 'error', text: "Equation not balanced! Try adjusting coefficients." });
            }
        };

        return (
            <div className="eq-battle-wrapper">
                <div className="battle-arena">
                    <motion.div
                        className={`monster-container ${isAttacking ? 'hit' : ''}`}
                        animate={isAttacking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                    >
                        <div className="monster-visual">👾</div>
                        <div className="monster-hp-bar">
                            <div className="hp-fill" style={{ width: `${(monsterHealth / currentEq.monsterHealth) * 100}%` }} />
                        </div>
                        <span className="hp-text">HP: {monsterHealth}</span>
                    </motion.div>

                    <div className="equation-zone">
                        <div className="eq-unbalanced">{currentEq.unbalanced}</div>

                        <div className="eq-balancing-area">
                            <div className="side reactants">
                                {currentEq.reactants.map(r => (
                                    <div key={r.id} className="item-block">
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            value={coefficients[r.id] || ''}
                                            onChange={(e) => setCoefficients({ ...coefficients, [r.id]: e.target.value })}
                                        />
                                        <span className="label">{r.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="eq-arrow">→</div>
                            <div className="side products">
                                {currentEq.products.map(p => (
                                    <div key={p.id} className="item-block">
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="1"
                                            value={coefficients[p.id] || ''}
                                            onChange={(e) => setCoefficients({ ...coefficients, [p.id]: e.target.value })}
                                        />
                                        <span className="label">{p.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button className="battle-btn" onClick={handleCheck} disabled={isAttacking}>
                            {isAttacking ? "⚡ BLASTING..." : "🔥 BALANCE! 🔥"}
                        </button>

                        {feedback && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`eq-feedback ${feedback.type}`}>
                                {feedback.text}
                            </motion.div>
                        )}
                    </div>

                    <div className="atom-counter">
                        <div className="count-col">
                            <h4>Reactants</h4>
                            {Object.entries(getAtomCounts('reactants', coefficients)).map(([atom, count]) => (
                                <div key={atom}>{atom}: {count}</div>
                            ))}
                        </div>
                        <div className="count-col">
                            <h4>Products</h4>
                            {Object.entries(getAtomCounts('products', coefficients)).map(([atom, count]) => (
                                <div key={atom}>{atom}: {count}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCurrentSim = () => {
        switch (simType) {
            case 'torch': return renderShadowCatcher();
            case 'ruler': return renderRulerSim();
            case 'thermometer': return renderThermometerSim();
            case 'race': return renderRaceSim();
            case 'bulb_slider': return renderBulbSliderSim();
            case 'pressure_lab': return renderPressureSim();
            case 'friction_slider': return renderFrictionSim();
            case 'pitch_match': return renderPitchSim();
            case 'gravity_drop': return renderGravitySim();
            case 'eye_focuser': return renderEyeFocuserSim();
            case 'eye_doctor':
                return renderEyeDoctorSim();
            case 'circuit_puzzle': return renderCircuitPuzzleSim();
            case 'magnetic_field': return renderMagneticFieldSim();
            case 'energy_planner': return renderEnergyPlannerSim();
            case 'equation_battle': return renderEquationBattleSim();
            case 'projectile': return renderProjectileSim();
            case 'photosynthesis': return renderPhotosynthesisSim();
            case 'graph_plot': return renderGraphSim();
            case 'fraction_bar': return renderFractionBarSim();
            case 'balance_scale': return renderBalanceScaleSim();
            case 'shape_builder': return renderShapeBuilderSim();
            case 'graph_plotter': return renderGraphPlotterSim();
            case 'trig_circle': return renderTrigCircleSim();
            case 'limit_explorer': return renderLimitSim();
            case 'polynomial_builder': return renderPolynomialSim();
            default: return <div>Simulation type not yet implemented.</div>;
        }
    };

    return (
        <div className="sim-container">
            {simType !== 'magnetic_field' && (
                <div className="sim-header">
                    <h1>{title}</h1>
                    <p className="sim-goal">{goal}</p>
                </div>
            )}

            {renderCurrentSim()}

            {hint && !finished && <div className="sim-hint">💡 {hint}</div>}

            <AnimatePresence>
                {finished && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sim-overlay">
                        <div className="sim-card">
                            <h2>Hurray! 🎉</h2>
                            <p>You mastered the experiment!</p>
                            <div className="stars">⭐⭐⭐</div>
                            <button onClick={onComplete} className="sim-btn">Continue Journey</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SimulationGame;
