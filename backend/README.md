# 📚 Bookstore RESTful API

A robust, production-ready backend service built with Node.js, Express, MongoDB, and Mongoose for managing bookstore operations, user authentication, and order processing.

---

## 🚀 Tech Stack

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Validation:** Joi
- **Security:** Helmet, Express Rate Limit, CORS
- **Logging:** Winston
- **Documentation:** Swagger UI / OpenAPI 3.0

---

## 📌 API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| `GET` | `/api/books` | Public | Get a list of all available books |
| `GET` | `/api/books/:id` | Public | Get detailed information for a single book |
| `POST` | `/api/books` | Admin | Add a new book to inventory |
| `PUT` | `/api/books/:id` | Admin | Update existing book details |
| `DELETE` | `/api/books/:id` | Admin | Remove a book from inventory |
| `POST` | `/api/orders` | Protected | Create a new book order |
| `GET` | `/api/orders/my-orders` | Protected | Get logged-in user order history |

---

## ⚙️ Local Setup & Installation

1. Clone the repository and navigate to backend:
   ```bash
   git clone <repository-url>
   cd backend