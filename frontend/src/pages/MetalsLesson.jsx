import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './MetalsLesson.css';

const LESSON_PAGES = [
    {
        title: "Physical Properties",
        content: "Metals are usually malleable, ductile, sonorous, and good conductors of heat and electricity. Non-metals have opposite properties.",
        properties: [
            { name: "Malleable", desc: "Can be beaten into thin sheets (Gold, Silver)" },
            { name: "Ductile", desc: "Can be drawn into thin wires (Copper, Aluminium)" },
            { name: "Lustrous", desc: "Have a shining surface" }
        ]
    },
    {
        title: "Chemical Properties",
        content: "Metals react with oxygen to form basic oxides. They react with water and acids to produce hydrogen gas.",
        reactions: [
            "Metal + Oxygen → Metal Oxide (Basic)",
            "Metal + Water → Metal Hydroxide + Hydrogen",
            "Metal + Dilute Acid → Salt + Hydrogen"
        ]
    },
    {
        title: "Reactivity Series",
        content: "Metals are arranged in the order of their decreasing activities. Potassium is highly reactive, while Gold is least reactive.",
        series: ["K", "Na", "Ca", "Mg", "Al", "Zn", "Fe", "Pb", "H", "Cu", "Hg", "Ag", "Au"],
        hint: "Potassium > Sodium > Calcium ... > Gold"
    },
    {
        title: "Extraction of Metals",
        content: "Metals are extracted from their ores using methods like roasting (for sulfides) and calcination (for carbonates).",
        methods: [
            { name: "Roasting", desc: "Heating ore in presence of excess air" },
            { name: "Calcination", desc: "Heating ore in limited supply of air" },
            { name: "Reduction", desc: "Using Carbon or Electrolysis to get pure metal" }
        ]
    },
    {
        title: "Corrosion & Prevention",
        content: "Corrosion is the gradual destruction of metals by air or moisture. Rusting of iron is a common example.",
        prevention: ["Painting", "Oiling/Greasing", "Galvanizing (Zinc coating)", "Alloying"]
    }
];

const MetalsLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            localStorage.setItem('lesson_complete_Metals and Non-metals', 'true');
            toast.success("Ready for the Industrial Mission! 🛠️🔓");
            setTimeout(() => {
                navigate(`/learn/${topicId}/levels?chapterName=Metals and Non-metals`);
            }, 2000);
        }
    };

    const handleBack = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const activePage = LESSON_PAGES[currentPage];

    return (
        <div className="lesson-container metals-theme">
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
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="page-card"
                    >
                        <h1>{activePage.title}</h1>
                        <p className="main-text">{activePage.content}</p>

                        {activePage.properties && (
                            <div className="props-grid">
                                {activePage.properties.map(p => (
                                    <div key={p.name} className="prop-item">
                                        <h3>{p.name}</h3>
                                        <p>{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePage.reactions && (
                            <div className="reaction-box">
                                {activePage.reactions.map((r, i) => (
                                    <div key={i} className="formula">🧪 {r}</div>
                                ))}
                            </div>
                        )}

                        {activePage.series && (
                            <div className="series-visual">
                                <div className="series-track">
                                    {activePage.series.map((m, i) => (
                                        <div key={m} className="metal-node" style={{ opacity: 1 - (i * 0.05) }}>
                                            {m}
                                        </div>
                                    ))}
                                </div>
                                <div className="series-label">Most Reactive ⬆️ Least Reactive ⬇️</div>
                            </div>
                        )}

                        {activePage.methods && (
                            <div className="methods-list">
                                {activePage.methods.map(m => (
                                    <div key={m.name} className="method-card">
                                        <strong>{m.name}:</strong> {m.desc}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePage.prevention && (
                            <div className="prevention-tags">
                                {activePage.prevention.map(p => (
                                    <span key={p} className="tag">{p}</span>
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
                    {currentPage === LESSON_PAGES.length - 1 ? "ENTER MISSION 🏁" : "NEXT"}
                </button>
            </footer>
        </div>
    );
};

export default MetalsLesson;
