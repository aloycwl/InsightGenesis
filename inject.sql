CREATE TABLE api_logs (
  id BIGSERIAL PRIMARY KEY,
  key_id BIGINT REFERENCES keys(id) ON DELETE SET NULL,
  ip TEXT,
  endpoint TEXT,
  timestamp TIMESTAMPTZ DEFAULT now(),
  status_code INTEGER
);

CREATE INDEX idx_api_logs_key_id ON api_logs(key_id);
CREATE INDEX idx_api_logs_timestamp ON api_logs(timestamp DESC);
