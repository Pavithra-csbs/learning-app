import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './EquationBalancer.css';

const EQUATIONS = [
    {
        id: 1,
        reactants: [
            { id: 'mg', symbol: 'Mg', atoms: { Mg: 1 } },
            { id: 'o2', symbol: 'O₂', atoms: { O: 2 } }
        ],
        products: [
            { id: 'mgo', symbol: 'MgO', atoms: { Mg: 1, O: 1 } }
        ],
        correctCoefficients: { mg: 2, o2: 1, mgo: 2 },
        explanation: "2 Magnesium atoms react with 1 Oxygen molecule to give 2 Magnesium Oxide units."
    },
    {
        id: 2,
        reactants: [
            { id: 'h2', symbol: 'H₂', atoms: { H: 2 } },
            { id: 'cl2', symbol: 'Cl₂', atoms: { Cl: 2 } }
        ],
        products: [
            { id: 'hcl', symbol: 'HCl', atoms: { H: 1, Cl: 1 } }
        ],
        correctCoefficients: { h2: 1, cl2: 1, hcl: 2 },
        explanation: "1 Hydrogen molecule reacts with 1 Chlorine molecule to form 2 Hydrochloric acid molecules."
    },
    {
        id: 3,
        reactants: [
            { id: 'ch4', symbol: 'CH₄', atoms: { C: 1, H: 4 } },
            { id: 'o2', symbol: 'O₂', atoms: { O: 2 } }
        ],
        products: [
            { id: 'co2', symbol: 'CO₂', atoms: { C: 1, O: 2 } },
            { id: 'h2o', symbol: 'H₂O', atoms: { H: 2, O: 1 } }
        ],
        correctCoefficients: { ch4: 1, o2: 2, co2: 1, h2o: 2 },
        explanation: "Methane combustion: 1 CH₄ + 2 O₂ → 1 CO₂ + 2 H₂O."
    }
];

const EquationBalancer = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userCoefficients, setUserCoefficients] = useState({});
    const [gameState, setGameState] = useState('playing'); // playing, checking, finished
    const [score, setScore] = useState(0);

    const activeEq = EQUATIONS[currentIdx];

    const getAtomCounts = () => {
        const counts = { reactants: {}, products: {} };
        activeEq.reactants.forEach(r => {
            const coeff = userCoefficients[r.id] || 1;
            Object.entries(r.atoms).forEach(([atom, count]) => {
                counts.reactants[atom] = (counts.reactants[atom] || 0) + (count * coeff);
            });
        });
        activeEq.products.forEach(p => {
            const coeff = userCoefficients[p.id] || 1;
            Object.entries(p.atoms).forEach(([atom, count]) => {
                counts.products[atom] = (counts.products[atom] || 0) + (count * coeff);
            });
        });
        return counts;
    };

    const atomCounts = getAtomCounts();
    const allAtoms = Array.from(new Set([...Object.keys(atomCounts.reactants), ...Object.keys(atomCounts.products)]));

    const handleCoeffChange = (id, val) => {
        setUserCoefficients(prev => ({ ...prev, [id]: parseInt(val) || 1 }));
    };

    const checkBalance = () => {
        const counts = getAtomCounts();
        const isCorrect = allAtoms.every(atom =>
            (counts.reactants[atom] || 0) === (counts.products[atom] || 0)
        );

        if (isCorrect) {
            setScore(prev => prev + 100);
            if (currentIdx < EQUATIONS.length - 1) {
                toast.success("Balanced! Next one...");
                setTimeout(() => {
                    setCurrentIdx(currentIdx + 1);
                    setUserCoefficients({});
                }, 1500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '1');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Not quite right. Count the atoms again!");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 300) return "Hurray 🎉 Woohoo! You are a Chemistry Champion!";
        if (score >= 200) return "Good job 👍 Try for full score!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="balancer-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 1: EQUATION BALANCER</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="balancing-view"
                        >
                            <h1>Balance the Equation</h1>

                            <div className="atom-counter">
                                {allAtoms.map(atom => {
                                    const rCount = atomCounts.reactants[atom] || 0;
                                    const pCount = atomCounts.products[atom] || 0;
                                    const isBalanced = rCount === pCount;
                                    return (
                                        <div key={atom} className={`atom-pill ${isBalanced ? 'balanced' : ''}`}>
                                            <span className="name">{atom}</span>
                                            <span className="count">{rCount} vs {pCount}</span>
                                            {isBalanced && <span className="check">✔️</span>}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="equation-flex">
                                <div className="side reactants">
                                    {activeEq.reactants.map((r, i) => (
                                        <div key={r.id} className="component">
                                            <input
                                                type="number"
                                                min="1"
                                                value={userCoefficients[r.id] || ''}
                                                placeholder="1"
                                                onChange={(e) => handleCoeffChange(r.id, e.target.value)}
                                            />
                                            <span className="symbol">{r.symbol}</span>
                                            {i < activeEq.reactants.length - 1 && <span className="plus">+</span>}
                                        </div>
                                    ))}
                                </div>
                                <div className="arrow">➡️</div>
                                <div className="side products">
                                    {activeEq.products.map((p, i) => (
                                        <div key={p.id} className="component">
                                            <input
                                                type="number"
                                                min="1"
                                                value={userCoefficients[p.id] || ''}
                                                placeholder="1"
                                                onChange={(e) => handleCoeffChange(p.id, e.target.value)}
                                            />
                                            <span className="symbol">{p.symbol}</span>
                                            {i < activeEq.products.length - 1 && <span className="plus">+</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={checkBalance} className="check-btn">CHECK BALANCE ⚖️</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 100) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default EquationBalancer;
