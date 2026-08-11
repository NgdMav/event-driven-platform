CREATE TABLE profiles
(
    user_id          UUID PRIMARY KEY,
    first_name       TEXT,
    last_name        TEXT,
    birth_date       DATE,
    sex              TEXT,
    height_cm        NUMERIC,
    weight_kg        NUMERIC,
    goal             TEXT,
    experience_level TEXT,
    activity_level   TEXT,
    timezone         TEXT,
    privacy_level    TEXT NOT NULL DEFAULT 'PRIVATE',
    created_at       TIMESTAMPTZ NOT NULL,
    updated_at       TIMESTAMPTZ NOT NULL
);

CREATE TABLE processed_events
(
    event_id     UUID PRIMARY KEY,
    event_type   TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL
);