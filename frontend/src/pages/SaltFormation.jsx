import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './SaltFormation.css';

const SALTS = [
    { name: "Sodium Chloride (Common Salt)", formula: "NaCl", acid: "HCl", base: "NaOH", icon: "🧂" },
    { name: "Potassium Sulphate", formula: "K₂SO₄", acid: "H₂SO₄", base: "KOH", icon: "🧪" },
    { name: "Ammonium Nitrate", formula: "NH₄NO₃", acid: "HNO₃", base: "NH₄OH", icon: "❄️" },
    { name: "Calcium Chloride", formula: "CaCl₂", acid: "HCl", base: "Ca(OH)₂", icon: "💎" }
];

const ACIDS = ["HCl", "H₂SO₄", "HNO₃", "CH₃COOH"];
const BASES = ["NaOH", "KOH", "NH₄OH", "Ca(OH)₂"];

const SaltFormation = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAcid, setSelectedAcid] = useState("");
    const [selectedBase, setSelectedBase] = useState("");
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeSalt = SALTS[currentIdx];

    const handleCreate = () => {
        if (!selectedAcid || !selectedBase) {
            toast.error("Choose both an acid and a base!");
            return;
        }

        if (selectedAcid === activeSalt.acid && selectedBase === activeSalt.base) {
            setScore(prev => prev + 100);
            toast.success(`Success! You formed ${activeSalt.name}!`);
            if (currentIdx < SALTS.length - 1) {
                setTimeout(() => {
                    setCurrentIdx(prev => prev + 1);
                    setSelectedAcid("");
                    setSelectedBase("");
                }, 2000);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Acids, Bases and Salts', '8');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Incorrect combination. The reaction didn't form the target salt.");
        }
    };

    return (
        <div className="salt-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 7: SALT SYNTHESIS</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <div className="creation-view">
                            <div className="target-salt">
                                <span className="icon">{activeSalt.icon}</span>
                                <h2>TARGET: {activeSalt.name}</h2>
                                <div className="formula">{activeSalt.formula}</div>
                            </div>

                            <div className="lab-table">
                                <div className="selector">
                                    <h3>SELECT ACID</h3>
                                    <div className="options">
                                        {ACIDS.map(a => (
                                            <button
                                                key={a}
                                                className={`opt-btn acid ${selectedAcid === a ? 'active' : ''}`}
                                                onClick={() => setSelectedAcid(a)}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="reaction-vessel">
                                    <div className="vessel-liquid" style={{
                                        height: (selectedAcid ? 50 : 0) + (selectedBase ? 50 : 0) + '%',
                                        background: selectedAcid && selectedBase ? '#fefae0' : (selectedAcid ? '#ff4d6d' : '#4361ee')
                                    }}></div>
                                </div>

                                <div className="selector">
                                    <h3>SELECT BASE</h3>
                                    <div className="options">
                                        {BASES.map(b => (
                                            <button
                                                key={b}
                                                className={`opt-btn base ${selectedBase === b ? 'active' : ''}`}
                                                onClick={() => setSelectedBase(b)}
                                            >
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleCreate} className="mix-btn">SYNTHESIZE SALT 🧪</button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 150) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>Magnificent Synthesis! 🎉</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default SaltFormation;
