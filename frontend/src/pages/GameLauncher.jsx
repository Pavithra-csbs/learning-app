import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PuzzleGame from './PuzzleGame';
import SimulationGame from './SimulationGame';
import BuilderGame from './BuilderGame';
import RayOpticsGame from './RayOpticsGame';
import GameFeedback from '../components/GameFeedback';
import '../components/GameFeedback.css';

const GameLauncher = () => {
    const { topicId } = useParams();
    const [searchParams] = useSearchParams();
    const chapterName = searchParams.get('chapterName');
    const topicTitle = searchParams.get('topic');
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [gameConfig, setGameConfig] = useState(null);
    const [feedback, setFeedback] = useState({ open: false, score: 0, stars: 0, xp: 0, levelUp: false });
    const [showHint, setShowHint] = useState(false);
    const [hintText, setHintText] = useState('');
    const [loadingHint, setLoadingHint] = useState(false);

    const getAIHint = async () => {
        setLoadingHint(true);
        try {
            const res = await axios.post('/api/generate-hint', {
                topic: topicTitle,
                chapter: chapterName,
                game_goal: gameConfig.goal
            });
            setHintText(res.data.hint);
            setShowHint(true);
        } catch (err) {
            setHintText("Focus on the core scientific principles! You've got this.");
            setShowHint(true);
        } finally {
            setLoadingHint(false);
        }
    };

    const fetchGameConfig = async () => {
        try {
            const subject = localStorage.getItem('selectedWorld') === 'math' ? 'Math' : 'Science';
            const res = await axios.post('/api/get-game-config', {
                subject,
                chapter: chapterName,
                topic: topicTitle,
                standard: user?.student_profile?.standard || user?.standard || "10",
                level: searchParams.get('level') || 1
            });
            setGameConfig(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMissionComplete = async (results) => {
        console.log("Mission Results:", results);
        try {
            const res = await axios.post('/student/complete-mission', {
                score: results.score || 10,
                stars: results.stars || 3
            });
            setFeedback({
                open: true,
                score: results.score || 10,
                stars: res.data.stars_earned,
                xp: res.data.xp_earned,
                levelUp: res.data.level_up
            });
        } catch (err) {
            console.error("Error saving mission results:", err);
            setFeedback({ open: true, score: 10, stars: 3, xp: 100, levelUp: false });
        }
    };

    const handleContinue = () => {
        setFeedback({ ...feedback, open: false });
        navigate('/map');
    };

    useEffect(() => {
        if (token) fetchGameConfig();
    }, [token, topicId]);

    if (loading) return (
        <div style={{ background: '#0d1117', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} style={{ fontSize: '3rem' }}>🎮</motion.div>
            <h2>Loading Interactive Mission...</h2>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
                style={{ marginTop: '1rem', color: '#aaa' }}
            >
                (Generating a unique mission for this topic... please wait!)
            </motion.p>
        </div>
    );

    if (!gameConfig) return (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '20vh' }}>
            <h2>Mission failed to load. 🛑</h2>
            <p>Please check the console for details.</p>
            <button onClick={() => navigate(-1)} style={{ padding: '1rem', marginTop: '1rem' }}>Return to Base</button>
        </div>
    );

    // Route to specialized components based on type
    const renderGame = () => {
        switch (gameConfig.type) {
            case 'puzzle':
            case 'drag-drop':
            case 'sort':
                return <PuzzleGame config={gameConfig} onComplete={handleMissionComplete} />;
            case 'simulation':
                return <SimulationGame config={gameConfig} onComplete={handleMissionComplete} />;
            case 'builder':
                return <BuilderGame config={gameConfig} onComplete={handleMissionComplete} />;
            case 'ray-optics':
                return <RayOpticsGame config={gameConfig} onComplete={handleMissionComplete} />;
            default:
                return <div style={{ color: 'white' }}>Unsupported Game Type: {gameConfig.type}</div>;
        }
    };

    return (
        <div className="game-launcher-page">
            <div className="game-header">
                <button onClick={() => navigate(-1)} className="back-btn">⬅️ Exit Mission</button>
                <div className="game-title-area">
                    <h2>{gameConfig.title}</h2>
                    <p>{gameConfig.goal}</p>
                </div>
                <div className="game-stats">
                    <span>⭐ {user?.student_profile?.total_stars}</span>
                </div>
            </div>

            <div className="game-container">
                {renderGame()}
            </div>

            <GameFeedback
                isOpen={feedback.open}
                score={feedback.score}
                stars={feedback.stars}
                xp={feedback.xp}
                levelUp={feedback.levelUp}
                onAction={handleContinue}
            />

            {/* AI Mentor Bubble */}
            <div className="ai-mentor-container">
                <AnimatePresence>
                    {showHint && (
                        <motion.div
                            className="ai-hint-bubble"
                            initial={{ scale: 0, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0, opacity: 0, y: 20 }}
                        >
                            <p>{hintText}</p>
                            <button onClick={() => setShowHint(false)}>Understood!</button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    className={`ai-mentor-btn ${loadingHint ? 'loading' : ''}`}
                    onClick={getAIHint}
                    disabled={loadingHint}
                >
                    {loadingHint ? '🤔' : '💡 HINT'}
                </button>
            </div>
        </div>
    );
};


export default GameLauncher;
