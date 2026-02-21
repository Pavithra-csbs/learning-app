import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ChapterSelection.css';

// NCERT Science Chapters by Class
const SCIENCE_CHAPTERS = {
    6: [
        { id: 1, title: "Food: Where Does It Come From?", description: "Sources of food" },
        { id: 2, title: "Components of Food", description: "Nutrients in our food" },
        { id: 3, title: "Fibre to Fabric", description: "Plant and animal fibres" },
        { id: 4, title: "Sorting Materials into Groups", description: "Properties of materials" },
        { id: 5, title: "Separation of Substances", description: "Methods of separation" },
        { id: 6, title: "Changes Around Us", description: "Physical and chemical changes" },
        { id: 7, title: "Getting to Know Plants", description: "Parts of plants" },
        { id: 8, title: "Body Movements", description: "Human body and movement" },
        { id: 9, title: "The Living Organisms", description: "Characteristics of living beings" },
        { id: 10, title: "Motion and Measurement", description: "Measuring length and motion" },
        { id: 11, title: "Light, Shadows and Reflections", description: "Properties of light" },
        { id: 12, title: "Electricity and Circuits", description: "Electric circuits" },
        { id: 13, title: "Fun with Magnets", description: "Magnetic properties" },
        { id: 14, title: "Water", description: "Importance of water" },
        { id: 15, title: "Air Around Us", description: "Properties of air" },
        { id: 16, title: "Garbage In, Garbage Out", description: "Waste management" }
    ],
    7: [
        { id: 1, title: "Nutrition in Plants", description: "Photosynthesis and nutrition" },
        { id: 2, title: "Nutrition in Animals", description: "Digestive system" },
        { id: 3, title: "Fibre to Fabric", description: "Wool and silk" },
        { id: 4, title: "Heat", description: "Temperature and heat transfer" },
        { id: 5, title: "Acids, Bases and Salts", description: "Chemical properties" },
        { id: 6, title: "Physical and Chemical Changes", description: "Types of changes" },
        { id: 7, title: "Weather, Climate and Adaptations", description: "Climate zones" },
        { id: 8, title: "Winds, Storms and Cyclones", description: "Air pressure and wind" },
        { id: 9, title: "Soil", description: "Soil profile and types" },
        { id: 10, title: "Respiration in Organisms", description: "Breathing and respiration" },
        { id: 11, title: "Transportation in Animals and Plants", description: "Circulatory system" },
        { id: 12, title: "Reproduction in Plants", description: "Plant reproduction" },
        { id: 13, title: "Motion and Time", description: "Speed and velocity" },
        { id: 14, title: "Electric Current and Its Effects", description: "Heating and magnetic effects" },
        { id: 15, title: "Light", description: "Reflection and refraction" },
        { id: 16, title: "Water: A Precious Resource", description: "Water conservation" },
        { id: 17, title: "Forests: Our Lifeline", description: "Forest ecosystem" },
        { id: 18, title: "Wastewater Story", description: "Sewage treatment" }
    ],
    8: [
        { id: 1, title: "Crop Production and Management", description: "Agricultural practices" },
        { id: 2, title: "Microorganisms", description: "Bacteria, viruses and fungi" },
        { id: 3, title: "Synthetic Fibres and Plastics", description: "Man-made materials" },
        { id: 4, title: "Materials: Metals and Non-Metals", description: "Properties of metals" },
        { id: 5, title: "Coal and Petroleum", description: "Fossil fuels" },
        { id: 6, title: "Combustion and Flame", description: "Burning and flames" },
        { id: 7, title: "Conservation of Plants and Animals", description: "Biodiversity" },
        { id: 8, title: "Cell - Structure and Functions", description: "Cell biology" },
        { id: 9, title: "Reproduction in Animals", description: "Sexual reproduction" },
        { id: 10, title: "Reaching the Age of Adolescence", description: "Puberty and hormones" },
        { id: 11, title: "Force and Pressure", description: "Types of forces" },
        { id: 12, title: "Friction", description: "Friction and its effects" },
        { id: 13, title: "Sound", description: "Production and propagation" },
        { id: 14, title: "Chemical Effects of Electric Current", description: "Electrolysis" },
        { id: 15, title: "Some Natural Phenomena", description: "Lightning and earthquakes" },
        { id: 16, title: "Light", description: "Laws of reflection" },
        { id: 17, title: "Stars and the Solar System", description: "Celestial objects" },
        { id: 18, title: "Pollution of Air and Water", description: "Environmental pollution" }
    ],
    9: [
        { id: 1, title: "Matter in Our Surroundings", description: "States of matter" },
        { id: 2, title: "Is Matter Around Us Pure?", description: "Mixtures and compounds" },
        { id: 3, title: "Atoms and Molecules", description: "Atomic structure" },
        { id: 4, title: "Structure of the Atom", description: "Subatomic particles" },
        { id: 5, title: "The Fundamental Unit of Life", description: "Cell structure" },
        { id: 6, title: "Tissues", description: "Plant and animal tissues" },
        { id: 7, title: "Diversity in Living Organisms", description: "Classification" },
        { id: 8, title: "Motion", description: "Types of motion" },
        { id: 9, title: "Force and Laws of Motion", description: "Newton's laws" },
        { id: 10, title: "Gravitation", description: "Universal gravitation" },
        { id: 11, title: "Work and Energy", description: "Forms of energy" },
        { id: 12, title: "Sound", description: "Sound waves" },
        { id: 13, title: "Why Do We Fall Ill?", description: "Health and disease" },
        { id: 14, title: "Natural Resources", description: "Air, water and soil" },
        { id: 15, title: "Improvement in Food Resources", description: "Agriculture techniques" }
    ],
    10: [
        { id: 1, title: "Chemical Reactions and Equations", description: "Balancing equations" },
        { id: 2, title: "Acids, Bases and Salts", description: "pH scale" },
        { id: 3, title: "Metals and Non-metals", description: "Reactivity series" },
        { id: 4, title: "Carbon and its Compounds", description: "Organic chemistry" },
        { id: 5, title: "Periodic Classification of Elements", description: "Periodic table" },
        { id: 6, title: "Life Processes", description: "Nutrition and respiration" },
        { id: 7, title: "Control and Coordination", description: "Nervous system" },
        { id: 8, title: "How do Organisms Reproduce?", description: "Reproduction methods" },
        { id: 9, title: "Heredity and Evolution", description: "Genetics and evolution" },
        { id: 10, title: "Light - Reflection and Refraction", description: "Laws of light" },
        { id: 11, title: "Human Eye and Colourful World", description: "Vision and spectrum" },
        { id: 12, title: "Electricity", description: "Current and circuits" },
        { id: 13, title: "Magnetic Effects of Electric Current", description: "Electromagnetism" },
        { id: 14, title: "Sources of Energy", description: "Renewable energy" },
        { id: 15, title: "Our Environment", description: "Ecosystem" },
        { id: 16, title: "Sustainable Management of Natural Resources", description: "Conservation" }
    ]
};

// NCERT Math Chapters by Class
const MATH_CHAPTERS = {
    6: [
        { id: 1, title: "Knowing Our Numbers", description: "Large numbers and estimation" },
        { id: 2, title: "Whole Numbers", description: "Properties of whole numbers" },
        { id: 3, title: "Playing with Numbers", description: "Factors and multiples" },
        { id: 4, title: "Basic Geometrical Ideas", description: "Points, lines, and curves" },
        { id: 5, title: "Understanding Elementary Shapes", description: "Types of angles and triangles" },
        { id: 6, title: "Integers", description: "Positive and negative numbers" },
        { id: 7, title: "Fractions", description: "Parts of a whole" },
        { id: 8, title: "Decimals", description: "Decimal numbers" },
        { id: 9, title: "Data Handling", description: "Bar graphs and tables" },
        { id: 10, title: "Mensuration", description: "Perimeter and area" },
        { id: 11, title: "Algebra", description: "Introduction to variables" },
        { id: 12, title: "Ratio and Proportion", description: "Comparing quantities" },
        { id: 13, title: "Symmetry", description: "Lines of symmetry" },
        { id: 14, title: "Practical Geometry", description: "Constructing shapes" }
    ],
    7: [
        { id: 1, title: "Integers", description: "Operations with integers" },
        { id: 2, title: "Fractions and Decimals", description: "Operations with fractions" },
        { id: 3, title: "Data Handling", description: "Mean, median, mode" },
        { id: 4, title: "Simple Equations", description: "Solving equations" },
        { id: 5, title: "Lines and Angles", description: "Pairs of angles" },
        { id: 6, title: "The Triangle and its Properties", description: "Types of triangles" },
        { id: 7, title: "Congruence of Triangles", description: "Criteria for congruence" },
        { id: 8, title: "Comparing Quantities", description: "Percentage and ratio" },
        { id: 9, title: "Rational Numbers", description: "Properties of rational numbers" },
        { id: 10, title: "Practical Geometry", description: "Construction of triangles" },
        { id: 11, title: "Perimeter and Area", description: "Circles and parallelograms" },
        { id: 12, title: "Algebraic Expressions", description: "Terms and factors" },
        { id: 13, title: "Exponents and Powers", description: "Laws of exponents" },
        { id: 14, title: "Symmetry", description: "Rotational symmetry" },
        { id: 15, title: "Visualising Solid Shapes", description: "3D shapes and nets" }
    ],
    8: [
        { id: 1, title: "Rational Numbers", description: "Properties and representation" },
        { id: 2, title: "Linear Equations in One Variable", description: "Solving equations" },
        { id: 3, title: "Understanding Quadrilaterals", description: "Polygons and properties" },
        { id: 4, title: "Practical Geometry", description: "Constructing quadrilaterals" },
        { id: 5, title: "Data Handling", description: "Pie charts and probability" },
        { id: 6, title: "Squares and Square Roots", description: "Finding square roots" },
        { id: 7, title: "Cubes and Cube Roots", description: "Finding cube roots" },
        { id: 8, title: "Comparing Quantities", description: "Compound interest" },
        { id: 9, title: "Algebraic Expressions and Identities", description: "Multiplying polynomials" },
        { id: 10, title: "Visualising Solid Shapes", description: "Euler's formula" },
        { id: 11, title: "Mensuration", description: "Volume and surface area" },
        { id: 12, title: "Exponents and Powers", description: "Negative exponents" },
        { id: 13, title: "Direct and Inverse Proportions", description: "Variations" },
        { id: 14, title: "Factorisation", description: "Factorising expressions" },
        { id: 15, title: "Introduction to Graphs", description: "Linear graphs" },
        { id: 16, title: "Playing with Numbers", description: "Divisibility tests" }
    ],
    9: [
        { id: 1, title: "Number Systems", description: "Irrational numbers" },
        { id: 2, title: "Polynomials", description: "Remainder theorem" },
        { id: 3, title: "Coordinate Geometry", description: "Cartesian plane" },
        { id: 4, title: "Linear Equations in Two Variables", description: "Graphing lines" },
        { id: 5, title: "Introduction to Euclid's Geometry", description: "Axioms and postulates" },
        { id: 6, title: "Lines and Angles", description: "Parallel lines and transversals" },
        { id: 7, title: "Triangles", description: "Congruence criteria" },
        { id: 8, title: "Quadrilaterals", description: "Properties of parallelograms" },
        { id: 9, title: "Circles", description: "Chords and arcs" },
        { id: 10, title: "Heron's Formula", description: "Area of triangles" },
        { id: 11, title: "Surface Areas and Volumes", description: "Sphere, cone, cylinder" },
        { id: 12, title: "Statistics", description: "Bar graphs and histograms" }
    ],
    10: [
        { id: 1, title: "Real Numbers", description: "Euclid's division lemma" },
        { id: 2, title: "Polynomials", description: "Zeros of polynomials" },
        { id: 3, title: "Pair of Linear Equations in Two Variables", description: "Graphical method" },
        { id: 4, title: "Quadratic Equations", description: "Roots and factorization" },
        { id: 5, title: "Arithmetic Progressions", description: "Nth term and sum" },
        { id: 6, title: "Triangles", description: "Similarity and Pythagoras theorem" },
        { id: 7, title: "Coordinate Geometry", description: "Distance and section formula" },
        { id: 8, title: "Introduction to Trigonometry", description: "Trigonometric ratios" },
        { id: 9, title: "Some Applications of Trigonometry", description: "Heights and distances" },
        { id: 10, title: "Circles", description: "Tangents to a circle" },
        { id: 11, title: "Areas Related to Circles", description: "Sectors and segments" },
        { id: 12, title: "Surface Areas and Volumes", description: "Combination of solids" },
        { id: 13, title: "Statistics", description: "Mean, median, mode" },
        { id: 14, title: "Probability", description: "Events and outcomes" }
    ]
};

const ChapterSelection = () => {
    const { levelId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedWorld] = useState(localStorage.getItem('selectedWorld') || 'science');

    // Get user's class/standard
    const userClass = user?.standard || user?.student_profile?.standard || 10;

    // Get chapters based on class and world with bulletproof fallbacks
    const chapters = (selectedWorld === 'math'
        ? (MATH_CHAPTERS[userClass] || MATH_CHAPTERS[10])
        : (SCIENCE_CHAPTERS[userClass] || SCIENCE_CHAPTERS[10])) || [];

    const isMath = selectedWorld === 'math';

    const handleChapterClick = (chapterId, chapterTitle) => {
        if (chapterTitle === "Magnetic Effects of Electric Current") {
            navigate(`/magnetism-lesson/${chapterId}`);
        } else if (chapterTitle === "Sources of Energy") {
            navigate(`/energy-lesson/${chapterId}`);
        } else if (chapterTitle === "Chemical Reactions and Equations") {
            navigate(`/chemistry-lesson/${chapterId}`);
        } else if (chapterTitle === "Acids, Bases and Salts") {
            navigate(`/acids-bases-lesson/${chapterId}`);
        } else if (chapterTitle === "Metals and Non-metals") {
            navigate(`/metals-lesson/${chapterId}`);
        } else {
            navigate(`/learn/${levelId}/levels?chapterId=${chapterId}&chapterName=${encodeURIComponent(chapterTitle)}`);
        }
    };

    return (
        <div className={`chapter-selection-container ${isMath ? 'math-theme' : 'science-theme'}`}>
            <div className="chapter-overlay"></div>

            {/* Header */}
            <header className="chapter-header">
                <Link to="/map" className="back-btn">
                    <span className="icon">⬅️</span> BACK TO MAP
                </Link>
                <div className="header-center">
                    <div className="mission-title">MISSION CONTROL</div>
                    <h1 className="chapter-main-title">
                        {isMath ? "MATHEMATICAL FRONTIER" : "SCIENTIFIC EXPEDITION"}
                    </h1>
                </div>
                <div className="class-badge">CLASS {userClass}</div>
            </header>

            {/* Chapter Grid */}
            <main className="chapter-grid-container">
                <div className="chapters-grid">
                    {chapters.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            className="chapter-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, boxShadow: "0 0 25px rgba(76, 201, 240, 0.4)" }}
                            onClick={() => handleChapterClick(chapter.id, chapter.title)}
                        >
                            <div className="card-glare"></div>
                            <div className="chapter-number-tag">UNIT {chapter.id}</div>
                            <div className="chapter-card-inner">
                                <div className="chapter-card-icon">
                                    {isMath ? '📐' : '🔬'}
                                </div>
                                <div className="chapter-card-info">
                                    <h3 className="chapter-card-title">{chapter.title}</h3>
                                    <p className="chapter-card-desc">{chapter.description}</p>
                                </div>
                            </div>
                            <div className="card-action-bar">
                                <span>START LESSON</span>
                                <span className="arrow">🚀</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Path Decorator */}
            <div className="path-decorator">
                <div className="floating-orb orb-1"></div>
                <div className="floating-orb orb-2"></div>
            </div>
        </div>
    );
};

export default ChapterSelection;
