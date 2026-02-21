import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizArena from './pages/QuizArena';
import TopicContent from './pages/TopicContent';
import Leaderboard from './pages/Leaderboard';
import LeaderboardPage from './pages/LeaderboardPage';
import TeacherDashboard from './pages/TeacherDashboard';
import { Toaster } from 'react-hot-toast'; // Need to install this, or use simple alerts

import TeacherDashboardLive from './pages/TeacherDashboardLive';
import QuizCreator from './pages/QuizCreator';
import LiveQuizHost from './pages/LiveQuizHost';
import LiveQuizJoin from './pages/LiveQuizJoin';
import LiveQuizPlayer from './pages/LiveQuizPlayer';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Puzzle from './pages/Puzzle';
import Feedback from './pages/Feedback';
import AIChat from './components/AIChat';
import BackgroundMusic from './components/BackgroundMusic';
import WorldSelection from './pages/WorldSelection';
import ChapterSelection from './pages/ChapterSelection';
import ChapterLevels from './pages/ChapterLevels';
import RayDrawingGame from './pages/RayDrawingGame';
import MirrorMaze from './pages/MirrorMaze';
import RefractionTank from './pages/RefractionTank';
import LensFocusGame from './pages/LensFocusGame';
import RayQuiz from './pages/RayQuiz';
import RayLabelingGame from './pages/RayLabelingGame';
import ImageFormationPuzzle from './pages/ImageFormationPuzzle';
import LightBossLevel from './pages/LightBossLevel';
import FocusAdjuster from './pages/FocusAdjuster';
import DefectFinder from './pages/DefectFinder';
import LensMatching from './pages/LensMatching';
import VisionQuiz from './pages/VisionQuiz';
import RetinaPuzzle from './pages/RetinaPuzzle';
import ColorVision from './pages/ColorVision';
import EyeBossBattle from './pages/EyeBossBattle';
import CircuitBuilder from './pages/CircuitBuilder';
import OhmsLawPuzzle from './pages/OhmsLawPuzzle';
import VIMatching from './pages/VIMatching';
import ResistanceMaze from './pages/ResistanceMaze';
import CircuitQuiz from './pages/CircuitQuiz';
import CircuitSymbolsGame from './pages/CircuitSymbolsGame';
import PowerPuzzle from './pages/PowerPuzzle';
import ElectricityBossLevel from './pages/ElectricityBossLevel';
import MagnetismLesson from './pages/MagnetismLesson';
import MagneticFieldPainter from './pages/MagneticFieldPainter';
import RightHandThumbRace from './pages/RightHandThumbRace';
import SolenoidSupercharger from './pages/SolenoidSupercharger';
import FlemingForceDuel from './pages/FlemingForceDuel';
import MotorAssembly from './pages/MotorAssembly';
import EMIExplorer from './pages/EMIExplorer';
import GeneratorSim from './pages/GeneratorSim';
import MagnetBoss from './pages/MagnetBoss';
import PoleMatchingGame from './pages/PoleMatchingGame';
import CompassPuzzle from './pages/CompassPuzzle';
import EarthMagnetism from './pages/EarthMagnetism';
import MagnetSymbols from './pages/MagnetSymbols';
import MagneticEffectPuzzle from './pages/MagneticEffectPuzzle';
import MagnetBattleQuiz from './pages/MagnetBattleQuiz';
import EnergyLesson from './pages/EnergyLesson';
import EnergySorting from './pages/EnergySorting';
import EnergyQuiz from './pages/EnergyQuiz';
import PowerPlantBuilder from './pages/PowerPlantBuilder';
import EnergySaver from './pages/EnergySaver';
import CarbonFootprint from './pages/CarbonFootprint';
import EnergyFlow from './pages/EnergyFlow';
import EnergyCrossword from './pages/EnergyCrossword';
import CityEnergyPlanner from './pages/CityEnergyPlanner';
import EyeLabeling from './pages/EyeLabelingGame';
import ChemistryLesson from './pages/ChemistryLesson';
import EquationBalancer from './pages/EquationBalancer';
import ReactionMatcher from './pages/ReactionMatcher';
import SymbolConverter from './pages/SymbolConverter';
import ReactionPuzzle from './pages/ReactionPuzzle';
import ChemistryQuiz from './pages/ChemistryQuiz';
import LabSafetyGame from './pages/LabSafetyGame';
import ReactionFlowchart from './pages/ReactionFlowchart';
import ProfessorChemLabs from './pages/ProfessorChemLabs';
import AcidsBasesLesson from './pages/AcidsBasesLesson';
import PhScaleSlider from './pages/PhScaleSlider';
import AcidBaseSorting from './pages/AcidBaseSorting';
import IndicatorMatch from './pages/IndicatorMatch';
import HouseholdQuiz from './pages/HouseholdQuiz';
import NeutralizationPuzzle from './pages/NeutralizationPuzzle';
import PhLabeling from './pages/PhLabeling';
import SaltFormation from './pages/SaltFormation';
import ProfessorAcidusLab from './pages/ProfessorAcidusLab';
import MetalsLesson from './pages/MetalsLesson';
import CarbonLesson from './pages/CarbonLesson';
import AtomBuilder from './pages/AtomBuilder';
import BondTypeMatch from './pages/BondTypeMatch';
import OrganicPuzzle from './pages/OrganicPuzzle';
import HydrocarbonSorting from './pages/HydrocarbonSorting';
import FunctionalGroupQuiz from './pages/FunctionalGroupQuiz';
import MoleculeStructure from './pages/MoleculeStructure';
import OrganicNaming from './pages/OrganicNaming';
import ProfessorCarboniusBoss from './pages/ProfessorCarboniusBoss';
import PeriodicLesson from './pages/PeriodicLesson';
import ElementTreasureHunt from './pages/ElementTreasureHunt';
import SymbolMatching from './pages/SymbolMatching';
import PeriodGroupPuzzle from './pages/PeriodGroupPuzzle';
import ElementPropertyQuiz from './pages/ElementPropertyQuiz';
import PeriodicCrossword from './pages/PeriodicCrossword';
import DragTableBlocks from './pages/DragTableBlocks';
import ElementUsesGame from './pages/ElementUsesGame';
import MendeleevBoss from './pages/MendeleevBoss';
import LifeProcessesLesson from './pages/LifeProcessesLesson';
import OrganLabelPuzzle from './pages/OrganLabelPuzzle';
import DigestionFlow from './pages/DigestionFlow';
import RespirationPath from './pages/RespirationPath';
import CirculationPuzzle from './pages/CirculationPuzzle';
import ExcretionQuiz from './pages/ExcretionQuiz';
import ProcessOrganMatch from './pages/ProcessOrganMatch';
import LifeProcessCrossword from './pages/LifeProcessCrossword';
import DrBioMasterBoss from './pages/DrBioMasterBoss';
import ControlCoordinationLesson from './pages/ControlCoordinationLesson';
import BrainPartMatch from './pages/BrainPartMatch';
import ReflexMaze from './pages/ReflexMaze';
import HormoneMatch from './pages/HormoneMatch';
import NervousSystemQuiz from './pages/NervousSystemQuiz';
import EndocrinePuzzle from './pages/EndocrinePuzzle';
import ControlLabeling from './pages/ControlLabeling';
import CoordinationCrossword from './pages/CoordinationCrossword';
import NeuroMasterBoss from './pages/NeuroMasterBoss';
import MetalSorting from './pages/MetalSorting';
import ReactivitySeries from './pages/ReactivitySeries';
import CorrosionGame from './pages/CorrosionGame';
import OreQuiz from './pages/OreQuiz';
import PropertyMatch from './pages/PropertyMatch';
import PeriodicDrag from './pages/PeriodicDrag';
import UsesPuzzle from './pages/UsesPuzzle';
import DrMetallusBoss from './pages/DrMetallusBoss';
import ReproductionLesson from './pages/ReproductionLesson';
import ReproductionSorting from './pages/ReproductionSorting';
import FlowerLabeling from './pages/FlowerLabeling';
import PollinationPuzzle from './pages/PollinationPuzzle';
import HumanReproductionQuiz from './pages/HumanReproductionQuiz';
import MenstrualCyclePuzzle from './pages/MenstrualCyclePuzzle';
import FertilizationSteps from './pages/FertilizationSteps';
import PlantReproductionSim from './pages/PlantReproductionSim';
import BioReproductionBoss from './pages/BioReproductionBoss';

import HeredityEvolutionLesson from './pages/HeredityEvolutionLesson';
import TraitMatching from './pages/TraitMatching';
import PunnettSquarePuzzle from './pages/PunnettSquarePuzzle';
import GeneticsQuiz from './pages/GeneticsQuiz';
import VariationPuzzle from './pages/VariationPuzzle';
import EvolutionTimeline from './pages/EvolutionTimeline';
import GeneticCrossSim from './pages/GeneticCrossSim';
import MendelCrossword from './pages/MendelCrossword';
import MendelBossChallenge from './pages/MendelBossChallenge';

import EnvironmentLesson from './pages/EnvironmentLesson';
import PollutionSorting from './pages/PollutionSorting';
import PollutionQuiz from './pages/PollutionQuiz';
import CleanEarthPuzzle from './pages/CleanEarthPuzzle';
import ReduceReuseRecycle from './pages/ReduceReuseRecycle';
import GreenCityBuilder from './pages/GreenCityBuilder';
import DragPollutionSources from './pages/DragPollutionSources';
import EnvironmentCrossword from './pages/EnvironmentCrossword';
import EcoHeroChallenge from './pages/EcoHeroChallenge';

import ResourceLesson from './pages/ResourceLesson';
import ResourceSorting from './pages/ResourceSorting';
import ResourceQuiz from './pages/ResourceQuiz';
import SustainabilityPuzzle from './pages/SustainabilityPuzzle';
import FiveRGame from './pages/FiveRGame';
import ResourcePlanner from './pages/ResourcePlanner';
import ResourceMatch from './pages/ResourceMatch';
import ResourceCrossword from './pages/ResourceCrossword';
import ResourceBoss from './pages/ResourceBoss';

// Temporary placeholder component
const AIChatPlaceholder = () => null;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-game-bg">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/world-selection" element={<WorldSelection />} />
            <Route path="/map" element={<Dashboard />} />
            <Route path="/learn/:levelId" element={<ChapterSelection />} />
            <Route path="/learn/:topicId/levels" element={<ChapterLevels />} />
            <Route path="/quiz/:topicId" element={<QuizArena />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/teacher/dashboard" element={<TeacherDashboardLive />} />
            <Route path="/teacher/quiz/:quizId/edit" element={<QuizCreator />} />
            <Route path="/teacher/live/:quizId" element={<LiveQuizHost />} />
            <Route path="/live-quiz/join" element={<LiveQuizJoin />} />
            <Route path="/live-quiz/play/:roomCode" element={<LiveQuizPlayer />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/ray-optics/:topicId" element={<RayDrawingGame />} />
            <Route path="/mirror-maze/:topicId" element={<MirrorMaze />} />
            <Route path="/refraction-tank/:topicId" element={<RefractionTank />} />
            <Route path="/lens-focus/:topicId" element={<LensFocusGame />} />
            <Route path="/ray-quiz/:topicId" element={<RayQuiz />} />
            <Route path="/ray-labeling/:topicId" element={<RayLabelingGame />} />
            <Route path="/image-puzzle/:topicId" element={<ImageFormationPuzzle />} />
            <Route path="/light-boss/:topicId" element={<LightBossLevel />} />
            <Route path="/eye-labeling/:topicId" element={<EyeLabeling />} />
            <Route path="/eye-focus/:topicId" element={<FocusAdjuster />} />
            <Route path="/defect-finder/:topicId" element={<DefectFinder />} />
            <Route path="/lens-matching/:topicId" element={<LensMatching />} />
            <Route path="/vision-test/:topicId" element={<VisionQuiz />} />
            <Route path="/retina-puzzle/:topicId" element={<RetinaPuzzle />} />
            <Route path="/color-vision/:topicId" element={<ColorVision />} />
            <Route path="/eye-boss/:topicId" element={<EyeBossBattle />} />
            <Route path="/circuit-builder/:topicId" element={<CircuitBuilder />} />
            <Route path="/ohms-law/:topicId" element={<OhmsLawPuzzle />} />
            <Route path="/vi-matching/:topicId" element={<VIMatching />} />
            <Route path="/resistance-maze/:topicId" element={<ResistanceMaze />} />
            <Route path="/circuit-quiz/:topicId" element={<CircuitQuiz />} />
            <Route path="/circuit-symbols/:topicId" element={<CircuitSymbolsGame />} />
            <Route path="/power-puzzle/:topicId" element={<PowerPuzzle />} />
            <Route path="/electricity-boss/:topicId" element={<ElectricityBossLevel />} />
            <Route path="/magnetism-lesson/:topicId" element={<MagnetismLesson />} />
            <Route path="/magnet-painter/:topicId" element={<MagneticFieldPainter />} />
            <Route path="/thumb-race/:topicId" element={<RightHandThumbRace />} />
            <Route path="/solenoid-builder/:topicId" element={<SolenoidSupercharger />} />
            <Route path="/fleming-duel/:topicId" element={<FlemingForceDuel />} />
            <Route path="/motor-assembly/:topicId" element={<MotorAssembly />} />
            <Route path="/emi-explorer/:topicId" element={<EMIExplorer />} />
            <Route path="/generator-sim/:topicId" element={<GeneratorSim />} />
            <Route path="/magnet-boss/:topicId" element={<MagnetBoss />} />
            <Route path="/pole-matching/:topicId" element={<PoleMatchingGame />} />
            <Route path="/compass-puzzle/:topicId" element={<CompassPuzzle />} />
            <Route path="/earth-magnetism/:topicId" element={<EarthMagnetism />} />
            <Route path="/magnet-symbols/:topicId" element={<MagnetSymbols />} />
            <Route path="/magnetic-effect-puzzle/:topicId" element={<MagneticEffectPuzzle />} />
            <Route path="/magnet-battle/:topicId" element={<MagnetBattleQuiz />} />
            <Route path="/energy-lesson/:topicId" element={<EnergyLesson />} />
            <Route path="/energy-sorting/:topicId" element={<EnergySorting />} />
            <Route path="/energy-quiz/:topicId" element={<EnergyQuiz />} />
            <Route path="/power-plant-builder/:topicId" element={<PowerPlantBuilder />} />
            <Route path="/energy-saver/:topicId" element={<EnergySaver />} />
            <Route path="/carbon-footprint/:topicId" element={<CarbonFootprint />} />
            <Route path="/energy-flow/:topicId" element={<EnergyFlow />} />
            <Route path="/energy-crossword/:topicId" element={<EnergyCrossword />} />
            <Route path="/city-energy-planner/:topicId" element={<CityEnergyPlanner />} />
            <Route path="/chemistry-lesson/:topicId" element={<ChemistryLesson />} />
            <Route path="/equation-balancer/:topicId" element={<EquationBalancer />} />
            <Route path="/reaction-matcher/:topicId" element={<ReactionMatcher />} />
            <Route path="/symbol-converter/:topicId" element={<SymbolConverter />} />
            <Route path="/reaction-puzzle/:topicId" element={<ReactionPuzzle />} />
            <Route path="/chemistry-quiz/:topicId" element={<ChemistryQuiz />} />
            <Route path="/lab-safety/:topicId" element={<LabSafetyGame />} />
            <Route path="/reaction-flowchart/:topicId" element={<ReactionFlowchart />} />
            <Route path="/professor-chem-lab/:topicId" element={<ProfessorChemLabs />} />
            <Route path="/acids-bases-lesson/:topicId" element={<AcidsBasesLesson />} />
            <Route path="/ph-slider/:topicId" element={<PhScaleSlider />} />
            <Route path="/acid-base-sorting/:topicId" element={<AcidBaseSorting />} />
            <Route path="/indicator-match/:topicId" element={<IndicatorMatch />} />
            <Route path="/household-quiz/:topicId" element={<HouseholdQuiz />} />
            <Route path="/neutralization-puzzle/:topicId" element={<NeutralizationPuzzle />} />
            <Route path="/ph-labeling/:topicId" element={<PhLabeling />} />
            <Route path="/salt-formation/:topicId" element={<SaltFormation />} />
            <Route path="/acid-boss-lab/:topicId" element={<ProfessorAcidusLab />} />
            <Route path="/metals-lesson/:topicId" element={<MetalsLesson />} />
            <Route path="/metal-sorting/:topicId" element={<MetalSorting />} />
            <Route path="/reactivity-series/:topicId" element={<ReactivitySeries />} />
            <Route path="/corrosion-game/:topicId" element={<CorrosionGame />} />
            <Route path="/ore-quiz/:topicId" element={<OreQuiz />} />
            <Route path="/property-match/:topicId" element={<PropertyMatch />} />
            <Route path="/periodic-drag/:topicId" element={<PeriodicDrag />} />
            <Route path="/uses-puzzle/:topicId" element={<UsesPuzzle />} />
            <Route path="/metal-boss/:topicId" element={<DrMetallusBoss />} />

            {/* Acids Bases Lesson Route */}
            <Route path="/acids-lesson/:topicId" element={<AcidsBasesLesson />} />

            {/* Carbon and its Compounds Routes */}
            <Route path="/carbon-lesson/:topicId" element={<CarbonLesson />} />
            <Route path="/atom-builder/:topicId" element={<AtomBuilder />} />
            <Route path="/bond-matching/:topicId" element={<BondTypeMatch />} />
            <Route path="/organic-puzzle/:topicId" element={<OrganicPuzzle />} />
            <Route path="/hydrocarbon-sorting/:topicId" element={<HydrocarbonSorting />} />
            <Route path="/functional-group-quiz/:topicId" element={<FunctionalGroupQuiz />} />
            <Route path="/molecule-structure/:topicId" element={<MoleculeStructure />} />
            <Route path="/organic-naming/:topicId" element={<OrganicNaming />} />
            <Route path="/carbon-boss/:topicId" element={<ProfessorCarboniusBoss />} />

            {/* Periodic Classification of Elements Routes */}
            <Route path="/periodic-lesson/:topicId" element={<PeriodicLesson />} />
            <Route path="/element-treasure/:topicId" element={<ElementTreasureHunt />} />
            <Route path="/symbol-matching/:topicId" element={<SymbolMatching />} />
            <Route path="/period-group-puzzle/:topicId" element={<PeriodGroupPuzzle />} />
            <Route path="/element-property-quiz/:topicId" element={<ElementPropertyQuiz />} />
            <Route path="/periodic-crossword/:topicId" element={<PeriodicCrossword />} />
            <Route path="/drag-table-blocks/:topicId" element={<DragTableBlocks />} />
            <Route path="/element-uses-game/:topicId" element={<ElementUsesGame />} />
            <Route path="/mendeleev-boss/:topicId" element={<MendeleevBoss />} />

            {/* Life Processes Routes */}
            <Route path="/life-processes-lesson/:topicId" element={<LifeProcessesLesson />} />
            <Route path="/organ-label/:topicId" element={<OrganLabelPuzzle />} />
            <Route path="/digestion-flow/:topicId" element={<DigestionFlow />} />
            <Route path="/respiration-path/:topicId" element={<RespirationPath />} />
            <Route path="/circulation-puzzle/:topicId" element={<CirculationPuzzle />} />
            <Route path="/excretion-quiz/:topicId" element={<ExcretionQuiz />} />
            <Route path="/process-organ-match/:topicId" element={<ProcessOrganMatch />} />
            <Route path="/life-process-crossword/:topicId" element={<LifeProcessCrossword />} />
            <Route path="/bio-boss/:topicId" element={<DrBioMasterBoss />} />

            {/* Control and Coordination Routes */}
            <Route path="/control-lesson/:topicId" element={<ControlCoordinationLesson />} />
            <Route path="/brain-match/:topicId" element={<BrainPartMatch />} />
            <Route path="/reflex-maze/:topicId" element={<ReflexMaze />} />
            <Route path="/hormone-match/:topicId" element={<HormoneMatch />} />
            <Route path="/nervous-quiz/:topicId" element={<NervousSystemQuiz />} />
            <Route path="/endocrine-puzzle/:topicId" element={<EndocrinePuzzle />} />
            <Route path="/control-labeling/:topicId" element={<ControlLabeling />} />
            <Route path="/coordination-crossword/:topicId" element={<CoordinationCrossword />} />
            <Route path="/neuro-boss/:topicId" element={<NeuroMasterBoss />} />

            {/* Reproduction Routes */}
            <Route path="/reproduction-lesson/:topicId" element={<ReproductionLesson />} />
            <Route path="/repro-sorting/:topicId" element={<ReproductionSorting />} />
            <Route path="/flower-labeling/:topicId" element={<FlowerLabeling />} />
            <Route path="/pollination-puzzle/:topicId" element={<PollinationPuzzle />} />
            <Route path="/repro-quiz/:topicId" element={<HumanReproductionQuiz />} />
            <Route path="/menstrual-puzzle/:topicId" element={<MenstrualCyclePuzzle />} />
            <Route path="/fertilization-steps/:topicId" element={<FertilizationSteps />} />
            <Route path="/plant-repro/:topicId" element={<PlantReproductionSim />} />
            <Route path="/repro-boss/:topicId" element={<BioReproductionBoss />} />

            {/* Heredity and Evolution Routes */}
            <Route path="/heredity-lesson/:topicId" element={<HeredityEvolutionLesson />} />
            <Route path="/trait-matching/:topicId" element={<TraitMatching />} />
            <Route path="/punnett-square/:topicId" element={<PunnettSquarePuzzle />} />
            <Route path="/genetics-quiz/:topicId" element={<GeneticsQuiz />} />
            <Route path="/variation-puzzle/:topicId" element={<VariationPuzzle />} />
            <Route path="/evolution-timeline/:topicId" element={<EvolutionTimeline />} />
            <Route path="/genetic-cross/:topicId" element={<GeneticCrossSim />} />
            <Route path="/mendel-crossword/:topicId" element={<MendelCrossword />} />
            <Route path="/mendel-boss/:topicId" element={<MendelBossChallenge />} />

            {/* Our Environment Routes */}
            <Route path="/environment-lesson/:topicId" element={<EnvironmentLesson />} />
            <Route path="/pollution-sorting/:topicId" element={<PollutionSorting />} />
            <Route path="/pollution-quiz/:topicId" element={<PollutionQuiz />} />
            <Route path="/clean-earth-puzzle/:topicId" element={<CleanEarthPuzzle />} />
            <Route path="/reduce-reuse-recycle/:topicId" element={<ReduceReuseRecycle />} />
            <Route path="/green-city-builder/:topicId" element={<GreenCityBuilder />} />
            <Route path="/drag-pollution-sources/:topicId" element={<DragPollutionSources />} />
            <Route path="/environment-crossword/:topicId" element={<EnvironmentCrossword />} />
            <Route path="/eco-hero-challenge/:topicId" element={<EcoHeroChallenge />} />

            {/* Resource Management Routes */}
            <Route path="/resource-lesson/:topicId" element={<ResourceLesson />} />
            <Route path="/resource-sorting/:topicId" element={<ResourceSorting />} />
            <Route path="/resource-quiz/:topicId" element={<ResourceQuiz />} />
            <Route path="/sustainability-puzzle/:topicId" element={<SustainabilityPuzzle />} />
            <Route path="/five-r-game/:topicId" element={<FiveRGame />} />
            <Route path="/resource-planner/:topicId" element={<ResourcePlanner />} />
            <Route path="/resource-match/:topicId" element={<ResourceMatch />} />
            <Route path="/resource-crossword/:topicId" element={<ResourceCrossword />} />
            <Route path="/resource-boss/:topicId" element={<ResourceBoss />} />
          </Routes>
          <Toaster position="top-center" />
          <AIChat />
          <BackgroundMusic />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
