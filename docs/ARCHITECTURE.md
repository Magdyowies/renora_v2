# System Architecture

This document provides a detailed overview of the Rentora system's architecture, covering the backend, frontend, database, and core business logic.

## 1. High-Level Architecture

Rentora is a monolithic repository containing three main applications:

1.  **Backend (`rentora_backend`)**: A monolithic Django application powered by the Django REST Framework (DRF) that serves a comprehensive REST API.
2.  **Frontend (`frontend`)**: A React (Vite) single-page application (SPA) that serves as the primary interface for `Customer` and `Vendor` users.
3.  **Admin Dashboard (`admin-dashboard`)**: A separate React (Vite) SPA exclusively for `Admin` users to manage the entire platform.

The frontend applications are completely decoupled from the backend. They communicate with the backend exclusively through the REST API.



---

## 2. Backend Architecture (`rentora_backend`)

The backend is built with Django and follows a modular, app-based architecture. All business logic, data processing, and authentication are handled here.

### 2.1. Django Apps

The project is divided into several Django apps, each with a distinct responsibility:

-   **`accounts`**: Manages user authentication, profiles, and roles. This is the core of the RBAC (Role-Based Access Control) system.
-   **`vehicles`**: Manages vehicle information, including categories, specifications, pricing, and images.
-   **`bookings`**: Handles the entire booking lifecycle, from creation and price calculation to status updates. This app contains critical business logic.
-   **`payments`**: A sophisticated module that manages user wallets, payment transactions (via Stripe), and a promotional code engine.
-   **`reviews`**: Allows customers to leave reviews after a booking is completed. It links directly to the `bookings` app to ensure data integrity.
-   **`chat`**: Implements a real-time messaging feature, likely between customers and vendors.
-   **`core`**: Contains shared models, utilities, or management commands used across multiple apps.

### 2.2. Authentication & Authorization

-   **Authentication**: The system uses **JSON Web Tokens (JWT)** for authentication, implemented via the `rest_framework_simplejwt` library.
    -   When a user logs in, the API generates a short-lived `access` token and a long-lived `refresh` token.
    -   The `access` token is sent in the `Authorization: Bearer <token>` header of every subsequent request to access protected resources.
    -   Once the `access` token expires, the `refresh` token is used to obtain a new one without requiring the user to log in again.

-   **Authorization (Permissions)**:
    -   The default permission level across the API is `IsAuthenticatedOrReadOnly`. This means that `GET` requests are generally public, while `POST`, `PUT`, `DELETE` methods require an authenticated session.
    -   This default is overridden in specific views to implement fine-grained Role-Based Access Control (RBAC). For example, only users with the `Vendor` role can create or update vehicles.

### 2.3. Role-Based Access Control (RBAC)

RBAC is managed via the custom `accounts.User` model, which includes a `role` field with three possible values:

-   `customer`: Can browse vehicles, make bookings, and write reviews.
-   `vendor`: Has all customer permissions, plus the ability to create, update, and manage their own vehicle listings.
-   `admin`: Has full system access. Can manage all users, vehicles, bookings, and platform settings through the dedicated `admin-dashboard` and its corresponding `/api/admin/` endpoints.

The backend enforces these roles using custom permission classes in its API views.

---

## 3. Frontend Architecture (`frontend` & `admin-dashboard`)

Both frontend applications are built with React and Vite, but they serve different purposes and user roles.

### 3.1. Common Structure

Both projects share a conventional React application structure:

-   **`pages/`**: Contains top-level components that correspond to a specific URL route (e.g., `LoginPage`, `VehiclesPage`).
-   **`components/`**: Contains smaller, reusable UI elements used across multiple pages (e.g., `Button`, `Card`, `Modal`).
-   **`context/`**: Manages global state. The `AuthContext.jsx` is particularly important, as it holds the user's authentication state (tokens, user info) and makes it available to the entire application.
-   **`services/`**: This directory is intended to encapsulate all API communication logic. Functions here would use `axios` or `fetch` to call the Django backend, handling request formatting and response processing.
-   **`layouts/`** (`admin-dashboard` only): Provides a consistent structure for the admin panel, containing shared elements like the main `Sidebar` and `Header`.

### 3.2. Frontend ↔ Backend Integration

-   **API Calls**: The React frontends communicate with the Django backend via asynchronous REST API calls. These calls are centralized in the `services/` directory.
-   **Authentication Flow**:
    1.  A user submits their credentials on the `Login` page.
    2.  An API call is made to the `/api/auth/login/` endpoint.
    3.  If successful, the backend returns `access` and `refresh` tokens.
    4.  The `AuthContext` stores these tokens (typically in `localStorage`) and the user's information.
    5.  For all subsequent API calls to protected endpoints, the `access` token is retrieved from storage and added to the request headers.
-   **Protected Routes**: Both React apps implement protected routes. If a non-authenticated user tries to access a page that requires a login, they are automatically redirected to the `/login` page. This logic is managed by consuming the `AuthContext`.

---

## 4. Database & Business Logic

The database schema is designed using Django's ORM and is stored in PostgreSQL.

### 4.1. Main Entities & Relationships

-   **User**: The central model. A `User` can be a `Customer`, `Vendor`, or `Admin`.
    -   A `Vendor` (User) has a one-to-many relationship with `Vehicle` (a vendor can have many vehicles).
-   **Vehicle**: Represents a vehicle for rent.
    -   It has a foreign key to the `User` model (the vendor).
-   **Booking**: The core transactional model.
    -   It has foreign keys to both `User` (the customer booking it) and `Vehicle`.
    -   It contains a critical piece of business logic in its `save()` method: `total_price = (end_date - start_date).days * vehicle.price_per_day`. **This is a dangerous area to modify.**
-   **Payment**: Tracks financial transactions.
    -   It is linked to a `Booking`.
    -   Each `User` also has a `Wallet` for storing credits.
-   **Review**: Captures user feedback.
    -   It has a one-to-one relationship with `Booking`, ensuring a booking can only be reviewed once.



### 4.2. Key Business Flows

-   **Booking Flow**:
    1.  A customer initiates a booking for a vehicle for a set date range.
    2.  An API call is sent to `/api/bookings/`.
    3.  The backend creates a `Booking` instance.
    4.  The model's `save()` method is triggered, automatically calculating `total_price`.
    5.  The vehicle's availability status might be updated.
    6.  The booking is saved with an initial status (e.g., `pending`).

-   **Payment Flow**:
    1.  After a booking is created, the user is directed to pay.
    2.  They can choose to pay via their `Wallet` or a new payment method (Stripe).
    3.  An API call to the `/api/payments/` endpoint initiates the transaction.
    4.  If a promo code is used, its validity is checked and the discount is applied.
    5.  Upon successful payment (confirmed via Stripe webhook or API response), the `Payment` status and the associated `Booking` status are updated to `confirmed`.
