-- Day 8: INSERT, UPDATE, DELETE Operations
-- This file contains examples of data modification in SQL

-- First, let's create a sample table to work with
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hire_date DATE DEFAULT CURRENT_DATE,
    salary NUMERIC(10, 2),
    department VARCHAR(50)
);

-- 1. INSERT Operations
-- Simple INSERT with all columns
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES ('John', 'Doe', 'john.doe@example.com', 50000, 'IT');

-- Multiple row INSERT
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES 
    ('Jane', 'Smith', 'jane.smith@example.com', 55000, 'HR'),
    ('Bob', 'Johnson', 'bob.johnson@example.com', 45000, 'Marketing');

-- INSERT with RETURNING clause (PostgreSQL)
INSERT INTO employees (first_name, last_name, email, salary, department)
VALUES ('Alice', 'Williams', 'alice.williams@example.com', 52000, 'IT')
RETURNING employee_id, first_name, last_name;

-- 2. UPDATE Operations
-- Simple UPDATE
UPDATE employees
SET salary = 51000
WHERE department = 'IT';

-- Multiple column UPDATE
UPDATE employees
SET 
    salary = salary * 1.1,
    department = 'Information Technology'
WHERE department = 'IT';

-- UPDATE with RETURNING (PostgreSQL)
UPDATE employees
SET salary = salary * 1.05
WHERE department = 'HR'
RETURNING employee_id, first_name, last_name, salary AS new_salary;

-- 3. DELETE Operations
-- Simple DELETE
DELETE FROM employees
WHERE department = 'Marketing';

-- DELETE with condition
DELETE FROM employees
WHERE hire_date < CURRENT_DATE - INTERVAL '90 days'
    AND department = 'Temporary';

-- DELETE with RETURNING (PostgreSQL)
DELETE FROM employees
WHERE salary < 40000
RETURNING *;

-- 4. Safe UPDATE and DELETE with subqueries
-- Update salaries based on department averages
UPDATE employees e
SET salary = (
    SELECT AVG(salary) * 1.1
    FROM employees
    WHERE department = e.department
)
WHERE employee_id IN (
    SELECT employee_id
    FROM employees
    WHERE department = 'IT'
);

-- Delete employees who haven't made any sales
DELETE FROM employees
WHERE employee_id NOT IN (
    SELECT DISTINCT employee_id
    FROM sales
    WHERE sale_date >= CURRENT_DATE - INTERVAL '1 year'
);

-- 5. Transaction Safety
-- Always use transactions for important modifications
BEGIN;

UPDATE employees
SET salary = salary * 1.1
WHERE department = 'IT';

-- Check if any salary exceeds budget
IF EXISTS (
    SELECT 1 
    FROM employees 
    WHERE salary > 100000
) THEN
    ROLLBACK;
ELSE
    COMMIT;
END IF;

-- 6. Practice Exercises

-- Exercise 1: Insert new employees
-- Add three new employees to the IT department with different salaries

-- Exercise 2: Update with conditions
-- Give a 5% raise to all employees in IT department who have been hired more than 6 months ago

-- Exercise 3: Safe Delete
-- Remove all employees from a specific department, but only if they have been transferred to a new department

-- Exercise 4: Complex Update
-- Update employee salaries based on their performance ratings from another table

-- Exercise 5: Bulk Operations
-- Insert 1000 sample employees with generated data
-- Hint: Use a loop or generated series in PostgreSQL

-- 7. Best Practices
-- 1. Always use transactions for multiple operations
-- 2. Use RETURNING clause to verify changes
-- 3. Test updates with SELECT first
-- 4. Use appropriate WHERE clauses
-- 5. Consider using LIMIT for safety
-- 6. Back up data before major changes
-- 7. Use explicit column lists in INSERT
-- 8. Validate data before modifications 