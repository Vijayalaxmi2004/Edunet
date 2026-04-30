const pool = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password, role } = userData;
    const query = `
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at
    `;
    const result = await pool.query(query, [username, email, password, role || 'Member']);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT id, username, email, role, created_at FROM users';
    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = User;
