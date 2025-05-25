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

// Swagger options
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
    components: {
      schemas: {
        Product: {
          type: 'object',
          required: ['name', 'description', 'price', 'category', 'stock', 'manufacturer', 'isActive'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated product ID',
              readOnly: true
            },
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Product name',
              example: 'Laptop'
            },
            description: {
              type: 'string',
              minLength: 10,
              maxLength: 500,
              description: 'Product description',
              example: 'Powerful laptop with 16GB RAM and 512GB SSD'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0,
              description: 'Product price',
              example: 1200.50
            },
            category: {
              type: 'string',
              enum: ['electronics', 'clothing', 'food', 'home', 'other'],
              description: 'Product category',
              example: 'electronics'
            },
            stock: {
              type: 'integer',
              minimum: 0,
              description: 'Available quantity in stock',
              example: 50
            },
            manufacturer: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Product manufacturer',
              example: 'Dell'
            },
            isActive: {
              type: 'boolean',
              description: 'Product availability status',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Product creation date',
              readOnly: true
            },
          },
          example: {
            name: 'Laptop',
            description: 'Powerful laptop with 16GB RAM and 512GB SSD',
            price: 1200.50,
            category: 'electronics',
            stock: 50,
            manufacturer: 'Dell',
            isActive: true,
            createdAt: '2023-10-27T10:00:00Z'
          }
        },
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
              example: {
                success: false,
                error: 'Validation Error',
                message: 'Invalid input for product creation',
                details: '"name" is required'
              }
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
              example: {
                success: false,
                error: 'Not Found',
                message: 'Product not found'
              }
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
              example: {
                success: false,
                error: 'Server Error',
                message: 'Failed to retrieve products',
                details: 'Database connection failed'
              }
            },
          },
        },
        ProductListResponse: {
          description: 'List of all products',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  count: {
                    type: 'integer',
                    example: 2
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Product'
                    }
                  }
                },
                example: {
                  success: true,
                  count: 2,
                  data: [
                    {
                      name: 'Laptop',
                      description: 'Powerful laptop with 16GB RAM and 512GB SSD',
                      price: 1200.50,
                      category: 'electronics',
                      stock: 50,
                      manufacturer: 'Dell',
                      isActive: true,
                      createdAt: '2023-10-27T10:00:00Z'
                    },
                    {
                      id: 2,
                      name: 'Mouse',
                      description: 'Wireless ergonomic mouse',
                      price: 25.99,
                      category: 'electronics',
                      stock: 150,
                      manufacturer: 'Logitech',
                      isActive: true,
                      createdAt: '2023-10-27T10:05:00Z'
                    }
                  ]
                }
              }
            }
          }
        },
        ProductCreationSuccessResponse: {
          description: 'Product created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  id: {
                    type: 'integer',
                    description: 'ID of the newly created product',
                    example: 3
                  },
                  message: {
                    type: 'string',
                    example: 'Product created successfully'
                  }
                },
                example: {
                  success: true,
                  id: 3,
                  message: 'Product created successfully'
                }
              }
            }
          }
        },
        ProductUpdateSuccessResponse: {
          description: 'Product updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Product updated successfully'
                  },
                  modifiedCount: {
                    type: 'integer',
                    description: 'Number of documents modified',
                    example: 1
                  }
                },
                example: {
                  success: true,
                  message: 'Product updated successfully',
                  modifiedCount: 1
                }
              }
            }
          }
        },
        ProductDeleteSuccessResponse: {
          description: 'Product deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: 'Product deleted successfully'
                  }
                },
                example: {
                  success: true,
                  message: 'Product deleted successfully'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
  logger,
};
