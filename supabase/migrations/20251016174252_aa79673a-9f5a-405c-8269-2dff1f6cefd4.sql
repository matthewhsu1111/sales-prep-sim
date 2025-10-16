-- Add speech metrics column to interview_sessions table
ALTER TABLE interview_sessions 
ADD COLUMN IF NOT EXISTS speech_metrics JSONB DEFAULT '{}'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN interview_sessions.speech_metrics IS 'Stores real-time speech analysis data including WPM, filler words, confidence scores, and trends';
