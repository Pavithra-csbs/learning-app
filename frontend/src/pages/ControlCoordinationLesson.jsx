import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './ControlCoordinationLesson.css';

const SECTIONS = [
    {
        id: 0,
        title: "🧠 The Nervous System",
        content: "The nervous system is the main coordination center of the body. It consists of the Central Nervous System (Brain and Spinal Cord) and the Peripheral Nervous System (Nerves). The basic unit of the nervous system is the Neuron.",
        visual: (
            <div className="cc-visual-neuron">
                <div className="neuron-diagram">
                    <div className="neuron-part cell-body">Cell Body</div>
                    <div className="neuron-part axon">Axon</div>
                    <div className="neuron-part dendrite">Dendrites</div>
                    <div className="neuron-part synapse">Synapses</div>
                </div>
                <div className="cc-info-box">
                    <strong>Electrical Signals:</strong> Information travels through neurons as electrical impulses!
                </div>
            </div>
        ),
        keyFact: "The brain contains about 86 billion neurons, each connected to thousands of others!"
    },
    {
        id: 1,
        title: "⚡ Reflex Action",
        content: "A reflex action is a sudden, involuntary response to a stimulus. It is controlled by the Spinal Cord to save time. The path followed by the signal is called the Reflex Arc.",
        visual: (
            <div className="cc-visual-reflex">
                <div className="reflex-arc">
                    <div className="arc-step">1️⃣ Receptor (Hand touches hot pan)</div>
                    <div className="arc-arrow">→</div>
                    <div className="arc-step">2️⃣ Sensory Neuron</div>
                    <div className="arc-arrow">→</div>
                    <div className="arc-step">3️⃣ Spinal Cord (Relay Neuron)</div>
                    <div className="arc-arrow">→</div>
                    <div className="arc-step">4️⃣ Motor Neuron</div>
                    <div className="arc-arrow">→</div>
                    <div className="arc-step">5️⃣ Effector (Muscle pulls away)</div>
                </div>
            </div>
        ),
        keyFact: "Reflex actions skip the brain initially for ultra-fast reaction speed—measured in milliseconds!"
    },
    {
        id: 2,
        title: "🏗️ The Human Brain",
        content: "The brain has three main parts: The Forebrain (cerebrum - thinking), Midbrain, and Hindbrain (cerebellum - balance, medulla - involuntary actions).",
        visual: (
            <div className="cc-visual-brain">
                <div className="brain-map">
                    <div className="brain-region cerebrum">Cerebrum (Thinking/Memory)</div>
                    <div className="brain-region cerebellum">Cerebellum (Balance/Posture)</div>
                    <div className="brain-region medulla">Medulla (Breathing/Heartbeat)</div>
                    <div className="brain-region hypothalamus">Hypothalamus (Hunger/Thirst)</div>
                </div>
            </div>
        ),
        keyFact: "The Forebrain is the main thinking part of the brain!"
    },
    {
        id: 3,
        title: "🧪 Endocrine Glands & Hormones",
        content: "Hormones are chemical messengers secreted by endocrine glands directly into the blood. They coordinate functions over longer periods compared to nerves.",
        visual: (
            <div className="cc-visual-hormones">
                <div className="hormone-table">
                    <div className="ht-row"><span>Pituitary</span><span>Growth Hormone</span></div>
                    <div className="ht-row"><span>Thyroid</span><span>Thyroxine (Metabolism)</span></div>
                    <div className="ht-row"><span>Pancreas</span><span>Insulin (Blood Sugar)</span></div>
                    <div className="ht-row"><span>Adrenal</span><span>Adrenaline (Emergency)</span></div>
                </div>
            </div>
        ),
        keyFact: "Adrenaline is known as the 'fight or flight' hormone!"
    },
    {
        id: 4,
        title: "🌱 Coordination in Plants",
        content: "Plants don't have a nervous system. They use hormones and movements to react. Trophic movements are direction-dependent (Phototropism - light, Geotropism - gravity).",
        visual: (
            <div className="cc-visual-plants">
                <div className="plant-movements">
                    <div className="pm-item">🌞 Phototropism: Shoots grow towards light</div>
                    <div className="pm-item">🌍 Geotropism: Roots grow towards gravity</div>
                    <div className="pm-item">💧 Hydrotropism: Roots grow towards water</div>
                    <div className="pm-item">🪴 Thigmotropism: Growth response to touch (climbing)</div>
                </div>
            </div>
        ),
        keyFact: "Plant hormones like Auxin help cells grow longer on the dark side of the stem, making it bend towards light!"
    }
];

const ControlCoordinationLesson = () => {
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
            toast.error('Please visit all sections first! 🧠');
            return;
        }
        localStorage.setItem('lesson_complete_Control and Coordination', 'true');
        localStorage.setItem('completed_levels_Control and Coordination', '1');
        toast.success('Coordination Lesson Complete! Level 1 Unlocked! 🎉');
        setTimeout(() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`), 2000);
    };

    return (
        <div className="cc-lesson-container">
            <header className="cc-header">
                <button className="cc-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Control and Coordination`)}>← Back</button>
                <h1>📖 Control and Coordination</h1>
                <div className="cc-progress-wrap">
                    <div className="cc-progress-track"><motion.div className="cc-progress-fill" style={{ width: `${progress}%` }} /></div>
                    <span>{Math.round(progress)}%</span>
                </div>
            </header>

            <div className="cc-body">
                <nav className="cc-nav">
                    {SECTIONS.map((s, i) => (
                        <button key={i} className={`cc-dot ${i === current ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`} onClick={() => goTo(i)} title={s.title}>{i + 1}</button>
                    ))}
                </nav>

                <AnimatePresence mode="wait">
                    <motion.div key={current} className="cc-section-card"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.3 }}>
                        <h2>{section.title}</h2>
                        <p className="cc-content">{section.content}</p>
                        <div className="cc-visual">{section.visual}</div>
                        <div className="cc-key-fact"><span>💡 Key Fact: </span>{section.keyFact}</div>
                    </motion.div>
                </AnimatePresence>

                <div className="cc-controls">
                    <button className="cc-btn-prev" onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}>← Previous</button>
                    <button className="cc-btn-next" onClick={handleNext}>
                        {current === SECTIONS.length - 1 ? '🎓 Finish Lesson!' : 'Next Section →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlCoordinationLesson;
