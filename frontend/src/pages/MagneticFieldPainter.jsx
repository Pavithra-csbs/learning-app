import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import canvasConfetti from 'canvas-confetti';
import './MagneticFieldPainter.css';

const MagneticFieldPainter = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState([]);
    const [tracedLines, setTracedLines] = useState(0);
    const [gameState, setGameState] = useState('playing'); // playing, victory
    const [feedback, setFeedback] = useState("Trace the field lines from North to South!");

    const TARGET_LINES = 6;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setIsDrawing(true);
        setPoints([{ x, y }]);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const lastPoint = points[points.length - 1];
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setPoints([...points, { x, y }]);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        checkTrace();
    };

    const checkTrace = () => {
        // Simple logic: if the path starts near N and ends near S, it's a valid field line
        if (points.length < 10) return;

        const start = points[0];
        const end = points[points.length - 1];

        // North pole is roughly at x=250, y=300 (relative to canvas)
        // South pole is roughly at x=550, y=300
        const nearN = start.x > 200 && start.x < 300 && start.y > 250 && start.y < 350;
        const nearS = end.x > 500 && end.x < 600 && end.y > 250 && end.y < 350;

        if (nearN && nearS) {
            setTracedLines(prev => {
                const newCount = prev + 1;
                if (newCount >= TARGET_LINES) {
                    setGameState('victory');
                    canvasConfetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
                return newCount;
            });
            setFeedback("Excellent! A field line revealed! ✨");
            setTimeout(() => setFeedback("Trace the next one!"), 2000);
        } else {
            setFeedback("Try tracing from the RED (North) to BLUE (South) pole.");
        }
        setPoints([]);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTracedLines(0);
        setFeedback("Canvas cleared. Start again!");
    };

    return (
        <div className="painter-container">
            <header className="painter-header">
                <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="back-btn">⬅️ MAP</button>
                <div className="title-area">
                    <h1>MAGNETIC FIELD PAINTER</h1>
                    <div className="line-counter">LINES REVEALED: {tracedLines}/{TARGET_LINES}</div>
                </div>
                <button onClick={clearCanvas} className="clear-btn">RESET</button>
            </header>

            <main className="painter-arena">
                <div className="feedback-badge">{feedback}</div>
                <div className="canvas-wrapper">
                    <canvas
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                    />
                    <div className="bar-magnet">
                        <div className="pole north">N</div>
                        <div className="pole south">S</div>
                    </div>
                    {/* Faint Guide Lines */}
                    <svg className="guide-lines" viewBox="0 0 800 600">
                        <path d="M 250 300 Q 400 100 550 300" className="guide" />
                        <path d="M 250 300 Q 400 500 550 300" className="guide" />
                        <path d="M 250 300 Q 400 50 550 300" className="guide" />
                        <path d="M 250 300 Q 400 550 550 300" className="guide" />
                        <path d="M 250 300 Q 400 150 550 300" className="guide" />
                        <path d="M 250 300 Q 400 450 550 300" className="guide" />
                    </svg>
                </div>
            </main>

            <AnimatePresence>
                {gameState === 'victory' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="victory-overlay">
                        <div className="victory-card">
                            <div className="win-icon">🎨</div>
                            <h2>Hurray 🎉 Woohoo!</h2>
                            <h1>You are an Electricity Champion!</h1>
                            <p>You've visualized the invisible world of magnetism perfectly!</p>
                            <div className="stars">⭐⭐⭐</div>
                            <button onClick={() => navigate(`/learn/${topicId}/levels?chapterName=Magnetic Effects of Electric Current`)} className="finish-btn">NEXT MISSION</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MagneticFieldPainter;
