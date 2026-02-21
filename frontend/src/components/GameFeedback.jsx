import { motion, AnimatePresence } from 'framer-motion';
import './GameFeedback.css';

const GameFeedback = ({ isOpen, score, stars, xp, levelUp, onAction }) => {
    if (!isOpen) return null;

    const getMessage = () => {
        if (score >= 10) return { title: "SCIENCE MASTER! 🏆", msg: "Hurray 🎉 Woohoo! You are a Science Master!", icon: "🌟" };
        if (score >= 7) return { title: "GREAT JOB! 👍", msg: "Good job 👍 Try for full score!", icon: "👏" };
        return { title: "NICE TRY! 😊", msg: "Don’t feel bad 😊 Try again!", icon: "💪" };
    };

    const content = getMessage();

    return (
        <AnimatePresence>
            <div className="feedback-backdrop">
                <motion.div
                    className="feedback-card"
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                >
                    <div className="feedback-icon">{content.icon}</div>
                    <h2 className="feedback-title">{content.title}</h2>
                    <p className="feedback-msg">{content.msg}</p>

                    <div className="rewards-row">
                        <div className="reward-item">
                            <span className="reward-val">+{stars}</span>
                            <span className="reward-label">STARS</span>
                        </div>
                        <div className="reward-item">
                            <span className="reward-val">+{xp}</span>
                            <span className="reward-label">XP</span>
                        </div>
                    </div>

                    {levelUp && (
                        <motion.div
                            className="level-up-badge"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                        >
                            LEVEL UP! 🚀
                        </motion.div>
                    )}

                    <button className="feedback-btn" onClick={onAction}>
                        CONTINUE ADVENTURE
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GameFeedback;
