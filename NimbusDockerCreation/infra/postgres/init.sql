-- CloudLab Database Initialization
-- This script runs automatically on first Postgres boot via docker-entrypoint-initdb.d

-- -------------------------------------------------------
-- Sessions Table
-- Tracks all lab session allocations and their lifecycle
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    session_id    UUID PRIMARY KEY,
    env           VARCHAR(50) NOT NULL,
    start_time    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time      TIMESTAMPTZ,
    status        VARCHAR(20) NOT NULL DEFAULT 'active',
    container_id  VARCHAR(100),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Valid status values: active, expired, scheduled, ready

CREATE INDEX IF NOT EXISTS idx_sessions_status   ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_end_time ON sessions(end_time);
CREATE INDEX IF NOT EXISTS idx_sessions_env      ON sessions(env);
