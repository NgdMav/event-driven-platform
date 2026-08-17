-- Программы тренировок
CREATE TABLE programs
(
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL,
    name           TEXT NOT NULL,
    goal           TEXT,
    duration_weeks INT,
    days_per_week  INT,
    status         TEXT NOT NULL DEFAULT 'DRAFT',
    source         TEXT NOT NULL DEFAULT 'RULE_BASED',
    created_at     TIMESTAMPTZ NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_programs_user_id ON programs (user_id);
CREATE INDEX idx_programs_status ON programs (status);

-- Дни тренировок
CREATE TABLE workout_days
(
    id         UUID PRIMARY KEY,
    program_id UUID NOT NULL REFERENCES programs (id) ON DELETE CASCADE,
    day_index  INT NOT NULL,
    title      TEXT,
    focus      TEXT
);

CREATE INDEX idx_workout_days_program_id ON workout_days (program_id);

-- Упражнения в дне тренировки
CREATE TABLE workout_exercises
(
    id               UUID PRIMARY KEY,
    workout_day_id   UUID NOT NULL REFERENCES workout_days (id) ON DELETE CASCADE,
    exercise_id      UUID NOT NULL,
    position         INT NOT NULL,
    sets             INT NOT NULL,
    reps_min         INT NOT NULL,
    reps_max         INT,
    rest_seconds     INT,
    target_weight_kg NUMERIC(6, 2),
    notes            TEXT
);

CREATE INDEX idx_workout_exercises_day_id ON workout_exercises (workout_day_id);

-- Тренировочные сессии
CREATE TABLE training_sessions
(
    id             UUID PRIMARY KEY,
    user_id        UUID NOT NULL,
    program_id     UUID REFERENCES programs (id),
    workout_day_id UUID REFERENCES workout_days (id),
    status         TEXT NOT NULL DEFAULT 'PLANNED',
    started_at     TIMESTAMPTZ,
    completed_at   TIMESTAMPTZ,
    notes          TEXT,
    created_at     TIMESTAMPTZ NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_training_sessions_user_id ON training_sessions (user_id);
CREATE INDEX idx_training_sessions_status ON training_sessions (status);

-- Подходы (set logs)
CREATE TABLE set_logs
(
    id                UUID PRIMARY KEY,
    session_id        UUID NOT NULL REFERENCES training_sessions (id) ON DELETE CASCADE,
    exercise_id       UUID NOT NULL,
    set_number        INT NOT NULL,
    reps              INT,
    weight_kg         NUMERIC(6, 2),
    difficulty_rating INT,
    completed         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_set_logs_session_id ON set_logs (session_id);

-- Outbox для событий
CREATE TABLE outbox_events
(
    id             UUID PRIMARY KEY,
    aggregate_type TEXT NOT NULL,
    aggregate_id   UUID NOT NULL,
    event_type     TEXT NOT NULL,
    payload        JSONB NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL,
    published_at   TIMESTAMPTZ
);

CREATE INDEX idx_outbox_events_unpublished ON outbox_events (created_at) WHERE published_at IS NULL;