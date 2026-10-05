-- StudyQuest Activity 2 MySQL Database
-- Import this file using phpMyAdmin > Import.

CREATE DATABASE IF NOT EXISTS `studyquest_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `studyquest_db`;

DROP TABLE IF EXISTS `assignments`;

CREATE TABLE `assignments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `priority` enum('Low','Medium','High') NOT NULL DEFAULT 'Medium',
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `assignments` (`name`, `subject`, `priority`, `completed`, `created_at`, `updated_at`) VALUES
('Finish Vue.js Activity', 'Web Development', 'High', 0, NOW(), NOW()),
('Review Algebra Notes', 'Mathematics', 'Medium', 1, NOW(), NOW()),
('Read Chapter 5', 'English', 'Low', 0, NOW(), NOW());
