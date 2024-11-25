# **Be News API**

**Description**  
Be News API is the backend service for a community-oriented application, designed to provide programmatic access to core application data. Built with a RESTful architecture, this API supports CRUD operations, enabling users to interact with resources such as articles, comments, users, and topics. The API forms the foundation for frontend applications, facilitating features like article management, topic exploration, commenting, and voting.

---

## **Features**

- **Article Management**: Perform CRUD operations on articles, including adding, updating, deleting, and fetching article details.
- **Commenting System**: Enable users to post, retrieve, and delete comments on articles.
- **Voting Mechanism**: Users can vote to upvote or downvote articles and comments.
- **Topic Navigation**: Retrieve information about various topics.
- **User Management**: Access and manage user profiles and associated data.
- **Error Handling**: Comprehensive error handling for invalid routes, requests, and data validation.

---

## **Hosted Version**

Access the hosted version of the API:  
**URL**: [https://be-news-api-production.up.railway.app/api](https://be-news-api-production.up.railway.app/api)

---

## **Technologies Used**

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **Testing**: Jest and Supertest for unit and integration testing
- **Hosting**: Railway (https://Railway.com/)

---

## **Using the API**

The API exposes endpoints for the following functionalities:
- **/api/articles**: Access, create, or update articles.
- **/api/articles/:article_id/comments**: Add or fetch comments on a specific article.
- **/api/topics**: Retrieve information about topics.
- **/api/users**: Access user profiles.

For a full list of endpoints and their functionalities, refer to the [API Documentation](#).

---

## **For Developers**

If you wish to contribute or run the project locally, follow these steps:

### **Prerequisites**

- **Node.js** (version 14 or higher)
- **PostgreSQL** (version 12 or higher)

### **Installation**

1. Clone the repository:
   ```
   git clone https://github.com/your_username/community-hub-api.git
   ```
2. Navigate to the project directory:
   ```
   cd community-hub-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### **Setup Environment Variables**

1. Create two `.env` files in the root directory:
   - `.env.development` for development environment variables.
   - `.env.test` for test environment variables.
2. Add the following configuration to each file:
   ```
   PGDATABASE=[database_name]
   ```
   Use one database for testing and another for development.

### **Seeding the Database**

Seed the local database with initial data:
```
npm run seed
```

### **Running Tests**

Run the tests to ensure everything is set up correctly:
```
npm test
```

### **Starting the Server**

Start the development server:
```
npm run dev
```

The server will run on `http://localhost:3000` by default.

---

## **Future Enhancements**

- **Enhanced Authentication**: Introduce user authentication and authorization.
- **Search Functionality**: Implement search features for articles and comments.
- **Real-Time Updates**: Enable real-time article and comment updates with WebSocket integration.
- **Pagination Improvements**: Add dynamic page size configuration for more flexible data navigation.

---

## **Contributing**

Contributions are welcome! Fork the repository and submit pull requests with your enhancements or fixes.

---

## **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## **Related Projects**

<section id="related-projects">
  <h2>Related Projects</h2>
  <p>
    The <strong>Trail Talk</strong> frontend application is powered by the <strong>Be News API</strong>. 
    The API provides the backend infrastructure to manage data for articles, comments, users, and topics, 
    enabling the seamless functionality of the web app.
  </p>
  <ul>
    <li>
      <a href="https://github.com/dudleyspence/TrailTalk" target="_blank">Trail Talk (Frontend Application)</a>
      <p>A web-based application for hikers to explore and interact with articles and discussions.</p>
    </li>
    <li>
      <a href="https://github.com/dudleyspence/Be-News-API" target="_blank">Be News API (Backend Service)</a>
      <p>A RESTful API providing the backend services for articles, comments, users, and topics.</p>
    </li>
  </ul>
</section>

