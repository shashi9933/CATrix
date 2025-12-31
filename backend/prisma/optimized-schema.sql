-- ============================================================================
-- CATrix: ULTRA-OPTIMIZED PostgreSQL Schema (Free-Tier Focused)
-- ============================================================================
-- Designed for: 1,000 users, 10 tests per user, 100 questions per test
-- Estimated storage: ~50-100MB (well within free tier)
-- ============================================================================

-- ============================================================================
-- TABLE 1: users
-- ============================================================================
-- STORAGE: ~100-120 bytes per user = ~120KB for 1000 users
CREATE TABLE users (
  id SMALLSERIAL PRIMARY KEY,  -- 0-32767 users (enough for free tier)
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash (fixed size)
  name VARCHAR(100),  -- Allow NULL for optional names
  role SMALLINT NOT NULL DEFAULT 0,  -- 0=user, 1=admin (SMALLINT instead of ENUM to save space)
  created_at INT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INT,  -- Unix timestamp (4 bytes)
  updated_at INT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INT,
  
  CONSTRAINT email_valid CHECK (email ~ '^[^@]+@[^@]+$')
);

-- Index for login (REQUIRED)
CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- TABLE 2: tests
-- ============================================================================
-- STORAGE: ~50 bytes per test = ~500 bytes for 10 tests
CREATE TABLE tests (
  id SMALLSERIAL PRIMARY KEY,  -- 0-32767 tests
  title VARCHAR(200) NOT NULL,
  section SMALLINT NOT NULL,  -- 0=VARC, 1=DILR, 2=QA (SMALLINT not TEXT)
  difficulty SMALLINT NOT NULL,  -- 0=easy, 1=medium, 2=hard
  duration_minutes SMALLINT NOT NULL DEFAULT 180,  -- 3 hours typical
  total_marks SMALLINT NOT NULL DEFAULT 100,
  created_at INT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INT,
  
  CONSTRAINT duration_valid CHECK (duration_minutes > 0 AND duration_minutes < 1000)
);

-- Minimal indexing: section/difficulty for filtering
CREATE INDEX idx_tests_section ON tests(section);

-- ============================================================================
-- TABLE 3: questions
-- ============================================================================
-- STORAGE: ~300-500 bytes per question = ~500KB for 1000 questions
-- CRITICAL: Store question ONCE, reference everywhere
CREATE TABLE questions (
  id SMALLSERIAL PRIMARY KEY,  -- 0-32767 questions
  question_text TEXT NOT NULL,
  correct_option SMALLINT NOT NULL,  -- 0-3 (4 options max)
  difficulty SMALLINT NOT NULL,  -- 0=easy, 1=medium, 2=hard
  time_limit_seconds SMALLINT DEFAULT 120,  -- Typical per question
  
  CONSTRAINT valid_option CHECK (correct_option >= 0 AND correct_option < 4)
);

-- NO INDEX on question_text (we never search by text)
-- Questions are accessed by ID, which is already optimized

-- ============================================================================
-- TABLE 4: question_options
-- ============================================================================
-- STORAGE: ~200 bytes per option = ~400KB for 4000 options (1000 questions * 4)
-- Store options separately to avoid repeating in test_questions
CREATE TABLE question_options (
  id SMALLSERIAL PRIMARY KEY,
  question_id SMALLINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_index SMALLINT NOT NULL,  -- 0-3
  option_text VARCHAR(500) NOT NULL,
  
  UNIQUE(question_id, option_index),
  CONSTRAINT valid_index CHECK (option_index >= 0 AND option_index < 4)
);

-- Minimal indexing: lookup options by question
CREATE INDEX idx_question_options_question_id ON question_options(question_id);

-- ============================================================================
-- TABLE 5: test_questions (Junction Table)
-- ============================================================================
-- STORAGE: ~12 bytes per entry = ~12KB for 1000 question-test mappings
-- NO DUPLICATION: Each test-question pair stored ONCE
CREATE TABLE test_questions (
  test_id SMALLINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question_id SMALLINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL,  -- Order within test (0-99)
  marks SMALLINT NOT NULL DEFAULT 1,  -- Can vary per test
  
  PRIMARY KEY (test_id, question_id),
  CONSTRAINT valid_position CHECK (position >= 0 AND position < 100),
  CONSTRAINT valid_marks CHECK (marks > 0 AND marks < 10)
);

-- Indexed for fetching questions in a test
CREATE INDEX idx_test_questions_test ON test_questions(test_id);

-- ============================================================================
-- TABLE 6: test_attempts (Main growth table)
-- ============================================================================
-- STORAGE: ~50 bytes per attempt = ~500KB for 10,000 attempts (1000 users * 10)
-- This is the FASTEST GROWING table
CREATE TABLE test_attempts (
  id INT PRIMARY KEY DEFAULT EXTRACT(EPOCH FROM NOW())::INT * 1000 + nextval('seq_attempt_counter')::INT,
  user_id SMALLINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id SMALLINT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  score SMALLINT,  -- NULL until completed
  time_taken_seconds INT,  -- NULL until completed
  status SMALLINT NOT NULL DEFAULT 0,  -- 0=in_progress, 1=completed, 2=abandoned
  started_at INT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INT,
  completed_at INT,  -- NULL until completed
  
  CONSTRAINT valid_status CHECK (status >= 0 AND status < 3),
  CONSTRAINT valid_score CHECK (score IS NULL OR (score >= 0 AND score <= 300))
);

-- Sequence for attempt IDs
CREATE SEQUENCE seq_attempt_counter START 1;

-- Indexes for common queries
CREATE INDEX idx_test_attempts_user ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_status ON test_attempts(status);  -- Filter in-progress
-- TTL: Delete old completed attempts after 90 days (see cleanup section)

-- ============================================================================
-- TABLE 7: question_attempts (CRITICAL: This grows FASTEST)
-- ============================================================================
-- STORAGE: ~25 bytes per answer = ~25MB for 1M answers (1000 users * 10 tests * 100 questions)
-- MOST IMPORTANT FOR SPACE OPTIMIZATION
CREATE TABLE question_attempts (
  attempt_id INT NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id SMALLINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_option SMALLINT NOT NULL,  -- 0-3, or 255 for not answered
  is_correct BOOLEAN NOT NULL,  -- Use BOOLEAN (1 byte)
  time_taken_seconds SMALLINT,  -- Seconds spent on this question
  
  PRIMARY KEY (attempt_id, question_id),
  CONSTRAINT valid_selected CHECK (selected_option >= 0 AND selected_option < 4)
);

-- Index for admin analytics (but use sparingly)
CREATE INDEX idx_question_attempts_attempt ON question_attempts(attempt_id);
-- NO other indexes: we fetch by (attempt_id, question_id) which is PRIMARY KEY

-- ============================================================================
-- TABLE 8: colleges (Optional, minimal)
-- ============================================================================
-- STORAGE: ~100 bytes per college = ~100KB for 1000 colleges
CREATE TABLE colleges (
  id SMALLSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  tier SMALLINT,  -- 0=tier1, 1=tier2, 2=tier3 (or NULL)
  cutoff_marks SMALLINT,  -- Expected cutoff
  
  CONSTRAINT valid_tier CHECK (tier IS NULL OR (tier >= 0 AND tier < 3))
);

-- No indexes: we'll fetch all colleges at once

-- ============================================================================
-- OPTIONAL TABLE 9: sessions (If needed, auto-cleanup)
-- ============================================================================
-- STORAGE: ~80 bytes per session (clean up daily)
-- Keeps sessions table MINIMAL - expires after 24 hours
CREATE TABLE sessions (
  id VARCHAR(64) PRIMARY KEY,  -- JWT token hash (if using stateful sessions)
  user_id SMALLINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INT NOT NULL,  -- Unix timestamp
  created_at INT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::INT
);

-- Index for cleanup: find expired sessions
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================================
-- VIEWS (0 storage, computed on-demand)
-- ============================================================================

-- View: User Performance Summary (no duplication, computed)
CREATE VIEW user_performance AS
SELECT 
  u.id,
  u.name,
  COUNT(DISTINCT ta.test_id) AS tests_taken,
  AVG(CASE WHEN ta.status = 1 THEN ta.score ELSE NULL END) AS avg_score,
  MAX(CASE WHEN ta.status = 1 THEN ta.score ELSE NULL END) AS best_score,
  ROUND(100.0 * SUM(CASE WHEN qa.is_correct THEN 1 ELSE 0 END) / 
        NULLIF(COUNT(qa.question_id), 0), 2) AS accuracy_percent
FROM users u
LEFT JOIN test_attempts ta ON u.id = ta.user_id AND ta.status = 1
LEFT JOIN question_attempts qa ON ta.id = qa.attempt_id
GROUP BY u.id, u.name;

-- View: Test Analysis (no duplication, computed)
CREATE VIEW test_analysis AS
SELECT 
  t.id,
  t.title,
  COUNT(DISTINCT ta.user_id) AS users_attempted,
  ROUND(AVG(CASE WHEN ta.status = 1 THEN ta.score ELSE NULL END), 2) AS avg_score,
  ROUND(AVG(CASE WHEN ta.status = 1 THEN ta.time_taken_seconds ELSE NULL END), 0) AS avg_time_seconds
FROM tests t
LEFT JOIN test_attempts ta ON t.id = ta.test_id AND ta.status = 1
GROUP BY t.id, t.title;

-- ============================================================================
-- STORAGE SUMMARY
-- ============================================================================
-- users:                    ~120 KB  (1000 users)
-- tests:                    ~5 KB   (10 tests)
-- questions:               ~500 KB  (1000 questions)
-- question_options:        ~200 KB  (4000 options)
-- test_questions:          ~12 KB   (1000 mappings)
-- test_attempts:           ~500 KB  (10,000 attempts)
-- question_attempts:       ~25 MB   (1M answers = 1000 users * 10 * 100)
-- colleges:                ~100 KB  (1000 colleges)
-- sessions:                ~10 KB   (auto-deleted)
--
-- TOTAL: ~26.5 MB (well within free tier of 1GB+)
-- ============================================================================
