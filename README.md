# Tiffin Management System

Enterprise-level full-stack Tiffin Management System built for the **RSM Innovation Java + React Developer Assessment**.

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, Spring Security, JWT |
| Frontend | React 18, React Router DOM, Axios, Bootstrap 5, Vite |
| Database | Oracle Database 21c XE |
| Build | Maven (Backend), npm (Frontend) |

## Project Structure

```
SibaSethy_RSM_Innovation_Submission/
├── backend/                    # Spring Boot REST API
│   └── src/main/java/com/rsm/tiffin/
│       ├── controller/         # REST Controllers
│       ├── service/            # Service Interfaces
│       ├── service/impl/       # Service Implementations
│       ├── repository/         # JPA Repositories
│       ├── entity/             # JPA Entities
│       ├── dto/                # Data Transfer Objects
│       ├── config/             # Security & App Config
│       ├── security/           # JWT & UserDetails
│       ├── exception/          # Global Exception Handling
│       ├── mapper/             # Entity-DTO Mappers
│       └── util/               # File Storage & PDF Utils
├── frontend/                   # React SPA
│   └── src/
│       ├── components/         # Reusable UI Components
│       ├── pages/              # Admin & Student Pages
│       ├── layouts/            # Sidebar & Layouts
│       ├── services/           # Axios API Services
│       ├── routes/             # Protected Routes
│       ├── context/            # Auth Context
│       └── utils/              # Helpers & Toast Utils
├── database/                   # Oracle SQL Scripts
└── postman/                    # Postman API Collection
```

## Features

### Authentication
- Student Registration & Login
- Admin Login
- JWT Token-based Authentication
- BCrypt Password Encryption
- Role-Based Access Control (ADMIN / STUDENT)

### Admin Panel
- Dashboard with KPI cards
- Student Management (CRUD, Search, Activate/Deactivate)
- Attendance Management
- Menu Management
- Order Management
- PDF Export (Students & Attendance)

### Student Panel
- Dashboard with order & attendance stats
- View Daily & Weekly Menu
- Place & Cancel Orders
- View Attendance Records
- Profile Management & Aadhaar Upload

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+
- Oracle Database 21c XE

## Database Setup

1. Start Oracle Database 21c XE
2. Run as SYS/SYSTEM:
   ```sql
   @database/create_user.sql
   ```
3. Connect as `tiffin_user` and run:
   ```sql
   @database/schema.sql
   ```

## Backend Setup

1. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
   spring.datasource.username=tiffin_user
   spring.datasource.password=tiffin_pass
   ```

2. Build and run:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

Backend runs at: **http://localhost:8080**

### Default Admin Credentials
| Email | Password |
|-------|----------|
| admin@tiffin.com | Admin@123 |

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET/POST/PUT/DELETE | `/api/students` | Admin |
| GET/POST/PUT/DELETE | `/api/attendance` | Admin (write), All (read) |
| GET/POST/PUT/DELETE | `/api/menus` | Admin (write), All (read) |
| GET/POST/PUT/DELETE | `/api/orders` | Role-based |
| GET | `/api/dashboard/admin` | Admin |
| GET | `/api/dashboard/student` | Student |
| GET | `/api/reports/students/pdf` | Admin |
| GET | `/api/reports/attendance/pdf` | Admin |

## Security

- All APIs secured with JWT (except `/api/auth/**`)
- Admin-only endpoints protected with `@PreAuthorize("hasRole('ADMIN')")`
- Student can only access own data for profile, orders, and attendance
- CORS configured for `http://localhost:3000`

## Postman Collection

Import `postman/Tiffin_Management_API.postman_collection.json` into Postman.

1. Run **Login** request (auto-saves JWT token)
2. Use other requests with Bearer token authentication

## Bonus Features Implemented

- PDF Report Generation (Students & Attendance)
- Pagination & Search Filters
- Sorting on student list
- Responsive Mobile Design
- Toast Notifications
- Loading Spinners
- File Upload (Aadhaar Card)

## Author

**Siba Sethy** — RSM Innovation Assessment Submission
