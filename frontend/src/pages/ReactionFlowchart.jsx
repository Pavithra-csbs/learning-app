import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';
import './ReactionFlowchart.css';

const EXPERIMENTS = [
    {
        id: 1,
        title: "Testing for Hydrogen Gas",
        steps: [
            { id: 's1', text: "Take Zn granules in test tube" },
            { id: 's2', text: "Add dilute sulphuric acid" },
            { id: 's3', text: "Pass gas through soap solution" },
            { id: 's4', text: "Bring burning candle near bubble" },
            { id: 's5', text: "Pop sound confirms Hydrogen" }
        ],
        hint: "Start with reactants, end with the test result."
    },
    {
        id: 2,
        title: "Thermal Decomposition of Lead Nitrate",
        steps: [
            { id: 'l1', text: "Take Lead Nitrate powder" },
            { id: 'l2', text: "Heat the test tube over flame" },
            { id: 'l3', text: "Brown fumes of NO₂ appear" },
            { id: 'l4', text: "Yellow residue of PbO remains" }
        ],
        hint: "Heating causes decomposition and color change."
    }
];

const ReactionFlowchart = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [currentSteps, setCurrentSteps] = useState([...EXPERIMENTS[0].steps].sort(() => Math.random() - 0.5));
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('playing');

    const activeExp = EXPERIMENTS[currentIdx];

    const checkOrder = () => {
        const isCorrect = currentSteps.every((step, i) => step.id === activeExp.steps[i].id);

        if (isCorrect) {
            setScore(prev => prev + 100);
            if (currentIdx < EXPERIMENTS.length - 1) {
                toast.success("Correct Sequence! Next Experiment...");
                setTimeout(() => {
                    const nextIdx = currentIdx + 1;
                    setCurrentIdx(nextIdx);
                    setCurrentSteps([...EXPERIMENTS[nextIdx].steps].sort(() => Math.random() - 0.5));
                }, 1500);
            } else {
                setGameState('finished');
                localStorage.setItem('completed_levels_Chemical Reactions and Equations', '7');
                canvasConfetti({ particleCount: 150, spread: 70 });
            }
        } else {
            toast.error("Order is not correct. Re-think the process!");
        }
    };

    const getMotivationalMessage = () => {
        if (score >= 200) return "Hurray 🎉 Woohoo! You are a Lab Procedure Expert!";
        if (score >= 100) return "Good job 👍 Sequence mastered!";
        return "Don’t feel bad 😊 Try again!";
    };

    return (
        <div className="flowchart-game-container">
            <header className="game-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="back-btn">⬅️ MAP</button>
                <div className="stat">SCORE: {score}</div>
                <div className="title">LEVEL 7: REACTION FLOWCHART</div>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'playing' ? (
                        <motion.div
                            key={currentIdx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="flow-view"
                        >
                            <h1>{activeExp.title}</h1>
                            <p className="hint">Drag to reorder the steps correctly!</p>

                            <Reorder.Group axis="y" values={currentSteps} onReorder={setCurrentSteps} className="steps-list">
                                {currentSteps.map((step, i) => (
                                    <Reorder.Item key={step.id} value={step} className="step-item">
                                        <div className="step-num">{i + 1}</div>
                                        <div className="step-text">{step.text}</div>
                                        <div className="drag-handle">≡</div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>

                            <button onClick={checkOrder} className="check-btn">VALIDATE PROCEDURE 🧪</button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="victory-card"
                        >
                            <div className="stars">
                                {[...Array(3)].map((_, i) => (
                                    <span key={i} className={i < (score / 70) ? 'gold' : ''}>⭐</span>
                                ))}
                            </div>
                            <h2>{getMotivationalMessage()}</h2>
                            <h1>Final Score: {score}/200</h1>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`)} className="next-level-btn">CONTINUE MISSION</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ReactionFlowchart;
