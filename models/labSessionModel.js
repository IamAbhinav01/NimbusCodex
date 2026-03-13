const pool = require("../db/database");

async function createSession(userId, containerId, port) {

  const query = `
    INSERT INTO lab_sessions
    (user_id, container_id, port, start_time, status)
    VALUES ($1,$2,$3,NOW(),'running')
  `;

  await pool.query(query, [userId, containerId, port]);
}

module.exports = { createSession };