CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    preferences json DEFAULT NULL,
    username VARCHAR(255),
    status TINIYINT(1) NOT NULL DEFAULT 0,
    UNIQUE KEY idx_email (email)
    INDEX idx_status (status)
);

CREATE TABLE user_providers (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    hashed_password VARCHAR(255)
);

CREATE TABLE user_sessions (
    id VARCHAR(127) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    active_expires BIGINT NOT NULL,
    idle_expires BIGINT NOT NULL,
    UNIQUE KEY idx_user_id (user_id)
);
