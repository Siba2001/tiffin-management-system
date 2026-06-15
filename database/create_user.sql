-- Create Oracle user for Tiffin Management System
-- Run as SYS or SYSTEM user

CREATE USER tiffin_user IDENTIFIED BY tiffin_pass
  DEFAULT TABLESPACE users
  TEMPORARY TABLESPACE temp
  QUOTA UNLIMITED ON users;

GRANT CONNECT, RESOURCE TO tiffin_user;
GRANT CREATE SESSION TO tiffin_user;
GRANT CREATE TABLE TO tiffin_user;
GRANT CREATE SEQUENCE TO tiffin_user;
GRANT CREATE VIEW TO tiffin_user;

-- Connect as tiffin_user and run schema.sql
