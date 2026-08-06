Deployed Link: https://quizgenai-eta.vercel.app
# QuizGenAI

QuizGenAI is a full-stack web application that generates custom quizzes on any topic using Google's Gemini AI. Users can register, log in with JWT-secured authentication, generate AI-powered quizzes on demand, submit their answers, and track their performance history over time.

## Features

- **AI-generated quizzes** – Instantly create quizzes on any topic, difficulty, and question count using the Gemini API
- **JWT authentication** – Secure registration and login with stateless, token-based sessions
- **Quiz history & results** – Submit quizzes and review past attempts and scores
- **Email notifications** – Transactional emails powered by Resend
- **Responsive React UI** – Custom-designed, dark-themed interface built with Vite

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router
- Axios

**Backend**
- Java 21 + Spring Boot 4
- Spring Security (JWT-based auth)
- Spring Data JPA
- MySQL / TiDB Cloud
- Google Gemini API (quiz generation)
- Resend API (email)

## Project Structure

```
quizgenai/
├── quizgenai-frontend/     # React + Vite client
│   ├── src/
│   │   ├── components/     # Navbar, Toast, PrivateRoute
│   │   ├── pages/          # Login, Register, Dashboard, Quiz, Result, History
│   │   ├── services/       # API client (Axios)
│   │   └── utils/          # JWT helpers
│   └── package.json
└── quizgenai-backend/      # Spring Boot API
    ├── src/main/java/com/quizgen/quizgenai/
    │   ├── controller/     # REST endpoints (Auth, Quiz, Result)
    │   ├── service/        # Business logic (Auth, Quiz, Result, Email, Gemini)
    │   ├── repository/     # Spring Data JPA repositories
    │   ├── entity/         # User, Result
    │   ├── security/       # JWT filter & service
    │   ├── dto/             # Request/response objects
    │   └── config/          # Security & REST client config
    └── src/main/resources/application.properties
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java 21 (JDK)
- Maven (or use the included `mvnw` wrapper)
- A MySQL-compatible database (e.g. local MySQL or [TiDB Cloud](https://tidbcloud.com/))
- API keys for [Google Gemini](https://ai.google.dev/) and [Resend](https://resend.com/)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd quizgenai-backend
   ```

2. Set the following environment variables (or configure them in your IDE's run configuration):
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://<host>:3306/quizgenai
   SPRING_DATASOURCE_USERNAME=<your-db-username>
   SPRING_DATASOURCE_PASSWORD=<your-db-password>
   GEMINI_API_KEY=<your-gemini-api-key>
   RESEND_API_KEY=<your-resend-api-key>
   PORT=8080
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The API will be available at `http://localhost:8080`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd quizgenai-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint             | Description                     | Auth Required |
|--------|-----------------------|----------------------------------|:--------------:|
| POST   | `/api/auth/register`  | Register a new user             | No             |
| POST   | `/api/auth/login`     | Log in and receive a JWT         | No             |
| POST   | `/api/quiz/generate`  | Generate a quiz via Gemini AI    | Yes            |
| POST   | `/api/result/submit`  | Submit quiz answers              | Yes            |
| GET    | `/api/result`         | Get the current user's results   | Yes            |
| GET    | `/api/test`           | Verify JWT authentication        | Yes            |

## Security Notes

- Never commit real credentials or API keys to version control. Configuration is read entirely from environment variables in `application.properties`.
- If you're setting up this project locally, create your own local properties file (or `.env`) with your own keys, and make sure it's listed in `.gitignore` before committing.

## License

This project is available for personal and educational use only.
