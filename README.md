
# Authentication API

## Features:
- User Registration (Sign Up)
- User Login (Sign In)
- Google Authentication (Sign In with Google)
- Role-based Access Control (USER / ADMIN)
- JWT Token Authentication
- Password Hashing with BCrypt
- PostgreSQL Database Integration
- Secure API endpoints
- Environment variables for sensitive data

---


## Roles:
- USER → sign-in/sign-up
- ADMIN → + view all users

---

## API Endpoints:

### Sign Up → Register new user
POST /api/auth/signup

Body:
{
"username": "your_name",
"password": "your_password",
"role" : "USER" //or "ADMIN"
}

---

### Sign In → Login existing user
POST /api/auth/signin

Body:
{
"username": "your_name",
"password": "your_password"
}

Response:
{
"token": "your JWT token"
}

---

### Sign In with Google → Login with Google Account
POST /api/auth/google

Body: (Raw String)
Google ID Token received from Google Sign-In

Response:
{
"token": "your JWT token"
}

---

### Get All Users → ADMIN only
GET /api/auth/users

Headers:
Authorization: Bearer admin_token

Response if Admin:
[List of all users]

Response if not Admin:
Access denied: Only Admin

---

## Environment variables:

Create `.env` file in project root:

DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id

---

## Run the project:

./mvnw spring-boot:run

or

mvn spring-boot:run

---

## Author:
Made by Natalya
