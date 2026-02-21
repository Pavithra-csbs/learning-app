import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './ResourceLesson.css';

const LESSON_CONTENT = [
    {
        id: 1,
        title: "Natural Resources",
        icon: "🌍",
        content: "Natural resources are substances found in nature that can be used by humans. They are the backbone of any economy.",
        points: [
            "Renewable: Solar, Wind, Water (Replenished naturally).",
            "Non-renewable: Coal, Oil, Minerals (Finite and can run out).",
            "Exhaustible vs Inexhaustible resources.",
            "Equitable distribution is key for sustainable growth."
        ]
    },
    {
        id: 2,
        title: "The 5R Principle",
        icon: "♻️",
        content: "To manage resources sustainably, we must follow the 5R strategy to minimize environmental impact.",
        points: [
            "Refuse: Say no to things you don't need.",
            "Reduce: Use less of everything.",
            "Reuse: Use things again and again.",
            "Repair: Fix broken items instead of buying new ones.",
            "Recycle: Process waste into new materials."
        ]
    },
    {
        id: 3,
        title: "Forests & Wildlife",
        icon: "🌳",
        content: "Forests are 'biodiversity hotspots'. Conservation is crucial for maintaining ecological balance.",
        points: [
            "Stakeholders: Locals, Forest Dept, Industrialists, Wildlife enthusiasts.",
            "Chipko Andolan: A classic instance of community forest protection.",
            "Amrita Devi Bishnoi: Sacrificed life to protect Khejri trees.",
            "Sustainable management involves local participation."
        ]
    },
    {
        id: 4,
        title: "Water Management",
        icon: "💧",
        content: "Water is vital for life. Management involves dams, rainwater harvesting, and traditional methods.",
        points: [
            "Dams: Provide irrigation & electricity, but have social/eco costs.",
            "Rainwater Harvesting: Recharging groundwater for future use.",
            "Traditional methods: Khadins, Ahars, Pynes (Local solutions).",
            "Watershed management: Increasing biomass production."
        ]
    },
    {
        id: 5,
        title: "Fossil Fuels & Sustainability",
        icon: "⛽",
        content: "Coal and Petroleum are exhaustible resources formed over millions of years.",
        points: [
            "Major sources of CO2, SO2, and Nitrogen oxides when burnt.",
            "Greenhouse effect and Global Warming risks.",
            "Need to shift to alternative energy sources (Solar, Wind).",
            "Sustainable Development: Meeting current needs without compromising future generations."
        ]
    }
];

const ResourceLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < LESSON_CONTENT.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            localStorage.setItem('lesson_complete_Sustainable Management of Natural Resources', 'true');
            toast.success("Lesson Completed! Mini-Games Unlocked! 🚀");
            navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    };

    const step = LESSON_CONTENT[currentStep];
    const progress = ((currentStep + 1) / LESSON_CONTENT.length) * 100;

    return (
        <div className="resource-lesson-container">
            <header className="lesson-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Sustainable Management of Natural Resources`)}>← Home</button>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="step-counter">Step {currentStep + 1} of {LESSON_CONTENT.length}</div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    className="lesson-card"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                >
                    <div className="card-icon">{step.icon}</div>
                    <h2>{step.title}</h2>
                    <p className="main-content">{step.content}</p>
                    <ul className="points-list">
                        {step.points.map((p, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                🌿 {p}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </AnimatePresence>

            <footer className="lesson-footer">
                <button className="nav-btn prev" onClick={handleBack} disabled={currentStep === 0}>Previous</button>
                <button className="nav-btn next" onClick={handleNext}>
                    {currentStep === LESSON_CONTENT.length - 1 ? "Start Games 🚀" : "Next Topic"}
                </button>
            </footer>
        </div>
    );
};

export default ResourceLesson;
