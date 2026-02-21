import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './VIMatching.css';

const GAME_SETS = [
    {
        resistance: 5,
        pairs: [
            { v: 5, i: 1 },
            { v: 10, i: 2 },
            { v: 15, i: 3 },
            { v: 25, i: 5 }
        ]
    },
    {
        resistance: 10,
        pairs: [
            { v: 10, i: 1 },
            { v: 20, i: 2 },
            { v: 50, i: 5 },
            { v: 100, i: 10 }
        ]
    }
];

const VIMatching = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();

    const [setIndex, setSetIndex] = useState(0);
    const [matches, setMatches] = useState([]); // Array of matched pair indices
    const [selectedV, setSelectedV] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [explanation, setExplanation] = useState(null);

    const currentSet = GAME_SETS[setIndex];

    // Shuffle cards for display
    const shuffledV = useMemo(() =>
        [...currentSet.pairs].map((p, idx) => ({ ...p, originalIdx: idx })).sort(() => Math.random() - 0.5),
        [setIndex]
    );
    const shuffledI = useMemo(() =>
        [...currentSet.pairs].map((p, idx) => ({ ...p, originalIdx: idx })).sort(() => Math.random() - 0.5),
        [setIndex]
    );

    useEffect(() => {
        if (gameState !== 'playing') return;
        if (timeLeft === 0) {
            setGameState('finished');
            return;
        }
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const handleMatch = (vPair, iPair) => {
        if (vPair.originalIdx === iPair.originalIdx) {
            const newMatches = [...matches, vPair.originalIdx];
            setMatches(newMatches);
            setScore(prev => prev + 50 + timeLeft);
            setExplanation(`CORRECT! Since V = ${vPair.v}V and R = ${currentSet.resistance}Ω, I = ${vPair.v}/${currentSet.resistance} = ${vPair.i}A.`);

            if (newMatches.length === currentSet.pairs.length) {
                if (setIndex < GAME_SETS.length - 1) {
                    setTimeout(() => {
                        setSetIndex(prev => prev + 1);
                        setMatches([]);
                        setExplanation(null);
                    }, 3000);
                } else {
                    setGameState('finished');
                    canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            } else {
                setTimeout(() => setExplanation(null), 3000);
            }
        } else {
            setScore(prev => Math.max(0, prev - 20));
            setExplanation("INCORRECT! Use Ohm's Law (V = I × R) to find the matching pair.");
            setTimeout(() => setExplanation(null), 3000);
        }
        setSelectedV(null);
    };

    return (
        <div className="vi-matching-container">
            <header className="vi-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ EXIT</button>
                <div className="game-stats">
                    <div className="stat-pill">TIME: {timeLeft}s</div>
                    <div className="stat-pill">XP: {score}</div>
                    <div className="resistance-box">RESISTANCE (R): {currentSet.resistance}Ω</div>
                </div>
            </header>

            <main className="matching-arena">
                <div className="instruction-bar">
                    Match the **Voltage (V)** cards to the correct **Current (I)** cards based on R = {currentSet.resistance}Ω.
                </div>

                <div className="cards-layout">
                    <div className="column v-column">
                        <h3>VOLTAGE (V)</h3>
                        {shuffledV.map((card) => (
                            <motion.button
                                key={`v-${card.originalIdx}`}
                                className={`vi-card v-card ${selectedV?.originalIdx === card.originalIdx ? 'selected' : ''} ${matches.includes(card.originalIdx) ? 'matched' : ''}`}
                                onClick={() => !matches.includes(card.originalIdx) && setSelectedV(card)}
                                whileHover={{ scale: matches.includes(card.originalIdx) ? 1 : 1.05 }}
                                disabled={matches.includes(card.originalIdx)}
                            >
                                {card.v}V
                            </motion.button>
                        ))}
                    </div>

                    <div className="column i-column">
                        <h3>CURRENT (I)</h3>
                        {shuffledI.map((card) => (
                            <motion.button
                                key={`i-${card.originalIdx}`}
                                className={`vi-card i-card ${matches.includes(card.originalIdx) ? 'matched' : ''}`}
                                onClick={() => selectedV && !matches.includes(card.originalIdx) && handleMatch(selectedV, card)}
                                whileHover={{ scale: matches.includes(card.originalIdx) ? 1 : 1.05 }}
                                disabled={matches.includes(card.originalIdx)}
                            >
                                {card.i}A
                            </motion.button>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {explanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`explanation-popup ${explanation.includes('CORRECT') ? 'success' : 'error'}`}
                        >
                            {explanation}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {gameState === 'finished' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vi-success-overlay">
                        <div className="success-modal">
                            <h1>MISSION COMPLETE! ⚡</h1>
                            <p>You matched all pairs with lightning speed.</p>
                            <div className="final-score">Final Score: {score} XP</div>
                            <button onClick={() => navigate('/map')} className="finish-btn">BACK TO CHAPTER</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VIMatching;
