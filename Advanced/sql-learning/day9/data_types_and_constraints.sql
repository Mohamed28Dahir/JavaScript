-- Day 9: Data Types & Constraints
-- This file demonstrates various SQL data types and constraints

-- 1. Common Data Types
-- Numeric Types
CREATE TABLE numeric_examples (
    -- Integers
    tiny_int SMALLINT,      -- -32768 to +32767
    regular_int INTEGER,     -- -2147483648 to +2147483647
    big_int BIGINT,         -- -9223372036854775808 to +9223372036854775807
    
    -- Decimal/Floating Point
    decimal_num DECIMAL(10,2),  -- 10 total digits, 2 after decimal
    float_num FLOAT,           -- floating point number
    money_amount MONEY,        -- currency amount
    
    -- Serial/Auto-increment
    id SERIAL                  -- auto-incrementing integer
);

-- String Types
CREATE TABLE string_examples (
    char_fixed CHAR(10),           -- Fixed-length, padded with spaces
    varchar_var VARCHAR(255),       -- Variable-length with limit
    text_unlimited TEXT,            -- Unlimited length text
    uuid_col UUID,                 -- UUID data type
    json_col JSON,                 -- JSON data
    jsonb_col JSONB               -- Binary JSON data
);

-- Date/Time Types
CREATE TABLE datetime_examples (
    date_only DATE,                -- Date only (no time)
    time_only TIME,                -- Time only (no date)
    timestamp_val TIMESTAMP,        -- Date and time
    timestamptz_val TIMESTAMPTZ,    -- Date and time with timezone
    interval_val INTERVAL          -- Time interval
);

-- Boolean Type
CREATE TABLE boolean_examples (
    is_active BOOLEAN,             -- true/false
    is_valid BOOL                  -- same as BOOLEAN
);

-- 2. Constraints
-- Primary Key and Foreign Key
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100)
);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dept_id INTEGER REFERENCES departments(dept_id),
    salary NUMERIC(10,2) CHECK (salary > 0),
    email VARCHAR(100) UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE,
    CONSTRAINT name_combination UNIQUE (first_name, last_name)
);

-- NOT NULL Constraint
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,              -- Can be NULL
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

-- UNIQUE Constraint
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- CHECK Constraint
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE DEFAULT CURRENT_DATE,
    total_amount NUMERIC(10,2) CHECK (total_amount > 0),
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    shipping_address TEXT NOT NULL,
    CONSTRAINT valid_dates CHECK (order_date <= CURRENT_DATE)
);

-- DEFAULT Values
CREATE TABLE audit_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    action_type VARCHAR(20) NOT NULL,
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    ip_address VARCHAR(45) DEFAULT '0.0.0.0'
);

-- 3. Complex Constraints
-- Composite Keys
CREATE TABLE order_items (
    order_id INTEGER REFERENCES orders(order_id),
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER CHECK (quantity > 0),
    price_at_time NUMERIC(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

-- Conditional Constraints
CREATE TABLE employees_salary_history (
    emp_id INTEGER REFERENCES employees(emp_id),
    change_date DATE DEFAULT CURRENT_DATE,
    old_salary NUMERIC(10,2),
    new_salary NUMERIC(10,2),
    PRIMARY KEY (emp_id, change_date),
    CONSTRAINT valid_salary_change CHECK (
        new_salary != old_salary AND
        new_salary > 0 AND
        (old_salary IS NULL OR new_salary != old_salary)
    )
);

-- 4. Practice Exercises

-- Exercise 1: Create a table for a library system
-- Include books, members, and loan records with appropriate constraints

-- Exercise 2: Create a table for a school grading system
-- Include students, courses, grades with valid range checks

-- Exercise 3: Create a table for an e-commerce system
-- Include products, categories, inventory with appropriate relationships

-- Exercise 4: Create a table for a blog system
-- Include posts, comments, users with proper constraints

-- 5. Best Practices
-- 1. Always specify NOT NULL for required fields
-- 2. Use appropriate data types for better performance
-- 3. Consider using ENUM types for fixed sets of values
-- 4. Use CHECK constraints to enforce business rules
-- 5. Name constraints explicitly for better maintenance
-- 6. Use appropriate index types for UNIQUE constraints
-- 7. Consider using FOREIGN KEY constraints for referential integrity
-- 8. Use DEFAULT values appropriately

-- 6. Testing Constraints
INSERT INTO departments (dept_name, location) VALUES ('IT', 'New York');
INSERT INTO employees (first_name, last_name, dept_id, salary, email)
VALUES ('John', 'Doe', 1, 50000, 'john@example.com');

-- This should fail (duplicate email)
INSERT INTO employees (first_name, last_name, dept_id, salary, email)
VALUES ('Jane', 'Smith', 1, 55000, 'john@example.com');

-- This should fail (negative salary)
INSERT INTO employees (first_name, last_name, dept_id, salary, email)
VALUES ('Bob', 'Johnson', 1, -1000, 'bob@example.com');

-- This should fail (non-existent department)
INSERT INTO employees (first_name, last_name, dept_id, salary, email)
VALUES ('Alice', 'Williams', 999, 60000, 'alice@example.com'); 