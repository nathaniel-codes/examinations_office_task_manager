-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS module_task_db;
USE module_task_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    module_id INT,
    is_complete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (module_id) REFERENCES modules(id)
);

-- Create module_masters (junction table between modules and users)
CREATE TABLE IF NOT EXISTS module_masters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id INT,
    user_id INT,
    FOREIGN KEY (module_id) REFERENCES modules(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert some users
INSERT INTO users (username, is_admin) VALUES ('Alice', FALSE), ('Bob', TRUE);

-- Insert your provided modules
INSERT INTO modules (code, title) VALUES
('COU 07301', 'Operating Systems'),
('COU 07302', 'Microprocessor and Computer Architecture'),
('COU 07303', 'Computer Programming'),
('COU 07304', 'Data Communication and Networking'),
('COU 07305', 'Multimedia Systems'),
('ETU 07321', 'Analogue Electronics'),
('ETU 07323', 'Instrumentation and Measurements'),
('GSU 07312', 'Engineering Mathematics'),
('GSU 07313', 'Technical Communication Skills');

-- Add module_masters (linking modules with users)
INSERT INTO module_masters (module_id, user_id) VALUES (1, 1), (2, 1), (3, 2), (4, 2), (5, 1), (6, 2), (7, 1), (8, 1), (9, 2);
-- Note: Adjust the module_id and user_id values as needed based on actual module and user IDs
