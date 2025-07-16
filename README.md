## 📝 Todo App Backend
### A RESTful backend built with NestJS, MongoDB (Mongoose), and JWT-based Authentication to manage user's todo items efficiently.

## 🚀 Features
✅ User Registration & Login

🔐 JWT Auth with Access & Refresh Tokens

📋 Todo CRUD (Create, Read, Update, Delete)

📊 Statistics on Todos

💾 MongoDB with Mongoose ODM

🧪 Unit & E2E Testing (Jest + Supertest)

⚙️ Environment Configuration with .env

## 📁 Project Structure
text
backend/
├── src/
│   ├── auth/            # Authentication logic (Register, Login, Jwt, Guard)
│   ├── todo/            # Todo module (CRUD, Statistics)
│   ├── schemas/         # Mongoose Schemas (User, Todo)
│   ├── database/        # Mongoose Configuration
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── app.module.ts
├── test/
│   ├── app.e2e-spec.ts  # E2E tests for API routes
│   └── jest-e2e.json    # E2E Jest config
├── tsconfig.json
├── package.json
└── README.md
🛠️ Prerequisites
## Ensure the following are installed:

Node.js (v18+ recommended)

MongoDB (local or hosted)

npm (comes with Node.js)

## 🧪 Setting Up Development
1. Clone the repository
bash
git clone https://github.com/your-username/todo-app.git
cd todo-app/backend
2. Install dependencies
bash
npm install
3. Configure environment variables
Create a .env file in the backend directory:

text
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=supersecuresecret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
PORT=3000
For E2E testing, you can also create a .env.test if needed.

📦 Running the App
▶️ Start in development mode
bash
npm run start:dev
Available at: http://localhost:3000

🔐 API Endpoints
Authorize with Bearer <token> after logging in.

🧑‍💼 Auth
Method	URL	Description
POST	/auth/register	Register new user
POST	/auth/login	Login & get tokens
POST	/auth/refresh	Get new access token
✅ Todos
Method	URL	Description
GET	/todos	Get all user's todos
POST	/todos	Create a new todo
GET	/todos/:id	Get a specific todo
PATCH	/todos/:id	Update a todo
DELETE	/todos/:id	Delete a todo
GET	/todos/statistics	View todo statistics
🧪 Running Tests
✅ Unit Tests
bash
npm run test
🔁 Test in watch mode
bash
npm run test:watch
📈 Test coverage
bash
npm run test:cov
🧪 End-to-End (E2E) Tests
bash
npm run test:e2e
Uses supertest to simulate real HTTP requests.

📦 Build
To build the app for production:

bash
npm run build
Find the output in the /dist folder.

## 🧹 Linting
Run ESLint on the project:

bash
npm run lint
## 📚 Tech Stack
NestJS (Node.js + TypeScript Framework)

MongoDB with Mongoose

PassportJS with JWT Strategy

Supertest + Jest (for testing)

Swagger (via @nestjs/swagger if added)