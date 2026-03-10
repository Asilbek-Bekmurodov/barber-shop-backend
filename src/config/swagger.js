import swaggerJSDoc from "swagger-jsdoc"

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Barbershop Backend API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5001}`,
      description: "Local",
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
        summary: "Create barber",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object" },
              examples: {
                example: {
                  summary: "Create barber payload",
                  value: {
                    name: "Aziz",
                    specialty: "Fade",
                    experienceYears: 5,
                  },
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
                    name: "Haircut",
                    price: 50000,
                    durationMinutes: 30,
                  },
                },
              },
            },
          },
        },
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
                    barberId: "65f0d0b1c2a1b2c3d4e5f678",
                    serviceId: "65f0d0b1c2a1b2c3d4e5f679",
                    date: "2026-03-10",
                    time: "14:00",
                    customerName: "John Doe",
                    customerPhone: "+998901234567",
                  },
                },
              },
            },
          },
        },
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
    },
  },
}

const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
})

export default swaggerSpec
