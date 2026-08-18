CREATE TABLE progress_snapshots
(
    id                 UUID PRIMARY KEY,
    user_id            UUID         NOT NULL,
    snapshot_date      DATE         NOT NULL,
    total_sessions     INT          NOT NULL DEFAULT 0,
    total_volume_kg    NUMERIC(12, 2) NOT NULL DEFAULT 0,
    completed_sessions INT          NOT NULL DEFAULT 0,
    avg_session_duration_minutes INT NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ  NOT NULL,
    updated_at         TIMESTAMPTZ  NOT NULL,
    UNIQUE (user_id, snapshot_date)
);

CREATE INDEX idx_progress_snapshots_user ON progress_snapshots (user_id);