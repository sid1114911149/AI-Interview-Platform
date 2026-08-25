# AI Interview Platform

An AI-powered interview preparation platform built with the MERN Stack that helps users prepare for technical interviews through authentication, interview management, AI-generated questions, and personalized interview sessions.

## Features Implemented

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Get Current User API
* Create Interview API
* Get All Interviews API
* Get Interview By ID API
* MongoDB Integration
* Password Hashing with bcrypt
* RESTful API Architecture

## Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## API Endpoints

### User Routes

POST /api/users/register

POST /api/users/login

GET /api/users/me

### Interview Routes

POST /api/interviews

GET	/api/interviews

GET	/api/interviews

## Project Status

### Completed
* User Authentication Module
* JWT Authorization
* Interview Creation API
* Get All Interviews API
* Get Interview By ID API
* MongoDB Integration
* Delete Interview API

### Currently Working On
* Gemini AI Integration
* AI Question Generation
* Frontend Integration (React)
* Resume Analysis

## Screenshots

### User Registration API

![Register API](screenshots/register-api.png)

Creates a new user account successfully.

---

### User Login API

![Login API](screenshots/login-api.png)

Authenticates the user and returns a JWT token.

---

### Create Interview API (Protected Route)

![Create Interview API](screenshots/create-interview-api.png)

Creates an interview record using JWT authentication and stores it in MongoDB.



## Author

Liean J Chacko
B.Tech Computer Science Engineering
CUSAT
    