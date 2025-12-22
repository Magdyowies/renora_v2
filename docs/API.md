# Rentora API Documentation

This document provides a detailed reference for the Rentora REST API.

**Base URL**: `/api/`

**Authentication**: Most endpoints require a JWT token provided in the `Authorization: Bearer <token>` header. Publicly accessible endpoints are marked.

---

## 1. Authentication (`/api/auth/`)

Handles user registration, login, and profile management.

### `POST /api/auth/register/`
- **Description**: Registers a new user.
- **Auth Required**: No.
- **Request Payload**:
  ```json
  {
    "email": "user@example.com",
    "username": "newuser",
    "password": "strongpassword123",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "user": { "...user object..." },
    "message": "User Created Successfully. Now perform Login to get your token"
  }
  ```
- **Errors**: `400 Bad Request` if validation fails (e.g., username taken).

### `POST /api/auth/login/`
- **Description**: Authenticates a user and returns JWT tokens.
- **Auth Required**: No.
- **Request Payload**:
  ```json
  {
    "email": "user@example.com",
    "password": "strongpassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "username": "newuser",
    "role": "customer",
    "...other user details...",
    "tokens": {
      "refresh": "eyJ...",
      "access": "eyJ..."
    }
  }
  ```
- **Errors**: `400 Bad Request` for invalid credentials.

### `POST /api/auth/refresh/`
- **Description**: Refreshes an expired access token.
- **Auth Required**: No (but requires a valid refresh token).
- **Request Payload**:
  ```json
  {
    "refresh": "eyJ..."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access": "eyJ..."
  }
  ```

### `POST /api/auth/logout/`
- **Description**: Blacklists a refresh token to log a user out.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "refresh": "eyJ..."
  }
  ```
- **Response**: `205 Reset Content`.

### `GET /api/auth/profile/`
- **Description**: Retrieves the profile of the currently authenticated user.
- **Auth Required**: Yes.
- **Response (200 OK)**: User profile object.

### `PUT/PATCH /api/auth/profile/update/`
- **Description**: Updates the profile of the currently authenticated user.
- **Auth Required**: Yes.
- **Request Payload**: Partial or full user profile object.
- **Response (200 OK)**: Updated user profile object.

### `PUT /api/auth/change-password/`
- **Description**: Changes the password for the authenticated user.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "old_password": "currentpassword",
    "new_password": "newstrongpassword"
  }
  ```
- **Response (200 OK)**: `{ "message": "Password updated successfully" }`.

### `GET /api/auth/verify/`
- **Description**: Verifies if the current access token is valid.
- **Auth Required**: Yes.
- **Response (200 OK)**: `{ "valid": true }`.

---

## 2. Users (`/api/users/` & `/api/admin/users/`)

### `GET /api/users/<int:id>/stats/`
- **Description**: Retrieves booking statistics for a specific user. Admins can view any user's stats; regular users can only view their own.
- **Auth Required**: Yes.
- **Response (200 OK)**:
  ```json
  {
    "totalBookings": 5,
    "totalSpent": 1250.00,
    "activeRentals": 1,
    "completedRentals": 4
  }
  ```

### `GET /api/admin/users/`
- **Description**: (Admin only) Lists all users in the system.
- **Auth Required**: Yes (Admin).
- **Response (200 OK)**: Array of user objects.

### `POST /api/admin/users/`
- **Description**: (Admin only) Creates a new user.
- **Auth Required**: Yes (Admin).
- **Request Payload**: Full user object including `role`.
- **Response (201 Created)**: The created user object.

### `GET/PUT/PATCH/DELETE /api/admin/users/<int:id>/`
- **Description**: (Admin only) Retrieve, update, or delete a specific user.
- **Auth Required**: Yes (Admin).
- **Response (200 OK / 204 No Content)**: The user object or empty on delete.

---

## 3. Vehicles (`/api/vehicles/` & `/api/admin/vehicles/`)

### `GET /api/vehicles/`
- **Description**: Lists all `available` vehicles. Supports filtering and searching.
- **Auth Required**: No.
- **Query Params**: `category`, `transmission`, `fuel_type`, `min_price`, `max_price`, `location`, `seats`, `search`, `ordering`.
- **Response (200 OK)**: Array of vehicle list objects.

### `POST /api/vehicles/search/`
- **Description**: An alternative to the GET endpoint that accepts search/filter criteria in the request body.
- **Auth Required**: No.
- **Request Payload**: JSON object with same keys as the GET query params.
- **Response (200 OK)**: Array of vehicle list objects.

### `GET /api/vehicles/<int:pk>/`
- **Description**: Retrieves detailed information for a single vehicle.
- **Auth Required**: No.
- **Response (200 OK)**: A single detailed vehicle object.

### `POST /api/vehicles/create/`
- **Description**: Creates a new vehicle.
- **Auth Required**: Yes (Vendor or Admin). The `vendor` is set to the request user.
- **Request Payload**: Vehicle data (`name`, `brand`, `price_per_day`, etc.).
- **Response (201 Created)**: The created vehicle object.

### `PUT/PATCH /api/vehicles/<int:pk>/`
- **Description**: Updates a vehicle.
- **Auth Required**: Yes (Owner Vendor or Admin).
- **Response (200 OK)**: The updated vehicle object.

### `DELETE /api/vehicles/<int:pk>/`
- **Description**: Deletes a vehicle.
- **Auth Required**: Yes (Owner Vendor or Admin).
- **Response**: `204 No Content`.

### `POST /api/vehicles/<int:pk>/availability/`
- **Description**: Checks if a vehicle is available for a given date range.
- **Auth Required**: No.
- **Request Payload**:
  ```json
  {
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  }
  ```
- **Response (200 OK)**: `{ "available": true }` or `{ "available": false }`.

### `POST /api/vehicles/<int:pk>/images/`
- **Description**: Uploads one or more images for a vehicle.
- **Auth Required**: Yes (Owner Vendor or Admin).
- **Request**: `multipart/form-data` with `images` field.
- **Response (201 Created)**: Array of created vehicle image objects.

### `DELETE /api/vehicles/<int:pk>/images/<int:image_pk>/`
- **Description**: Deletes a specific image from a vehicle.
- **Auth Required**: Yes (Owner Vendor or Admin).
- **Response**: `204 No Content`.

### `GET /api/vehicles/categories/`
- **Description**: Lists all vehicle categories.
- **Auth Required**: No.
- **Response (200 OK)**: Array of category objects.

### `GET /api/vehicles/my/`
- **Description**: Lists all vehicles owned by the authenticated vendor.
- **Auth Required**: Yes (Vendor).
- **Response (200 OK)**: Array of vehicle objects.

### Admin Endpoints (`/api/admin/vehicles/`)
- Provides full `GET`, `POST`, `PUT`, `DELETE` CRUD functionality for all vehicles, exclusively for Admins.

---

## 4. Bookings (`/api/bookings/`)

### `POST /api/bookings/create/`
- **Description**: Creates a new booking. The `total_price` is calculated automatically on the backend.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "vehicle": 1, // Vehicle ID
    "pickup_date": "YYYY-MM-DD",
    "return_date": "YYYY-MM-DD"
  }
  ```
- **Response (201 Created)**: The full booking object.

### `GET /api/bookings/my/`
- **Description**: Lists all bookings made by the authenticated customer.
- **Auth Required**: Yes.
- **Response (200 OK)**: Array of booking objects.

### `GET /api/bookings/vendor/`
- **Description**: Lists all bookings for vehicles owned by the authenticated vendor.
- **Auth Required**: Yes (Vendor).
- **Response (200 OK)**: Array of booking objects.

### `POST /api/bookings/<int:pk>/cancel/`
- **Description**: Cancels a booking. Only works for bookings with `pending` or `confirmed` status.
- **Auth Required**: Yes (Customer who made the booking).
- **Response (200 OK)**: `{ "message": "Booking cancelled successfully" }`.

### `POST /api/bookings/<int:pk>/status/`
- **Description**: (Vendor only) Updates the status of a booking.
- **Auth Required**: Yes (Owner Vendor).
- **Request Payload**:
  ```json
  { "status": "active" } // e.g., 'confirmed', 'active', 'completed'
  ```
- **Response (200 OK)**: The updated booking object.

### Admin Endpoints (`/api/bookings/admin-crud/`)
- Provides full `GET`, `POST`, `PUT`, `DELETE` CRUD functionality for all bookings, exclusively for Admins.

---

## 5. Payments (`/api/payments/`)

### `GET /api/payments/wallet/`
- **Description**: Retrieves the authenticated user's wallet details.
- **Auth Required**: Yes.
- **Response (200 OK)**: `{ "balance": 100.50, "user": 1 }`.

### `POST /api/payments/create/`
- **Description**: Creates a payment for a booking. This is a complex endpoint that handles promo codes and different payment methods.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "booking_id": 1,
    "method": "wallet", // or "stripe"
    "promo_code": "SAVE10" // optional
  }
  ```
- **Response (201 Created)**: The created payment object.

### `GET /api/payments/history/`
- **Description**: Lists the payment history for the authenticated user.
- **Auth Required**: Yes.
- **Response (200 OK)**: Array of payment objects.

### `POST /api/payments/promo-codes/validate/`
- **Description**: Validates a promo code against a booking amount.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "code": "SAVE10",
    "booking_amount": 250.00
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "valid": true,
    "discount": 25.00,
    "final_amount": 225.00
  }
  ```

### `POST /api/payments/webhook/stripe/`
- **Description**: Webhook for Stripe to send payment status updates.
- **Auth Required**: No.

---

## 6. Reviews (`/api/reviews/`)

### `POST /api/reviews/`
- **Description**: Creates a new review for a completed booking.
- **Auth Required**: Yes.
- **Request Payload**:
  ```json
  {
    "booking": 1, // Booking ID
    "rating": 5,
    "comment": "Great car, smooth ride!"
  }
  ```
- **Response (201 Created)**: The created review object.

### `GET /api/reviews/my/`
- **Description**: Lists all reviews written by the authenticated user.
- **Auth Required**: Yes.
- **Response (200 OK)**: Array of review objects.

### `GET /api/reviews/vehicle/<int:vehicle_id>/`
- **Description**: Lists all reviews for a specific vehicle.
- **Auth Required**: No.
- **Response (200 OK)**: Array of review objects.

---

## 7. Chat (`/api/chat/`)

### `POST /api/chat/sessions/`
- **Description**: Creates a new chat session with the AI assistant.
- **Auth Required**: Yes.
- **Response (201 Created)**: Chat session object with an initial greeting message.

### `GET /api/chat/sessions/`
- **Description**: Lists all chat sessions for the authenticated user.
- **Auth Required**: Yes.
- **Response (200 OK)**: Array of chat session objects.

### `GET /api/chat/sessions/<int:pk>/`
- **Description**: Retrieves a specific chat session, including all its messages.
- **Auth Required**: Yes.
- **Response (200 OK)**: A single chat session object with a nested array of messages.

### `POST /api/chat/sessions/<int:pk>/send/`
- **Description**: Sends a message in a chat session and gets a response from the AI.
- **Auth Required**: Yes.
- **Request Payload**: `{ "content": "Hello, I need a car." }`
- **Response (200 OK)**:
  ```json
  {
    "user_message": { "...message object..." },
    "bot_message": { "...message object..." }
  }
  ```
