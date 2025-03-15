# Portfolio Backend

A Node.js backend server for handling contact form submissions from the portfolio website. This server connects to MongoDB to store form submissions and provides API endpoints for submitting and retrieving form data.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server
- **Express.js**: Web framework for creating API endpoints
- **MongoDB**: NoSQL database for storing form submissions
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **Cors**: Middleware for enabling Cross-Origin Resource Sharing
- **Dotenv**: Module for loading environment variables

## API Endpoints

### Submit Form
- **URL**: `/Form`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "message": "Contact message"
  }
  ```
- **Success Response**: 
  - Status Code: 200
  - Content: `{ "message": "Form submitted successfully." }`
- **Error Response**: 
  - Status Code: 400 (Bad Request) or 500 (Server Error)
  - Content: `{ "message": "Error message" }`

### Display Form Submissions
- **URL**: `/Display`
- **Method**: `GET`
- **Success Response**: 
  - Status Code: 200
  - Content: Array of form submissions
- **Error Response**: 
  - Status Code: 500 (Server Error)
  - Content: Error message

## Data Model

### Form Submission
- **name**: String (required) - Name of the person submitting the form
- **email**: String (required) - Email address of the person
- **message**: String (required) - Message content
- **dateTime**: String - Automatically generated timestamp in IST (Indian Standard Time)

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd portfolio-backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Create a .env file**
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Start the server**
   ```
   npm start
   ```

5. **For development**
   ```
   npm run dev
   ```

## Deployment

This backend is deployed on Vercel. The production URL is:
```
https://portfolio-backend-8vrb4nhpt-naveens-projects-42486591.vercel.app
```

## Environment Variables

- **MONGO_URI**: MongoDB connection string (required)

## Notes

- The server automatically formats and stores the submission date and time in Indian Standard Time (IST)
- All form fields (name, email, message) are required
- CORS is enabled to allow requests from the frontend 