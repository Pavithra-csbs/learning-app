import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './CarbonLesson.css';

const LESSON_PAGES = [
    {
        title: "Carbon: The Element of Life",
        content: "Carbon is a versatile element that forms the basis of all life. It forms covalent bonds by sharing electrons.",
        keyPoints: [
            { icon: "⚛️", text: "Atomic Number: 6" },
            { icon: "🔌", text: "Valency: 4 (Tetravalent)" },
            { icon: "🔗", text: "Property: Catenation (Self-linking)" }
        ],
        visual: "bonding"
    },
    {
        title: "Allotropes of Carbon",
        content: "Carbon exists in different crystalline forms known as allotropes.",
        allotropes: [
            { name: "Diamond", desc: "Hardest natural substance. Each C bonded to 4 others.", icon: "💎" },
            { name: "Graphite", desc: "Smooth and slippery. Each C bonded to 3 others.", icon: "✏️" },
            { name: "Fullerene", desc: "Soccer ball structure (C-60).", icon: "⚽" }
        ]
    },
    {
        title: "Hydrocarbons",
        content: "Compounds made of Hydrogen and Carbon. They are classified as Saturated and Unsaturated.",
        types: [
            { name: "Alkanes", formula: "CnH2n+2", bond: "Single Bond (-)", ex: "Methane (CH4)" },
            { name: "Alkenes", formula: "CnH2n", bond: "Double Bond (=)", ex: "Ethene (C2H4)" },
            { name: "Alkynes", formula: "CnH2n-2", bond: "Triple Bond (≡)", ex: "Ethyne (C2H2)" }
        ]
    },
    {
        title: "Functional Groups & Homologous Series",
        content: "Functional groups determine chemical properties. A homologous series is a family of compounds with the same functional group.",
        groups: [
            { name: "Alcohol", group: "-OH", suffix: "-ol" },
            { name: "Aldehyde", group: "-CHO", suffix: "-al" },
            { name: "Ketone", group: "-CO-", suffix: "-one" },
            { name: "Carboxylic Acid", group: "-COOH", suffix: "-oic acid" }
        ]
    },
    {
        title: "Ethanol & Ethanoic Acid",
        content: "Two commercially important carbon compounds.",
        compounds: [
            {
                name: "Ethanol (Alcohol)",
                props: ["Liquid at room temp", "Good solvent", "Used in medicines/tinctures"],
                reaction: "CH3CH2OH + Na → CH3CH2ONa + H2"
            },
            {
                name: "Ethanoic Acid (Acetic Acid)",
                props: ["5-8% solution is Vinegar", "Preservative in pickles"],
                reaction: "CH3COOH + NaOH → CH3COONa + H2O"
            }
        ]
    },
    {
        title: "Soaps & Detergents",
        content: "Soaps are sodium/potassium salts of long-chain carboxylic acids. They clean by forming micelles.",
        process: [
            { step: "Hydrophilic Head", desc: "Attracted to water (Ionic end)" },
            { step: "Hydrophobic Tail", desc: "Attracted to dirt/oil (Carbon chain)" },
            { step: "Micelle Formation", desc: "Dirt is trapped in the center." }
        ]
    }
];

const CarbonLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            localStorage.setItem('lesson_complete_Carbon and its Compounds', 'true');
            toast.success("Ready for Organic Chemistry Missions! 🧪🔓");
            setTimeout(() => {
                navigate(`/learn/${topicId}/levels?chapterName=Carbon and its Compounds`);
            }, 2000);
        }
    };

    const handleBack = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const activePage = LESSON_PAGES[currentPage];

    return (
        <div className="carbon-lesson-container">
            <header className="lesson-header">
                <button onClick={() => navigate('/map')} className="exit-btn">🚪 EXIT</button>
                <div className="progress-indicator">
                    PAGE {currentPage + 1} / {LESSON_PAGES.length}
                </div>
            </header>

            <main className="lesson-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="page-card"
                    >
                        <h1>{activePage.title}</h1>
                        <p className="main-text">{activePage.content}</p>

                        {/* Slide 1: Introduction */}
                        {activePage.keyPoints && (
                            <div className="key-points">
                                {activePage.keyPoints.map((pt, i) => (
                                    <div key={i} className="point-card">
                                        <span className="icon">{pt.icon}</span>
                                        <span>{pt.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Slide 2: Allotropes */}
                        {activePage.allotropes && (
                            <div className="allotropes-grid">
                                {activePage.allotropes.map(a => (
                                    <div key={a.name} className="allotrope-card">
                                        <div className="icon-large">{a.icon}</div>
                                        <h3>{a.name}</h3>
                                        <p>{a.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Slide 3: Hydrocarbons */}
                        {activePage.types && (
                            <div className="hydrocarbon-list">
                                {activePage.types.map(t => (
                                    <div key={t.name} className="hydro-row">
                                        <div className="name">{t.name}</div>
                                        <div className="formula">{t.formula}</div>
                                        <div className="bond">{t.bond}</div>
                                        <div className="ex">{t.ex}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Slide 4: Functional Groups */}
                        {activePage.groups && (
                            <div className="functional-grid">
                                {activePage.groups.map(g => (
                                    <div key={g.name} className="group-card">
                                        <h3>{g.name}</h3>
                                        <div className="group-formula">{g.group}</div>
                                        <div className="suffix">Suffix: {g.suffix}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Slide 5: Key Compounds */}
                        {activePage.compounds && (
                            <div className="compounds-container">
                                {activePage.compounds.map(c => (
                                    <div key={c.name} className="compound-box">
                                        <h3>{c.name}</h3>
                                        <ul>
                                            {c.props.map((p, i) => <li key={i}>{p}</li>)}
                                        </ul>
                                        <div className="reaction-box">🔹 {c.reaction}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Slide 6: Soaps */}
                        {activePage.process && (
                            <div className="soap-process">
                                {activePage.process.map((s, i) => (
                                    <div key={i} className="process-step">
                                        <div className="step-num">{i + 1}</div>
                                        <h4>{s.step}</h4>
                                        <p>{s.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="lesson-footer">
                <button onClick={handleBack} disabled={currentPage === 0} className="nav-btn prev">BACK</button>
                <div className="dots">
                    {LESSON_PAGES.map((_, i) => (
                        <div key={i} className={`dot ${i === currentPage ? 'active' : ''}`} />
                    ))}
                </div>
                <button onClick={handleNext} className="nav-btn next">
                    {currentPage === LESSON_PAGES.length - 1 ? "Start Missions 🚀" : "NEXT"}
                </button>
            </footer>
        </div>
    );
};

export default CarbonLesson;
