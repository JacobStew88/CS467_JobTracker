-- ============================================
-- CS467 Job Tracker Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS jobtracker;
USE defaultdb;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS JobContacts;
DROP TABLE IF EXISTS JobSkills;
DROP TABLE IF EXISTS Contacts;
DROP TABLE IF EXISTS Skills;
DROP TABLE IF EXISTS Jobs;
DROP TABLE IF EXISTS Users;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Users
-- ============================================
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- ============================================
-- Jobs
-- ============================================
CREATE TABLE Jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    status ENUM('applied', 'waiting', 'interviewed', 'decision') NOT NULL,
    application_date DATE NOT NULL,

    CONSTRAINT fk_jobs_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- Skills
-- ============================================
CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    comfort_level INT NOT NULL,

    CONSTRAINT chk_skills_comfort_level
        CHECK (comfort_level BETWEEN 1 AND 5),

    CONSTRAINT uq_skills_user_skill
        UNIQUE (user_id, skill_name),

    CONSTRAINT fk_skills_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- Contacts
-- ============================================
CREATE TABLE Contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    notes TEXT NULL,

    CONSTRAINT fk_contacts_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- JobSkills
-- Junction table for Jobs <-> Skills
-- ============================================
CREATE TABLE JobSkills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,

    PRIMARY KEY (job_id, skill_id),

    CONSTRAINT fk_jobskills_job
        FOREIGN KEY (job_id)
        REFERENCES Jobs(job_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_jobskills_skill
        FOREIGN KEY (skill_id)
        REFERENCES Skills(skill_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- JobContacts
-- Junction table for Jobs <-> Contacts
-- ============================================
CREATE TABLE JobContacts (
    job_id INT NOT NULL,
    contact_id INT NOT NULL,
    relationship_type VARCHAR(50) NOT NULL,

    PRIMARY KEY (job_id, contact_id),

    CONSTRAINT fk_jobcontacts_job
        FOREIGN KEY (job_id)
        REFERENCES Jobs(job_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_jobcontacts_contact
        FOREIGN KEY (contact_id)
        REFERENCES Contacts(contact_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- PasswordResetTokens
-- Stores secure one-time password reset tokens
-- ============================================
CREATE TABLE PasswordResetTokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_user
        FOREIGN KEY (user_id)
        REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

