# Medical Appointment API

![GitHub Repo Size](https://img.shields.io/github/repo-size/username/medical-appointment-api) ![License](https://img.shields.io/github/license/username/medical-appointment-api) ![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)

- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Architecture](#project-architecture)
- [AI-Powered Classification](#ai-powered-classification)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

The **Medical Appointment API** provides a robust backend system for patients, doctors, and administrators to manage appointments, medical records, and doctor availability. Built with Node.js, Express.js, and PostgreSQL, it ensures secure JWT-based authentication, role-based access control, and integrates AI-powered department classification via AWS Bedrock.

---

## Key Features

- 🔐 **Authentication & Authorization**: JWT-based login, registration, password change, and role-based access (patient, doctor, admin).
- 📆 **Appointment Scheduling**: 30-minute time slots, booking, cancellation, and calendar management.
- 🏥 **Medical Records**: CRUD operations with full audit trail via history logs.
- 🩺 **Doctor Availability**: Weekly scheduling with customizable blocks.
- 💼 **Services Management**: CRUD for medical services and fee management.
- 🤖 **AI Classification**: AWS Bedrock integration to classify patient issues into appropriate departments.
- 📷 **Image Upload**: Profile photo handling using Sharp.
- 📚 **API Documentation**: Swagger UI available at `/api-docs`.

---

## Technology Stack

- **Backend**: Node.js, Express.js 5.1.0
- **Database**: PostgreSQL with `pg` driver
- **Auth**: JWT (`jsonwebtoken`), bcrypt
- **AI**: AWS SDK for Bedrock
- **Validation**: Joi
- **Logging**: Winston, Morgan
- **File Processing**: Sharp
- **Documentation**: Swagger UI (OpenAPI 3.0.1)
- **Environment**: dotenv

---

## Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL v12+
- AWS account (for Bedrock AI)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kallash04/swe-medical-backend.git
   cd swe-medical-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and populate it with the following variables:

```dotenv
PGUSER=
PGHOST=
PGDATABASE=
PGPASSWORD=
PGPORT=
PG_MAX_CLIENTS=
PG_IDLE_TIMEOUT=
PG_CONN_TIMEOUT=

JWT_SECRET=
SALT_ROUNDS=
AWS_REGION=
PORT=3000
```

### Running the App

```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured `PORT`).

---

## Environment Variables

| Variable          | Description                 |
| ----------------- | --------------------------- |
| `PGUSER`          | PostgreSQL username         |
| `PGHOST`          | PostgreSQL host             |
| `PGDATABASE`      | PostgreSQL database name    |
| `PGPASSWORD`      | PostgreSQL password         |
| `PGPORT`          | PostgreSQL port             |
| `PG_MAX_CLIENTS`  | Max DB connections for pool |
| `PG_IDLE_TIMEOUT` | Pool idle timeout (ms)      |
| `PG_CONN_TIMEOUT` | Connection timeout (ms)     |
| `JWT_SECRET`      | Secret key for JWT signing  |
| `SALT_ROUNDS`     | bcrypt salt rounds          |
| `AWS_REGION`      | AWS region for Bedrock      |
| `PORT`            | Express server port         |

---

## API Endpoints

### Authentication (`/auth`)

- `POST /register` – User registration
- `POST /login` – User login
- `POST /change-password` – Update password

### User (`/user`)

- `GET /profile` – Fetch user profile
- `PUT /profile` – Update user profile
- `GET /doctors` – List available doctors

### Appointments (`/appointments`)

- `POST /` – Book an appointment
- `GET /` – List user appointments
- `PUT /:id` – Update appointment status
- `DELETE /:id` – Cancel appointment

### Doctor (`/doctor`)

- `GET /patients` – List assigned patients
- `GET /records/:patientId` – Fetch patient medical records
- `PUT /availability` – Set weekly availability

### Admin (`/admin`)

- `GET /users` – List all users
- `POST /doctors` – Create doctor account
- `DELETE /users/:id` – Remove user

### Departments (`/departments`)

- `GET /` – List departments
- `POST /` – Create department
- `PUT /:id` – Update department
- `DELETE /:id` – Delete department

### Availability (`/availability`)

- `GET /:doctorId` – Get doctor availability
- `POST /:doctorId` – Set availability blocks

### Services (`/services`)

- CRUD operations for medical services and fees

### History (`/history`)

- Audit trail endpoints for record changes

### AI Classification (`/api/ai`)

- `POST /classify` – Classify issue description into department

---

## Project Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Encapsulate business logic
- **Models**: Database schemas and queries
- **Middleware**: Authentication, authorization, validation, error handling
- **Utilities**: Helper functions, logger setup
- **Docs**: Swagger specification (`/swagger.json`)

---

## AI-Powered Classification

Utilizes AWS Bedrock to analyze patient issue descriptions and automatically assign the correct medical department, improving triage efficiency.



