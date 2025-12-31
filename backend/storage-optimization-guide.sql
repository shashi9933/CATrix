-- ============================================================================
-- STORAGE OPTIMIZATION & CLEANUP QUERIES
-- ============================================================================
-- For keeping PostgreSQL database under free-tier limits
-- ============================================================================

-- ============================================================================
-- PART 1: STORAGE ESTIMATES & BREAKDOWN
-- ============================================================================

/*
SCENARIO: 1,000 users, 10 tests per user, 100 questions per test

TABLE GROWTH:
┌──────────────────────────────┬──────────────┬─────────────────┐
│ Table                        │ Rows         │ Estimated Size  │
├──────────────────────────────┼──────────────┼─────────────────┤
│ users                        │ 1,000        │ 120 KB          │
│ tests                        │ 10           │ 1 KB            │
│ questions                    │ 1,000        │ 500 KB          │
│ question_options             │ 4,000        │ 200 KB          │
│ test_questions               │ 1,000        │ 12 KB           │
│ test_attempts                │ 10,000       │ 500 KB          │
│ question_attempts            │ 1,000,000    │ 25 MB           │
│ colleges                     │ 1,000        │ 100 KB          │
│ sessions                     │ 100 (daily)  │ 10 KB           │
├──────────────────────────────┼──────────────┼─────────────────┤
│ TOTAL                        │ 1,016,010    │ ~26.5 MB        │
└──────────────────────────────┴──────────────┴─────────────────┘

GROWTH RATES (per 1000 new users):
- users:          +1000 rows     = +120 KB
- test_attempts:  +10000 rows    = +500 KB
- question_attempts: +1000000 rows = +25 MB ← FASTEST GROWING

Conclusion: At this scale, you'll stay under 100 MB for years.
Free tier usually allows 1 GB or more.

COST PER ADDITIONAL 1000 USERS:
- Storage added: ~26 MB
- Query count: Minimal (only read-heavy)
- Rows added: ~1M rows (mostly in question_attempts)
*/

-- ============================================================================
-- PART 2: CRITICAL CLEANUP QUERIES
-- ============================================================================

-- === DAILY CLEANUP (Run every 24 hours) ===

-- Delete expired sessions (older than 24 hours)
-- FREQUENCY: Daily
-- IMPACT: Removes 50-200 rows
-- RUN TIME: < 1 second
DELETE FROM sessions 
WHERE expires_at < EXTRACT(EPOCH FROM NOW())::INT;

-- === MONTHLY CLEANUP (Run monthly) ===

-- Archive abandoned test attempts after 7 days
-- (Keep completed tests, delete abandoned/incomplete ones older than 7 days)
-- FREQUENCY: Monthly
-- IMPACT: Removes 100-500 rows
-- RUN TIME: < 2 seconds
DELETE FROM test_attempts 
WHERE status = 2  -- abandoned
  AND started_at < (EXTRACT(EPOCH FROM NOW())::INT - 604800);  -- 7 days ago

-- === QUARTERLY CLEANUP (Run every 3 months) ===

-- Archive old test attempts (keep only last 12 months)
-- REASON: Users rarely need old test data for analytics
-- FREQUENCY: Quarterly
-- IMPACT: Removes 2000-10000 rows (frees ~250KB-1.25MB)
-- RUN TIME: 2-5 seconds
DELETE FROM test_attempts 
WHERE status = 1  -- completed
  AND completed_at < (EXTRACT(EPOCH FROM NOW())::INT - 31536000);  -- 365 days ago

-- Alternative: If you want to keep records, archive to separate table
-- (more complex, skip for free tier)

-- ============================================================================
-- PART 3: INDEXING STRATEGY (MINIMAL, ONLY ESSENTIAL)
-- ============================================================================

/*
INDEXES EXPLAINED:

1. users(email) - REQUIRED
   - Why: Login queries filter by email
   - Size: ~50 KB for 1000 users
   - Trade-off: Worth it (frequent queries)

2. tests(section) - OPTIONAL but recommended
   - Why: Users filter tests by section (VARC/DILR/QA)
   - Size: ~5 KB for 10 tests
   - Trade-off: Worth it (low overhead)

3. question_options(question_id) - REQUIRED
   - Why: Must fetch all 4 options for a question
   - Size: ~100 KB for 4000 options
   - Trade-off: Essential for UX

4. test_questions(test_id) - REQUIRED
   - Why: Must fetch all questions in a test
   - Size: ~30 KB for 1000 entries
   - Trade-off: Essential for test-taking

5. test_attempts(user_id) - RECOMMENDED
   - Why: Show user's test history
   - Size: ~50 KB for 10000 entries
   - Trade-off: Worth it (common query)

6. test_attempts(status) - RECOMMENDED
   - Why: Filter in-progress vs completed tests
   - Size: ~50 KB for 10000 entries
   - Trade-off: Improves query speed for active tests

7. question_attempts(attempt_id) - PRIMARY KEY
   - Why: Fetch all answers in an attempt
   - Size: Covered by PRIMARY KEY
   - Trade-off: Automatic, no additional index needed

8. sessions(expires_at) - RECOMMENDED
   - Why: Find expired sessions for cleanup
   - Size: ~5 KB for 100 sessions
   - Trade-off: Essential for cleanup efficiency

⚠️  INDEXES NOT TO CREATE:
- question_attempts(question_id) - Don't create, waste of space
- question_attempts(is_correct) - Don't create, very selective
- test_attempts(score) - Don't create, rare analytical query
- question_text - Never, you don't search by text
- Test results analytics - Never, use VIEWs instead

TOTAL INDEX OVERHEAD: ~280 KB (minimal)
*/

-- ============================================================================
-- PART 4: QUERY OPTIMIZATION EXAMPLES
-- ============================================================================

-- ❌ BAD: Full table scan, slow
SELECT * FROM question_attempts 
WHERE is_correct = TRUE;  -- No index, will scan 1M rows

-- ✅ GOOD: Use database-level aggregation (if needed)
SELECT COUNT(*) FROM question_attempts 
WHERE attempt_id = 12345 AND is_correct = TRUE;

-- ❌ BAD: Joining question_attempts to fetch text
SELECT qa.*, q.question_text FROM question_attempts qa
JOIN questions q ON qa.question_id = q.id
WHERE qa.attempt_id = 12345;  -- Could be slow with 100 questions

-- ✅ GOOD: Fetch attempt data, then fetch all question texts in one query
SELECT * FROM question_attempts WHERE attempt_id = 12345;
SELECT question_text FROM questions WHERE id IN (SELECT question_id FROM question_attempts WHERE attempt_id = 12345);

-- ✅ BEST: Batch load with application code
-- Fetch all questions used by any test in one query (cache them)
SELECT id, question_text, correct_option FROM questions;
-- (Cache in app memory, lookup by ID)

-- ❌ BAD: Aggregating on-demand
SELECT user_id, COUNT(DISTINCT test_id) FROM test_attempts GROUP BY user_id;

-- ✅ GOOD: Use VIEW (computed on read, never stored)
-- Create VIEW once, query it without storage overhead
CREATE VIEW user_performance AS
SELECT 
  u.id,
  COUNT(DISTINCT ta.test_id) AS tests_taken,
  ROUND(AVG(CASE WHEN ta.status = 1 THEN ta.score END), 1) AS avg_score
FROM users u
LEFT JOIN test_attempts ta ON u.id = ta.user_id
GROUP BY u.id;

-- ============================================================================
-- PART 5: MONITORING & SPACE ANALYSIS
-- ============================================================================

-- Check table sizes (run periodically)
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Expected output (after cleanup):
-- tablename              | size
-- ─────────────────────────────────
-- question_attempts     | 25 MB
-- questions             | 500 KB
-- test_attempts         | 500 KB
-- question_options      | 200 KB
-- colleges              | 100 KB
-- users                 | 120 KB
-- test_questions        | 12 KB
-- sessions              | 10 KB
-- tests                 | 1 KB
-- TOTAL                 | ~26.5 MB

-- Check index sizes
SELECT 
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- ============================================================================
-- PART 6: ROW COUNT TRACKING
-- ============================================================================

-- Quick row counts for monitoring
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL
SELECT 'tests', COUNT(*) FROM tests
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'test_questions', COUNT(*) FROM test_questions
UNION ALL
SELECT 'test_attempts', COUNT(*) FROM test_attempts
UNION ALL
SELECT 'question_attempts', COUNT(*) FROM question_attempts;

-- Expected output (at target scale):
-- table_name         | count
-- ──────────────────────────
-- users              | 1,000
-- tests              | 10
-- questions          | 1,000
-- test_questions     | 1,000
-- test_attempts      | 10,000
-- question_attempts  | 1,000,000

-- ============================================================================
-- PART 7: CLEANUP AUTOMATION (Optional)
-- ============================================================================

-- Create a cleanup routine (run via cron/task scheduler)
-- Pseudocode for Node.js backend:

/*
// backend/scripts/cleanup-db.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupDatabase() {
  console.log('Starting database cleanup...');
  
  // 1. Delete expired sessions (run daily)
  const deletedSessions = await prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: Math.floor(Date.now() / 1000)
      }
    }
  });
  console.log(`Deleted ${deletedSessions.count} expired sessions`);
  
  // 2. Delete abandoned attempts older than 7 days (run monthly)
  const deletedAbandoned = await prisma.testAttempt.deleteMany({
    where: {
      status: 2,  // abandoned
      startedAt: {
        lt: Math.floor(Date.now() / 1000) - 604800  // 7 days
      }
    }
  });
  console.log(`Deleted ${deletedAbandoned.count} abandoned attempts`);
  
  // 3. Delete old completed attempts older than 12 months (run quarterly)
  const deletedOld = await prisma.testAttempt.deleteMany({
    where: {
      status: 1,  // completed
      completedAt: {
        lt: Math.floor(Date.now() / 1000) - 31536000  // 365 days
      }
    }
  });
  console.log(`Deleted ${deletedOld.count} old completed attempts`);
  
  console.log('Cleanup completed');
  process.exit(0);
}

cleanupDatabase().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});

// package.json scripts:
// "cleanup": "node scripts/cleanup-db.js"
// Set to run: daily (sessions), monthly (abandoned), quarterly (old)
*/

-- ============================================================================
-- PART 8: DATA RETENTION POLICY
-- ============================================================================

/*
RETENTION POLICY RECOMMENDATIONS:

User Data (Permanent):
- Keep user accounts forever
- Size impact: Minimal

Test Structure (Permanent):
- Keep all tests, questions, options forever
- Size impact: Static (~1-2 MB)

Test Attempts:
- In-progress: Keep until user completes or 7 days pass
- Completed: Keep for 12 months
- Abandoned: Delete after 7 days
- Size impact: Prevents question_attempts from exploding

Question Attempts (Largest table):
- Automatically deleted when test_attempt deleted (CASCADE)
- No separate cleanup needed
- Size impact: Controlled by test_attempt retention

Sessions:
- Delete after 24 hours expiration
- Run daily cleanup
- Size impact: Negligible

College Data (Reference):
- Keep forever (immutable reference data)
- Size impact: Minimal

GROWTH PROJECTION:
- Year 1 (5000 users, 50,000 attempts): ~150 MB
- Year 2 (10000 users, 100,000 attempts): ~300 MB
- Year 3+ (with retention cleanup): ~400-500 MB max

Free tier usually allows 1-10 GB, so you're safe.
*/

-- ============================================================================
-- PART 9: STORAGE ALERTS & MONITORING
-- ============================================================================

-- Create a function to check database size
-- (Run weekly to alert if approaching limits)
CREATE OR REPLACE FUNCTION check_db_size()
RETURNS TABLE(current_size_mb NUMERIC, max_allowed_mb INT, percentage NUMERIC) AS $$
SELECT 
  ROUND(pg_database_size('catrix')::NUMERIC / 1024 / 1024, 2),
  1024,  -- 1 GB limit (adjust based on your free tier)
  ROUND(100.0 * pg_database_size('catrix') / (1024 * 1024 * 1024), 2)
$$ LANGUAGE SQL;

-- Check size
SELECT * FROM check_db_size();

-- Expected output:
-- current_size_mb | max_allowed_mb | percentage
-- ───────────────────────────────────────────
-- 26.5            | 1024           | 2.6

-- ============================================================================
-- PART 10: FREE-TIER SAFETY CHECKLIST
-- ============================================================================

/*
✅ CHECKLIST FOR STAYING UNDER FREE-TIER LIMITS:

Database Design:
  ☑ No JSON/array columns (use separate tables)
  ☑ No file storage in database
  ☑ No logs in database
  ☑ No audit trails in database
  ☑ No analytics aggregates stored
  ☑ Questions stored once, referenced by ID
  ☑ Proper normalization (3NF)
  ☑ Minimal indexes (only 8 essential ones)
  ☑ No redundant columns
  ☑ Unix timestamps (Int, 4 bytes) not DateTime

Data Cleanup:
  ☑ Sessions expire after 24 hours
  ☑ Abandoned attempts deleted after 7 days
  ☑ Completed attempts archived after 12 months
  ☑ Cleanup queries run daily/monthly/quarterly

Monitoring:
  ☑ Track row counts weekly
  ☑ Monitor database size monthly
  ☑ Alert if >50% of free tier used
  ☑ Test backup/restore procedures

Queries:
  ☑ Never fetch all rows without LIMIT
  ☑ Use indexes for common queries
  ☑ Batch load data in app code
  ☑ Cache frequently accessed data
  ☑ Use VIEWs for analytics (never stored)

Performance:
  ☑ Average query < 100ms
  ☑ Max query < 1 second
  ☑ Concurrent users < 50 on free tier
  ☑ Connection pooling configured

❌ WHAT NOT TO DO:
  ☒ Store images/PDFs in database
  ☒ Create audit logs for every action
  ☒ Store raw API responses as JSON
  ☒ Keep all history forever
  ☒ Over-index tables
  ☒ Use TEXT for fixed-size strings
  ☒ Store analytics calculations
  ☒ Enable row-level security logging
  ☒ Create views for every possible query
  ☒ Use JSONB for normal columns
*/

-- ============================================================================
-- STORAGE OPTIMIZATION SUMMARY
-- ============================================================================

/*
FINAL NUMBERS:

For 1,000 users / 10 tests / 100 questions/test:

Expected Storage:      ~26.5 MB
Index Overhead:        ~280 KB
Estimated Safety Margin: <100 MB
Free Tier Limit:       1-10 GB

Result:               ✅ SAFE FOR 10+ YEARS at this scale

Largest Growing Table: question_attempts
- With 100K users:   ~2.65 GB (still under free tier!)
- Cleanup every 12 months reduces size to ~500 MB

Next tier up: Upgrade to 1 CPU, 256 MB RAM, 10 GB storage = $7-10/month

RECOMMENDATION:
- Stay on free tier until 50K users
- Monitor monthly
- Use cleanup queries religiously
- Cache question data in application layer
- Archive attempts after 12 months
*/
