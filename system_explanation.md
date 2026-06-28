# Gemlast Project: System Explanation

## 1. Introduction

The Gemlast project appears to be a comprehensive educational management system designed to cater to various roles within an educational institution and government hierarchy. It supports functionalities ranging from user authentication and role-based access control to managing schools, students, teachers, attendance, scores, fees, announcements, and even exam questions and results. The system is built as a monorepo, leveraging modern web technologies for both its frontend and backend components.

## 2. Project Structure

The project is organized as a pnpm monorepo, which allows for managing multiple packages within a single repository. This structure promotes code sharing and consistency across different parts of the application. The main directories observed are:

*   `artifacts`: Contains deployable applications or services. In this project, it includes:
    *   `api-server`: The backend API service built with Express.js.
    *   `gebre-africa`: The main frontend application, likely a React-based web interface.
    *   `mockup-sandbox`: A minimal frontend application, possibly for development or testing UI components in isolation.
*   `lib`: Contains shared libraries and utilities used across the `artifacts`.
    *   `api-client-react`: A generated React Query client for interacting with the API.
    *   `api-spec`: Defines the OpenAPI specification for the backend API.
    *   `api-zod`: Contains generated Zod schemas for API data validation.
    *   `db`: Houses the Drizzle ORM configuration and database schema definitions.
*   `scripts`: Contains utility scripts, such as `hello.ts` and post-merge hooks.

## 3. Core Technologies

The Gemlast project utilizes a robust set of modern technologies:

*   **Frontend**: React, Vite, TypeScript, TailwindCSS, Radix UI, Wouter (for routing), Tanstack Query (for data fetching and caching).
*   **Backend**: Node.js, Express.js, TypeScript.
*   **Database**: PostgreSQL (managed via Drizzle ORM).
*   **Authentication**: Supabase.
*   **API Definition**: OpenAPI (Swagger).
*   **Code Generation**: Orval (for generating API clients and types), Zod (for schema validation).

## 4. API Layer

### OpenAPI Specification

The `lib/api-spec/openapi.yaml` file defines the contract for the backend API using OpenAPI 3.1.0. This specification ensures consistency between frontend and backend development. Currently, it includes a basic `/healthz` endpoint for checking server health, returning a `HealthStatus` object with a `status` field.

### Frontend API Client (`api-client-react`)

The `lib/api-client-react` package contains a generated API client, likely produced by Orval based on the `openapi.yaml`. This client uses `@tanstack/react-query` to provide hooks for data fetching, caching, and synchronization with the backend. For example, `api.ts` in this package includes `useHealthCheck` for querying the health endpoint.

### Frontend Custom Fetch (`artifacts/gebre-africa/src/lib/api.ts`)

The main frontend application (`gebre-africa`) employs a custom API wrapper (`api.ts`) that integrates with Supabase for authentication. This wrapper handles:

*   **Session Management**: Retrieves the Supabase session and attempts a silent refresh if the session is expired or not yet loaded.
*   **Authentication Headers**: Attaches `Authorization: Bearer <token>` headers to outgoing requests using the Supabase access token.
*   **Request Helpers**: Provides `apiGet` and `apiPost` functions for making authenticated GET and POST requests, respectively, with built-in error handling.

This custom fetch layer indicates that the frontend directly interacts with the backend API, with Supabase acting as the authentication provider.

### Backend API Server (`artifacts/api-server`)

The backend is an Express.js application responsible for handling API requests. Key aspects include:

*   **Application Assembly**: `artifacts/api-server/src/app.ts` sets up the Express app, configures logging (`pino-http`), enables CORS, and parses JSON/URL-encoded request bodies.
*   **Routing**: `artifacts/api-server/src/routes/index.ts` aggregates various route modules (e.g., `health`, `geo`, `me`, `students`, `teachers`, `announcements`, `exams`) and mounts them under the `/api` base path.
*   **Server Bootstrap**: `artifacts/api-server/src/index.ts` handles environment variable validation for the `PORT` and starts the Express server.

## 5. Authentication and Authorization

Authentication and authorization are critical aspects of the Gemlast system, handled through a combination of Supabase and custom middleware.

### Supabase Integration

Supabase serves as the primary authentication provider. Both the frontend and backend interact with Supabase:

*   **Frontend (`artifacts/gebre-africa/src/lib/supabase/client.ts`)**: Initializes a Supabase client with session persistence and auto-refresh capabilities.
*   **Backend (`artifacts/api-server/src/lib/supabase.ts`)**: Provides server-side helpers to create a Supabase client, validate bearer tokens, and retrieve authenticated user information.

### Client-Side Protection (`AuthGuard.tsx`)

In the frontend, `artifacts/gebre-africa/src/components/auth/AuthGuard.tsx` acts as a client-side route guard. It checks the current Supabase user session and redirects unauthenticated users to the `/login` page. It also displays a loading state while the authentication status is being verified.

### Server-Side Access Control (`auth.ts` Middleware)

The `artifacts/api-server/src/middlewares/auth.ts` file defines crucial middleware for server-side authentication and authorization:

*   **`requireAuth`**: This middleware extracts the bearer token from the `Authorization` header, uses Supabase to verify the token and retrieve the authenticated user (`authUser`). It then queries the database to find the corresponding `dbUser` (from the `users` table) and attaches both to the request object. If authentication fails, it returns a 401 Unauthorized response.
*   **`requireRole(...roles)`**: This higher-order middleware enforces role-based access. It checks if the authenticated `dbUser` has one of the specified roles. If not, it returns a 403 Forbidden response. Defined roles include `DIRECTOR`, `VICE_ACADEMIC`, `VICE_ADMIN`, `RECORD_OFFICE`, `HR`, `CASHIER`, `TEACHER`, `STUDENT`, `PARENT`, and various administrative roles (`WOREDA_ADMIN`, `ZONE_ADMIN`, `REGION_ADMIN`, `MINISTRY_ADMIN`, `EXAM_OFFICER`).
*   **`requireSchool`**: This middleware ensures that school-level users (non-admin roles) have an associated `schoolId` in their profile. It prevents access for such users if their `schoolId` is missing, returning a 403 Forbidden response. Administrative roles are exempt from this check.

## 6. Database Layer

### Drizzle ORM

The project uses Drizzle ORM for interacting with a PostgreSQL database. Drizzle provides a type-safe way to define schemas and perform database operations, enhancing developer experience and reducing errors.

### Database Schema (`lib/db/src/schema/index.ts`)

The `lib/db/src/schema/index.ts` file defines the entire database schema using Drizzle's `pgTable` and `pgEnum` functions. The schema is extensive and covers various entities:

*   **Enums**: Defines several enumerations for roles (`roleEnum`), gender (`genderEnum`), attendance status (`attendanceStatusEnum`), fee status (`feeStatusEnum`), question types (`questionTypeEnum`), exam status (`examStatusEnum`), school types (`schoolTypeEnum`), and educational levels (`educationalLevelEnum`).
*   **Government Hierarchy**: Tables to represent geographical and administrative divisions:
    *   `countries`
    *   `regions` (references `countries`)
    *   `zones` (references `regions`)
    *   `woredas` (references `zones`)
*   **School & Sections**: Tables for managing educational institutions and their structure:
    *   `schools` (references `regions`, `zones`, `woredas`, `countries`)
    *   `grades` (references `schools`)
    *   `sections` (references `grades`)
*   **User & Authentication**: Core tables for user management:
    *   `users`: Stores user details, including `authUserId` (linked to Supabase), email, role, names, phone, and `schoolId`.
    *   `teachers` (references `users`, `schools`)
    *   `students` (references `users`, `schools`, `grades`, `sections`)
    *   `parents` (references `users`)
*   **Attendance**: `attendance` table (references `students`, `users` for `markedById`).
*   **Scores**: `scores` table (references `students`).
*   **Fees**: `fees` table (references `students`).
*   **Announcements**: `announcements` table (references `schools`, `users` for `authorId`).
*   **Questions & Exams**: Tables for managing assessments:
    *   `questions` (references `users` for `createdById`)
    *   `exams` (references `schools`, `users` for `createdById`)
    *   `examResults` (references `exams`, `students`)

## 7. Frontend Application (`artifacts/gebre-africa`)

The `artifacts/gebre-africa` directory contains the main user-facing application. Its `App.tsx` file is the central component that orchestrates the application's structure and navigation:

*   **Root Component**: The `App` component wraps the entire application with necessary providers:
    *   `QueryClientProvider`: For `@tanstack/react-query` to manage data fetching.
    *   `LanguageProvider`: For internationalization (i18n).
    *   `TooltipProvider`: For UI tooltips.
    *   `WouterRouter`: The routing library used for client-side navigation.
    *   `Toaster`: For displaying toast notifications.
*   **Routing (`Router` component)**: Defines a comprehensive set of routes using `wouter`'s `Switch` and `Route` components. The routes are categorized into:
    *   **Auth Routes**: `/login`, `/signup` (multi-step process), `/verify-email`, `/role-selection`, `/onboarding/director`.
    *   **Role-Specific Dashboards**: Extensive routing for various roles like `director`, `vice-academic`, `vice-admin`, `hr`, `cashier`, `record-office`, `teacher`, `parent`, and administrative hierarchy roles (`woreda`, `zone`, `region`, `ministry`). Many of these routes are wrapped with `AuthGuard` to ensure authenticated access.
    *   **Exam Management**: Routes for `question-bank`, `create-exam`, and `results`.
    *   **Utility Pages**: `ComingSoonPage`, `IndexRedirect`, and `NotFound`.
*   **UI Components**: The application leverages a component library based on Radix UI primitives and styled with TailwindCSS, as indicated by imports like `@/components/ui/toaster` and `@/components/ui/tooltip`.

## 8. Data Flow Overview

1.  **User Interaction**: A user interacts with the frontend application (`gebre-africa`), triggering actions that require data from the backend (e.g., logging in, viewing a dashboard, submitting a form).
2.  **Frontend API Call**: The frontend's custom `apiFetch` (or `apiGet`/`apiPost`) function is invoked. This function first retrieves the user's Supabase session and ensures it's valid, refreshing it if necessary. It then attaches the Supabase access token as a Bearer token in the `Authorization` header.
3.  **Backend API Request**: The authenticated request is sent to the backend API server (`api-server`).
4.  **Backend Authentication Middleware**: The `requireAuth` middleware intercepts the request. It validates the bearer token using Supabase, identifies the `authUser`, and fetches the corresponding `dbUser` from the PostgreSQL database using Drizzle ORM. Both `authUser` and `dbUser` are attached to the request object.
5.  **Backend Authorization Middleware**: If applicable, `requireRole` and `requireSchool` middlewares further restrict access based on the `dbUser`'s role and `schoolId`.
6.  **Route Handler**: If the request passes all authentication and authorization checks, the appropriate route handler in the `api-server` processes the request. This handler uses Drizzle ORM to interact with the PostgreSQL database (e.g., querying for student records, updating attendance, creating announcements).
7.  **Database Interaction**: Drizzle ORM translates the application logic into SQL queries, which are executed against the PostgreSQL database.
8.  **Response Generation**: The backend processes the data, constructs a response (often JSON), and sends it back to the frontend.
9.  **Frontend Data Handling**: The frontend receives the response. `@tanstack/react-query` (or direct `apiFetch` usage) handles parsing the response, updating the UI, and caching data as needed.

## 9. Conclusion

Gemlast is a well-structured educational management system built with a modern TypeScript-based monorepo architecture. It features a robust authentication and authorization system leveraging Supabase and custom Express.js middleware, ensuring secure access for various user roles. The use of Drizzle ORM for database interactions provides type safety and a clear schema definition for managing complex educational data. The React frontend, with its comprehensive routing and UI components, offers a rich user experience across different functional areas of the system. The project demonstrates a clear separation of concerns and a strong foundation for further development and scalability.
