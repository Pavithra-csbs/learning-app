import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './PeriodicLesson.css';

const SECTIONS = [
    {
        id: 0,
        title: "🏛️ Why We Need a Periodic Table",
        content: "By the 19th century, scientists had discovered over 60 elements. It was impossible to remember properties of each one. Dmitri Mendeleev arranged them by increasing atomic mass and observed repeating (periodic) properties — giving us the Periodic Table!",
        visual: (
            <div className="visual-box timeline">
                <div className="timeline-item">1800s: 60+ elements discovered</div>
                <div className="timeline-arrow">↓</div>
                <div className="timeline-item highlight">Mendeleev (1869): Arranged by atomic mass</div>
                <div className="timeline-arrow">↓</div>
                <div className="timeline-item">Modern: Arranged by atomic number</div>
            </div>
        ),
        keyFact: "Mendeleev left gaps for undiscovered elements — and predicted their properties accurately!"
    },
    {
        id: 1,
        title: "⚛️ Modern Periodic Law",
        content: "The Modern Periodic Law states: Properties of elements are a periodic function of their atomic number. The table has 18 vertical columns (Groups) and 7 horizontal rows (Periods).",
        visual: (
            <div className="visual-box periods-groups">
                <div className="pg-grid">
                    <div className="pg-label period">Period 1: H, He</div>
                    <div className="pg-label period">Period 2: Li → Ne (8 elements)</div>
                    <div className="pg-label period">Period 3: Na → Ar (8 elements)</div>
                    <div className="pg-label group">Group 1: Alkali Metals (Li, Na, K...)</div>
                    <div className="pg-label group">Group 17: Halogens (F, Cl, Br...)</div>
                    <div className="pg-label group">Group 18: Noble Gases (He, Ne, Ar...)</div>
                </div>
            </div>
        ),
        keyFact: "There are 118 confirmed elements. The table has 18 groups and 7 periods."
    },
    {
        id: 2,
        title: "🔵 Atomic Size Trends",
        content: "Atomic size is the radius of an atom. It follows clear trends across the periodic table that help predict element behavior.",
        visual: (
            <div className="visual-box trends-box">
                <div className="trend-row">
                    <span className="trend-label">Across a Period →</span>
                    <div className="trend-atoms">
                        {['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl'].map((el, i) => (
                            <div key={el} className="trend-atom" style={{ width: `${38 - i * 4}px`, height: `${38 - i * 4}px` }}>{el}</div>
                        ))}
                    </div>
                    <span className="trend-arrow shrink">Size decreases →</span>
                </div>
                <div className="trend-row">
                    <span className="trend-label">Down a Group ↓</span>
                    <div className="trend-atoms vertical">
                        {['Li', 'Na', 'K', 'Rb'].map((el, i) => (
                            <div key={el} className="trend-atom" style={{ width: `${28 + i * 6}px`, height: `${28 + i * 6}px` }}>{el}</div>
                        ))}
                    </div>
                    <span className="trend-arrow grow">Size increases ↓</span>
                </div>
            </div>
        ),
        keyFact: "Across a period: nuclear charge increases pulling electrons closer. Down a group: new shells add distance."
    },
    {
        id: 3,
        title: "⚡ Valency Trends",
        content: "Valency is the combining capacity of an element, determined by the number of electrons in the outermost shell. It follows a periodic pattern.",
        visual: (
            <div className="visual-box valency-table">
                <table>
                    <thead>
                        <tr><th>Group</th><th>Outer e⁻</th><th>Valency</th><th>Example</th></tr>
                    </thead>
                    <tbody>
                        {[
                            [1, 1, 1, 'Na'],
                            [2, 2, 2, 'Mg'],
                            [13, 3, 3, 'Al'],
                            [14, 4, 4, 'C'],
                            [15, 5, 3, 'N'],
                            [16, 6, 2, 'O'],
                            [17, 7, 1, 'Cl'],
                            [18, 8, 0, 'Ar'],
                        ].map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
                    </tbody>
                </table>
            </div>
        ),
        keyFact: "Valency first increases from 1 to 4, then decreases to 0 across a period."
    },
    {
        id: 4,
        title: "🔩 Metals, Non-metals & Metalloids",
        content: "The periodic table is divided into metals, non-metals, and metalloids (semi-metals). The dividing line (staircase line) separates them.",
        visual: (
            <div className="visual-box classification-box">
                <div className="class-card metal">
                    <h4>⚙️ Metals</h4>
                    <ul>
                        <li>Left & center of table</li>
                        <li>Shiny, malleable, ductile</li>
                        <li>Good conductors</li>
                        <li>Examples: Fe, Cu, Na</li>
                    </ul>
                </div>
                <div className="class-card metalloid">
                    <h4>◈ Metalloids</h4>
                    <ul>
                        <li>Along the staircase line</li>
                        <li>Semi-conductors</li>
                        <li>Examples: Si, Ge, As</li>
                    </ul>
                </div>
                <div className="class-card nonmetal">
                    <h4>💨 Non-metals</h4>
                    <ul>
                        <li>Right side of table</li>
                        <li>Dull, brittle (solid)</li>
                        <li>Poor conductors</li>
                        <li>Examples: O, Cl, S</li>
                    </ul>
                </div>
            </div>
        ),
        keyFact: "Metallic character decreases left → right across a period, and increases top → bottom in a group."
    },
    {
        id: 5,
        title: "🌍 Real-Life Applications",
        content: "Understanding periodic trends helps us design materials, medicines, and technologies. Elements are chosen for specific jobs based on their position in the table.",
        visual: (
            <div className="visual-box applications-box">
                <div className="app-item">💡 Silicon (Si) → Computer chips</div>
                <div className="app-item">🔋 Lithium (Li) → Phone batteries</div>
                <div className="app-item">🏗️ Iron (Fe) → Steel construction</div>
                <div className="app-item">💊 Iodine (I) → Medicine</div>
                <div className="app-item">🚀 Titanium (Ti) → Aerospace</div>
                <div className="app-item">⚡ Copper (Cu) → Electrical wiring</div>
            </div>
        ),
        keyFact: "The periodic table is the most powerful reference tool in all of chemistry!"
    }
];

const PeriodicLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentSection, setCurrentSection] = useState(0);
    const [visited, setVisited] = useState(new Set([0]));
    const [completed, setCompleted] = useState(false);

    const section = SECTIONS[currentSection];
    const progress = (visited.size / SECTIONS.length) * 100;

    const goTo = (idx) => {
        setCurrentSection(idx);
        setVisited(prev => new Set([...prev, idx]));
    };

    const handleNext = () => {
        if (currentSection < SECTIONS.length - 1) {
            goTo(currentSection + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        if (visited.size < SECTIONS.length) {
            toast.error('Please visit all sections first! 📚');
            return;
        }
        setCompleted(true);
        localStorage.setItem('lesson_complete_Periodic Classification of Elements', 'true');
        localStorage.setItem('completed_levels_Periodic Classification of Elements', '1');
        toast.success('Lesson Complete! Level 1 Unlocked! 🎉');
        setTimeout(() => {
            navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`);
        }, 2000);
    };

    return (
        <div className="periodic-lesson-container">
            <header className="lesson-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Periodic Classification of Elements`)}>
                    ← Back
                </button>
                <h1>📖 Periodic Classification of Elements</h1>
                <div className="progress-bar-wrapper">
                    <div className="progress-bar-track">
                        <motion.div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span>{Math.round(progress)}%</span>
                </div>
            </header>

            <div className="lesson-body">
                <nav className="section-nav">
                    {SECTIONS.map((s, i) => (
                        <button
                            key={s.id}
                            className={`nav-dot ${i === currentSection ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`}
                            onClick={() => goTo(i)}
                            title={s.title}
                        >
                            {i + 1}
                        </button>
                    ))}
                </nav>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSection}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35 }}
                        className="section-card"
                    >
                        <h2>{section.title}</h2>
                        <p className="section-content">{section.content}</p>
                        <div className="section-visual">{section.visual}</div>
                        <div className="key-fact">
                            <span>💡 Key Fact: </span>{section.keyFact}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="lesson-controls">
                    <button className="btn-prev" onClick={() => goTo(Math.max(0, currentSection - 1))} disabled={currentSection === 0}>
                        ← Previous
                    </button>
                    <button className="btn-next" onClick={handleNext}>
                        {currentSection === SECTIONS.length - 1 ? '🎓 Complete Lesson!' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeriodicLesson;
