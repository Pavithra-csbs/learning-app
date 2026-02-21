import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './AtomBuilder.css';

const MOLECULES = [
    {
        id: 1,
        name: "Hydrogen (H₂)",
        formula: "H-H",
        atoms: [
            { id: 'h1', type: 'H', x: -100, needed: 1, current: 0 },
            { id: 'h2', type: 'H', x: 100, needed: 1, current: 0 }
        ],
        electrons: 2, // Total shared pair needed (1 pair = 2 electrons)
        description: "Form a single covalent bond by sharing 1 electron pair."
    },
    {
        id: 2,
        name: "Oxygen (O₂)",
        formula: "O=O",
        atoms: [
            { id: 'o1', type: 'O', x: -100, needed: 2, current: 0 },
            { id: 'o2', type: 'O', x: 100, needed: 2, current: 0 }
        ],
        electrons: 4, // Double bond = 2 pairs
        description: "Form a double covalent bond by sharing 2 electron pairs."
    },
    {
        id: 3,
        name: "Nitrogen (N₂)",
        formula: "N≡N",
        atoms: [
            { id: 'n1', type: 'N', x: -100, needed: 3, current: 0 },
            { id: 'n2', type: 'N', x: 100, needed: 3, current: 0 }
        ],
        electrons: 6, // Triple bond = 3 pairs
        description: "Form a triple covalent bond by sharing 3 electron pairs."
    }
];

const AtomBuilder = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentLevel, setCurrentLevel] = useState(0);
    const [sharedElectrons, setSharedElectrons] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, won

    const activeMolecule = MOLECULES[currentLevel];

    const handleDrop = () => {
        const newCount = sharedElectrons + 1;
        setSharedElectrons(newCount);

        if (newCount === activeMolecule.electrons) {
            toast.success("Bond Formed! ⚛️✨");
            setTimeout(() => {
                if (currentLevel < MOLECULES.length - 1) {
                    setCurrentLevel(currentLevel + 1);
                    setSharedElectrons(0);
                } else {
                    handleGameComplete();
                }
            }, 1500);
        }
    };

    const handleGameComplete = () => {
        setGameState('won');
        canvasConfetti({ particleCount: 200, spread: 100 });
        localStorage.setItem('completed_levels_Carbon and its Compounds', '2');
        toast.success("Master of Covalent Bonds! 🎓");
        setTimeout(() => {
            navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`);
        }, 3000);
    };

    return (
        <div className="atom-builder-container">
            <header className="game-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅ EXIT</button>
                <div className="level-info">MOLECULE {currentLevel + 1} / {MOLECULES.length}</div>
            </header>

            <main className="builder-arena">
                <h1 className="molecule-title">{activeMolecule.name}</h1>
                <p className="instruction">{activeMolecule.description}</p>

                <div className="atoms-display">
                    {activeMolecule.atoms.map((atom) => (
                        <div key={atom.id} className={`atom-circle ${atom.type.toLowerCase()}`}>
                            <span className="atom-symbol">{atom.type}</span>
                        </div>
                    ))}

                    {/* Bonding Region */}
                    <div className="bonding-region">
                        <div className="shared-electrons">
                            {Array.from({ length: sharedElectrons }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="electron shared"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="electron-bank">
                    <p>Drag Electrons to the Center!</p>
                    <motion.div
                        className="electron draggable"
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        dragElastic={0.5}
                        onDragEnd={(e, info) => {
                            if (info.offset.y < -100) { // Simple overlap check
                                handleDrop();
                            }
                        }}
                        whileHover={{ scale: 1.2, cursor: 'grab' }}
                        whileDrag={{ scale: 1.5, cursor: 'grabbing' }}
                    />
                    <div className="electron-shadow"></div>
                </div>
            </main>
        </div>
    );
};

export default AtomBuilder;
