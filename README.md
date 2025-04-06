# Blog Platform

A full-stack blog application with user authentication, post creation, commenting, and profile management.

## Overview

This Blog Platform is a modern web application that allows users to create an account, publish blog posts, interact with other users' content through comments and likes, and manage their profiles. The application is built with a React frontend and a Node.js/Express backend, using MongoDB as the database.

## Features

- **User Authentication**: Register, login, and profile management
- **Blog Posts**: Create, read, update, and delete blog posts
- **Interactive Elements**: Like posts and add comments
- **User Profiles**: View user profiles and their published posts
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS v4
- Axios for API calls
- JWT for authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose ORM
- JWT for authentication
- bcrypt for password hashing

## Project Structure

The project is divided into two main directories:

### Client
The frontend React application with the following structure:
- `src/components`: Reusable UI components
- `src/pages`: Page components for different routes
- `src/context`: Context providers for state management
- `src/api`: API service functions
- `src/assets`: Static assets like images

### Server
The backend Express application with the following structure:
- `routes`: API route definitions
- `controllers`: Request handlers
- `models`: Mongoose data models
- `middleware`: Express middleware for authentication, etc.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
```

2. Set up the server:
```
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Set up the client:
```
cd ../client
npm install
```

5. Create a `.env` file in the client directory with:
```
VITE_API_URL=http://localhost:5000
```

### Running the Application

1. Start the server:
```
cd server
npm run dev
```

2. Start the client (in a new terminal):
```
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Posts
- `GET /api/posts`: Get all posts
- `GET /api/posts/:id`: Get a specific post
- `POST /api/posts`: Create a new post (requires authentication)
- `PUT /api/posts/:id`: Update a post (requires authentication)
- `DELETE /api/posts/:id`: Delete a post (requires authentication)
- `POST /api/posts/:id/like`: Like/unlike a post (requires authentication)
- `POST /api/posts/:id/comments`: Add a comment to a post (requires authentication)
- `GET /api/posts/user/:userId`: Get all posts by a specific user
- `GET /api/posts/my-posts/all`: Get all posts by the authenticated user

### Users
- `GET /api/users/:id`: Get user profile
- `PUT /api/users/:id`: Update user profile (requires authentication)


 
