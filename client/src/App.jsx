import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navigation setIsAuthenticated={setIsAuthenticated} />}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects"
            element={isAuthenticated ? <Projects /> : <Navigate to="/login" />}
          />
          <Route
            path="/projects/:projectId"
            element={isAuthenticated ? <ProjectDetail /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navigation({ setIsAuthenticated }) {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="nav-logo">TaskManager</h1>
        <ul className="nav-menu">
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/projects">Projects</a></li>
          <li className="user-menu">
            <span className="user-name">{user?.username}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default App;
