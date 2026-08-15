-- ClickHouse Ping Telemetry & Logs Migration

CREATE TABLE IF NOT EXISTS ping_telemetry (
  timestamp DateTime64(3, 'UTC'),
  monitor_id UUID,
  team_id UUID,
  status_code UInt16,
  latency_ms UInt32,
  is_up UInt8,
  error_message String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (team_id, monitor_id, timestamp);

CREATE TABLE IF NOT EXISTS app_logs (
  timestamp DateTime64(3, 'UTC'),
  service String,
  level String,
  correlation_id String,
  message String,
  meta String
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (service, timestamp);
