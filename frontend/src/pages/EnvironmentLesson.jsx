import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './EnvironmentLesson.css';

const LESSON_CONTENT = [
    {
        id: 1,
        title: "Ecosystem & Its Components",
        icon: "🌍",
        content: "An ecosystem consists of all the living organisms (Biotic) in an area together with the non-living (Abiotic) components of the environment.",
        points: [
            "Biotic: Plants, animals, microorganisms.",
            "Abiotic: Temperature, rainfall, wind, soil, minerals.",
            "Producers: Organisms that produce food (Plants).",
            "Consumers: Organisms that consume food (Animals).",
            "Decomposers: Microorganisms that break down dead remains."
        ]
    },
    {
        id: 2,
        title: "Food Chains & Food Webs",
        icon: "🕸️",
        content: "A food chain shows the flow of energy from one organism to another. Multiple interconnected food chains form a food web.",
        points: [
            "Grass → Deer → Tiger (Simple Food Chain).",
            "Unidirectional energy flow.",
            "Food webs provide stability to ecosystems.",
            "Each step or level of the food chain is a Trophic Level."
        ]
    },
    {
        id: 3,
        title: "Trophic Levels & Energy Flow",
        icon: "🔋",
        content: "The 10% Law states that only 10% of energy is transferred to the next trophic level. Most energy is lost as heat.",
        points: [
            "T1: Producers (Autotrophs).",
            "T2: Primary Consumers (Herbivores).",
            "T3: Secondary Consumers (Carnivores).",
            "T4: Tertiary Consumers (Top Carnivores).",
            "Energy decreases as we go up the chain."
        ]
    },
    {
        id: 4,
        title: "Biodegradable & Non-Biodegradable",
        icon: "♻️",
        content: "Substances that are broken down by biological processes (bacteria/fungi) are biodegradable. Others are non-biodegradable.",
        points: [
            "Biodegradable: Wood, paper, fruit peels.",
            "Non-biodegradable: Plastics, DDT, glass.",
            "Biological Magnification: Accumulation of chemicals in higher trophic levels.",
            "Environmental persistence of plastics is a major concern."
        ]
    },
    {
        id: 5,
        title: "Ozone Layer & Waste Management",
        icon: "🛡️",
        content: "The ozone layer protects Earth from harmful UV radiation. Human activities are depleting it and creating waste problems.",
        points: [
            "Ozone (O3) is formed by UV action on Oxygen (O2).",
            "CFCs (Chlorofluorocarbons) deplete the ozone layer.",
            "The 3 R's: Reduce, Reuse, Recycle.",
            "Scientific disposal of waste: Landfills, Incineration, Composting."
        ]
    }
];

const EnvironmentLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < LESSON_CONTENT.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            localStorage.setItem('lesson_complete_Our Environment', 'true');
            toast.success("Lesson Completed! Mini-Games Unlocked! 🎉");
            navigate(`/learn/${topicId}/levels?chapterName=Our Environment`);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(s => s - 1);
    };

    const step = LESSON_CONTENT[currentStep];
    const progress = ((currentStep + 1) / LESSON_CONTENT.length) * 100;

    return (
        <div className="environment-lesson-container">
            <header className="lesson-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Our Environment`)}>← Home</button>
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
                                ✨ {p}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </AnimatePresence>

            <footer className="lesson-footer">
                <button className="nav-btn prev" onClick={handleBack} disabled={currentStep === 0}>Previous</button>
                <button className="nav-btn next" onClick={handleNext}>
                    {currentStep === LESSON_CONTENT.length - 1 ? "Unlock Games 🚀" : "Next Topic"}
                </button>
            </footer>
        </div>
    );
};

export default EnvironmentLesson;
