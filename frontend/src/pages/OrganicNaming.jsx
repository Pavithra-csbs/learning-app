import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './OrganicNaming.css';

const LEVELS = [
    {
        id: 1,
        formula: "CH₃—CH₂—CH₃",
        visual: "C-C-C",
        type: "Alkane",
        options: ["Ethane", "Propane", "Butane", "Methane"],
        correct: "Propane",
        hint: "3 Carbon atoms, single bonds = Prop + ane"
    },
    {
        id: 2,
        formula: "CH₃—CH=CH₂",
        visual: "C-C=C",
        type: "Alkene",
        options: ["Propene", "Propane", "Ethene", "Butene"],
        correct: "Propene",
        hint: "3 Carbons, double bond = Prop + ene"
    },
    {
        id: 3,
        formula: "CH₃—COOH",
        visual: "C-COOH",
        type: "Carboxylic Acid",
        options: ["Methanoic Acid", "Ethanoic Acid", "Propanoic Acid", "Ethanol"],
        correct: "Ethanoic Acid",
        hint: "2 Carbons, -COOH group = Ethan + oic acid"
    },
    {
        id: 4,
        formula: "CH₃—CH₂—OH",
        visual: "C-C-OH",
        type: "Alcohol",
        options: ["Methanol", "Ethanol", "Propanol", "Ethanal"],
        correct: "Ethanol",
        hint: "2 Carbons, -OH group = Ethan + ol"
    },
    {
        id: 5,
        formula: "H—CHO",
        visual: "H-C=O",
        type: "Aldehyde",
        options: ["Methanal", "Ethanal", "Methanol", "Methanoic Acid"],
        correct: "Methanal",
        hint: "1 Carbon, -CHO group = Methan + al"
    },
    {
        id: 6,
        formula: "CH₃—CO—CH₃",
        visual: "C-C(=O)-C",
        type: "Ketone",
        options: ["Propanone", "Propanal", "Propanoic Acid", "Butanone"],
        correct: "Propanone",
        hint: "3 Carbons, middle C=O group = Propan + one"
    }
];

const OrganicNaming = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, finished
    const [selectedOption, setSelectedOption] = useState(null);

    const activeQuestion = LEVELS[currentIdx];

    const handleOptionSelect = (option) => {
        if (selectedOption) return;
        setSelectedOption(option);

        if (option === activeQuestion.correct) {
            setScore(prev => prev + 10);
            toast.success("Correct Name! 🏷️✅");
            setTimeout(() => {
                if (currentIdx < LEVELS.length - 1) {
                    setCurrentIdx(prev => prev + 1);
                    setSelectedOption(null);
                } else {
                    handleGameComplete();
                }
            }, 1000);
        } else {
            toast.error("Incorrect! Try again.");
            // Optional: Deduct points or allow retry directly?
            // Let's allow retry after a delay or just move on with penalty. 
            // Better: Show correct, then move on. Or block until correct.
            // Let's simple feedback loop: wait 1s, reset selection to allow retry but no points for subsequent tries?
            // For simplicity: Just wait and clear selection to retry.
            setTimeout(() => setSelectedOption(null), 1000);
        }
    };

    const handleGameComplete = () => {
        setGameState('finished');
        localStorage.setItem('completed_levels_Carbon and its Compounds', '8');
        canvasConfetti({ particleCount: 200, spread: 100 });
        toast.success("IUPAC Master! 🎓");
        setTimeout(() => {
            navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`);
        }, 3000);
    };

    return (
        <div className="organic-naming-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="level-info">Question {currentIdx + 1} / {LEVELS.length}</div>
                <div className="score-badge">SCORE: {score}</div>
            </header>

            {gameState === 'playing' ? (
                <main className="naming-arena">
                    <motion.div
                        key={activeQuestion.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="compound-display"
                    >
                        <div className="type-tag">{activeQuestion.type}</div>
                        <h1 className="formula-text">{activeQuestion.formula}</h1>
                        <div className="visual-model">{activeQuestion.visual}</div>
                    </motion.div>

                    <div className="options-grid">
                        {activeQuestion.options.map((opt) => (
                            <motion.button
                                key={opt}
                                className={`name-opt ${selectedOption === opt ? (opt === activeQuestion.correct ? 'correct' : 'wrong') : ''}`}
                                onClick={() => handleOptionSelect(opt)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {opt}
                            </motion.button>
                        ))}
                    </div>

                    <button className="hint-btn" onClick={() => toast(activeQuestion.hint)}>
                        💡 Need a Hint?
                    </button>
                </main>
            ) : (
                <div className="victory-screen">
                    <h1>🎉 Naming Champion!</h1>
                    <p>You speak the language of Chemistry!</p>
                    <div className="final-score">Final Score: {score}</div>
                    <button
                        className="next-btn"
                        onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`)}
                    >
                        Back to Menu
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrganicNaming;
