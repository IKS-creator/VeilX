-- VeilX: Phase 3 — Create tables
-- Run manually via Vercel Postgres console or psql

CREATE TABLE IF NOT EXISTS users (
  id            serial PRIMARY KEY,
  name          varchar(50) NOT NULL,
  token         varchar(16) NOT NULL,
  vless_uuid    uuid NOT NULL,
  status        varchar(10) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  traffic_up    bigint NOT NULL DEFAULT 0,
  traffic_down  bigint NOT NULL DEFAULT 0,
  last_connected_at timestamp,
  created_at    timestamp NOT NULL DEFAULT now(),
  updated_at    timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip            varchar(45) PRIMARY KEY,
  attempts      int NOT NULL DEFAULT 0,
  window_start  timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_token_idx ON users (token);
CREATE UNIQUE INDEX IF NOT EXISTS users_vless_uuid_idx ON users (vless_uuid);
