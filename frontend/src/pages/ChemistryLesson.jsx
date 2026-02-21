import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import './ChemistryLesson.css';

const LESSON_PAGES = [
    {
        title: "Chemical Changes",
        content: "Whenever a chemical change occurs, we say a chemical reaction has taken place. For example, milk left at room temperature in summer, an iron tawa/pan/nail left in humid atmosphere, or even respiration!",
        equation: "Magnesium + Oxygen → Magnesium Oxide",
        symbol: "2Mg + O₂ → 2MgO",
        type: "intro",
        animation: "combustion"
    },
    {
        title: "Writing Chemical Equations",
        content: "Chemical equations are shorthand representations of reactions. The substances that undergo chemical change are Reactants (LHS), and the new substances formed are Products (RHS).",
        points: ["LHS: Reactants", "RHS: Products", "Arrow (→) indicates direction"],
        example: "Zn + H₂SO₄ → ZnSO₄ + H₂"
    },
    {
        title: "Balancing Equations",
        content: "Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction. Total mass of elements in products must equal total mass in reactants.",
        steps: ["Write word equation", "Write symbols", "Compare number of atoms", "Balance using coefficients"],
        example: "3Fe + 4H₂O → Fe₃O₄ + 4H₂"
    },
    {
        title: "Combination Reactions",
        content: "A reaction in which a single product is formed from two or more reactants. Calcium oxide reacts vigorously with water to produce slaked lime, releasing a large amount of heat.",
        equation: "CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat",
        type: "combination"
    },
    {
        title: "Decomposition Reactions",
        content: "A single reactant breaks down to give simpler products. Ferrous sulphate crystals lose water when heated, then decompose into ferric oxide, sulphur dioxide and sulphur trioxide.",
        equation: "2FeSO₄(s) --Heat--> Fe₂O₃(s) + SO₂(g) + SO₃(g)",
        type: "decomposition"
    },
    {
        title: "Displacement Reactions",
        content: "When a more reactive element displaces a less reactive element from its compound. Iron nail becomes brownish and blue copper sulphate solution fades when iron displaces copper.",
        equation: "Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)",
        type: "displacement"
    },
    {
        title: "Double Displacement",
        content: "Reactions in which there is an exchange of ions between the reactants. Often results in the formation of a precipitate - an insoluble substance.",
        equation: "Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)",
        type: "double-displacement"
    },
    {
        title: "Redox Reactions",
        content: "Reactions where one reactant gets oxidised while the other gets reduced. Oxidation is the gain of oxygen or loss of hydrogen. Reduction is loss of oxygen or gain of hydrogen.",
        equation: "CuO + H₂ --Heat--> Cu + H₂O",
        explanation: "H₂ is Oxidised to H₂O, CuO is Reduced to Cu.",
        type: "redox"
    },
    {
        title: "Everyday Effects",
        content: "Corrosion: When a metal is attacked by substances around it such as moisture, acids, etc. Example: Black coating on silver, green coating on copper. Rancidity: Oxidation of fats and oils leading to bad smell and taste.",
        prevention: ["Painting/Greasing", "Air-tight containers", "Nitrogen flushing of chips packets"]
    }
];

const ChemistryLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            localStorage.setItem(`lesson_complete_Chemical Reactions and Equations`, 'true');
            toast.success("Lesson Complete! Games Unlocked! 🔬");
            setTimeout(() => {
                navigate(`/learn/${topicId}/levels?chapterName=Chemical Reactions and Equations`);
            }, 2000);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const activePage = LESSON_PAGES[currentPage];

    return (
        <div className="chemistry-lesson-container">
            <Toaster position="top-center" />
            <header className="lesson-header">
                <button onClick={() => navigate('/map')} className="exit-btn">🚪 EXIT</button>
                <div className="progress-container">
                    <div className="progress-labels">
                        <span>CHEMISTRY MISSION</span>
                        <span>{currentPage + 1} / {LESSON_PAGES.length}</span>
                    </div>
                    <div className="progress-bar-bg">
                        <motion.div
                            className="progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentPage + 1) / LESSON_PAGES.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="lesson-main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="page-content"
                    >
                        <h1 className="page-title">{activePage.title}</h1>
                        <p className="page-text">{activePage.content}</p>

                        {(activePage.equation || activePage.symbol) && (
                            <div className="equation-box">
                                {activePage.equation && <div className="equation-text">{activePage.equation}</div>}
                                {activePage.symbol && <div className="symbol-text">{activePage.symbol}</div>}
                            </div>
                        )}

                        {activePage.points && (
                            <ul className="points-list">
                                {activePage.points.map((p, i) => <li key={i}>{p}</li>)}
                            </ul>
                        )}

                        {activePage.steps && (
                            <div className="steps-container">
                                {activePage.steps.map((s, i) => (
                                    <div key={i} className="step-card">
                                        <span className="step-num">{i + 1}</span>
                                        {s}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePage.type && (
                            <div className={`animation-container ${activePage.type}`}>
                                {activePage.type === 'intro' && (
                                    <div className="reaction-sim">
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="flame"
                                        >🔥</motion.div>
                                        <div className="ribbon">Magnesium Ribbon</div>
                                    </div>
                                )}
                                {activePage.type === 'combination' && (
                                    <div className="beaker-sim">
                                        <div className="steam">💨</div>
                                        <div className="water">💧 CaO + H₂O</div>
                                        <div className="bottom-text">Heat is released! (Exothermic)</div>
                                    </div>
                                )}
                                {activePage.type === 'displacement' && (
                                    <div className="displacement-sim">
                                        <div className="test-tube">
                                            <div className="solution blue">CuSO₄</div>
                                            <div className="nail grey">🔩 Iron Nail</div>
                                        </div>
                                        <div className="arrow">➡️</div>
                                        <div className="test-tube">
                                            <div className="solution green">FeSO₄</div>
                                            <div className="nail brown">🔩 Copper Coated</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activePage.explanation && <div className="explanation-bubble">{activePage.explanation}</div>}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="lesson-footer">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="nav-btn prev"
                >
                    PREVIOUS
                </button>
                <div className="hint-pill">NCERT ALIGNED ⚛️</div>
                <button onClick={handleNext} className="nav-btn next">
                    {currentPage === LESSON_PAGES.length - 1 ? "FINISH MODULE" : "NEXT LESSON"}
                </button>
            </footer>
        </div>
    );
};

export default ChemistryLesson;
