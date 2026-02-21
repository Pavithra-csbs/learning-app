import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import './EnergyLesson.css';

const LESSON_PAGES = [
    {
        id: 'intro',
        title: "What is a Good Source of Energy?",
        content: (
            <div className="lesson-section">
                <h2>Criteria for a Good Fuel</h2>
                <div className="criteria-grid">
                    <div className="criteria-card">
                        <span className="icon">🔥</span>
                        <p>High calorific value (Maximum heat per unit mass)</p>
                    </div>
                    <div className="criteria-card">
                        <span className="icon">💨</span>
                        <p>Pollution-free (Minimum smoke/residue)</p>
                    </div>
                    <div className="criteria-card">
                        <span className="icon">💰</span>
                        <p>Economical and easily available</p>
                    </div>
                    <div className="criteria-card">
                        <span className="icon">🚚</span>
                        <p>Easy to store and transport</p>
                    </div>
                </div>
                <p className="summary-box">A good source of energy should do a large amount of work per unit volume or mass!</p>
            </div>
        )
    },
    {
        id: 'conventional',
        title: "Conventional Sources: Fossil Fuels",
        content: (
            <div className="lesson-section">
                <h2>Fossil Fuels</h2>
                <p>Formed over millions of years by the decomposition of plants and animals under high pressure and temperature.</p>
                <div className="consequences-box">
                    <h3>Disadvantages:</h3>
                    <ul>
                        <li>Non-renewable (Limited availability)</li>
                        <li>Air pollution (CO2, SO2, Nitrogen oxides)</li>
                        <li>Acid rain and Global Warming</li>
                    </ul>
                </div>
                <div className="thermal-simulation">
                    <h3>Thermal Power Plant</h3>
                    <div className="plant-svg">
                        <svg viewBox="0 0 400 200">
                            {/* Boiler */}
                            <rect x="50" y="100" width="80" height="80" fill="#475569" rx="5" />
                            <text x="65" y="145" fill="white" fontSize="12">Boiler</text>
                            <circle cx="90" cy="185" r="5" fill="#ef4444" />

                            {/* Turbine */}
                            <circle cx="200" cy="140" r="30" fill="#334155" stroke="#3b82f6" strokeWidth="2" />
                            <motion.path
                                d="M 180 140 L 220 140 M 200 120 L 200 160"
                                stroke="white"
                                strokeWidth="3"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                            <text x="180" y="185" fill="#3b82f6" fontSize="12">Turbine</text>

                            {/* Generator */}
                            <rect x="280" y="110" width="70" height="60" fill="#1e293b" rx="5" />
                            <text x="285" y="145" fill="white" fontSize="10">Generator</text>

                            {/* Connection Lines */}
                            <path d="M 130 140 L 170 140" stroke="#94a3b8" strokeWidth="4" strokeDasharray="5,5" />
                            <path d="M 230 140 L 280 140" stroke="#fbbf24" strokeWidth="4" />

                            {/* Labels */}
                            <text x="140" y="130" fill="#94a3b8" fontSize="8">Steam</text>
                            <text x="240" y="130" fill="#fbbf24" fontSize="8">Electricity</text>
                        </svg>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'hydro',
        title: "Conventional: Hydro Power",
        content: (
            <div className="lesson-section">
                <h2>Hydro Power Plants</h2>
                <p>Convert the kinetic energy of flowing water or the potential energy of water at a height into electricity.</p>
                <div className="hydro-stats">
                    <div className="stat">25% of India's electricity demand is met by hydro power plants.</div>
                </div>
                <div className="pros-cons">
                    <div className="pro">Renewable and Pollution-free</div>
                    <div className="con">Displaces large populations and destroys ecosystems (Submerged forests produce Methane)</div>
                </div>
            </div>
        )
    },
    {
        id: 'non-conventional',
        title: "Non-Conventional: Solar Energy",
        content: (
            <div className="lesson-section">
                <h2>The Sun: Ultimate Source</h2>
                <p>Solar energy is free, renewable, and doesn't cause pollution.</p>
                <div className="tech-box">
                    <h3>Solar Cells (Photovoltaic)</h3>
                    <p>Convert solar energy directly into electricity. A typical cell produces 0.5–1 V and 0.7 W of power.</p>
                    <div className="solar-panel-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="solar-cell">
                                <div className="reflection"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="benefit">Silicon is used for making solar cells, which is abundant but high-purity silicon is expensive.</div>
            </div>
        )
    },
    {
        id: 'nuclear',
        title: "Nuclear Energy",
        content: (
            <div className="lesson-section">
                <h2>Nuclear Fission</h2>
                <p>The nucleus of a heavy atom (Uranium, Plutonium) is bombarded with low-energy neutrons, split into lighter nuclei, releasing tremendous energy.</p>
                <div className="danger-zone">
                    <h3>Major Risks:</h3>
                    <ul>
                        <li>Improper waste storage leads to radiation</li>
                        <li>Risk of accidental leakage</li>
                        <li>High installation cost</li>
                    </ul>
                </div>
                <div className="fact-box">1 Uranium atom fission releases 10 million times energy than burning 1 Carbon atom from coal!</div>
            </div>
        )
    }
];

const EnergyLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < LESSON_PAGES.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            localStorage.setItem(`lesson_complete_Sources of Energy`, 'true');
            toast.success("Lesson Complete! Games Unlocked! 🚀");
            setTimeout(() => {
                navigate(`/learn/${topicId}/levels?chapterName=Sources of Energy`);
            }, 1500);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="energy-lesson-container">
            <Toaster />
            <header className="lesson-header">
                <button onClick={() => navigate('/map')} className="back-btn">⬅️ MAP</button>
                <div className="lesson-info">
                    <h1>SOURCES OF ENERGY</h1>
                    <span className="unit-label">Class 10 Physics</span>
                </div>
                <div className="progress-container">
                    <div className="progress-label">MISSION PROGRESS</div>
                    <div className="outer-bar">
                        <motion.div
                            className="inner-bar"
                            animate={{ width: `${((currentPage + 1) / LESSON_PAGES.length) * 100}%` }}
                        />
                    </div>
                </div>
            </header>

            <main className="lesson-main">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="page-content"
                    >
                        <div className="page-header">
                            <span className="page-idx">Part {currentPage + 1}</span>
                            <h2>{LESSON_PAGES[currentPage].title}</h2>
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
                    BACK
                </button>
                <button onClick={handleNext} className="nav-btn next">
                    {currentPage === LESSON_PAGES.length - 1 ? 'READY TO PLAY? 🔓' : 'CONTINUE'}
                </button>
            </footer>
        </div>
    );
};

export default EnergyLesson;
