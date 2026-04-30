import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await taskAPI.getDashboard();
      setStats(response.data.stats);
      setMyTasks(response.data.myTasks);
      setOverdueTasks(response.data.overdueTasks);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p className="welcome">Welcome, {user?.username}!</p>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card">
            <h3>{stats.completedTasks}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card">
            <h3>{stats.inProgressTasks}</h3>
            <p>In Progress</p>
          </div>
          <div className="stat-card">
            <h3>{stats.pendingTasks}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{stats.overdueTasks}</h3>
            <p>Overdue</p>
          </div>
          <div className="stat-card">
            <h3>{stats.totalProjects}</h3>
            <p>Projects</p>
          </div>
        </div>
      )}

      <div className="tasks-section">
        <h2>My Tasks</h2>
        {myTasks.length > 0 ? (
          <ul className="task-list">
            {myTasks.map((task) => (
              <li key={task.id} className={`task-item ${task.status}`}>
                <div className="task-title">{task.title}</div>
                <div className="task-meta">
                  <span className={`status ${task.status}`}>{task.status}</span>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks assigned to you</p>
        )}
      </div>

      {overdueTasks.length > 0 && (
        <div className="tasks-section">
          <h2>Overdue Tasks</h2>
          <ul className="task-list">
            {overdueTasks.map((task) => (
              <li key={task.id} className="task-item overdue">
                <div className="task-title">{task.title}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
