---

# Kudosware Backend

This is the backend for the Kudosware application, built with Node.js and Express.js. The backend handles user authentication and profile management, allowing users to sign up, log in, and manage their personal information.

## Features

- **User Signup:** Users can sign up by providing relevant information, including their resume.
- **User Login:** After signing up, users can log in using their credentials.
- **Token-Based Authentication:** Upon successful login, users receive a token that they can use to authenticate further requests.
- **Profile Management:** Users can update their personal information by providing the token received during login.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Devgupta851900/Kudosware-BE.git
   cd Kudosware-BE
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=your_port_number
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_NAME = your_cloudinary_name
   CLOUDINARY_API_KEY = your_cloudinary_api_key
   CLOUDINARY_API_SECRET = your_cloudinary_api_secret
   CLOUDINARY_FOLDER = your_cloudinary_folder_name
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   The backend will be running at `http://localhost:your_port_number`.

## API Endpoints

- **POST /signup:** Allows users to sign up with their information.
- **POST /login:** Allows users to log in and receive a token.
- **PUT /updateUser:** Allows users to update their personal information using the token.

## Dependencies

- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose:** MongoDB object modeling tool designed to work in an asynchronous environment.
- **jsonwebtoken:** JSON Web Token implementation (JWT) for securely transmitting information.
- **dotenv:** Loads environment variables from a `.env` file into `process.env`.

---
