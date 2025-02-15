
CREATE TYPE report_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE appeal_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  reporter_id UUID NOT NULL REFERENCES profiles(user_id),
  reason TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES reports(id),
  appeal_text TEXT NOT NULL,
  status appeal_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reports" ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own reports" ON reports
  FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Users can create appeals for their reports" ON appeals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE id = report_id 
      AND reporter_id = auth.uid()
    )
  );
