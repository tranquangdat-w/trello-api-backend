# Trello API (Node.js)

## Description

This is a RESTful API for a Trello-like application, built with Node.js, Express.js, and MongoDB. It provides endpoints for managing boards, columns, and cards.

## Features

- **Boards Management**: Create, read, update, and delete boards.
- **Columns Management**: Create, read, update, and delete columns within boards.
- **Cards Management**: Create, read, update, and delete cards within columns.
- **User Authentication**: (Placeholder - to be implemented or described if already present)
- **Error Handling**: Centralized error handling for API responses.
- **Validation**: Joi-based request body validation.

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Joi (for validation)
- http-status-codes
- dotenv
- cors

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or Yarn
- MongoDB instance (local or cloud-based)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd trello-api-nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory based on `.env.example` and configure your environment variables, especially the MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string
   APP_HOST=localhost
   APP_PORT=8017
   BUILD_MODE=dev
   ```

### Running the Application

To start the development server:

```bash
npm start
# or
yarn start
```

The API will be running at `http://localhost:8017` (or the port you configured).

## API Endpoints

(This section can be expanded with specific endpoint details, e.g., `/v1/boards`, `/v1/columns`, `/v1/cards` and their respective HTTP methods and request/response formats.)

## Project Structure

```
.babelrc
.env.example
.eslintrc.cjs
.gitignore
jsconfig.json
package.json
yarn.lock
src/
├── server.js
├── config/
│   ├── cors.js
│   ├── environment.js
│   └── mongodb.js
├── controllers/
│   ├── boardControllers.js
│   ├── cardControllers.js
│   └── columnControllers.js
├── middlewares/
│   └── errorHandlingMiddlewares.js
├── models/
│   ├── boardModel.js
│   ├── cardModel.js
│   └── columnModel.js
├── routes/
│   ├── v1/
│   │   ├── boardRoutes.js
│   │   ├── cardRoutes.js
│   │   ├── columnRoutes.js
│   │   ├── index.js
│   │   └── userRoutes.js
│   └── v2/
├── services/
│   ├── boardServices.js
│   ├── cardServices.js
│   └── columnServices.js
├── utils/
│   ├── ApiErrors.js
│   ├── constrants.js
│   └── sorts.js
└── validations/
    ├── boardValidations.js
    ├── cardValidations.js
    ├── columnValidations.js
    └── userValidations.js
```
