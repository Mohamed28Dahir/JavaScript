-- Day 10: CREATE & ALTER TABLE Operations
-- This file demonstrates various table creation and modification operations

-- 1. Basic Table Creation
-- Simple table with basic columns
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table with constraints
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Creation with Foreign Keys
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id) 
        REFERENCES customers(customer_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- 3. ALTER TABLE Operations
-- Add a column
ALTER TABLE customers
ADD COLUMN phone VARCHAR(20);

-- Add multiple columns
ALTER TABLE products
ADD COLUMN manufacturer VARCHAR(100),
ADD COLUMN weight NUMERIC(5,2),
ADD COLUMN dimensions VARCHAR(50);

-- Modify column data type
ALTER TABLE products
ALTER COLUMN name TYPE VARCHAR(200);

-- Change column nullability
ALTER TABLE customers
ALTER COLUMN phone SET NOT NULL;

-- Add a constraint
ALTER TABLE products
ADD CONSTRAINT positive_weight
CHECK (weight > 0);

-- Remove a constraint
ALTER TABLE products
DROP CONSTRAINT positive_weight;

-- Add a foreign key
ALTER TABLE orders
ADD CONSTRAINT fk_status
    FOREIGN KEY (status) 
    REFERENCES order_statuses(status_code);

-- 4. Complex Table Modifications
-- Add a computed column
ALTER TABLE orders
ADD COLUMN items_count INTEGER GENERATED ALWAYS AS (
    SELECT COUNT(*) FROM order_items WHERE order_items.order_id = orders.order_id
) STORED;

-- Add an index
CREATE INDEX idx_customer_email 
ON customers(email);

-- Add a partial index
CREATE INDEX idx_active_products 
ON products(name) 
WHERE stock_quantity > 0;

-- 5. Table Management
-- Rename a table
ALTER TABLE customers
RENAME TO clients;

-- Rename a column
ALTER TABLE products
RENAME COLUMN name TO product_name;

-- Change column default
ALTER TABLE products
ALTER COLUMN stock_quantity SET DEFAULT 10;

-- Drop a column
ALTER TABLE customers
DROP COLUMN phone;

-- 6. Schema Management
-- Create a schema
CREATE SCHEMA inventory;

-- Move table to new schema
ALTER TABLE products
SET SCHEMA inventory;

-- 7. Practice Exercises

-- Exercise 1: Create a complex table
CREATE TABLE employees (
    -- Add appropriate columns and constraints
    -- Include computed columns and complex checks
);

-- Exercise 2: Modify existing table
-- Add various constraints and columns to the employees table
-- Create appropriate indexes

-- Exercise 3: Create related tables
-- Create tables for departments and employee_departments
-- Set up appropriate foreign keys and constraints

-- Exercise 4: Add audit trail
-- Add created_at, updated_at, created_by, updated_by columns
-- Create triggers to maintain these columns

-- 8. Best Practices
-- 1. Use appropriate data types
-- 2. Name constraints explicitly
-- 3. Consider adding indexes for frequently queried columns
-- 4. Use schemas for better organization
-- 5. Document table changes
-- 6. Test modifications on non-production first
-- 7. Back up before major changes
-- 8. Consider impact on existing data

-- 9. Common Patterns

-- Audit Fields Pattern
CREATE TABLE audit_fields (
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(user_id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(user_id)
);

-- Soft Delete Pattern
ALTER TABLE products
ADD COLUMN deleted_at TIMESTAMP,
ADD COLUMN deleted_by INTEGER REFERENCES users(user_id);

-- Version Control Pattern
ALTER TABLE products
ADD COLUMN version INTEGER DEFAULT 1,
ADD COLUMN valid_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN valid_to TIMESTAMP;

-- 10. Testing Changes

-- Test adding columns with default values
ALTER TABLE products
ADD COLUMN rating NUMERIC(3,2) DEFAULT 0.0;

-- Test modifying columns with existing data
UPDATE products
SET rating = 5.0
WHERE rating IS NULL;

-- Test constraints
ALTER TABLE products
ADD CONSTRAINT valid_rating
CHECK (rating >= 0 AND rating <= 5.0);

-- 11. Cleanup Operations (if needed)
-- DROP TABLE IF EXISTS temporary_table;
-- DROP INDEX IF EXISTS idx_temporary;
-- DROP CONSTRAINT IF EXISTS temporary_constraint; 