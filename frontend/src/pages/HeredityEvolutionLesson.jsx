import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './HeredityEvolutionLesson.css';

const LESSON_SECTIONS = [
    {
        id: 'intro',
        title: '🧬 What is Heredity?',
        content: 'Heredity is the transfer of characters (traits) from parents to offspring. Variations are the differences among individuals of the same species.',
        key_points: [
            'Genetics: The study of heredity and variation.',
            'Traits: Observable characteristics like height, eye color.',
            'Variation: Necessary for survival and evolution.'
        ],
        visual: '🧬'
    },
    {
        id: 'mendel',
        title: '👨‍🔬 Mendel\'s Experiments',
        content: 'Gregor Mendel, the "Father of Genetics", used Garden Pea (Pisum sativum) for his experiments because they were easy to grow and had clear contrasting traits.',
        key_points: [
            'Monohybrid Cross: Study of inheritance of one pair of traits (e.g., Height).',
            'Dominant Trait: Expresses itself (e.g., Tall - T).',
            'Recessive Trait: remains hidden in presence of dominant (e.g., Short - t).'
        ],
        visual: '🧪'
    },
    {
        id: 'genotype',
        title: '🧩 Genotype vs Phenotype',
        content: 'Genotype is the genetic makeup of an organism (e.g., TT, Tt, tt), while Phenotype is the physical appearance (e.g., Tall or Short).',
        key_points: [
            'Homozygous: Two identical alleles (TT or tt).',
            'Heterozygous: Two different alleles (Tt).',
            'Alleles: Alternative forms of a gene.'
        ],
        visual: '🧩'
    },
    {
        id: 'traits',
        title: '👣 Inherited vs Acquired',
        content: 'Traits can be classified based on how they are obtained.',
        key_points: [
            'Inherited Traits: Passed from parents via DNA (e.g., skin color, height). They cause evolution.',
            'Acquired Traits: Developed during lifetime (e.g., muscles, learning a language). These are NOT passed to offspring.'
        ],
        visual: '👣'
    },
    {
        id: 'evolution',
        title: '⏳ Evolution',
        content: 'Evolution is the sequence of gradual changes over millions of years which lead to the development of new species from pre-existing ones.',
        key_points: [
            'Speciation: Formation of new species.',
            'Fossils: Preserved remains of ancient organisms.',
            'Homologous Organs: Same structure, different function (proof of common ancestry).'
        ],
        visual: '🐒'
    }
];

const HeredityEvolutionLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(0);

    const handleNext = () => {
        if (activeSection < LESSON_SECTIONS.length - 1) {
            setActiveSection(prev => prev + 1);
        } else {
            localStorage.setItem('lesson_complete_Heredity and Evolution', 'true');
            toast.success('Lesson Complete! Games Unlocked! 🎮');
            navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`);
        }
    };

    const section = LESSON_SECTIONS[activeSection];

    return (
        <div className="heredity-lesson-container">
            <header className="hl-header">
                <button className="hl-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Heredity and Evolution`)}>← Back</button>
                <div className="hl-progress">
                    {LESSON_SECTIONS.map((_, idx) => (
                        <div key={idx} className={`hl-progress-dot ${idx <= activeSection ? 'active' : ''}`} />
                    ))}
                </div>
            </header>

            <main className="hl-main">
                <AnimatePresence mode="wait">
                    <motion.section
                        key={section.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="hl-content-card"
                    >
                        <div className="hl-visual-icon">{section.visual}</div>
                        <h1>{section.title}</h1>
                        <p className="hl-description">{section.content}</p>

                        <div className="hl-key-points">
                            <h3>Key Concepts:</h3>
                            <ul>
                                {section.key_points.map((point, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.2 }}
                                    >
                                        {point}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>
                </AnimatePresence>
            </main>

            <footer className="hl-footer">
                <button className="hl-next-btn" onClick={handleNext}>
                    {activeSection === LESSON_SECTIONS.length - 1 ? 'Start Games 🎮' : 'Next Section →'}
                </button>
            </footer>
        </div>
    );
};

export default HeredityEvolutionLesson;
