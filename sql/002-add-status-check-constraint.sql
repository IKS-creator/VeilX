-- VeilX: Phase 7 — Add CHECK constraint on users.status
-- Run on existing databases that already have 001-create-tables applied

ALTER TABLE users
  ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'disabled'));
