CREATE TABLE recommendation_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    recommendation_type TEXT NOT NULL,
    request_payload JSONB NOT NULL,
    response_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_rec_logs_user_id ON recommendation_logs(user_id);