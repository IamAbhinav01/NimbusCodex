setInterval(async () => {

  const expiredLabs = await pool.query(`
    SELECT * FROM lab_sessions
    WHERE start_time < NOW() - INTERVAL '1 hour'
    AND status='running'
  `);

  for (let lab of expiredLabs.rows) {

    const container = docker.getContainer(lab.container_id);

    await container.stop();
  }

}, 60000);