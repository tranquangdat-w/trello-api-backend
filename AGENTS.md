# Backend Agents Guide

## Project Overview

Express.js REST API with MongoDB. Trello-like board management system.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via native driver)
- **Validation**: Joi
- **Auth**: JWT (access + refresh tokens)
- **Password Hashing**: Argon2
- **File Upload**: Multer + Cloudinary
- **Email**: Resend

## Directory Structure

```
src/
├── config/          # Environment & DB config
├── controllers/     # Request handlers (thin layer)
├── middlewares/     # Auth, error handling, file upload
├── models/          # Database operations (Mongoose-like patterns)
├── providers/       # External services (JWT, Cloudinary, Email)
├── routes/          # Express routers (v1 subfolder)
├── services/        # Business logic
├── utils/           # Constants, helpers, ApiErrors
└── validations/     # Joi schemas
```

## Key Patterns

### Request Flow
```
Route → Middleware → Controller → Service → Model → DB
```

### File Naming
- Models: `camelCase` + `Model` suffix → `userModel.js`
- Services: `camelCase` + `Services` suffix → `userServices.js`
- Controllers: `camelCase` + `Controllers` suffix → `userControllers.js`
- Validations: `camelCase` + `Validations` suffix → `userValidations.js`
- Middlewares: `camelCase` + `MiddleWares` suffix → `authJWTMiddleWares.js`

### Import Alias
Use `~` to reference `src/` directory:
```javascript
import { userModel } from '~/models/userModel'
import env from '~/config/environment'
```

### Controller Pattern
```javascript
const controllerName = async (req, res, next) => {
  try {
    const result = await serviceName(req.body, req.params.id)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
```

### Service Pattern
```javascript
const serviceName = async (param) => {
  // Business logic
  // Throw ApiErrors with appropriate StatusCodes
  // Return data (not response)
}
```

### Error Handling
Use `ApiErrors` from `~/utils/ApiErrors`:
```javascript
throw new ApiErros(StatusCodes.NOT_FOUND, 'Resource not found')
```

### User Model Fields
```javascript
{
  _id: string (UUID),
  username: string,
  password: string (hashed),
  email: string,
  role: 'client' | 'admin',
  avatar: string | null,
  verifyToken: string | null,
  isActive: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## JWT Token Structure
```javascript
{
  _id: string,
  email: string,
  username: string,
  role: 'client' | 'admin',
  createdAt: timestamp
}
```

## Authentication Flow

1. User registers → `isActive: false`, `verifyToken` generated
2. User verifies email → `isActive: true`, `verifyToken: null`
3. User logs in → receives `accessToken` + `refreshToken` in HTTP-only cookies
4. Protected routes use `authMiddleware.isAuthorized` to verify token
5. 401 → logout, 410 (expired) → auto refresh token

## Route Pattern
```javascript
// Public routes
Router.post('/register', validation, controller)

// Protected routes (requires auth)
Router.put(
  '/update',
  authMiddleware.isAuthorized,
  validation,
  controller
)
```

## Adding New Endpoints

1. **Model** (`src/models/`): Add DB operations
2. **Validation** (`src/validations/`): Add Joi schema if needed
3. **Service** (`src/services/`): Add business logic
4. **Controller** (`src/controllers/`): Add request handler
5. **Route** (`src/routes/v1/`): Wire it up

## Important Files

- `src/server.js` - Express app entry point
- `src/config/mongodb.js` - MongoDB connection
- `src/config/environment.js` - Environment variables
- `src/utils/ApiErrors.js` - Custom error class
- `src/utils/picker.js` - Select allowed fields for API responses

## Running the Project

```bash
# Development
npm run dev

# Production build
npm run start

# Lint
npm run lint
```

## Database Collections

Configured via `process.env`:
- `USER_COLLECTION_NAME`
- `BOARD_COLLECTION_NAME`
- `COLUMN_COLLECTION_NAME`
- `CARD_COLLECTION_NAME`
- `INVITATION_COLLECTION_NAME`
