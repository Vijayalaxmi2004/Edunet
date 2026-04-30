const pool = require('../config/database');

class Project {
  static async create(projectData) {
    const { name, description, owner_id } = projectData;
    const query = `
      INSERT INTO projects (name, description, owner_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, owner_id]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByOwnerId(owner_id) {
    const query = 'SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [owner_id]);
    return result.rows;
  }

  static async findAll() {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async update(id, updates) {
    const { name, description } = updates;
    const query = `
      UPDATE projects
      SET name = COALESCE($1, name), 
          description = COALESCE($2, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async addMember(project_id, user_id, role = 'Member') {
    const query = `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3
      RETURNING *
    `;
    const result = await pool.query(query, [project_id, user_id, role]);
    return result.rows[0];
  }

  static async removeMember(project_id, user_id) {
    const query = 'DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [project_id, user_id]);
    return result.rows[0];
  }

  static async getMembers(project_id) {
    const query = `
      SELECT u.id, u.username, u.email, pm.role
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `;
    const result = await pool.query(query, [project_id]);
    return result.rows;
  }
}

module.exports = Project;
