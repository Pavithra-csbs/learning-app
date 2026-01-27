import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizArena from './pages/QuizArena';
import TopicContent from './pages/TopicContent';
import Leaderboard from './pages/Leaderboard';
import TeacherDashboard from './pages/TeacherDashboard';
import { Toaster } from 'react-hot-toast'; // Need to install this, or use simple alerts

import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Puzzle from './pages/Puzzle';
import Feedback from './pages/Feedback';
import AIChat from './components/AIChat';
import WorldSelection from './pages/WorldSelection';

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
            <Route path="/learn/:topicId" element={<TopicContent />} />
            <Route path="/quiz/:topicId" element={<QuizArena />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/puzzle" element={<Puzzle />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Routes>
          <Toaster position="top-center" />
          <AIChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
