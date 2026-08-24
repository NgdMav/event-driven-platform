# Project: Fit Platform (Fitness & Workout Tracker)

## Overview
A microservice fitness platform. The backend consists of Spring Boot services behind API Gateway. The frontend is a Next.js (App Router) application that communicates ONLY with API Gateway.

## Tech Stack
### Backend (Already implemented, do not touch unless absolutely necessary)
- Java 21, Spring Boot 3.4.x, Maven
- PostgreSQL 16, Flyway, RabbitMQ
- API Gateway (Spring Cloud Gateway MVC)
- Auth: JWT. The "Header Trust" pattern is used (Gateway validates the JWT and forwards the X-User-Id to internal services).

### Frontend (AI Responsibility)
- Next.js 14+ (App Router), TypeScript (Strict mode)
- Tailwind CSS + shadcn/ui (or lucide-react for icons)
- TanStack Query (React Query) for server state and caching
- Zustand for client state (token storage, UI)
- Zod + React Hook Form for form validation
- Axios with interceptors for HTTP requests

## Architecture & Rules
1. **API Communication**: The frontend makes requests ONLY to `http://localhost:8080` (API Gateway). Direct calls to microservices are prohibited.
2. **Auth Flow**:
- Tokens (`accessToken`, `refreshToken`) are stored in Zustand (or httpOnly cookies).
- The Axios interceptor adds `Authorization: Bearer <token>` to every request.
- If `401 Unauthorized` occurs, the interceptor should automatically call `/api/auth/refresh`, refresh the token, and retry the original request.
3. **Frontend Structure**:
- `/app` - Pages (App Router).
- `/components` - Reusable UI components.
- `/lib/api` - Axios instance, API clients, interceptors.
- `/hooks` - Custom hooks (wrappers over TanStack Query).
- `/store` - Custom stores.
4. **Code Style**:
- Strong TypeScript typing. No `any`.
- Use `record` or `interface` for DTOs that mirror the backend. - Handle `isLoading`, `isError`, and `Empty` states in the UI.

## Backend API Reference (Current scope)
- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Profile**: `GET /api/profile/me`, `PUT /api/profile/me` (Accepts JSON with fields: firstName, lastName, heightCm, weightKg, goal, experienceLevel, etc.)
- **Catalog**: `GET /api/catalog/exercises`, `GET /api/catalog/exercises/{id}`, `GET /api/catalog/exercises/slug/{slug}`, `POST /api/catalog/exercises/filter`, `GET /api/catalog/exercises/search?query=...`