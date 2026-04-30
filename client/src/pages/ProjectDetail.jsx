import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI, authAPI } from '../services/api';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    priority: 'medium',
    status: 'pending',
  });
  const [memberFormData, setMemberFormData] = useState({
    user_id: '',
    role: 'Member',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
    fetchUsers();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getById(projectId);
      setProject(response.data.project);
      setMembers(response.data.members);

      const tasksResponse = await taskAPI.getProjectTasks(projectId);
      setTasks(tasksResponse.data.tasks);
    } catch (err) {
      setError('Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await taskAPI.create(projectId, taskFormData);
      setTaskFormData({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        status: 'pending',
      });
      setShowTaskForm(false);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await projectAPI.addMember(projectId, memberFormData);
      setMemberFormData({ user_id: '', role: 'Member' });
      setShowMemberForm(false);
      fetchProject();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-detail-container">
      <button className="btn-back" onClick={() => navigate('/projects')}>← Back</button>

      <div className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="project-content">
        <div className="section">
          <div className="section-header">
            <h2>Tasks</h2>
            <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
              {showTaskForm ? 'Cancel' : '+ New Task'}
            </button>
          </div>

          {showTaskForm && (
            <form className="task-form" onSubmit={handleCreateTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
              />
              <select
                value={taskFormData.assigned_to}
                onChange={(e) => setTaskFormData({ ...taskFormData, assigned_to: e.target.value })}
              >
                <option value="">Assign to...</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
              <select
                value={taskFormData.priority}
                onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit">Create Task</button>
            </form>
          )}

          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className="status">{task.status}</span>
                    <span className="priority">{task.priority}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No tasks yet</p>
            )}
          </div>
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Members</h2>
            <button className="btn-primary" onClick={() => setShowMemberForm(!showMemberForm)}>
              {showMemberForm ? 'Cancel' : '+ Add Member'}
            </button>
          </div>

          {showMemberForm && (
            <form className="member-form" onSubmit={handleAddMember}>
              <select
                value={memberFormData.user_id}
                onChange={(e) => setMemberFormData({ ...memberFormData, user_id: e.target.value })}
                required
              >
                <option value="">Select user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
              <select
                value={memberFormData.role}
                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <button type="submit">Add Member</button>
            </form>
          )}

          <div className="members-list">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="member-item">
                  <div>
                    <h4>{member.username}</h4>
                    <p>{member.email}</p>
                  </div>
                  <span className="role">{member.role}</span>
                </div>
              ))
            ) : (
              <p>No members yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
