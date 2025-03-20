-- Create the baby_activities table
CREATE TABLE IF NOT EXISTS baby_activities (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  details JSONB,
  notes TEXT
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_baby_activities_timestamp ON baby_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_baby_activities_type ON baby_activities(type);