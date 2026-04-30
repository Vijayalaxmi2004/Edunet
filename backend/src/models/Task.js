const pool = require('../config/database');

class Task {
  static async create(taskData) {
    const { title, description, project_id, assigned_to, status, priority } = taskData;
    const query = `
      INSERT INTO tasks (title, description, project_id, assigned_to, status, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, project_id, assigned_to, status || 'pending', priority || 'medium']);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByProjectId(project_id) {
    const query = 'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [project_id]);
    return result.rows;
  }

  static async findByAssignedTo(user_id) {
    const query = 'SELECT * FROM tasks WHERE assigned_to = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [user_id]);
    return result.rows;
  }

  static async update(id, updates) {
    const { title, description, status, priority, assigned_to } = updates;
    const query = `
      UPDATE tasks
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          priority = COALESCE($4, priority),
          assigned_to = COALESCE($5, assigned_to),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;
    const result = await pool.query(query, [title, description, status, priority, assigned_to, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getOverdueTasks() {
    const query = `
      SELECT * FROM tasks
      WHERE status != 'completed' AND created_at < NOW() - INTERVAL '7 days'
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async getTaskStats(project_id) {
    const query = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM tasks
      WHERE project_id = $1
    `;
    const result = await pool.query(query, [project_id]);
    return result.rows[0];
  }
}

module.exports = Task;
