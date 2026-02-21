import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './UsesPuzzle.css';

const USES = [
    { metal: "Copper", use: "Electrical Wires & Cables", icon: "🔌" },
    { metal: "Gold", use: "Jewelry & Electronics", icon: "💍" },
    { metal: "Iron", use: "Construction & Machinery", icon: "🏗️" },
    { metal: "Aluminium", use: "Foil & Airplane Parts", icon: "✈️" },
    { metal: "Zinc", use: "Galvanizing Iron", icon: "🛡️" },
    { metal: "Lead", use: "Storage Batteries", icon: "🔋" }
];

const UsesPuzzle = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [matches, setMatches] = useState({}); // { metalName: useText }
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const metals = USES.map(u => u.metal).sort(() => Math.random() - 0.5);
    const useOptions = USES.map(u => u.use).sort(() => Math.random() - 0.5);

    const handleMatch = (metal, use) => {
        setMatches(prev => ({ ...prev, [metal]: use }));
    };

    const checkSolution = () => {
        let correct = 0;
        USES.forEach(u => {
            if (matches[u.metal] === u.use) correct++;
        });

        if (correct === USES.length) {
            setScore(100);
            setGameState('finished');
            localStorage.setItem('completed_levels_Metals and Non-metals', '8');
            canvasConfetti({ particleCount: 150, spread: 70 });
            toast.success("Perfect Matching! 🏭🥂");
        } else {
            toast.error(`Only ${correct}/${USES.length} matches are correct. Try again!`);
        }
    };

    return (
        <div className="uses-game-container industrial-theme">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}/100</div>
                <div className="title">LEVEL 7: METAL USES PUZZLE</div>
            </header>

            <main className="game-arena">
                <div className="instructions">Match the Metal to its Industrial Application</div>

                <div className="puzzle-board">
                    {metals.map(metal => (
                        <div key={metal} className="puzzle-row">
                            <div className="metal-label">{metal}</div>
                            <select
                                className="use-select"
                                value={matches[metal] || ""}
                                onChange={(e) => handleMatch(metal, e.target.value)}
                            >
                                <option value="">Select Application...</option>
                                {useOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <button onClick={checkSolution} className="check-btn">VALIDATE USES 🚧</button>

                {gameState === 'finished' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="victory-card">
                        <h2>Industrial Master! 🏭✨</h2>
                        <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`)} className="next-level-btn">CONTINUE MISSION</button>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default UsesPuzzle;
