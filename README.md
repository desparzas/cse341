# CSE 341 - W01 Project: Contacts Part 1

This project provides an API for storing and retrieving information about contacts. The contacts are stored in a MongoDB database, and all interaction happens through the API.

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=8080
   ```
4. Import the sample data to MongoDB:
   - Create a MongoDB Atlas account if you don't have one
   - Create a new cluster and database
   - Import the `contacts-data.json` file to a collection named `contacts`

## Running the Application

- Development mode:
  ```
  npm run dev
  ```
- Production mode:
  ```
  npm start
  ```

## API Endpoints

- `GET /contacts` - Get all contacts
- `GET /contacts/:id` - Get a single contact by ID

## Testing

Use the `routes.rest` file with a REST client (like REST Client extension for VS Code) to test the API endpoints.

## Deployment

This application is deployed on Render. Update the production URLs in the `routes.rest` file with your Render deployment URL.

## Technologies Used

- Node.js
- Express
- MongoDB
- dotenv for environment variables
- cors for Cross-Origin Resource Sharing
