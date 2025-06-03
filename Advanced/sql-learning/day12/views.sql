-- Day 12: Views in SQL
-- This file demonstrates various types of views and their applications

-- 1. Basic Views
-- Simple View
CREATE VIEW employee_details AS
SELECT 
    employee_id,
    first_name,
    last_name,
    department,
    salary
FROM employees;

-- View with Calculations
CREATE VIEW employee_annual_costs AS
SELECT 
    employee_id,
    first_name,
    last_name,
    salary * 12 as annual_salary,
    (salary * 12 * 0.3) as benefits_cost
FROM employees;

-- 2. Complex Views
-- View with Joins
CREATE VIEW department_summary AS
SELECT 
    d.department_id,
    d.department_name,
    COUNT(e.employee_id) as employee_count,
    AVG(e.salary) as avg_salary,
    SUM(e.salary) as total_salary
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_id, d.department_name;

-- View with Subqueries
CREATE VIEW high_value_departments AS
SELECT 
    department_id,
    department_name,
    employee_count,
    total_salary
FROM department_summary
WHERE total_salary > (
    SELECT AVG(total_salary) FROM department_summary
);

-- 3. Updatable Views
-- Simple Updatable View
CREATE VIEW active_employees AS
SELECT employee_id, first_name, last_name, department_id, salary
FROM employees
WHERE status = 'active'
WITH CHECK OPTION;

-- View with Instead Of Trigger
CREATE VIEW employee_locations AS
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    l.city,
    l.country
FROM employees e
JOIN locations l ON e.location_id = l.location_id;

CREATE OR REPLACE FUNCTION update_employee_location()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the location_id in the employees table
    UPDATE employees
    SET location_id = (
        SELECT location_id 
        FROM locations 
        WHERE city = NEW.city AND country = NEW.country
    )
    WHERE employee_id = NEW.employee_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employee_locations_update
INSTEAD OF UPDATE ON employee_locations
FOR EACH ROW
EXECUTE FUNCTION update_employee_location();

-- 4. Materialized Views
-- Create a materialized view for performance
CREATE MATERIALIZED VIEW monthly_sales_summary AS
SELECT 
    DATE_TRUNC('month', sale_date) as month,
    product_id,
    SUM(quantity) as total_quantity,
    SUM(amount) as total_amount
FROM sales
GROUP BY DATE_TRUNC('month', sale_date), product_id
WITH DATA;

-- Refresh materialized view
REFRESH MATERIALIZED VIEW monthly_sales_summary;

-- 5. View Information
-- Get view definitions
SELECT 
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');

-- Get materialized view information
SELECT 
    schemaname,
    matviewname,
    matviewowner,
    ispopulated
FROM pg_matviews;

-- 6. Common View Patterns

-- Pattern 1: Data Security
CREATE VIEW employee_public_info AS
SELECT 
    employee_id,
    first_name,
    last_name,
    department
FROM employees;

-- Pattern 2: Data Aggregation
CREATE VIEW daily_sales_summary AS
SELECT 
    DATE_TRUNC('day', sale_timestamp) as sale_date,
    COUNT(*) as total_transactions,
    SUM(amount) as total_amount
FROM sales
GROUP BY DATE_TRUNC('day', sale_timestamp);

-- Pattern 3: Data Denormalization
CREATE VIEW product_full_details AS
SELECT 
    p.product_id,
    p.product_name,
    c.category_name,
    s.supplier_name,
    p.unit_price,
    p.units_in_stock
FROM products p
JOIN categories c ON p.category_id = c.category_id
JOIN suppliers s ON p.supplier_id = s.supplier_id;

-- 7. Practice Exercises

-- Exercise 1: Create a Customer Summary View
-- Show total orders, average order value, and last order date

-- Exercise 2: Create an Inventory Status View
-- Show products, their current stock, pending orders, and reorder status

-- Exercise 3: Create a Sales Performance View
-- Show sales by employee, with rankings and year-over-year comparison

-- 8. Best Practices
-- 1. Use meaningful names for views
-- 2. Document complex views
-- 3. Consider performance impact
-- 4. Use materialized views for expensive calculations
-- 5. Maintain views (refresh materialized views, update statistics)
-- 6. Use appropriate permissions
-- 7. Consider the impact on the underlying tables
-- 8. Test view performance

-- 9. Advanced View Techniques

-- Recursive View
CREATE RECURSIVE VIEW employee_hierarchy AS
SELECT 
    employee_id,
    first_name,
    last_name,
    manager_id,
    1 as level
FROM employees
WHERE manager_id IS NULL
UNION ALL
SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.manager_id,
    eh.level + 1
FROM employees e
JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id;

-- View with Window Functions
CREATE VIEW employee_department_stats AS
SELECT 
    e.*,
    AVG(salary) OVER (PARTITION BY department_id) as dept_avg_salary,
    RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as salary_rank
FROM employees e;

-- View for Audit Purposes
CREATE VIEW audit_log_summary AS
SELECT 
    table_name,
    action_type,
    COUNT(*) as action_count,
    MIN(action_timestamp) as first_action,
    MAX(action_timestamp) as last_action
FROM audit_log
GROUP BY table_name, action_type;

-- 10. Testing Views

-- Test view performance
EXPLAIN ANALYZE
SELECT * FROM employee_department_stats
WHERE department_id = 1;

-- Test view data accuracy
SELECT 
    (SELECT COUNT(*) FROM employees) as actual_count,
    (SELECT COUNT(*) FROM employee_details) as view_count;

-- 11. Cleanup (for testing purposes)
-- DROP VIEW IF EXISTS employee_details;
-- DROP VIEW IF EXISTS employee_annual_costs;
-- DROP VIEW IF EXISTS department_summary;
-- DROP MATERIALIZED VIEW IF EXISTS monthly_sales_summary; 