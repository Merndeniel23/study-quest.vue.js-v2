# StudyQuest — Laravel + Vue 3 + Quasar Activity 2

**Student:** Mern Deniel M. Rallos  
**Section:** BSIT 4C  
**Project:** StudyQuest Assignment Tracker

This package contains:

- `backend/` — Laravel REST API
- `frontend/` — Vue 3 + Quasar + TypeScript frontend
- `database/studyquest_db.sql` — import-ready MySQL database
- `screenshots/` — folder where you can save the required submission screenshots

> `vendor/` and `node_modules/` are intentionally not included because they are generated dependency folders. Run `composer install` and `npm install` once on your computer.

## 1. Requirements

Make sure these are installed:

```bash
php -v
composer -V
node -v
npm -v
```

Also start **MySQL** using XAMPP.

## 2. Database setup

### Fastest method: import the included SQL file

1. Start Apache and MySQL in XAMPP.
2. Open `http://localhost/phpmyadmin`.
3. Click **Import**.
4. Select `database/studyquest_db.sql`.
5. Click **Go**.
6. Confirm that `studyquest_db` exists and contains the `assignments` table.

The backend `.env` is already configured for:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=studyquest_db
DB_USERNAME=root
DB_PASSWORD=
```

If your MySQL root account has a password, put it in `DB_PASSWORD`.

### Alternative method: Laravel migration

Create an empty database called `studyquest_db`, then run:

```bash
cd backend
composer install
php artisan migrate --seed
```

Do not import the SQL and then immediately run the same assignment migration unless you first reset/drop the table.

## 3. Run the Laravel backend

Open Terminal 1:

```bash
cd backend
composer install
php artisan serve
```

Laravel should run at:

`http://127.0.0.1:8000`

Required API endpoint:

`http://127.0.0.1:8000/api/hello`

Expected result:

```json
{
  "message": "Hello from Mern Deniel M. Rallos!"
}
```

The frontend also uses these StudyQuest CRUD endpoints:

- `GET /api/assignments`
- `POST /api/assignments`
- `PATCH /api/assignments/{id}`
- `DELETE /api/assignments/{id}`

## 4. Run the Quasar frontend

Open Terminal 2:

```bash
cd frontend
npm install
npm run dev
```

Quasar normally opens the browser automatically. If it does not, use the URL shown in the terminal, commonly:

`http://localhost:9000`

The proxy in `quasar.config.ts` sends `/api` requests to:

`http://127.0.0.1:8000`

## 5. Test the Activity 2 requirement

1. Keep Laravel running.
2. Keep Quasar running.
3. Open the StudyQuest frontend.
4. Click **Test Backend**.
5. The page should show:

`Hello from Mern Deniel M. Rallos!`

You can also add, complete, mark pending, search, filter, and delete assignments. Those changes are stored in MySQL through Laravel.

## 6. Required submission screenshots

Save these screenshots inside the included `screenshots/` folder if you want to keep them organized:

1. `01-laravel-running.png` — terminal showing `php artisan serve`
2. `02-quasar-running.png` — terminal showing `npm run dev`
3. `03-api-hello.png` — browser showing `/api/hello`
4. `04-frontend-api-message.png` — StudyQuest page after clicking **Test Backend**
5. `05-vscode-project-folders.png` — VS Code Explorer showing both `backend` and `frontend`

## 7. Project structure

```text
StudyQuest_Activity2/
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/AssignmentController.php
│   │   └── Models/Assignment.php
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── .env
│   ├── artisan
│   └── composer.json
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/IndexPage.vue
│   │   ├── router/
│   │   └── stores/
│   ├── quasar.config.ts
│   └── package.json
├── database/
│   └── studyquest_db.sql
├── screenshots/
└── SETUP_GUIDE.md
```

## Important note

The required class message can be restored by changing `backend/routes/api.php` to:

```php
'message' => 'Hello from BSIT 4C!'
```

For the final submission requirement asking for your own name, the package already uses:

```php
'message' => 'Hello from Mern Deniel M. Rallos!'
```
