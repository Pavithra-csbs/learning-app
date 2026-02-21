import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './MagnetismLesson.css';

const LESSON_PAGES = [
    {
        id: 'intro',
        title: "Introduction",
        content: (
            <div className="lesson-section">
                <h2>Magnetic Fields & Field Lines</h2>
                <p>A region around a magnetic material or a moving electric charge within which the force of magnetism acts.</p>
                <div className="diagram-container">
                    <svg viewBox="0 0 400 200" className="field-svg">
                        <rect x="150" y="80" width="100" height="40" fill="#ef4444" rx="5" />
                        <rect x="250" y="80" width="100" height="40" fill="#3b82f6" rx="5" />
                        <text x="170" y="105" fill="white" fontWeight="bold">N</text>
                        <text x="270" y="105" fill="white" fontWeight="bold">S</text>
                        {/* Magnetic Field Lines */}
                        <path d="M 150 100 Q 50 20 250 100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M 150 100 Q 50 180 250 100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M 350 100 Q 450 20 250 100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M 350 100 Q 450 180 250 100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                    <p className="caption">Magnetic field lines emerge from North pole and enter South pole.</p>
                </div>
            </div>
        )
    },
    {
        id: 'thumb-rule',
        title: "Right-Hand Thumb Rule",
        content: (
            <div className="lesson-section">
                <h2>Oersted's Discovery</h2>
                <p>Hans Christian Oersted discovered that electricity and magnetism are linked. A current-carrying conductor produces a magnetic field.</p>
                <div className="rule-box">
                    <h3>Maxwell's Right-Hand Thumb Rule</h3>
                    <p>Imagine holding a current-carrying straight conductor in your right hand such that the thumb points towards the direction of current. Then your fingers will wrap around the conductor in the direction of the field lines.</p>
                    <div className="animation-placeholder">
                        <div className="wire">
                            <div className="current-arrow">↑ I</div>
                        </div>
                        <div className="field-rings">
                            <div className="ring r1"></div>
                            <div className="ring r2"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'solenoid',
        title: "The Solenoid",
        content: (
            <div className="lesson-section">
                <h2>Magnetic Field in a Solenoid</h2>
                <p>A coil of many circular turns of insulated copper wire wrapped closely in the shape of a cylinder is called a solenoid.</p>
                <p>The magnetic field lines inside the solenoid are in the form of parallel straight lines, indicating that the magnetic field is uniform inside.</p>
                <div className="application">
                    <strong>Real-life Use:</strong> Electromagnets!
                </div>
            </div>
        )
    },
    {
        id: 'left-hand-rule',
        title: "Fleming's Left-Hand Rule",
        content: (
            <div className="lesson-section">
                <h2>Force on a Conductor</h2>
                <p>A magnetic field exerts a force on a current-carrying conductor. This force is maximum when the direction of current is perpendicular to the direction of the magnetic field.</p>
                <div className="rule-card">
                    <h3>Fleming's Left-Hand Rule</h3>
                    <ul>
                        <li><strong>Thumb:</strong> Direction of Motion (Force)</li>
                        <li><strong>Forefinger:</strong> Magnetic Field</li>
                        <li><strong>Middle finger:</strong> Current</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'motor-gen',
        title: "Motors & Generators",
        content: (
            <div className="lesson-section">
                <h2>Electric Motor</h2>
                <p>An electric motor is a rotating device that converts electrical energy to mechanical energy.</p>
                <hr />
                <h2>Electromagnetic Induction (EMI)</h2>
                <p>The phenomenon of producing an induced current in a coil by changing the magnetic field linked with it.</p>
                <h2>Electric Generator</h2>
                <p>Converts mechanical energy into electrical energy using EMI.</p>
            </div>
        )
    }
];

const MagnetismLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            // Unlock levels and navigate to chapter levels
            navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="magnet-lesson-container">
            <header className="lesson-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ MAP</button>
                <div className="lesson-title">
                    <h1>MAGNETIC EFFECTS OF CURRENT</h1>
                    <span className="chapter-label">Class 10 NCERT Science</span>
                </div>
                <div className="lesson-progress">
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            animate={{ width: `${((currentPage + 1) / LESSON_PAGES.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="lesson-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="page-wrapper"
                    >
                        <div className="page-header">
                            <span className="page-number">PART {currentPage + 1}</span>
                            <h1>{LESSON_PAGES[currentPage].title}</h1>
                        </div>
                        <div className="page-body">
                            {LESSON_PAGES[currentPage].content}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="lesson-footer">
                <button
                    onClick={handlePrev}
                    className={`nav-btn prev ${currentPage === 0 ? 'hidden' : ''}`}
                >
                    PREVIOUS
                </button>
                <button onClick={handleNext} className="nav-btn next">
                    {currentPage === LESSON_PAGES.length - 1 ? 'UNLOCK MISSIONS 🔓' : 'CONTINUE'}
                </button>
            </footer>
        </div>
    );
};

export default MagnetismLesson;
