const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
      description: "API for managing book reviews and ratings.",
    },
    servers: [
      { url: "http://localhost:3000", description: "Development server" },
      {
        url: "https://project-c38u.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "connect.sid", // Default cookie name for express-session
        },
      },
      schemas: {
        Book: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60c72b2f9b1d8c001f8e4d2a" },
            title: { type: "string", example: "The Great Gatsby" },
            author: { type: "string", example: "F. Scott Fitzgerald" },
            genre: { type: "string", example: "Fiction" },
            publishedYear: { type: "number", example: 1925 },
            isbn: { type: "string", example: "978-0743273565" },
            summary: {
              type: "string",
              example:
                "A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
            },
            averageRating: { type: "number", example: 4.2 },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Review: {
          type: "object",
          properties: {
            _id: { type: "string", example: "60c72b2f9b1d8c001f8e4d2b" },
            bookId: { type: "string", example: "60c72b2f9b1d8c001f8e4d2a" },
            userId: { type: "string", example: "60c72b2f9b1d8c001f8e4d2c" },
            rating: { type: "number", example: 5 },
            comment: { type: "string", example: "An absolute masterpiece!" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
