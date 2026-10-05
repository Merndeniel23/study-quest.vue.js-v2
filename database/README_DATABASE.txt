STUDYQUEST DATABASE
===================

Database name: studyquest_db
File to import: studyquest_db.sql

OPTION A - IMPORT SQL (easiest)
1. Start Apache and MySQL in XAMPP.
2. Open http://localhost/phpmyadmin
3. Click Import.
4. Select studyquest_db.sql.
5. Click Import/Go.
6. Confirm that studyquest_db > assignments exists.

OPTION B - USE LARAVEL MIGRATION
1. Create an empty database named studyquest_db in phpMyAdmin.
2. Open a terminal inside backend.
3. Run: composer install
4. Run: php artisan migrate --seed

Use only one option for initial setup. If you import the SQL file, you do not need to run the assignment migration immediately.
