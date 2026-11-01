# Spendly – Personal Expense Tracker

Spendly is a full-stack personal expense tracking application that helps users manage their daily expenses, monitor spending habits, and organize transactions by category.

The application provides secure user authentication and allows each user to manage their own expenses through a simple and responsive interface.

## 🚀 Live Demo

- **Frontend:** https://expensetracker-frontend-seven.vercel.app/login.html
- **Backend API:** https://expense-tracker-gg9y.onrender.com
- **API Documentation:** https://expense-tracker-gg9y.onrender.com/docs

## ✨ Features

- **User Authentication:** Register and log in securely using email and password.
- **Password Hashing:** Passwords are hashed before being stored in the database.
- **JWT Authentication:** Protected API endpoints using JSON Web Tokens.
- **Add Expenses:** Record expenses with title, amount, category, and description.
- **View Expenses:** Display your recorded expenses.
- **Update Expenses:** Modify existing expense records.
- **Delete Expenses:** Remove expenses when needed.
- **User-specific Data:** Each user can access only their own expenses.
- **Expense Summary:** View total spending, transaction count, and top category.
- **Dark Mode:** Switch between light and dark themes.
- **Responsive UI:** Access the application from desktop and mobile devices.

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI
- SQLAlchemy
- PyJWT
- pwdlib (Argon2 password hashing)

### Database
- PostgreSQL
- Neon (Cloud PostgreSQL)

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting
- Neon – Database hosting

## 🏗️ Project Structure

```text
Expense_Tracker/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── style.css
│   ├── script.js
│   └── auth.js
│
├── main.py
├── database.py
├── models.py
├── schemas.py
├── crud.py
├── auth.py
├── dependencies.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/pradhankiran400-dotcom/Expense_Tracker.git
```

```bash
cd Expense_Tracker
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows:**
```bash
venv\Scripts\activate
```

**Linux / macOS:**
```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/expense_tracker

JWT_SECRET_KEY=your_secret_key
```

Replace the database credentials with your PostgreSQL credentials.

Generate a secure JWT secret key using:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### 5. Start the backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Start the frontend

Open the `frontend` folder using VS Code and run `index.html` with the Live Server extension.

Alternatively, serve the frontend using:

```text
http://127.0.0.1:5500
```

Make sure the frontend API URL points to your local backend while testing locally:

```javascript
const API = "http://127.0.0.1:8000";
```

For the deployed frontend, use:

```javascript
const API = "https://expense-tracker-gg9y.onrender.com";
```

## 🔐 Authentication Workflow

Spendly uses JWT-based authentication.

1. A new user registers with their name, email, and password.
2. The backend hashes the password using Argon2.
3. The hashed password is stored in PostgreSQL.
4. During login, the submitted password is verified against the stored hash.
5. After successful authentication, the backend generates a JWT access token.
6. The frontend stores the token in local storage.
7. Protected requests send the token using the Authorization header.

Example:

```http
Authorization: Bearer <access_token>
```

The backend verifies the token and identifies the current user before processing protected requests.

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user details |

### Expenses

| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses` | Add a new expense |
| GET | `/expenses` | Get user's expenses |
| PUT | `/expenses/{id}` | Update an expense |
| DELETE | `/expenses/{id}` | Delete an expense |

*Protected expense endpoints require a valid JWT access token.*

## 🗄️ Database Design

### Users Table

| Column | Description |
|---|---|
| id | Unique user ID |
| name | User's name |
| email | Unique email address |
| password_hash | Hashed password |

### Expenses Table

| Column | Description |
|---|---|
| id | Unique expense ID |
| title | Expense title |
| amount | Expense amount |
| category | Expense category |
| description | Optional description |
| user_id | Reference to the owner |

**Relationship:** One user can have multiple expenses (One-to-Many).

## 🌐 Deployment Architecture

```text
          User / Browser
                 |
                 v
        Frontend (Vercel)
          HTML / CSS
