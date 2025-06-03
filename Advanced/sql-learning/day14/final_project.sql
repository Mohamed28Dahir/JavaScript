-- Day 14: Final Project - Library Management System
-- This project implements a complete library management system using all concepts learned

-- 1. Database Schema Creation

-- Create Schemas
CREATE SCHEMA library;
SET search_path TO library;

-- Authors Table
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_author UNIQUE (first_name, last_name, birth_date)
);

-- Books Table
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author_id INTEGER REFERENCES authors(author_id),
    publication_year INTEGER CHECK (publication_year >= 1000 AND publication_year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    genre VARCHAR(50),
    total_copies INTEGER DEFAULT 0,
    available_copies INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_copies CHECK (available_copies >= 0 AND available_copies <= total_copies)
);

-- Members Table
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    join_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loans Table
CREATE TABLE loans (
    loan_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id),
    member_id INTEGER REFERENCES members(member_id),
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK (
        loan_date <= due_date 
        AND (return_date IS NULL OR return_date >= loan_date)
    )
);

-- 2. Indexes for Performance
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_dates ON loans(loan_date, due_date, return_date);

-- 3. Views for Common Queries

-- Available Books View
CREATE VIEW available_books AS
SELECT 
    b.book_id,
    b.isbn,
    b.title,
    a.first_name || ' ' || a.last_name as author_name,
    b.genre,
    b.available_copies
FROM books b
JOIN authors a ON b.author_id = a.author_id
WHERE b.available_copies > 0;

-- Member Loan History View
CREATE VIEW member_loan_history AS
SELECT 
    m.member_id,
    m.first_name || ' ' || m.last_name as member_name,
    b.title,
    l.loan_date,
    l.due_date,
    l.return_date,
    l.status,
    CASE 
        WHEN l.return_date IS NULL AND l.due_date < CURRENT_DATE THEN 
            CURRENT_DATE - l.due_date
        ELSE 0
    END as days_overdue
FROM loans l
JOIN members m ON l.member_id = m.member_id
JOIN books b ON l.book_id = b.book_id;

-- 4. Functions and Procedures

-- Function to Check Book Availability
CREATE OR REPLACE FUNCTION is_book_available(p_book_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM books 
        WHERE book_id = p_book_id 
        AND available_copies > 0
    );
END;
$$ LANGUAGE plpgsql;

-- Function to Process Book Loan
CREATE OR REPLACE FUNCTION loan_book(
    p_book_id INTEGER,
    p_member_id INTEGER,
    p_loan_days INTEGER DEFAULT 14
) RETURNS INTEGER AS $$
DECLARE
    v_loan_id INTEGER;
BEGIN
    -- Start transaction
    BEGIN;
        -- Check book availability
        IF NOT is_book_available(p_book_id) THEN
            RAISE EXCEPTION 'Book is not available';
        END IF;
        
        -- Check member status
        IF NOT EXISTS (
            SELECT 1 FROM members 
            WHERE member_id = p_member_id 
            AND status = 'active'
        ) THEN
            RAISE EXCEPTION 'Member is not active';
        END IF;
        
        -- Create loan record
        INSERT INTO loans (book_id, member_id, loan_date, due_date)
        VALUES (
            p_book_id,
            p_member_id,
            CURRENT_DATE,
            CURRENT_DATE + p_loan_days
        )
        RETURNING loan_id INTO v_loan_id;
        
        -- Update book availability
        UPDATE books 
        SET available_copies = available_copies - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE book_id = p_book_id;
        
        COMMIT;
        RETURN v_loan_id;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to Process Book Return
CREATE OR REPLACE FUNCTION return_book(p_loan_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    BEGIN;
        -- Update loan record
        UPDATE loans 
        SET return_date = CURRENT_DATE,
            status = 'returned',
            updated_at = CURRENT_TIMESTAMP
        WHERE loan_id = p_loan_id
        AND return_date IS NULL;
        
        -- Update book availability
        UPDATE books 
        SET available_copies = available_copies + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE book_id = (
            SELECT book_id FROM loans WHERE loan_id = p_loan_id
        );
        
        COMMIT;
        RETURN TRUE;
    EXCEPTION WHEN OTHERS THEN
        ROLLBACK;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- 5. Triggers

-- Update Timestamp Trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_authors_timestamp
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_books_timestamp
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_members_timestamp
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_loans_timestamp
    BEFORE UPDATE ON loans
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 6. Sample Data Insertion
INSERT INTO authors (first_name, last_name, nationality) VALUES
('Jane', 'Austen', 'British'),
('George', 'Orwell', 'British'),
('Gabriel', 'García Márquez', 'Colombian');

INSERT INTO books (isbn, title, author_id, publication_year, genre, total_copies, available_copies) VALUES
('9780141439518', 'Pride and Prejudice', 1, 1813, 'Classic', 5, 5),
('9780451524935', '1984', 2, 1949, 'Dystopian', 3, 3),
('9780307474728', 'One Hundred Years of Solitude', 3, 1967, 'Magical Realism', 4, 4);

INSERT INTO members (first_name, last_name, email, phone) VALUES
('John', 'Doe', 'john.doe@email.com', '123-456-7890'),
('Jane', 'Smith', 'jane.smith@email.com', '098-765-4321');

-- 7. Example Queries

-- Find all overdue books
SELECT 
    m.first_name || ' ' || m.last_name as member,
    b.title,
    l.due_date,
    CURRENT_DATE - l.due_date as days_overdue
FROM loans l
JOIN members m ON l.member_id = m.member_id
JOIN books b ON l.book_id = b.book_id
WHERE l.return_date IS NULL 
AND l.due_date < CURRENT_DATE;

-- Get popular books
SELECT 
    b.title,
    COUNT(*) as loan_count
FROM loans l
JOIN books b ON l.book_id = b.book_id
GROUP BY b.book_id, b.title
ORDER BY loan_count DESC
LIMIT 10;

-- Member activity summary
SELECT 
    m.first_name || ' ' || m.last_name as member,
    COUNT(*) as total_loans,
    COUNT(CASE WHEN l.return_date IS NULL THEN 1 END) as current_loans,
    COUNT(CASE WHEN l.status = 'overdue' THEN 1 END) as overdue_loans
FROM members m
LEFT JOIN loans l ON m.member_id = l.member_id
GROUP BY m.member_id, m.first_name, m.last_name;

-- 8. Maintenance Tasks

-- Update overdue status
UPDATE loans
SET status = 'overdue'
WHERE return_date IS NULL 
AND due_date < CURRENT_DATE
AND status = 'borrowed';

-- Remove old records (archive instead in production)
DELETE FROM loans
WHERE return_date < CURRENT_DATE - INTERVAL '5 years';

-- 9. Testing

-- Test book loan
SELECT loan_book(1, 1, 14);

-- Test book return
SELECT return_book(1);

-- Verify available copies
SELECT book_id, title, total_copies, available_copies
FROM books
WHERE book_id = 1;

-- 10. Backup (example commands)
-- pg_dump -U username -d library -f library_backup.sql

-- 11. Cleanup (for testing purposes)
-- DROP SCHEMA library CASCADE; 