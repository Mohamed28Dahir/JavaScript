-- Day 11: Indexes & Performance
-- This file demonstrates various indexing strategies and performance optimization techniques

-- 1. Creating Sample Tables and Data
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- 2. Basic Index Types
-- Single Column Index
CREATE INDEX idx_posts_user_id ON posts(user_id);

-- Multi-Column Index
CREATE INDEX idx_posts_user_status ON posts(user_id, status);

-- Unique Index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Partial Index
CREATE INDEX idx_posts_published 
ON posts(published_at) 
WHERE status = 'published';

-- Expression Index
CREATE INDEX idx_posts_title_lower 
ON posts(LOWER(title));

-- 3. EXPLAIN ANALYZE Examples
-- Simple query analysis
EXPLAIN ANALYZE
SELECT * FROM posts WHERE user_id = 1;

-- Complex query analysis
EXPLAIN ANALYZE
SELECT u.username, COUNT(p.post_id) as post_count
FROM users u
LEFT JOIN posts p ON u.user_id = p.user_id
WHERE p.status = 'published'
GROUP BY u.username;

-- 4. Index Usage Examples
-- Using B-tree index (default)
CREATE INDEX idx_posts_created ON posts(created_at);

-- Using BRIN index (good for sequential data)
CREATE INDEX idx_posts_created_brin ON posts USING BRIN (created_at);

-- Using GiST index (good for geometric data)
CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    position POINT,
    address TEXT
);

CREATE INDEX idx_locations_position ON locations USING GIST (position);

-- 5. Performance Optimization Techniques
-- Covering Index
CREATE INDEX idx_posts_covering 
ON posts(user_id, status, created_at)
INCLUDE (title);

-- Clustered Index
CLUSTER posts USING idx_posts_created;

-- Filtered Index with Include
CREATE INDEX idx_active_users 
ON users(created_at)
INCLUDE (email)
WHERE active = true;

-- 6. Index Maintenance
-- Rebuild index
REINDEX INDEX idx_posts_user_id;

-- Analyze table statistics
ANALYZE posts;

-- 7. Common Performance Issues and Solutions

-- Problem 1: Slow COUNT queries
-- Solution: Maintain counter table
CREATE TABLE post_counts (
    user_id INTEGER PRIMARY KEY,
    total_posts INTEGER DEFAULT 0
);

-- Problem 2: Full table scans
-- Solution: Add appropriate indexes
CREATE INDEX idx_posts_status_created 
ON posts(status, created_at);

-- Problem 3: Slow range queries
-- Solution: Use BRIN index for large tables with sequential data
CREATE INDEX idx_logs_timestamp_brin 
ON logs USING BRIN (timestamp);

-- 8. Monitoring Index Usage
SELECT 
    schemaname || '.' || relname as table,
    indexrelname as index,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes;

-- 9. Practice Exercises

-- Exercise 1: Analyze Query Performance
-- Write queries to test different index types
-- Compare performance with EXPLAIN ANALYZE

-- Exercise 2: Optimize Slow Queries
-- Identify slow queries in your application
-- Create appropriate indexes to improve performance

-- Exercise 3: Index Strategy
-- Design an indexing strategy for a social media application
-- Consider different query patterns and data access patterns

-- 10. Best Practices
-- 1. Don't over-index (indexes take space and slow down writes)
-- 2. Consider the workload (read-heavy vs write-heavy)
-- 3. Monitor index usage
-- 4. Use appropriate index types
-- 5. Regular maintenance (ANALYZE, REINDEX)
-- 6. Consider partial indexes for large tables
-- 7. Use covering indexes for frequent queries
-- 8. Remove unused indexes

-- 11. Performance Testing Scenarios

-- Scenario 1: Finding unused indexes
SELECT 
    schemaname || '.' || relname as table,
    indexrelname as index,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND pg_relation_size(indexrelid) > 1024 * 1024;

-- Scenario 2: Table bloat check
SELECT 
    schemaname || '.' || tablename as table,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) as total_size,
    pg_size_pretty(pg_table_size(schemaname || '.' || tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) as index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');

-- Scenario 3: Index hit ratio
SELECT 
    relname as table,
    100 * idx_scan / (seq_scan + idx_scan) as index_use_ratio
FROM pg_stat_user_tables
WHERE seq_scan + idx_scan > 0
ORDER BY index_use_ratio DESC;

-- 12. Common Query Patterns and Recommended Indexes

-- Pattern 1: Latest items
CREATE INDEX idx_posts_latest 
ON posts(status, created_at DESC);

-- Pattern 2: Full text search
CREATE INDEX idx_posts_content_gin 
ON posts USING GIN (to_tsvector('english', content));

-- Pattern 3: Range queries with filtering
CREATE INDEX idx_posts_composite 
ON posts(status, user_id, created_at);

-- 13. Cleanup (for testing purposes)
-- DROP INDEX IF EXISTS idx_posts_user_id;
-- DROP INDEX IF EXISTS idx_posts_user_status;
-- DROP INDEX IF EXISTS idx_users_email;
-- DROP INDEX IF EXISTS idx_posts_published;
-- DROP INDEX IF EXISTS idx_posts_title_lower; 