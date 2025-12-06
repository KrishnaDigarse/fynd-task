import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-100 font-sans antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
        {/* Modern Navbar */}


        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
