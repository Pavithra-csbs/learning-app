import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BuilderGame.css';

const BuilderGame = ({ config, onComplete }) => {
    const {
        title,
        goal,
        components,
        slots,
        logic,
        actionLabel = "VERIFY BUILD 🚀",
        successMessage = "Build Complete! 🎉"
    } = config;

    const [placedParts, setPlacedParts] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [finished, setFinished] = useState(false);
    const [stars, setStars] = useState(0);

    const handleDrop = (part, slotId) => {
        setPlacedParts(prev => ({ ...prev, [slotId]: part }));
        setIsValid(false);
    };

    const checkLogic = () => {
        const placedItems = Object.values(placedParts);
        const placedTypes = placedItems.map(p => p.type);

        // 1. Check Required Types
        if (logic?.requiredTypes) {
            const hasAllRequired = logic.requiredTypes.every(type => placedTypes.includes(type));
            if (!hasAllRequired) {
                alert(`Incomplete! Required components: ${logic.requiredTypes.join(', ')}`);
                return;
            }
        }

        // 2. Check Success Condition
        let conditionMet = true;
        if (logic?.successCondition) {
            switch (logic.successCondition) {
                case 'neutral_atom':
                    const protons = placedTypes.filter(t => t === 'proton').length;
                    const electrons = placedTypes.filter(t => t === 'electron').length;
                    conditionMet = protons > 0 && protons === electrons;
                    if (!conditionMet) alert("The atom is not neutral! Protons must equal electrons.");
                    break;
                case 'output_match_one':
                    // Simplified for logic gates demo
                    conditionMet = placedTypes.includes('and');
                    if (!conditionMet) alert("Wrong gate! This configuration won't output 1.");
                    break;
                case 'molecule_match':
                    const atomCounts = {};
                    placedTypes.forEach(t => {
                        atomCounts[t] = (atomCounts[t] || 0) + 1;
                    });

                    const target = logic.targetMolecule;
                    conditionMet = true;
                    // Check if all required atoms are present in correct quantity
                    for (const [atom, count] of Object.entries(target)) {
                        if (atomCounts[atom] !== count) {
                            conditionMet = false;
                            break;
                        }
                    }
                    if (!conditionMet) alert(`Incorrect molecule! check the number of atoms.`);
                    break;
                case 'closed_circuit':
                    const hasCell = placedTypes.includes('cell');
                    const hasBulb = placedTypes.includes('bulb');
                    const hasSwitch = placedTypes.includes('switch');
                    conditionMet = hasCell && hasBulb && hasSwitch;
                    if (!conditionMet) alert("The circuit is open! Add a cell, bulb, and switch.");
                    break;
                default:
                    conditionMet = placedItems.length === slots.length;
            }
        }

        if (conditionMet) {
            setIsValid(true);
            setTimeout(() => {
                setFinished(true);
                setStars(3);
            }, 1000);
        }
    };

    return (
        <div className="builder-container">
            <div className="builder-header">
                <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }}>{title}</motion.h1>
                <p className="builder-goal">{goal}</p>
            </div>

            <div className="builder-workspace">
                <div className="parts-palette">
                    <h3>Components</h3>
                    {components.map(comp => (
                        <motion.div
                            key={comp.id}
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            onDragEnd={(e, info) => {
                                const elements = document.elementsFromPoint(e.clientX, e.clientY);
                                const slot = elements.find(el => el.classList.contains('build-slot'));
                                if (slot) handleDrop(comp, slot.getAttribute('data-id'));
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileDrag={{ scale: 1.2, zIndex: 100 }}
                            className="build-part"
                        >
                            <span className="part-icon">{comp.icon}</span>
                            <span className="part-label">{comp.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="build-area">
                    <div className="workspace-grid">
                        {slots.map(slot => (
                            <div key={slot.id} data-id={slot.id} className="build-slot">
                                {placedParts[slot.id] ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{
                                            scale: 1,
                                            boxShadow: isValid && (placedParts[slot.id].type === 'bulb' || placedParts[slot.id].type === 'proton')
                                                ? "0 0 30px rgba(253, 224, 71, 0.6)" : "none"
                                        }}
                                        className={`placed-part ${isValid ? 'valid' : ''}`}
                                    >
                                        <span className="part-icon">{placedParts[slot.id].icon}</span>
                                    </motion.div>
                                ) : (
                                    <div className="slot-placeholder">
                                        <div className="plus-icon">+</div>
                                        <span>{slot.label}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="builder-controls">
                    <button
                        onClick={checkLogic}
                        className={`power-btn ${isValid ? 'on' : 'off'}`}
                        disabled={isValid}
                    >
                        {isValid ? 'VERIFIED ✓' : actionLabel}
                    </button>
                    <button className="reset-btn" onClick={() => { setPlacedParts({}); setIsValid(false); }}>
                        RESET ↺
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {finished && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="builder-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="builder-card"
                        >
                            <h2>{successMessage}</h2>
                            <p>You've successfully completed this engineering mission!</p>
                            <div className="stars">⭐⭐⭐</div>
                            <button onClick={onComplete} className="builder-btn">Return to Map</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuilderGame;
