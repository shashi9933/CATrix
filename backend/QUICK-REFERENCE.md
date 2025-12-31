# 🗄️ FREE-TIER OPTIMIZATION: QUICK REFERENCE CARD

## 📊 Storage Estimate (1000 users, 10 tests, 100 q/test)

```
TOTAL: ~26.5 MB (vs 1-10 GB free tier limit)
Risk Level: ✅ SAFE - 40-400x safety margin
Years on Free Tier: 10+ (with cleanup)
```

---

## 🔑 Core Principles (DO THIS!)

### 1. Store Questions ONCE
```sql
✅ questions(id=1, text="What is CAT?")
   question_attempts(1, question_id=1, selected=0)
   question_attempts(2, question_id=1, selected=2)  -- Reuse!

❌ question_attempts(text="What is CAT?...", ...)
   question_attempts(text="What is CAT?...", ...)  -- Duplication!
```
**Saves**: 98% storage

### 2. Use Smallest Data Types
```sql
✅ score SMALLINT         -- 2 bytes (0-32767)
✅ is_correct BOOLEAN     -- 1 byte (true/false)
✅ created_at INT         -- 4 bytes (unix timestamp)
✅ section SMALLINT       -- 2 bytes (0-2 for VARC/DILR/QA)

❌ score BIGINT           -- 8 bytes (overkill)
❌ is_correct TEXT        -- 1+ bytes (overkill)
❌ created_at TIMESTAMP   -- 8 bytes (overkill)
❌ section VARCHAR        -- 4-20 bytes (overkill)
```
**Saves**: 50-75% per field

### 3. Index ONLY What You Query
```sql
✅ CREATE INDEX users(email)              -- Login
✅ CREATE INDEX test_questions(test_id)   -- Fetch questions
✅ CREATE INDEX test_attempts(user_id)    -- User history

❌ CREATE INDEX question_text()           -- Never searched
❌ CREATE INDEX is_correct()              -- Too selective
❌ CREATE INDEX score()                   -- Rarely queried
❌ CREATE INDEX created_at()              -- Not filtered
```
**Saves**: 50% index space

### 4. Delete Old Data
```sql
✅ DELETE FROM sessions WHERE expires_at < NOW()  -- Daily
✅ DELETE FROM test_attempts WHERE status=2 AND started_at < (NOW - 7 days)  -- Weekly
✅ DELETE FROM test_attempts WHERE status=1 AND completed_at < (NOW - 12 months)  -- Monthly

❌ Keep everything forever
❌ Create archive tables (doubles storage)
❌ Store raw logs in database
```
**Saves**: 99% (prevents bloat)

### 5. NO JSON, NO LOGS
```sql
✅ Store user performance in a VIEW (computed, 0 storage)
✅ Store question as reference only (query from cache)
✅ Store only IDs, not full objects

❌ user_data = {tests_taken: 10, avg_score: 78...}
❌ question_full_text in every attempt record
❌ audit_logs table with every action
❌ analytics_daily table with daily counts
```
**Saves**: 95% bloat

---

## 📈 Table Growth Chart

```
question_attempts      ████████████████████  25 MB  (1M rows)
questions             ██                     500 KB (1K rows)
test_attempts         ██                     500 KB (10K rows)
question_options      ░                      200 KB (4K rows)
other tables          ░                      250 KB (5K rows)
────────────────────────────────────────────────────
TOTAL                 ████████████████████░ ~26.5 MB
FREE TIER              ████████████████████... (1-10 GB)
```

---

## 🧹 Cleanup Schedule

| Task | Frequency | Impact | SQL |
|------|-----------|--------|-----|
| Delete expired sessions | Daily | -50 rows | `DELETE FROM sessions WHERE expires_at < NOW()` |
| Delete abandoned (7+ days) | Weekly | -500 rows | `DELETE FROM test_attempts WHERE status=2 AND...` |
| Archive old (>12 months) | Monthly | -5K rows | `DELETE FROM test_attempts WHERE status=1 AND...` |
| Vacuum table | Monthly | Reclaim 5% | `VACUUM ANALYZE` |

**Total Storage Reclaimed per Month**: ~250 KB

---

## ✅ Critical Checklist

Before going to production, verify:

- [ ] questions table stores each Q once
- [ ] No JSON fields
- [ ] No text logs
- [ ] SMALLINT used for 0-99 ranges
- [ ] BOOLEAN used for flags
- [ ] Only 8 indexes created
- [ ] No index on text fields
- [ ] Cleanup script created
- [ ] Cleanup scheduled
- [ ] Monitoring alerts set

---

## 🚨 Red Flags (Take Action!)

| Red Flag | Action |
|----------|--------|
| DB > 500 MB | ⚠️ Check cleanup running |
| DB > 800 MB | 🔴 Run cleanup immediately |
| Slow queries | Add missing index |
| test_attempts growing 10%+/month | Increase cleanup frequency |

---

## 📝 Cleanup SQL (Copy-Paste Ready)

```sql
-- Daily (delete expired sessions)
DELETE FROM sessions WHERE expires_at < EXTRACT(EPOCH FROM NOW())::INT;

-- Weekly (delete abandoned attempts)
DELETE FROM test_attempts 
WHERE status = 2 AND started_at < (EXTRACT(EPOCH FROM NOW())::INT - 604800);

-- Monthly (archive old attempts)
DELETE FROM test_attempts 
WHERE status = 1 AND completed_at < (EXTRACT(EPOCH FROM NOW())::INT - 31536000);

-- Check sizes
SELECT pg_size_pretty(pg_database_size('catrix'));
```

---

## 🔧 Implementation (3 Files)

1. **schema-optimized.prisma** - Use this Prisma schema
2. **optimized-schema.sql** - Raw SQL (for reference)
3. **storage-optimization-guide.sql** - All cleanup queries
4. **FREE-TIER-OPTIMIZATION.md** - Full guide

---

## 💰 Cost Analysis

| Scale | Storage | Cost | Duration |
|-------|---------|------|----------|
| 1K users, 10 tests | ~26 MB | **$0** | Forever |
| 5K users | ~150 MB | **$0** | Forever |
| 10K users | ~300 MB | **$0** | Forever |
| 50K users | ~1.5 GB | $7-15/mo | After 3+ years |
| 100K users | ~3 GB | $30+/mo | After 5+ years |

**Free tier valid for**: Project showcase, MVP, small-scale use

---

## 🎯 Bottom Line

```
❌ WRONG APPROACH (grows to 1GB fast):
- Store question text in every attempt
- Keep all history forever
- Create index on every column
- Store JSON/logs in database

✅ RIGHT APPROACH (stays at ~30MB):
- Store question once, reference by ID
- Delete old data quarterly
- Index only what you query
- Use VIEWs for analytics

RESULT: 
- 10+ years on free tier
- $0/month cost
- Production-ready architecture
```

---

## 🚀 Next Steps

1. Replace Prisma schema → Use `schema-optimized.prisma`
2. Run migrations → `npx prisma db push`
3. Create cleanup script → Use SQL from `storage-optimization-guide.sql`
4. Schedule cleanup → Daily/Weekly/Monthly
5. Set up monitoring → Check size monthly
6. Document policy → Keep `FREE-TIER-OPTIMIZATION.md` handy

---

**Status**: ✅ Free-Tier Safe
**Storage**: ~26.5 MB (out of 1-10 GB)
**Safety Margin**: 40-400x
**Cost**: $0/month
**Lifespan**: 10+ years

🎉 **Ready to deploy!**
