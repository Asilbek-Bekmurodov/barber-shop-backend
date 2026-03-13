import swaggerJSDoc from "swagger-jsdoc"

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Barbershop Backend API",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://barber-shop-backend-zoxv.onrender.com",
      description: "Production",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Register payload",
                  value: {
                    name: "John Doe",
                    firstName: "John",
                    lastName: "Doe",
                    phone: "+998901234567",
                    age: 24,
                    rating: 4.8,
                    image: "https://cdn.example.com/uploads/uuid.jpg",
                    email: "john@example.com",
                    password: "Secret123!",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Login payload",
                  value: {
                    email: "john@example.com",
                    password: "Secret123!",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/barbers": {
      get: {
        tags: ["Barbers"],
        summary: "List barbers",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Barbers"],
        summary: "Create barber (admin or superadmin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create barber payload",
                  value: {
                    userId: "65f0d0b1c2a1b2c3d4e5f670",
                    name: "Aziz",
                    firstName: "Aziz",
                    lastName: "Karimov",
                    phone: "+998901234567",
                    rating: 4.7,
                    speciality: "Fade",
                    experience: 5,
                    image: "https://cdn.example.com/uploads/uuid.jpg",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/users": {
      post: {
        tags: ["Users"],
        summary: "Create user (superadmin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create user payload",
                  value: {
                    name: "Jane Doe",
                    firstName: "Jane",
                    lastName: "Doe",
                    phone: "+998901234567",
                    age: 22,
                    rating: 4.5,
                    image: "https://cdn.example.com/uploads/uuid.jpg",
                    email: "jane@example.com",
                    password: "Secret123!",
                    role: "admin",
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
      get: {
        tags: ["Users"],
        summary: "List users (superadmin only)",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/users/{id}": {
      put: {
        tags: ["Users"],
        summary: "Update user (superadmin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Update user payload",
                  value: {
                    name: "Jane Doe",
                    phone: "+998901234567",
                    age: 23,
                    rating: 4.6,
                    image: "https://cdn.example.com/uploads/uuid.jpg",
                    role: "admin",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (superadmin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/barbers/{id}/availability": {
      get: {
        tags: ["Barbers"],
        summary: "Get barber available slots",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string", example: "2026-03-12" },
          },
          {
            name: "slotMinutes",
            in: "query",
            required: false,
            schema: { type: "integer", example: 30 },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/barbers/{id}/photo": {
      post: {
        tags: ["Barbers"],
        summary: "Upload barber profile photo (owner barber, admin, or superadmin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/barbers/{id}/link-user": {
      post: {
        tags: ["Barbers"],
        summary: "Link barber profile to barber user (admin or superadmin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Link barber user payload",
                  value: {
                    userId: "65f0d0b1c2a1b2c3d4e5f670",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/barbers/{id}/services": {
      get: {
        tags: ["Barbers"],
        summary: "List barber services",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Barbers"],
        summary: "Create barber service (owner barber, admin, or superadmin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create barber service payload",
                  value: {
                    title: "Haircut",
                    price: 50000,
                    duration: 30,
                    description: "Classic haircut",
                  },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/api/barbers/{id}/services/{serviceId}": {
      put: {
        tags: ["Barbers"],
        summary: "Update barber service (owner barber, admin, or superadmin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Update barber service payload",
                  value: {
                    title: "Haircut Premium",
                    price: 70000,
                    duration: 45,
                    description: "Premium haircut",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Barbers"],
        summary: "Delete barber service (owner barber, admin, or superadmin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "serviceId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/users/{id}/photo": {
      post: {
        tags: ["Users"],
        summary: "Upload user profile photo",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/services": {
      get: {
        tags: ["Services"],
        summary: "List services",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Services"],
        summary: "Create service",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create service payload",
                  value: {
                    title: "Haircut",
                    price: 50000,
                    duration: 30,
                    description: "Classic haircut",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/services/{id}": {
      put: {
        tags: ["Services"],
        summary: "Update service",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Update service payload",
                  value: {
                    title: "Haircut Premium",
                    price: 70000,
                    duration: 45,
                    description: "Premium haircut",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Services"],
        summary: "Delete service",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/bookings": {
      get: {
        tags: ["Bookings"],
        summary: "List bookings",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Bookings"],
        summary: "Create booking",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create booking payload",
                  value: {
                    userId: "65f0d0b1c2a1b2c3d4e5f677",
                    barberId: "65f0d0b1c2a1b2c3d4e5f678",
                    serviceId: "65f0d0b1c2a1b2c3d4e5f679",
                    date: "2026-03-10",
                    startTime: "14:00",
                    status: "pending",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/bookings/{id}": {
      put: {
        tags: ["Bookings"],
        summary: "Update booking",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Update booking payload",
                  value: {
                    date: "2026-03-12",
                    startTime: "16:00",
                    status: "confirmed",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Bookings"],
        summary: "Delete booking",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Create review",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create review payload",
                  value: {
                    userId: "65f0d0b1c2a1b2c3d4e5f677",
                    barberId: "65f0d0b1c2a1b2c3d4e5f678",
                    rating: 5,
                    comment: "Zo'r xizmat!",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/reviews/barber/{id}": {
      get: {
        tags: ["Reviews"],
        summary: "Get reviews for a barber",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/admin/dashboard": {
      get: {
        tags: ["Admin"],
        summary: "Admin dashboard",
        responses: { 200: { description: "OK" } },
      },
    },
    "/api/upload": {
      post: {
        tags: ["Upload"],
        summary: "Upload image",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary" },
                },
                required: ["image"],
              },
              examples: {
                example: {
                  summary: "Upload image",
                  value: {
                    image: "(binary)",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
      delete: {
        tags: ["Upload"],
        summary: "Delete image",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Delete image payload",
                  value: {
                    key: "uploads/uuid.jpg",
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: "OK" } },
      },
    },
  },
}

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
})

export default swaggerSpec
