const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Swagger components
const components = {
  schemas: {
    Contact: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
      properties: {
        id: {
          type: 'integer',
          description: 'Auto-generated contact ID',
        },
        firstName: {
          type: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Contact first name',
        },
        lastName: {
          type: 'string',
          minLength: 2,
          maxLength: 50,
          description: 'Contact last name',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Contact email address',
        },
        favoriteColor: {
          type: 'string',
          minLength: 3,
          maxLength: 20,
          description: 'Contact favorite color',
        },
        birthday: {
          type: 'string',
          format: 'date',
          description: 'Contact birthday in ISO format',
        },
      },
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: false,
        },
        error: {
          type: 'string',
          description: 'Error type/category',
        },
        message: {
          type: 'string',
          description: 'Human-readable error message',
        },
        details: {
          type: 'string',
          description: 'Technical error details',
        },
      },
    },
  },
  responses: {
    BadRequest: {
      description: 'Invalid request data',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ErrorResponse',
          },
        },
      },
    },
    NotFound: {
      description: 'Resource not found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ErrorResponse',
          },
        },
      },
    },
    ServerError: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/ErrorResponse',
          },
        },
      },
    },
  },
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE 341 API Documentation',
      version: '1.0.0',
      description: 'API documentation for CSE 341 project',
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: `https://cse341-7pys.onrender.com`,
        description: 'Production server',
      },
      {
        url: `http://localhost:${process.env.PORT || 8080}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  logger,
};
