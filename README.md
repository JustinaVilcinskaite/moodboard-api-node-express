# Moodboard App – Backend

A REST API built with Node.js, Express, and MongoDB for an in-progress full-stack visual research workspace.

Moodboard is designed as one focused place for artists, designers, and other visually oriented users to collect image references, organize them into project boards and folders, and move from scattered inspiration toward a clearer creative direction.

## Current Status

The project is currently in active development.

The backend foundation is substantially implemented, including authentication, ownership-protected board/folder/image logic, public and private board access, default folder behavior, folder reordering, URL-based image references for the current implementation phase, image notes/tags, and Joi validation.

The API is built to work with a dedicated React/Next.js frontend that is being developed in stages.

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- Joi
- uuid
- dotenv
- cors
- ESLint
- Nodemon

## Implemented Backend Features

### Authentication

- User registration and login with hashed passwords using `bcryptjs`
- JWT-based authentication middleware for protected API routes
- Current-user endpoint for validating the logged-in user

### Boards

- Authenticated users can create, view, update, and delete their own boards
- Boards support public/private visibility, with public boards available through read-only routes
- Creating a board automatically creates a default `General` folder
- Deleting a board also deletes its related folders and images
- Board list responses include summary data such as thumbnail URL and image count

### Folders

- Authenticated users can create, update, delete, and reorder folders inside boards they own
- Folders are returned in saved order, with new folders added after the current last folder
- Each board has a protected default folder that cannot be renamed, deleted, or moved from first position during reordering
- Deleting a non-default folder moves its images to the board’s default folder

### Images

- Authenticated users can create URL-based image references for the current implementation phase
- Images are assigned to folders, or added to the board’s default folder if no folder is provided
- Images can include notes and tags
- Users can view, update, and delete only images from boards they own
- Public image routes return images only when the related board is public

### Validation, Access Control & Structure

- Joi validation for key request bodies and route parameters
- Ownership checks are enforced for protected board, folder, and image actions
- Modular structure with separate controllers, routes, models, schemas, middleware, and utilities
- Environment-based configuration using `.env` variables

## Planned Backend Improvements

- Add real image file upload support with an external image storage service
- Add image reordering
- Support moving images between folders
- Add search and filtering functionality
- Prepare and deploy the API for production use
- Longer-term plans include board collaboration, private board invitations, personal favorites, and color-based organization

## Project Structure

```text
moodboard-api-node-express/
├── src/
│   ├── controllers/        # Request handlers for users, boards, folders, and images
│   ├── middlewares/        # Authentication and validation middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # Express route definitions
│   ├── schemas/            # Joi validation schemas
│   └── utils/              # Helper functions
├── index.js                # Server entry point
├── eslint.config.js
├── package.json
└── README.md
```

## Getting Started

This repository contains the backend API. After running the server locally, the endpoints can be tested with an API client such as Thunder Client or Postman.

### 1. Clone the repository

```bash
git clone https://github.com/JustinaVilcinskaite/moodboard-api-node-express.git
cd moodboard-api-node-express
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=3002
MONGO_CONNECTION=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the placeholder values with your MongoDB connection string and JWT secret.

### 4. Run the development server

```bash
npm run dev
```

The API will be available at:

```bash
http://localhost:3002
```

All routes are mounted under the `/api` prefix.

Example endpoint:

```bash
http://localhost:3002/api/users/login
```

### Related Repository

This backend is built to work with a separate React/Next.js frontend, which is currently being developed:

[moodboard-app-react-next-ts](https://github.com/JustinaVilcinskaite/moodboard-app-react-next-ts)
