import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './AcidsBasesLesson.css';

const LESSON_PAGES = [
    {
        title: "Introduction to Acids and Bases",
        content: "Acids are substances that taste sour and turn blue litmus red. Bases are bitter, feel soapy, and turn red litmus blue.",
        animation: "indicators",
        examples: ["Lemon Juice (Acid)", "Soap (Base)"]
    },
    {
        title: "The pH Scale",
        content: "The pH scale measures the strength of acids and bases, ranging from 0 (very acidic) to 14 (very basic). pH 7 is neutral.",
        animation: "ph-scale",
        details: "Lower pH = Stronger Acid. Higher pH = Stronger Base."
    },
    {
        title: "Indicators",
        content: "Indicators change color to show if a substance is acidic or basic. Common ones include Litmus, Phenolphthalein, and Methyl Orange.",
        animation: "colors",
        table: [
            { indicator: "Litmus", acid: "Red", base: "Blue" },
            { indicator: "Phenolphthalein", acid: "Colorless", base: "Pink" },
            { indicator: "Methyl Orange", acid: "Red", base: "Yellow" }
        ]
    },
    {
        title: "Neutralization",
        content: "When an acid reacts with a base, they neutralize each other's effects to form salt and water.",
        equation: "Acid + Base → Salt + Water",
        example: "HCl + NaOH → NaCl + H₂O"
    },
    {
        title: "Importance of pH",
        content: "pH is vital in life! Our body works at pH 7.0–7.8. Tooth decay starts below pH 5.5. Antacids (bases) relieve acidity.",
        animation: "real-life",
        examples: ["Plants need specific soil pH", "Bees sting with acid, use baking soda (base) to neutralize"]
    }
];

const AcidsBasesLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            localStorage.setItem('lesson_complete_Acids, Bases and Salts', 'true');
            toast.success("Lesson Complete! Games Unlocked! 🧪🔓");
            setTimeout(() => {
                navigate(`/learn/${topicId}/levels?chapterName=Acids, Bases and Salts`);
            }, 2000);
        }
    };

    const handleBack = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const activePage = LESSON_PAGES[currentPage];

    return (
        <div className="lesson-container acids-bases-theme">
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

                        {activePage.animation === 'ph-scale' && (
                            <div className="ph-visual">
                                <div className="ph-gradient">
                                    <span>0</span>
                                    <span>7</span>
                                    <span>14</span>
                                </div>
                                <div className="ph-labels">
                                    <span className="acidic">ACIDIC</span>
                                    <span className="neutral">NEUTRAL</span>
                                    <span className="basic">BASIC</span>
                                </div>
                            </div>
                        )}

                        {activePage.table && (
                            <div className="indicator-table">
                                <div className="table-header">
                                    <span>Indicator</span>
                                    <span>In Acid</span>
                                    <span>In Base</span>
                                </div>
                                {activePage.table.map(row => (
                                    <div key={row.indicator} className="table-row">
                                        <span>{row.indicator}</span>
                                        <span className={row.acid.toLowerCase()}>{row.acid}</span>
                                        <span className={row.base.toLowerCase()}>{row.base}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activePage.equation && (
                            <div className="equation-box">
                                <div className="formula">{activePage.equation}</div>
                                <div className="example">{activePage.example}</div>
                            </div>
                        )}

                        {activePage.examples && (
                            <ul className="example-list">
                                {activePage.examples.map((ex, i) => (
                                    <li key={i}>{ex}</li>
                                ))}
                            </ul>
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
                    {currentPage === LESSON_PAGES.length - 1 ? "FINISH 🏁" : "NEXT"}
                </button>
            </footer>
        </div>
    );
};

export default AcidsBasesLesson;
