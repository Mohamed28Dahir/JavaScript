-- Day 13: Transactions & ACID Properties
-- This file demonstrates transaction management and ACID principles

/*
ACID Properties:
1. Atomicity: All operations in a transaction succeed or all fail
2. Consistency: Database remains in a valid state before and after transaction
3. Isolation: Concurrent transactions don't interfere with each other
4. Durability: Committed changes are permanent
*/

-- 1. Basic Transaction Structure
BEGIN;
    UPDATE accounts 
    SET balance = balance - 100 
    WHERE account_id = 1;
    
    UPDATE accounts 
    SET balance = balance + 100 
    WHERE account_id = 2;
COMMIT;

-- 2. Transaction with Rollback
BEGIN;
    UPDATE accounts 
    SET balance = balance - 100 
    WHERE account_id = 1;
    
    -- Check if account 2 exists
    IF NOT EXISTS (SELECT 1 FROM accounts WHERE account_id = 2) THEN
        ROLLBACK;
    ELSE
        UPDATE accounts 
        SET balance = balance + 100 
        WHERE account_id = 2;
        COMMIT;
    END IF;

-- 3. Savepoints
BEGIN;
    SAVEPOINT before_updates;
    
    UPDATE products 
    SET stock = stock - 1 
    WHERE product_id = 1;
    
    -- If stock becomes negative, rollback to savepoint
    IF EXISTS (SELECT 1 FROM products WHERE stock < 0) THEN
        ROLLBACK TO before_updates;
    END IF;
    
    COMMIT;

-- 4. Transaction Isolation Levels

-- Read Uncommitted (lowest isolation)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1;
COMMIT;

-- Read Committed (prevents dirty reads)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1;
COMMIT;

-- Repeatable Read (prevents non-repeatable reads)
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1;
    -- This will see the same data even if another transaction updates it
    SELECT * FROM accounts WHERE account_id = 1;
COMMIT;

-- Serializable (highest isolation)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1;
COMMIT;

-- 5. Common Transaction Patterns

-- Pattern 1: Fund Transfer
CREATE OR REPLACE FUNCTION transfer_funds(
    sender_id INTEGER,
    receiver_id INTEGER,
    amount NUMERIC
) RETURNS BOOLEAN AS $$
BEGIN
    -- Start transaction
    BEGIN;
        -- Check sender's balance
        IF NOT EXISTS (
            SELECT 1 
            FROM accounts 
            WHERE account_id = sender_id 
            AND balance >= amount
        ) THEN
            ROLLBACK;
            RETURN FALSE;
        END IF;
        
        -- Deduct from sender
        UPDATE accounts 
        SET balance = balance - amount 
        WHERE account_id = sender_id;
        
        -- Add to receiver
        UPDATE accounts 
        SET balance = balance + amount 
        WHERE account_id = receiver_id;
        
        COMMIT;
        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Pattern 2: Inventory Management
CREATE OR REPLACE FUNCTION process_order(
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    BEGIN;
        -- Check stock
        IF NOT EXISTS (
            SELECT 1 
            FROM products 
            WHERE product_id = product_id 
            AND stock >= quantity
        ) THEN
            ROLLBACK;
            RETURN FALSE;
        END IF;
        
        -- Update stock
        UPDATE products 
        SET stock = stock - quantity 
        WHERE product_id = product_id;
        
        -- Create order record
        INSERT INTO orders (order_id, product_id, quantity, status)
        VALUES (order_id, product_id, quantity, 'processed');
        
        COMMIT;
        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- 6. Handling Deadlocks
-- Example of deadlock prevention
CREATE OR REPLACE FUNCTION safe_transfer(
    sender_id INTEGER,
    receiver_id INTEGER,
    amount NUMERIC
) RETURNS BOOLEAN AS $$
BEGIN
    -- Always lock accounts in the same order (lower ID first)
    BEGIN;
        -- Lock rows in consistent order
        SELECT * FROM accounts 
        WHERE account_id IN (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
        FOR UPDATE;
        
        -- Perform transfer
        UPDATE accounts SET balance = balance - amount 
        WHERE account_id = sender_id;
        
        UPDATE accounts SET balance = balance + amount 
        WHERE account_id = receiver_id;
        
        COMMIT;
        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- 7. Transaction Monitoring

-- Active transactions
SELECT * FROM pg_stat_activity 
WHERE state = 'active';

-- Lock information
SELECT * FROM pg_locks;

-- Transaction duration
SELECT now() - xact_start as xact_age,
       datname, usename, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL;

-- 8. Practice Exercises

-- Exercise 1: Implement a Shopping Cart Checkout
-- Create a transaction that:
-- 1. Checks product availability
-- 2. Updates inventory
-- 3. Creates order
-- 4. Updates customer balance

-- Exercise 2: Implement Account Management
-- Create transactions for:
-- 1. Creating new accounts
-- 2. Closing accounts
-- 3. Updating account details
-- 4. Handling overdraft protection

-- Exercise 3: Implement Batch Processing
-- Create a transaction that:
-- 1. Processes multiple records
-- 2. Uses savepoints
-- 3. Handles errors appropriately
-- 4. Reports success/failure

-- 9. Best Practices
-- 1. Keep transactions short
-- 2. Avoid user input during transactions
-- 3. Handle deadlocks appropriately
-- 4. Use appropriate isolation levels
-- 5. Always include error handling
-- 6. Consider using savepoints for complex transactions
-- 7. Monitor long-running transactions
-- 8. Use connection pooling

-- 10. Testing Transaction Behavior

-- Test concurrent access
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1 FOR UPDATE;
    -- Simulate long-running transaction
    SELECT pg_sleep(10);
    UPDATE accounts SET balance = balance + 100 WHERE account_id = 1;
COMMIT;

-- Test deadlock detection
BEGIN;
    SELECT * FROM accounts WHERE account_id = 1 FOR UPDATE;
    SELECT * FROM accounts WHERE account_id = 2 FOR UPDATE;
COMMIT;

-- Test isolation levels
BEGIN;
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    SELECT * FROM accounts WHERE balance > 1000;
    -- Compare with another session's results
COMMIT;

-- 11. Cleanup (for testing purposes)
-- ROLLBACK; -- Roll back any open transactions
-- RESET work_mem; -- Reset any custom settings 