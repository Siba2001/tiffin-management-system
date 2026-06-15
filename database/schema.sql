-- ============================================================
-- Tiffin Management System - Oracle Database 21c XE Schema
-- ============================================================

-- Drop tables if they exist (in reverse dependency order)
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE orders CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE attendance CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE menus CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE users CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL;
END;
/

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE users (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name       VARCHAR2(100) NOT NULL,
    mobile_number   VARCHAR2(15) NOT NULL,
    email           VARCHAR2(150) NOT NULL,
    password        VARCHAR2(255) NOT NULL,
    address         VARCHAR2(500),
    aadhaar_number  VARCHAR2(12),
    aadhaar_image   VARCHAR2(500),
    role            VARCHAR2(20) NOT NULL CHECK (role IN ('ADMIN', 'STUDENT')),
    status          VARCHAR2(20) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_mobile UNIQUE (mobile_number),
    CONSTRAINT uk_users_aadhaar UNIQUE (aadhaar_number)
);

-- ============================================================
-- MENUS TABLE
-- ============================================================
CREATE TABLE menus (
    id          NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    menu_date   DATE NOT NULL,
    breakfast   VARCHAR2(500),
    lunch       VARCHAR2(500),
    dinner      VARCHAR2(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uk_menus_date UNIQUE (menu_date)
);

-- ============================================================
-- ATTENDANCE TABLE
-- ============================================================
CREATE TABLE attendance (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id      NUMBER NOT NULL,
    attendance_date DATE NOT NULL,
    status          VARCHAR2(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_attendance_student_date UNIQUE (student_id, attendance_date)
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
    id           NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id   NUMBER NOT NULL,
    menu_id      NUMBER NOT NULL,
    order_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    quantity     NUMBER(5) DEFAULT 1 NOT NULL CHECK (quantity > 0),
    total_amount NUMBER(10, 2) NOT NULL CHECK (total_amount >= 0),
    order_status VARCHAR2(20) DEFAULT 'PLACED' NOT NULL CHECK (order_status IN ('PLACED', 'CANCELLED', 'COMPLETED')),
    CONSTRAINT fk_orders_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_orders_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_orders_student ON orders(student_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_menus_date ON menus(menu_date);

-- ============================================================
-- SEED DATA - Default Admin User
-- Password: Admin@123 (BCrypt encoded)
-- ============================================================
INSERT INTO users (full_name, mobile_number, email, password, address, role, status)
VALUES (
    'System Administrator',
    '9999999999',
    'admin@tiffin.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi',
    'Admin Office, Tiffin Management System',
    'ADMIN',
    'ACTIVE'
);

COMMIT;
