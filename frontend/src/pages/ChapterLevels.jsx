import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ChapterLevels.css';

const ChapterLevels = () => {
    const { topicId } = useParams();
    const [searchParams] = useSearchParams();
    const chapterName = searchParams.get('chapterName');
    const chapterId = searchParams.get('chapterId');
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedWorld] = useState(localStorage.getItem('selectedWorld') || 'science');
    const isMath = selectedWorld === 'math';

    // Level mappings for different chapters
    const CHAPTER_LEVELS = {
        "Light - Reflection and Refraction": [
            { id: 1, title: "Ray Drawing Challenge", type: "ray-optics", icon: "✏️", description: "Learn basic ray tracing" },
            { id: 2, title: "Mirror Maze", type: "simulation", icon: "🪞", description: "Navigate through reflections" },
            { id: 3, title: "Refraction Tank", type: "simulation", icon: "🌊", description: "Snell's Law Simulation" },
            { id: 4, title: "Lens Focus Challenge", type: "simulation", icon: "🔍", description: "Image Formation Experiment" },
            { id: 5, title: "True/False Ray Quiz", type: "puzzle", icon: "🧠", description: "Conceptual Mastery" },
            { id: 6, title: "Drag-Drop Ray Labels", type: "puzzle", icon: "🏷️", description: "Terminology Check" },
            { id: 7, title: "Image Formation Puzzle", type: "puzzle", icon: "🧩", description: "Matching Properties" },
            { id: 8, title: "Ultimate Boss: Light Master", type: "boss", icon: "👑", description: "The Final Optical Battle" },
        ],
        "Human Eye and Colourful World": [
            { id: 1, title: "Eye Parts Label Game", type: "anatomy", icon: "👁️", description: "Identify physiological structures" },
            { id: 2, title: "Focus Adjuster Slider", type: "simulation", icon: "🎚️", description: "Adjust lens for clear vision" },
            { id: 3, title: "Defect Finder Game", type: "puzzle", icon: "🔍", description: "Diagnose vision issues" },
            { id: 4, title: "Correct Lens Matching", type: "puzzle", icon: "👓", description: "Prescribe corrective lenses" },
            { id: 5, title: "Vision Test Quiz", type: "quiz", icon: "📝", description: "Test your ocular knowledge" },
            { id: 6, title: "Retina Drag Puzzle", type: "puzzle", icon: "🎞️", description: "Form images on the retina" },
            { id: 7, title: "Color Vision Puzzle", type: "puzzle", icon: "🌈", description: "Explore the color spectrum" },
            { id: 8, title: "Boss Eye Health Challenge", type: "boss", icon: "🏥", description: "Master the human eye unit" }
        ],
        "Electricity": [
            { id: 1, title: "Circuit Builder", type: "simulation", icon: "🔌", description: "Build working electrical circuits" },
            { id: 2, title: "Ohm’s Law Puzzle", type: "puzzle", icon: "💡", description: "Solve V=IR challenges" },
            { id: 3, title: "Voltage-Current Matching", type: "puzzle", icon: "📈", description: "Match readings for components" },
            { id: 4, title: "Resistance Maze", type: "puzzle", icon: "🌀", description: "Find the path of least resistance" },
            { id: 5, title: "Circuit Quiz", type: "quiz", icon: "📋", description: "Test your electrical knowledge" },
            { id: 6, title: "Drag Circuit Symbols", type: "puzzle", icon: "📐", description: "Identify schematic components" },
            { id: 7, title: "Power Calculation Puzzle", type: "puzzle", icon: "⚡", description: "Calculate watts and efficiency" },
            { id: 8, title: "Boss Circuit Simulation", type: "simulation", icon: "🤖", boss: true, description: "Master the electricity unit" }
        ],
        "Magnetic Effects of Electric Current": [
            { id: 1, title: "Pole Matching", type: "puzzle", icon: "🧲", description: "Match poles to show attraction/repulsion" },
            { id: 2, title: "Magnetic Field Painter", type: "simulation", icon: "✏️", description: "Trace field lines around magnets" },
            { id: 3, title: "Right-Hand Thumb Race", type: "puzzle", icon: "👍", description: "Predict field direction speed" },
            { id: 4, title: "Compass Direction Puzzle", type: "puzzle", icon: "🧭", description: "Predict needle alignment" },
            { id: 5, title: "Earth Magnetism Game", type: "simulation", icon: "🌍", description: "Master the global magnet" },
            { id: 6, title: "Drag Magnet Symbols Game", type: "puzzle", icon: "🏷️", description: "Complete the magnetic circuit" },
            { id: 7, title: "Magnetic Effect Puzzle", type: "puzzle", icon: "🌀", description: "Visualize coils and fields" },
            { id: 8, title: "Boss: Magnetic Battle Quiz", type: "boss", icon: "👑", boss: true, description: "The Ultimate Magnetism Review" }
        ],
        "Carbon and its Compounds": [
            { id: 1, title: "Atom Builder", type: "simulation", icon: "⚛️", description: "Construct carbon atoms and isotopes" },
            { id: 2, title: "Bond Type Matching", type: "puzzle", icon: "🔗", description: "Identify single, double, and triple bonds" },
            { id: 3, title: "Organic Compound Puzzle", type: "puzzle", icon: "🧩", description: "Solve structures of common compounds" },
            { id: 4, title: "Hydrocarbon Sorting", type: "sorting", icon: "⛽", description: "Categorize alkanes, alkenes, and alkynes" },
            { id: 5, title: "Functional Group Quiz", type: "quiz", icon: "🧪", description: "Identify alcohols, acids, and more" },
            { id: 6, title: "Drag Molecule Structure", type: "puzzle", icon: "🏗️", description: "Assemble molecular frameworks" },
            { id: 7, title: "Organic Naming Game", type: "puzzle", icon: "🏷️", description: "Master IUPAC nomenclature" },
            { id: 8, title: "Boss 3D Molecule Creator", type: "simulation", icon: "🧊", boss: true, description: "Build complex 3D organic structures" }
        ],
        "Periodic Classification of Elements": [
            { id: 1, title: "Element Treasure Hunt", type: "puzzle", icon: "🏴‍☠️", description: "Find elements based on clues" },
            { id: 2, title: "Symbol Matching", type: "puzzle", icon: "🧪", description: "Match symbols with element names" },
            { id: 3, title: "Period Group Puzzle", type: "puzzle", icon: "🧩", description: "Place elements in their correct groups" },
            { id: 4, title: "Element Property Quiz", type: "quiz", icon: "📝", description: "Test your knowledge of trends" },
            { id: 5, title: "Periodic Crossword", type: "puzzle", icon: "🔠", description: "Solve the chemical grid" },
            { id: 6, title: "Drag Table Blocks", type: "puzzle", icon: "🧱", description: "Assemble the s, p, d, f blocks" },
            { id: 7, title: "Element Uses Game", type: "puzzle", icon: "⚙️", description: "Match elements with their real-world uses" },
            { id: 8, title: "Boss Periodic Battle Quiz", type: "quiz", icon: "⚔️", boss: true, description: "Master the periodic table unit" }
        ],
        "Life Processes": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Nutrition, Respiration, Transport & Excretion" },
            { id: 1, title: "Organ Label Puzzle", type: "puzzle", icon: "🧩", description: "Label human body organs" },
            { id: 2, title: "Digestion Flow", type: "flowchart", icon: "🍎", description: "Arrange digestion steps in order" },
            { id: 3, title: "Respiration Path", type: "path", icon: "🫁", description: "Trace oxygen through the body" },
            { id: 4, title: "Circulation Puzzle", type: "puzzle", icon: "❤️", description: "Assemble the circulatory system" },
            { id: 5, title: "Excretion Quiz", type: "quiz", icon: "🚽", description: "Test knowledge on kidneys & excretion" },
            { id: 6, title: "Process-Organ Match", type: "match", icon: "🔄", description: "Match life processes to organs" },
            { id: 7, title: "Life Process Crossword", type: "crossword", icon: "📝", description: "Solve biology crossword clues" },
            { id: 8, title: "Dr. Bio Master Boss", type: "boss", icon: "🧠", boss: true, description: "Ultimate human body challenge" }
        ],
        "Control and Coordination": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Nervous system, Brain, Reflex action & Hormones" },
            { id: 1, title: "Brain Part Matching", type: "puzzle", icon: "🧠", description: "Identify functions of brain regions" },
            { id: 2, title: "Reflex Path Maze", type: "simulation", icon: "⚡", description: "Trace the path of a reflex arc" },
            { id: 3, title: "Hormone Match Game", type: "puzzle", icon: "🧪", description: "Connect glands with hormones" },
            { id: 4, title: "Nervous System Quiz", type: "quiz", icon: "📝", description: "Test your neuro-knowledge" },
            { id: 5, title: "Endocrine Puzzle", type: "puzzle", icon: "🧩", description: "Assemble the hormonal system" },
            { id: 6, title: "Drag Control Labels", type: "puzzle", icon: "🏷️", description: "Identify parts of control systems" },
            { id: 7, title: "Coordination Crossword", type: "puzzle", icon: "🔡", description: "Solve the coordination grid" },
            { id: 8, title: "Boss Brain Power Quiz", type: "boss", icon: "💡", boss: true, description: "Ultimate coordination challenge" }
        ],
        "How do Organisms Reproduce?": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Sexual vs Asexual, Plants & Humans" },
            { id: 1, title: "Sexual/Asexual Sorting", type: "sorting", icon: "🌱", description: "Categorize reproductive methods" },
            { id: 2, title: "Flower Parts Label Game", type: "puzzle", icon: "🌸", description: "Identify botanical structures" },
            { id: 3, title: "Pollination Puzzle", type: "puzzle", icon: "🐝", description: "Connect pollinators with plants" },
            { id: 4, title: "Human Reproduction Quiz", type: "quiz", icon: "📝", description: "Test your reproductive biology" },
            { id: 5, title: "Cycle Puzzle", type: "puzzle", icon: "📅", description: "Sequence reproductive cycles" },
            { id: 6, title: "Fertilization Steps Drag Game", type: "puzzle", icon: "🧪", description: "Order the stages of fertilization" },
            { id: 7, title: "Plant Reproduction Sim", type: "simulation", icon: "🌱", description: "Germination & Vegetative Propagation" },
            { id: 8, title: "Reproduction Boss", type: "boss", icon: "🧬", boss: true, description: "Master the cycle of life" }
        ],
        "Heredity and Evolution": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Mendel, Traits, Genes & Evolution" },
            { id: 1, title: "Trait Matching", type: "puzzle", icon: "🧬", description: "Inherited vs Acquired traits" },
            { id: 2, title: "Punnett Square Puzzle", type: "simulation", icon: "🧩", description: "Predict offspring genotypes" },
            { id: 3, title: "Dominant Traits Quiz", type: "quiz", icon: "📝", description: "Test your genetics knowledge" },
            { id: 4, title: "Variation Puzzle", type: "puzzle", icon: "🌈", description: "Identify genetic/env variations" },
            { id: 5, title: "Evolution Timeline", type: "simulation", icon: "🕰️", description: "Trace the history of life" },
            { id: 6, title: "Genetic Cross Simulation", type: "simulation", icon: "⚡", description: "Perform hybrid crosses" },
            { id: 7, title: "Mendel Crossword", type: "puzzle", icon: "🔡", description: "Solve the genetics grid" },
            { id: 8, title: "Genetics Boss Battle", type: "boss", icon: "🧠", boss: true, description: "Ultimate Mendel challenge" }
        ],
        "Our Environment": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Ecosystem, Food Chains & Waste" },
            { id: 1, title: "Pollution Sorting", type: "sorting", icon: "🗑️", description: "Categorize waste & pollutants" },
            { id: 2, title: "Air & Water Quiz", type: "quiz", icon: "💧", description: "Causes & effects of pollution" },
            { id: 3, title: "Clean Earth Puzzle", type: "puzzle", icon: "🌍", description: "Restore the environment" },
            { id: 4, title: "Reduce-Reuse-Recycle", type: "sorting", icon: "♻️", description: "Waste management strategies" },
            { id: 5, title: "Green City Builder", type: "simulation", icon: "🏙️", description: "Design a sustainable city" },
            { id: 6, title: "Pollution Sources", type: "puzzle", icon: "🏷️", description: "Identify sources of pollution" },
            { id: 7, title: "Eco Crossword", type: "puzzle", icon: "🔡", description: "Solve environmental science grid" },
            { id: 8, title: "Boss: Eco Hero", type: "boss", icon: "🦸", boss: true, description: "Master the environment unit" }
        ],
        "Sustainable Management of Natural Resources": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Natural Resources & 5R Principle" },
            { id: 1, title: "Resource Sorting", type: "sorting", icon: "♻️", description: "Renewable vs Non-renewable" },
            { id: 2, title: "Water & Forest Quiz", type: "quiz", icon: "💧", description: "Conservation & wildlife" },
            { id: 3, title: "Sustainable City Puzzle", type: "puzzle", icon: "🧩", description: "Build a greener environment" },
            { id: 4, title: "5R Classification", type: "sorting", icon: "🔢", description: "Refuse, Reduce, Reuse, Recycle, Repair" },
            { id: 5, title: "Resource Planner", type: "simulation", icon: "🏗️", description: "Smart city resource management" },
            { id: 6, title: "Resource Uses Match", type: "puzzle", icon: "🏷️", description: "Match resources to their uses" },
            { id: 7, title: "Resource Crossword", type: "puzzle", icon: "🔡", description: "Solve the resource grid" },
            { id: 8, title: "Boss: Smart Resource Manager", type: "boss", icon: "🦸", boss: true, description: "Master the resource unit" }
        ],
        "Sources of Energy": [
            { id: 1, title: "Energy Source Sorting", type: "sorting", icon: "🔋", description: "Sort renewable and non-renewable" },
            { id: 2, title: "Renewable vs Non-renewable Quiz", type: "quiz", icon: "☀️", description: "Test your energy knowledge" },
            { id: 3, title: "Power Plant Builder", type: "simulation", icon: "🏗️", description: "Design an efficient power plant" },
            { id: 4, title: "Energy Saving Puzzle", type: "puzzle", icon: "💡", description: "Find ways to conserve energy" },
            { id: 5, title: "Carbon Footprint Game", type: "simulation", icon: "👣", description: "Calculate environmental impact" },
            { id: 6, title: "Drag Energy Icons", type: "puzzle", icon: "🏷️", description: "Label energy systems" },
            { id: 7, title: "Energy Crossword", type: "puzzle", icon: "📝", description: "Solve the energy grid" },
            { id: 8, title: "Boss Smart City Energy Planner", type: "boss", icon: "🌆", boss: true, description: "Master the sources of energy unit" }
        ],
        "Acids, Bases and Salts": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Learn about pH, indicators and neutralization" },
            { id: 1, title: "pH Scale Slider", type: "slider", icon: "🌡️", description: "Identify acidic and basic substances" },
            { id: 2, title: "Acid/Base Sorting", type: "sorting", icon: "🧪", description: "Categorize household chemicals" },
            { id: 3, title: "Indicator Color Match", type: "match", icon: "🎨", description: "Test indicators in real-time" },
            { id: 4, title: "Household Chemical Quiz", type: "quiz", icon: "🏠", description: "Daily life chemistry challenge" },
            { id: 5, title: "Neutralization Puzzle", type: "puzzle", icon: "⚗️", description: "Assemble reaction equations" },
            { id: 6, title: "Drag pH Labels", type: "labeling", icon: "🧩", description: "Match pH values to substances" },
            { id: 7, title: "Salt Formation", type: "simulation", icon: "🧂", description: "Synthesize salts in the lab" },
            { id: 8, title: "Professor Acidus Lab", type: "boss", icon: "🧠", boss: true, description: "Master the Acids-Bases challenge" }
        ],
        "Metals and Non-Metals": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Learn about properties, reactivity and extraction" },
            { id: 1, title: "Metal Sorting Game", type: "sorting", icon: "🏗️", description: "Categorize metals and non-metals" },
            { id: 2, title: "Reactivity Series Puzzle", type: "puzzle", icon: "📉", description: "Rank metals by reactivity" },
            { id: 3, title: "Corrosion Prevention", type: "simulation", icon: "🛡️", description: "Stop the rust on the bridge" },
            { id: 4, title: "Ore Extraction Quiz", type: "quiz", icon: "⛏️", description: "Master roasting and calcination" },
            { id: 5, title: "Metal Properties Match", type: "match", icon: "⚖️", description: "Identify malleability and ductility" },
            { id: 6, title: "Drag Periodic Table", type: "puzzle", icon: "🧩", description: "Place elements in position" },
            { id: 7, title: "Metal Uses Puzzle", type: "puzzle", icon: "🏭", description: "Match metals to applications" },
            { id: 8, title: "Dr. Metallus Boss", type: "boss", icon: "🤖", boss: true, description: "Final Industrial Challenge" }
        ],
        "Chemical Reactions and Equations": [
            { id: -1, title: "Interactive Lesson", type: "lesson", icon: "📖", description: "Learn about chemical changes and balancing" },
            { id: 1, title: "Equation Balancing Drag", type: "puzzle", icon: "⚖️", description: "Balance equations like a pro" },
            { id: 2, title: "Reaction Type Match", type: "sorting", icon: "🧪", description: "Identify combination, displacement, etc." },
            { id: 3, title: "Word to Symbol", type: "puzzle", icon: "🔤", description: "Convert names to formulas" },
            { id: 4, title: "Reaction Puzzle", type: "puzzle", icon: "🧩", description: "Assemble reactants and products" },
            { id: 5, title: "Chemical React MCQ", type: "quiz", icon: "📝", description: "Test your theoretical knowledge" },
            { id: 6, title: "Lab Safety Game", type: "puzzle", icon: "🥽", description: "Identify safe lab practices" },
            { id: 7, title: "Reaction Flowchart", type: "puzzle", icon: "🔃", description: "Order the steps of a reaction" },
            { id: 8, title: "Boss Virtual Lab", type: "boss", icon: "⚗️", boss: true, description: "Perform experiments with Prof. Chem" }
        ]
    };

    // Fallback to Light if chapter not found or generic levels
    const levels = CHAPTER_LEVELS[chapterName] || CHAPTER_LEVELS["Light - Reflection and Refraction"] || [];

    const handleLevelClick = (level) => {
        // 1. Lessons first
        if (level.type === 'lesson') {
            if (chapterName === "Chemical Reactions and Equations") {
                navigate(`/chemistry-lesson/${topicId}`);
            } else if (chapterName === "Sources of Energy") {
                navigate(`/energy-lesson/${topicId}`);
            } else if (chapterName === "Magnetic Effects of Electric Current") {
                navigate(`/magnetism-lesson/${topicId}`);
            } else if (chapterName === "Metals and Non-Metals") {
                navigate(`/metals-lesson/${topicId}`);
            } else if (chapterName === "Carbon and its Compounds") {
                navigate(`/carbon-lesson/${topicId}`);
            } else if (chapterName === "Acids, Bases and Salts") {
                navigate(`/acids-lesson/${topicId}`);
            } else if (chapterName === "Periodic Classification of Elements") {
                navigate(`/periodic-lesson/${topicId}`);
            } else if (chapterName === "Life Processes") {
                navigate(`/life-processes-lesson/${topicId}`);
            } else if (chapterName === "Control and Coordination") {
                navigate(`/control-lesson/${topicId}`);
            } else if (chapterName === "How do Organisms Reproduce?") {
                navigate(`/reproduction-lesson/${topicId}`);
            } else if (chapterName === "Heredity and Evolution") {
                navigate(`/heredity-lesson/${topicId}`);
            } else if (chapterName === "Our Environment") {
                navigate(`/environment-lesson/${topicId}`);
            } else if (chapterName === "Sustainable Management of Natural Resources") {
                navigate(`/resource-lesson/${topicId}`);
            }
            return;
        }


        // 2. Exact Title/Keyword Matching
        const title = level.title.toLowerCase();

        if (title.includes('ray drawing') || level.type === 'ray-optics') {
            navigate(`/ray-optics/${topicId}`);
        } else if (level.type === 'anatomy' || title.includes('parts label')) {
            navigate(`/eye-labeling/${topicId}`);
        } else if (title.includes('focus adjuster')) {
            navigate(`/eye-focus/${topicId}`);
        } else if (title.includes('defect finder')) {
            navigate(`/defect-finder/${topicId}`);
        } else if (title.includes('correct lens')) {
            navigate(`/lens-matching/${topicId}`);
        } else if (title.includes('vision test')) {
            navigate(`/vision-test/${topicId}`);
        } else if (title.includes('retina drag')) {
            navigate(`/retina-puzzle/${topicId}`);
        } else if (title.includes('color vision')) {
            navigate(`/color-vision/${topicId}`);
        } else if (title.includes('circuit builder')) {
            navigate(`/circuit-builder/${topicId}`);
        } else if (title.includes('ohm') && title.includes('law')) {
            navigate(`/ohms-law/${topicId}`);
        } else if (title.includes('voltage-current matching') || title.includes('vi matching')) {
            navigate(`/vi-matching/${topicId}`);
        } else if (title.includes('resistance maze')) {
            navigate(`/resistance-maze/${topicId}`);
        } else if (title.includes('circuit quiz')) {
            navigate(`/circuit-quiz/${topicId}`);
        } else if (title.includes('drag circuit symbols') || title.includes('circuit symbols')) {
            navigate(`/circuit-symbols/${topicId}`);
        } else if (title.includes('power calculation') || title.includes('power puzzle')) {
            navigate(`/power-puzzle/${topicId}`);
        } else if (title.includes('refraction tank')) {
            navigate(`/refraction-tank/${topicId}`);
        } else if (title.includes('lens focus')) {
            navigate(`/lens-focus/${topicId}`);
        } else if (title.includes('label') && chapterName.includes('Light')) {
            navigate(`/ray-labeling/${topicId}`);
        } else if (title.includes('image formation')) {
            navigate(`/image-puzzle/${topicId}`);
        } else if (title.includes('mirror maze')) {
            navigate(`/mirror-maze/${topicId}`);
        } else if (title.includes('ray quiz')) {
            navigate(`/light-boss/${topicId}`);
        } else if (title.includes('pole matching')) {
            navigate(`/pole-matching/${topicId}`);
        } else if (title.includes('field painter')) {
            navigate(`/magnet-painter/${topicId}`);
        } else if (title.includes('thumb race')) {
            navigate(`/thumb-race/${topicId}`);
        } else if (title.includes('solenoid')) {
            navigate(`/solenoid-builder/${topicId}`);
        } else if (title.includes('fleming')) {
            navigate(`/fleming-duel/${topicId}`);
        } else if (title.includes('motor assembly')) {
            navigate(`/motor-assembly/${topicId}`);
        } else if (title.includes('emi explorer')) {
            navigate(`/emi-explorer/${topicId}`);
        } else if (title.includes('generator')) {
            navigate(`/generator-sim/${topicId}`);
        } else if (title.includes('compass direction')) {
            navigate(`/compass-puzzle/${topicId}`);
        } else if (title.includes('earth magnetism')) {
            navigate(`/earth-magnetism/${topicId}`);
        } else if (title.includes('magnet symbols')) {
            navigate(`/magnet-symbols/${topicId}`);
        } else if (title.includes('magnetic effect puzzle')) {
            navigate(`/magnetic-effect-puzzle/${topicId}`);
        } else if (title.includes('magnet battle')) {
            navigate(`/magnet-battle/${topicId}`);
        } else if (title.includes('energy source sorting') || title.includes('energy sorting')) {
            navigate(`/energy-sorting/${topicId}`);
        } else if (title.includes('renewable vs non-renewable quiz') || title.includes('energy quiz')) {
            navigate(`/energy-quiz/${topicId}`);
        } else if (title.includes('power plant builder')) {
            navigate(`/power-plant-builder/${topicId}`);
        } else if (title.includes('energy saving')) {
            navigate(`/energy-saver/${topicId}`);
        } else if (title.includes('carbon footprint')) {
            navigate(`/carbon-footprint/${topicId}`);
        } else if (title.includes('drag energy icons') || title.includes('energy flow')) {
            navigate(`/energy-flow/${topicId}`);
        } else if (title.includes('energy crossword')) {
            navigate(`/energy-crossword/${topicId}`);
        } else if (title.includes('smart city') || title.includes('energy planner')) {
            navigate(`/city-energy-planner/${topicId}`);
        } else if (chapterName === "Chemical Reactions and Equations") {
            if (level.id === 1) navigate(`/equation-balancer/${topicId}`);
            else if (level.id === 2) navigate(`/reaction-matcher/${topicId}`);
            else if (level.id === 3) navigate(`/symbol-converter/${topicId}`);
            else if (level.id === 4) navigate(`/reaction-puzzle/${topicId}`);
            else if (level.id === 5) navigate(`/chemistry-quiz/${topicId}`);
            else if (level.id === 6) navigate(`/lab-safety/${topicId}`);
            else if (level.id === 7) navigate(`/reaction-flowchart/${topicId}`);
            else if (level.id === 8) navigate(`/professor-chem-lab/${topicId}`);
        } else if (chapterName === "Acids, Bases and Salts") {
            if (level.id === 1) navigate(`/ph-slider/${topicId}`);
            else if (level.id === 2) navigate(`/acid-base-sorting/${topicId}`);
            else if (level.id === 3) navigate(`/indicator-match/${topicId}`);
            else if (level.id === 4) navigate(`/household-quiz/${topicId}`);
            else if (level.id === 5) navigate(`/neutralization-puzzle/${topicId}`);
            else if (level.id === 6) navigate(`/ph-labeling/${topicId}`);
            else if (level.id === 7) navigate(`/salt-formation/${topicId}`);
            else if (level.id === 8) navigate(`/acid-boss-lab/${topicId}`);
        } else if (chapterName === "Metals and Non-Metals") {
            if (level.id === 1) navigate(`/metal-sorting/${topicId}`);
            else if (level.id === 2) navigate(`/reactivity-series/${topicId}`);
            else if (level.id === 3) navigate(`/corrosion-game/${topicId}`);
            else if (level.id === 4) navigate(`/ore-quiz/${topicId}`);
            else if (level.id === 5) navigate(`/property-match/${topicId}`);
            else if (level.id === 6) navigate(`/periodic-drag/${topicId}`);
            else if (level.id === 7) navigate(`/uses-puzzle/${topicId}`);
            else if (level.id === 8) navigate(`/metal-boss/${topicId}`);
        } else if (chapterName === "Carbon and its Compounds") {
            if (level.id === -1) navigate(`/carbon-lesson/${topicId}`);
            else if (level.id === 1) navigate(`/atom-builder/${topicId}`);
            else if (level.id === 2) navigate(`/bond-matching/${topicId}`);
            else if (level.id === 3) navigate(`/organic-puzzle/${topicId}`);
            else if (level.id === 4) navigate(`/hydrocarbon-sorting/${topicId}`);
            else if (level.id === 5) navigate(`/functional-group-quiz/${topicId}`);
            else if (level.id === 6) navigate(`/molecule-structure/${topicId}`);
            else if (level.id === 7) navigate(`/organic-naming/${topicId}`);
            else if (level.id === 8) navigate(`/carbon-boss/${topicId}`);
        } else if (chapterName === "Periodic Classification of Elements") {
            if (level.id === -1) navigate(`/periodic-lesson/${topicId}`);
            else if (level.id === 1) navigate(`/element-treasure/${topicId}`);
            else if (level.id === 2) navigate(`/symbol-matching/${topicId}`);
            else if (level.id === 3) navigate(`/period-group-puzzle/${topicId}`);
            else if (level.id === 4) navigate(`/element-property-quiz/${topicId}`);
            else if (level.id === 5) navigate(`/periodic-crossword/${topicId}`);
            else if (level.id === 6) navigate(`/drag-table-blocks/${topicId}`);
            else if (level.id === 7) navigate(`/element-uses-game/${topicId}`);
            else if (level.id === 8) navigate(`/mendeleev-boss/${topicId}`);
        } else if (chapterName === "Life Processes") {
            if (level.id === 1) navigate(`/organ-label/${topicId}`);
            else if (level.id === 2) navigate(`/digestion-flow/${topicId}`);
            else if (level.id === 3) navigate(`/respiration-path/${topicId}`);
            else if (level.id === 4) navigate(`/circulation-puzzle/${topicId}`);
            else if (level.id === 5) navigate(`/excretion-quiz/${topicId}`);
            else if (level.id === 6) navigate(`/process-organ-match/${topicId}`);
            else if (level.id === 7) navigate(`/life-process-crossword/${topicId}`);
            else if (level.id === 8) navigate(`/bio-boss/${topicId}`);
        } else if (chapterName === "Control and Coordination") {
            if (level.id === 1) navigate(`/brain-match/${topicId}`);
            else if (level.id === 2) navigate(`/reflex-maze/${topicId}`);
            else if (level.id === 3) navigate(`/hormone-match/${topicId}`);
            else if (level.id === 4) navigate(`/nervous-quiz/${topicId}`);
            else if (level.id === 5) navigate(`/endocrine-puzzle/${topicId}`);
            else if (level.id === 6) navigate(`/control-labeling/${topicId}`);
            else if (level.id === 7) navigate(`/coord-crossword/${topicId}`);
            else if (level.id === 8) navigate(`/neuro-boss/${topicId}`);
        } else if (chapterName === "How do Organisms Reproduce?") {
            if (level.id === 1) navigate(`/repro-sorting/${topicId}`);
            else if (level.id === 2) navigate(`/flower-labeling/${topicId}`);
            else if (level.id === 3) navigate(`/pollination-puzzle/${topicId}`);
            else if (level.id === 4) navigate(`/repro-quiz/${topicId}`);
            else if (level.id === 5) navigate(`/menstrual-puzzle/${topicId}`);
            else if (level.id === 6) navigate(`/fertilization-steps/${topicId}`);
            else if (level.id === 7) navigate(`/plant-repro/${topicId}`);
            else if (level.id === 8) navigate(`/repro-boss/${topicId}`);
        } else if (chapterName === "Heredity and Evolution") {
            if (level.id === 1) navigate(`/trait-matching/${topicId}`);
            else if (level.id === 2) navigate(`/punnett-square/${topicId}`);
            else if (level.id === 3) navigate(`/genetics-quiz/${topicId}`);
            else if (level.id === 4) navigate(`/variation-puzzle/${topicId}`);
            else if (level.id === 5) navigate(`/evolution-timeline/${topicId}`);
            else if (level.id === 6) navigate(`/genetic-cross/${topicId}`);
            else if (level.id === 7) navigate(`/mendel-crossword/${topicId}`);
            else if (level.id === 8) navigate(`/mendel-boss/${topicId}`);
        } else if (chapterName === "Our Environment") {
            if (level.id === 1) navigate(`/pollution-sorting/${topicId}`);
            else if (level.id === 2) navigate(`/pollution-quiz/${topicId}`);
            else if (level.id === 3) navigate(`/clean-earth-puzzle/${topicId}`);
            else if (level.id === 4) navigate(`/reduce-reuse-recycle/${topicId}`);
            else if (level.id === 5) navigate(`/green-city-builder/${topicId}`);
            else if (level.id === 6) navigate(`/drag-pollution-sources/${topicId}`);
            else if (level.id === 7) navigate(`/environment-crossword/${topicId}`);
            else if (level.id === 8) navigate(`/eco-hero-challenge/${topicId}`);
        } else if (chapterName === "Sustainable Management of Natural Resources") {
            if (level.id === 1) navigate(`/resource-sorting/${topicId}`);
            else if (level.id === 2) navigate(`/resource-quiz/${topicId}`);
            else if (level.id === 3) navigate(`/sustainability-puzzle/${topicId}`);
            else if (level.id === 4) navigate(`/five-r-game/${topicId}`);
            else if (level.id === 5) navigate(`/resource-planner/${topicId}`);
            else if (level.id === 6) navigate(`/resource-match/${topicId}`);
            else if (level.id === 7) navigate(`/resource-crossword/${topicId}`);
            else if (level.id === 8) navigate(`/resource-boss/${topicId}`);
        } else if (level.boss) {
            if (chapterName.includes('Light')) navigate(`/light-boss/${topicId}`);
            else if (chapterName.includes('Eye')) navigate(`/eye-boss/${topicId}`);
            else if (chapterName.includes('Electricity')) navigate(`/electricity-boss/${topicId}`);
            else if (chapterName.includes('Magnetist')) navigate(`/magnet-boss/${topicId}`);
        } else if (level.type === 'quiz') {
            navigate(`/quiz/${topicId}?chapterName=${encodeURIComponent(chapterName)}&level=${level.id}&levelTitle=${encodeURIComponent(level.title)}`);
        } else {
            console.warn("Unrouted level:", level);
            navigate(`/chapter/${topicId}/levels`);
        }
    };

    const getCompletedCount = () => {
        const stored = localStorage.getItem(`completed_levels_${chapterName}`);
        if (stored) return parseInt(stored);

        // Check if lesson is complete for specific chapters
        if (chapterName === "Sources of Energy") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            return lessonComplete ? 0 : -1; // -1 means even Level 1 is locked until lesson
        }
        if (chapterName === "Magnetic Effects of Electric Current") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            return lessonComplete ? 0 : -1;
        }

        if (chapterName === "Chemical Reactions and Equations") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1; // Unlocks Level 1 (Index 1)
            return 0; // Only Lesson (Index 0) is active
        }

        if (chapterName === "Acids, Bases and Salts") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Metals and Non-metals") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Carbon and its Compounds") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Periodic Classification of Elements") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Control and Coordination") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "How do Organisms Reproduce?") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Heredity and Evolution") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Sustainable Management of Natural Resources") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        if (chapterName === "Our Environment") {
            const lessonComplete = localStorage.getItem(`lesson_complete_${chapterName}`);
            if (lessonComplete) return 1;
            return 0;
        }

        return 0;
    };

    const completedLevelsCount = getCompletedCount();

    return (
        <div className={`chapter-levels-container ${isMath ? 'math-theme' : 'science-theme'}`}>
            <div className="chapter-levels-overlay"></div>

            <header className="levels-header">
                <Link to="/map" className="back-btn">
                    <span className="icon">⬅️</span> BACK TO MAP
                </Link>
                <div className="header-info">
                    <div className="mission-tag">MISSION CONTROL</div>
                    <h1 className="chapter-title">{chapterName || "UNNAMED MISSION"}</h1>
                    <div className="chapter-progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${(completedLevelsCount / levels.length) * 100}%` }}></div>
                        </div>
                        <span className="progress-text">{completedLevelsCount} / {levels.length} LEVELS COMPLETED</span>
                    </div>
                </div>
                <div className="world-badge">CLASS {user?.standard || user?.student_profile?.standard || 10}</div>
            </header>

            <main className="levels-grid-container">
                <div className="levels-grid">
                    {levels.map((level, index) => {
                        const isCompleted = index < completedLevelsCount;
                        const isActive = index === completedLevelsCount || (completedLevelsCount === -1 && index === 0);
                        const isLocked = completedLevelsCount === -1 || index > completedLevelsCount;

                        return (
                            <motion.div
                                key={level.id}
                                className={`level-card ${isLocked ? 'locked' : ''} ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${level.boss ? 'boss-card' : ''}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={!isLocked ? { y: -5, boxShadow: "0 0 25px rgba(56, 189, 248, 0.4)" } : {}}
                                onClick={() => !isLocked && handleLevelClick(level)}
                            >
                                <div className="card-glare"></div>
                                <div className="level-number-tag">
                                    LEVEL {level.id} {level.boss ? '• BOSS' : ''}
                                </div>

                                <div className="level-card-inner">
                                    <div className="level-card-icon">
                                        {isLocked ? '🔒' : level.icon}
                                    </div>
                                    <div className="level-card-info">
                                        <h3 className="level-card-title">{level.title}</h3>
                                        <p className="level-card-desc">{level.description}</p>
                                    </div>
                                </div>

                                <div className="card-status-bar">
                                    {isLocked ? (
                                        <span className="status-locked">{completedLevelsCount === -1 ? 'LESSON REQUIRED' : 'LOCKED'}</span>
                                    ) : isCompleted ? (
                                        <span className="status-done">COMPLETED ✅</span>
                                    ) : (
                                        <>
                                            <span>START MISSION</span>
                                            <span className="arrow">🚀</span>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </main>

            <footer className="levels-footer">
                <div className="stats-box">
                    <div className="stat">
                        <span className="stat-label">STARS EARNED</span>
                        <div className="stat-content">
                            <span className="stat-icon">⭐</span>
                            <span className="stat-value">{user?.student_profile?.total_stars || 0}</span>
                        </div>
                    </div>
                    <div className="stat">
                        <span className="stat-label">XP POINTS</span>
                        <div className="stat-content">
                            <span className="stat-icon">⚡</span>
                            <span className="stat-value">{user?.student_profile?.xp_points || 0}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ChapterLevels;
