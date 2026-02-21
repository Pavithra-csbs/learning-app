import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './PropertyMatch.css';

const PAIRS = [
    { id: 1, prop: "Malleable", desc: "Can be beaten into thin sheets", metal: "Gold" },
    { id: 2, prop: "Ductile", desc: "Can be drawn into thin wires", metal: "Copper" },
    { id: 3, prop: "Sonorous", desc: "Produces sound when struck", metal: "Bell Metal" },
    { id: 4, prop: "Conductor", desc: "Allows heat/electricity flow", metal: "Silver" },
    { id: 5, prop: "Lustrous", desc: "Has a natural shine", metal: "Aluminium" }
];

const PropertyMatch = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [selectedProp, setSelectedProp] = useState(null);
    const [matches, setMatches] = useState([]); // Array of property ids
    const [score, setScore] = useState(0);

    const properties = [...PAIRS].sort(() => Math.random() - 0.5);
    const metals = [...PAIRS].sort(() => Math.random() - 0.5);

    const handlePropClick = (p) => {
        if (matches.includes(p.id)) return;
        setSelectedProp(p);
    };

    const handleMetalClick = (m) => {
        if (!selectedProp || matches.includes(m.id)) return;

        if (selectedProp.id === m.id) {
            setMatches([...matches, m.id]);
            setScore(prev => prev + 20);
            toast.success(`Correct! ${selectedProp.prop} fits ${m.metal}.`);
            setSelectedProp(null);

            if (matches.length === PAIRS.length - 1) {
                localStorage.setItem('completed_levels_Metals and Non-metals', '6');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Not a match. Try again!");
            setSelectedProp(null);
        }
    };

    return (
        <div className="match-game-container properties-theme">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}/100</div>
                <div className="title">LEVEL 5: PROPERTY MATCHING</div>
            </header>

            <main className="game-arena">
                <div className="matching-grid">
                    <div className="col">
                        <h3>PROPERTIES</h3>
                        {properties.map(p => (
                            <button
                                key={p.id}
                                disabled={matches.includes(p.id)}
                                onClick={() => handlePropClick(p)}
                                className={`match-btn prop-btn ${selectedProp?.id === p.id ? 'active' : ''} ${matches.includes(p.id) ? 'matched' : ''}`}
                            >
                                {p.prop}
                                {matches.includes(p.id) && <span className="check">✓</span>}
                            </button>
                        ))}
                    </div>

                    <div className="col">
                        <h3>METALS</h3>
                        {metals.map(m => (
                            <button
                                key={m.id}
                                disabled={matches.includes(m.id)}
                                onClick={() => handleMetalClick(m)}
                                className={`match-btn metal-btn ${matches.includes(m.id) ? 'matched' : ''}`}
                            >
                                {m.metal}
                                {matches.includes(m.id) && <span className="check">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {matches.length === PAIRS.length && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="victory-card">
                        <h2>You are a Property Expert! 🎉</h2>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default PropertyMatch;
