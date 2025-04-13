# How to start project(requiered to have node.js)
1. cd cringe
2. Enter `npm install`
3. npm run dev
4. Open new terminal
5. cd test
6. mvn spring-boot:run

# Inclusive Places Finder API

A backend solution for an inclusive map platform designed to help users find and evaluate places based on their accessibility and environment. This API powers features like user reviews, accessibility scoring, authentication, and admin management.
To fetch data about locations was used overPass API

---

## Features

- User Authentication & Authorization
  - Sign Up / Sign In with JWT
  - Google Sign-In
  - Role-based Access Control (USER / ADMIN)
  
- Places API
  - Add and manage places
  - Submit and view accessibility reviews
  - Generate summarized accessibility information from user reviews (AI-powered)
  
- Reviews API
  - Add reviews to places
  - Automatic environment summary generation based on reviews

- Admin Functionality
  - View all users
  - Manage roles and data

---

## Tech Stack

| Technology | Purpose                          |
|------------|---------------------------------|
| Java + Spring Boot | Backend API framework |
| PostgreSQL        | Database               |
| Python            | Review summarization (AI Model) |
| TypeScript        | Frontend (Coming Soon) |
| SCSS              | Frontend Styling (Coming Soon) |

---

## API Endpoints Overview

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| /api/auth/signup | POST | Public | Register new user |
| /api/auth/signin | POST | Public | Login with username/password |
| /api/auth/google | POST | Public | Login with Google |
| /api/auth/users | GET | Admin | Get all users |
| /api/places | GET/POST | User/Admin | Manage Places |
| /api/reviews | POST | User | Add a review to a place |

---

## Environment Variables

Create a `.env` file in the root folder:

```
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Running the Project

### Backend

```
./mvnw spring-boot:run
```

or

```
mvn spring-boot:run
```

---

## Folder Structure

```
Hackathon_2025/
│
├── src/               # Java Spring Boot Backend
│
├── python/            # Python Scripts for Review Summarization
│
├── test/              # Test data & scripts
│
├── node_modules/      # Node dependencies (Frontend - in progress)
│
└── .env               # Environment variables (local only)
```

---

## Authors

Made with ❤️ during Hackathon 2025  
Team: Natalya & Team Members  

---

## Future Plans

- Interactive frontend with React + TypeScript
- Route planning considering accessibility
- Map integration
- AI-powered smart suggestions
