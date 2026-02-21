import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import canvasConfetti from 'canvas-confetti';
import './GeneticCrossSim.css';

const CROSS_TYPES = [
    {
        id: 'monohybrid',
        title: 'Mono-hybrid Cross',
        parent1: 'TT',
        parent2: 'tt',
        desc: 'Cross between Pure Tall (TT) and Pure Short (tt) pea plants.',
        correctOffspring: 'Tt',
        ratio: '100% Tall (Hybrid)',
        instruction: 'Combine parental alleles to find the F1 generation genotype.'
    },
    {
        id: 'f1_cross',
        title: 'F1 Self-Cross',
        parent1: 'Tt',
        parent2: 'Tt',
        desc: 'Cross between two F1 hybrids (Tt x Tt).',
        correctOffspring: ['TT', 'Tt', 'tt'],
        ratio: '3 Tall : 1 Short',
        instruction: 'Predict the genotypes of the F2 generation.'
    }
];

const GeneticCrossSim = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [crossIdx, setCrossIdx] = useState(0);
    const [offspringGenotype, setOffspringGenotype] = useState('');
    const [gameState, setGameState] = useState('playing');

    const cross = CROSS_TYPES[crossIdx];

    const handleAlleleDrop = (allele) => {
        if (offspringGenotype.length < 2) {
            setOffspringGenotype(prev => (prev + allele).split('').sort().join(''));
        }
    };

    const resetGenotype = () => setOffspringGenotype('');

    const verifyCross = () => {
        if (offspringGenotype.length < 2) {
            toast.error('Offspring needs two alleles!');
            return;
        }

        const isCorrect = Array.isArray(cross.correctOffspring)
            ? cross.correctOffspring.includes(offspringGenotype)
            : offspringGenotype === cross.correctOffspring;

        if (isCorrect) {
            toast.success(`Correct! Genotype: ${offspringGenotype}`);
            if (crossIdx < CROSS_TYPES.length - 1) {
                setTimeout(() => {
                    setCrossIdx(c => c + 1);
                    setOffspringGenotype('');
                }, 1500);
            } else {
                canvasConfetti({ particleCount: 150, spread: 70 });
                setTimeout(() => setGameState('finished'), 1500);
            }
        } else {
            toast.error('Incorrect genotype combination for this cross!');
            setOffspringGenotype('');
        }
    };

    const handleComplete = () => {
        const curLevel = parseInt(localStorage.getItem('completed_levels_Heredity and Evolution') || '6');
        if (curLevel < 7) localStorage.setItem('completed_levels_Heredity and Evolution', '7');
        navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
    };

    if (gameState === 'finished') {
        return (
            <div className="gcs-finish-screen">
                <motion.div className="gcs-result-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <h2>Inheritance Master! 🧬</h2>
                    <div className="stars-row">⭐⭐⭐</div>
                    <p className="final-score">Mendelian Accuracy: 100%</p>
                    <p className="motivational-text">Hurray 🎉 You are a Genetics Champion!</p>
                    <button className="finish-btn" onClick={handleComplete}>Mendel Crossword →</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="genetic-cross-container">
            <header className="gcs-header">
                <button className="gcs-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Map</button>
                <h1>⚡ Genetic Cross Simulator</h1>
                <div className="gcs-type">{cross.title}</div>
            </header>

            <main className="gcs-game-area">
                <div className="gcs-info">
                    <p>{cross.desc}</p>
                    <p className="instruction">💡 {cross.instruction}</p>
                </div>

                <div className="cross-visualization">
                    <div className="parents-row">
                        <div className="parent-node p1">
                            <span className="label">Parent 1</span>
                            <div className="alleles">{cross.parent1}</div>
                        </div>
                        <div className="cross-icon">✖️</div>
                        <div className="parent-node p2">
                            <span className="label">Parent 2</span>
                            <div className="alleles">{cross.parent2}</div>
                        </div>
                    </div>

                    <div className="offspring-section">
                        <div className="down-arrows">⬇️ ⬇️</div>
                        <motion.div
                            className={`offspring-node ${offspringGenotype ? 'filled' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            onClick={resetGenotype}
                        >
                            <span className="label">Offspring Genotype</span>
                            <div className="genotype-display">{offspringGenotype || '?'}</div>
                            {offspringGenotype && <div className="click-reset">Click to reset</div>}
                        </motion.div>
                    </div>
                </div>

                <div className="allele-selector">
                    <h3>Available Alleles</h3>
                    <div className="allele-chips">
                        <button className="allele-chip dom" onClick={() => handleAlleleDrop('T')}>T (Dominant)</button>
                        <button className="allele-chip rec" onClick={() => handleAlleleDrop('t')}>t (Recessive)</button>
                    </div>
                </div>

                <button className="gcs-verify-btn" onClick={verifyCross}>Verify Cross ✅</button>
            </main>
        </div>
    );
};

export default GeneticCrossSim;
