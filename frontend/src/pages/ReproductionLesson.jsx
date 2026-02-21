import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './ReproductionLesson.css';

const SECTIONS = [
    {
        id: "intro",
        title: "🧬 Why Reproduce?",
        content: "Reproduction ensures the continuity of species. It involves the creation of a DNA copy, which is the blueprint for body design. Variations during DNA copying are the basis for evolution!",
        visual: (
            <div className="rep-visual-dna">
                <div className="dna-helix">
                    <div className="dna-strand"></div>
                    <div className="dna-strand"></div>
                </div>
                <div className="rep-info-box">DNA copying is not 100% accurate, leading to small <strong>Variations</strong>!</div>
            </div>
        ),
        keyFact: "Variations help species survive in changing environments over long periods of time."
    },
    {
        id: "asexual",
        title: "🌱 Asexual Reproduction",
        content: "A single parent produces offspring without gametes. Types include Fission (Amoeba), Budding (Hydra), Spore Formation (Rhizopus), and Vegetative Propagation (Plants).",
        visual: (
            <div className="rep-asexual-grid">
                <div className="as-type">🧫 Fission</div>
                <div className="as-type">🌿 Fragmentation</div>
                <div className="as-type">🦎 Regeneration</div>
                <div className="as-type">🍄 Spores</div>
            </div>
        ),
        keyFact: "Asexual reproduction produces clones which are genetically identical to the parent."
    },
    {
        id: "plants",
        title: "🌸 Sexual Reproduction in Plants",
        content: "Flowering plants use flowers as reproductive organs. Stamen (Male) and Carpel/Pistil (Female) are the main parts. Pollination occurs when pollen reaches the stigma.",
        visual: (
            <div className="rep-visual-flower">
                <div className="flower-parts">
                    <div className="f-part male">Stamen (Anther + Filament)</div>
                    <div className="f-part female">Carpel (Stigma + Style + Ovary)</div>
                </div>
            </div>
        ),
        keyFact: "The ovary later develops into a fruit, and ovules become seeds!"
    },
    {
        id: "humans",
        title: "👨‍👩‍👦 Human Reproduction",
        content: "Humans reproduce sexually. Males produce sperm in testes, and females produce eggs in ovaries. Fertilization happens in the fallopian tube.",
        visual: (
            <div className="rep-human-anatomy">
                <div className="anatomy-item">♂️ Testes: Produce Testosterone & Sperm</div>
                <div className="anatomy-item">♀️ Ovaries: Produce Oestrogen & Eggs</div>
            </div>
        ),
        keyFact: "Puberty is the period during which teenagers reach sexual maturity."
    },
    {
        id: "health",
        title: "📅 Menstrual Cycle & Health",
        content: "If the egg is not fertilized, the thickened uterus lining breaks down, causing menstruation (bleeding). Reproductive health involves preventing STDs and planning families.",
        visual: (
            <div className="rep-cycle-calendar">
                <div className="calendar-circle">
                    <span>1-5: Menstruation</span>
                    <span>14: Ovulation</span>
                </div>
            </div>
        ),
        keyFact: "Mechanical barriers like condoms help prevent both pregnancy and STDs like AIDS/Syphilis!"
    }
];

const ReproductionLesson = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [visited, setVisited] = useState(new Set([0]));

    const section = SECTIONS[current];
    const progress = (visited.size / SECTIONS.length) * 100;

    const goTo = (idx) => {
        setCurrent(idx);
        setVisited(prev => new Set([...prev, idx]));
    };

    const handleNext = () => {
        if (current < SECTIONS.length - 1) goTo(current + 1);
        else handleComplete();
    };

    const handleComplete = () => {
        if (visited.size < SECTIONS.length) {
            toast.error('Watch all sections to unlock games! 🧬');
            return;
        }
        localStorage.setItem('lesson_complete_How do Organisms Reproduce?', 'true');
        localStorage.setItem('completed_levels_How do Organisms Reproduce?', '1');
        toast.success('Reproduction Lesson Complete! Level 1 Unlocked! 🌱');
        setTimeout(() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`), 2000);
    };

    return (
        <div className="repro-lesson-page">
            <header className="repro-header">
                <button className="back-btn" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=How do Organisms Reproduce?`)}>← Map</button>
                <h1>🌿 Reproduction Lesson</h1>
                <div className="progress-container">
                    <div className="progress-bar"><motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progress}%` }} /></div>
                    <span>{Math.round(progress)}%</span>
                </div>
            </header>

            <main className="repro-lesson-body">
                <div className="section-selector">
                    {SECTIONS.map((s, i) => (
                        <button key={i} className={`section-dot ${i === current ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`} onClick={() => goTo(i)}>
                            {i + 1}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={current} className="lesson-card"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                        <h2>{section.title}</h2>
                        <p className="lesson-text">{section.content}</p>
                        <div className="lesson-visual">{section.visual}</div>
                        <div className="lesson-fact">
                            <strong>💡 NCERT Key Fact:</strong> {section.keyFact}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="lesson-footer">
                    <button className="nav-btn prev" onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}>← Previous</button>
                    <button className="nav-btn next" onClick={handleNext}>
                        {current === SECTIONS.length - 1 ? '🎓 Finish Lesson' : 'Next Section →'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ReproductionLesson;
