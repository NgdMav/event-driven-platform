CREATE TABLE exercises
(
    id                        UUID PRIMARY KEY,
    name                      TEXT NOT NULL,
    slug                      TEXT NOT NULL UNIQUE,
    description               TEXT,
    technique                 TEXT,
    difficulty                TEXT NOT NULL,
    equipment                 TEXT,
    primary_muscle_group      TEXT NOT NULL,
    secondary_muscle_groups   TEXT[] DEFAULT '{}',
    video_url                 TEXT,
    thumbnail_url             TEXT,
    is_active                 BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                TIMESTAMPTZ NOT NULL,
    updated_at                TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_exercises_primary_muscle_group ON exercises (primary_muscle_group);
CREATE INDEX idx_exercises_difficulty ON exercises (difficulty);
CREATE INDEX idx_exercises_equipment ON exercises (equipment);
CREATE INDEX idx_exercises_is_active ON exercises (is_active);
CREATE INDEX idx_exercises_name ON exercises (name);