
# Authentication API — Spring Boot + PostgreSQL + JWT

Simple and clean backend authentication system.

## Features:
- User Registration (Sign Up)
- User Login (Sign In)
- JWT Token Authentication
- Password Hashing with BCrypt
- PostgreSQL Database Integration
- Secure API endpoints
- Environment variables for sensitive data

---

## API Endpoints:

### Sign Up → Register new user
POST /api/auth/signup

Send JSON Body:
{
"username": "your_name",
"password": "your_password"
}

Response if success:
User registered successfully

Response if username already exists:
User already exists

---

### Sign In → Login existing user
POST /api/auth/signin

Send JSON Body:
{
"username": "your_name",
"password": "your_password"
}

Response if success:
{
"token": "your JWT token"
}

Response if wrong username/password:
Invalid password
or
User not found

---

## Run the project:

./mvnw spring-boot:run

or

mvn spring-boot:run

---

## Author:
Made by Natalya
