import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './LifeProcessesLesson.css';

const SECTIONS = [
    {
        id: 0,
        title: "🌱 What are Life Processes?",
        content: "Life processes are the basic functions performed by all living organisms to maintain their life. The major life processes are: Nutrition, Respiration, Transportation, and Excretion.",
        visual: (
            <div className="lp-visual-grid">
                {[
                    { icon: '🍎', label: 'Nutrition', desc: 'Getting energy from food' },
                    { icon: '🫁', label: 'Respiration', desc: 'Converting food into energy' },
                    { icon: '❤️', label: 'Transportation', desc: 'Moving materials through the body' },
                    { icon: '🚽', label: 'Excretion', desc: 'Removing waste products' },
                ].map(p => (
                    <div key={p.label} className="lp-process-card">
                        <div className="lp-icon">{p.icon}</div>
                        <div className="lp-label">{p.label}</div>
                        <div className="lp-desc">{p.desc}</div>
                    </div>
                ))}
            </div>
        ),
        keyFact: "All living things — from bacteria to humans — carry out these four essential life processes!"
    },
    {
        id: 1,
        title: "🍎 Nutrition",
        content: "Nutrition is the process of obtaining food for energy and growth. Humans are heterotrophs — we eat other organisms. Plants are autotrophs — they make food through photosynthesis using sunlight, CO₂ and water. Human digestion starts in the mouth and ends in the small intestine where nutrients are absorbed.",
        visual: (
            <div className="lp-visual-flow">
                <div className="lp-flow-title">Human Digestion Journey:</div>
                <div className="lp-flow-steps">
                    {['👄 Mouth\n(chewing + saliva)', '🗣️ Oesophagus\n(peristalsis)', '🫃 Stomach\n(HCl + enzymes)', '🧬 Small Intestine\n(absorption)', '💧 Large Intestine\n(water absorption)', '🚽 Anus\n(egestion)'].map((step, i) => (
                        <div key={i} className="lp-flow-item">
                            <div className="lp-flow-box">{step}</div>
                            {i < 5 && <div className="lp-flow-arrow">↓</div>}
                        </div>
                    ))}
                </div>
                <div className="lp-plants-box">
                    🌿 <strong>Photosynthesis:</strong> 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂
                </div>
            </div>
        ),
        keyFact: "The small intestine is 6–7 metres long! Villi in the walls increase surface area for absorption."
    },
    {
        id: 2,
        title: "🫁 Respiration",
        content: "Respiration is the process of breaking down glucose to release energy. It happens in every cell. Aerobic respiration uses oxygen and is more efficient. Anaerobic respiration occurs without oxygen and produces lactic acid (in muscles) or ethanol (in yeast).",
        visual: (
            <div className="lp-resp-box">
                <div className="lp-resp-card aerobic">
                    <h4>✅ Aerobic Respiration</h4>
                    <div className="lp-formula">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + <strong>38 ATP</strong></div>
                    <ul><li>Occurs in mitochondria</li><li>Produces lots of energy</li><li>Requires oxygen</li></ul>
                </div>
                <div className="lp-resp-card anaerobic">
                    <h4>⚡ Anaerobic Respiration</h4>
                    <div className="lp-formula">C₆H₁₂O₆ → 2C₃H₆O₃ + <strong>2 ATP</strong></div>
                    <ul><li>In cytoplasm (no O₂ needed)</li><li>Produces less energy</li><li>Causes muscle cramps!</li></ul>
                </div>
                <div className="lp-oxygen-path">
                    <strong>Breathing Path:</strong> Nose → Pharynx → Larynx → Trachea → Bronchi → Alveoli → Blood
                </div>
            </div>
        ),
        keyFact: "Alveoli have walls only ONE cell thick — this allows rapid gas exchange between air and blood!"
    },
    {
        id: 3,
        title: "❤️ Transportation",
        content: "The circulatory system transports oxygen, nutrients, hormones, and wastes through the body. Humans have a double circulatory system — blood passes through the heart twice per complete circuit.",
        visual: (
            <div className="lp-circ-box">
                <div className="lp-heart-diagram">
                    <div className="hd-chamber ra">Right Atrium<br /><small>Receives deoxygenated blood</small></div>
                    <div className="hd-chamber rv">Right Ventricle<br /><small>Pumps to lungs</small></div>
                    <div className="hd-arrow">→ Lungs (oxygenated) →</div>
                    <div className="hd-chamber la">Left Atrium<br /><small>Receives oxygenated blood</small></div>
                    <div className="hd-chamber lv">Left Ventricle<br /><small>Pumps to body</small></div>
                </div>
                <div className="lp-blood-types">
                    <div className="bt-card arteries">🔴 Arteries: carry blood AWAY from heart (oxygenated, thick walls)</div>
                    <div className="bt-card veins">🔵 Veins: carry blood TO heart (deoxygenated, valves)</div>
                    <div className="bt-card capillaries">🟣 Capillaries: microscopic, site of gas/nutrient exchange</div>
                </div>
            </div>
        ),
        keyFact: "The human heart beats about 72 times per minute — that's over 100,000 times per day!"
    },
    {
        id: 4,
        title: "🚽 Excretion",
        content: "Excretion is the removal of metabolic waste products from the body. The kidneys are the primary excretory organs. Each kidney contains about 1 million nephrons — the functional units that filter blood.",
        visual: (
            <div className="lp-excretion-box">
                <div className="lp-nephron">
                    <div className="nephron-step">1️⃣ Blood enters Glomerulus (filtration)</div>
                    <div className="nephron-arrow">↓</div>
                    <div className="nephron-step">2️⃣ Bowman's Capsule (collects filtrate)</div>
                    <div className="nephron-arrow">↓</div>
                    <div className="nephron-step">3️⃣ Tubules (reabsorption of glucose, water, salts)</div>
                    <div className="nephron-arrow">↓</div>
                    <div className="nephron-step">4️⃣ Collecting Duct → Ureter → Bladder → Urethra</div>
                </div>
                <div className="lp-other-excretion">
                    <div className="oe-item">🌿 Lungs: excrete CO₂ and water vapour</div>
                    <div className="oe-item">💧 Skin: excretes sweat (salt + water + urea)</div>
                    <div className="oe-item">🌱 Liver: excretes bile (from broken-down haemoglobin)</div>
                </div>
            </div>
        ),
        keyFact: "Your kidneys filter about 180 litres of blood per day, but only produce 1.5 litres of urine!"
    },
    {
        id: 5,
        title: "🌿 Life Processes in Plants",
        content: "Plants also carry out all four life processes but in unique ways. Xylem transports water and minerals upward. Phloem transports food (sugars) from leaves to rest of plant. Stomata regulate gas exchange. Roots absorb water by osmosis.",
        visual: (
            <div className="lp-plants-visual">
                <div className="pv-item">🌱 <strong>Nutrition:</strong> Photosynthesis in chloroplasts (leaves)</div>
                <div className="pv-item">🔥 <strong>Respiration:</strong> In all living cells (mitochondria)</div>
                <div className="pv-item">💧 <strong>Transport:</strong> Xylem (water up) + Phloem (food down)</div>
                <div className="pv-item">🍃 <strong>Excretion:</strong> O₂ via stomata, stored resins & gums</div>
                <div className="pv-fact">Stomata open during day (for photosynthesis) and close at night. Guard cells control the opening!</div>
            </div>
        ),
        keyFact: "Trees can transport water over 100 metres upward using transpiration pull — no pump needed!"
    }
];

const LifeProcessesLesson = () => {
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
            toast.error('Please visit all sections first! 📚');
            return;
        }
        localStorage.setItem('lesson_complete_Life Processes', 'true');
        localStorage.setItem('completed_levels_Life Processes', '1');
        toast.success('Lesson Complete! Level 1 Unlocked! 🎉');
        setTimeout(() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`), 2000);
    };

    return (
        <div className="lp-lesson-container">
            <header className="lp-header">
                <button className="lp-back" onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Life Processes`)}>← Back</button>
                <h1>📖 Life Processes</h1>
                <div className="lp-progress-wrap">
                    <div className="lp-progress-track"><motion.div className="lp-progress-fill" style={{ width: `${progress}%` }} /></div>
                    <span>{Math.round(progress)}%</span>
                </div>
            </header>

            <div className="lp-body">
                <nav className="lp-nav">
                    {SECTIONS.map((s, i) => (
                        <button key={i} className={`lp-dot ${i === current ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`} onClick={() => goTo(i)} title={s.title}>{i + 1}</button>
                    ))}
                </nav>

                <AnimatePresence mode="wait">
                    <motion.div key={current} className="lp-section-card"
                        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
                        <h2>{section.title}</h2>
                        <p className="lp-content">{section.content}</p>
                        <div className="lp-visual">{section.visual}</div>
                        <div className="lp-key-fact"><span>💡 Key Fact: </span>{section.keyFact}</div>
                    </motion.div>
                </AnimatePresence>

                <div className="lp-controls">
                    <button className="lp-btn-prev" onClick={() => goTo(Math.max(0, current - 1))} disabled={current === 0}>← Previous</button>
                    <button className="lp-btn-next" onClick={handleNext}>
                        {current === SECTIONS.length - 1 ? '🎓 Complete Lesson!' : 'Next →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LifeProcessesLesson;
