✅ **Integration TODO Checklist**

**MODULE: Auth**
- [x] `POST /api/auth/login`
- [x] `POST /api/auth/register`
- [x] `POST /api/auth/logout`
- [x] `GET /api/auth/verify`
- [x] `POST /api/auth/refresh`

**MODULE: Users**
- [x] `GET /api/users/profile`
- [x] `PUT /api/users/{id}`
- [x] `GET /api/users/{id}/stats`

**MODULE: Vehicles**
- [x] `GET /api/vehicles/`
- [x] `GET /api/vehicles/{id}`
- [x] `POST /api/vehicles/search`
- [x] `POST /api/vehicles/{id}/availability`
- [x] Pagination support (assuming `VehicleListView` has it)
- [x] Search & filters (assuming `VehicleListView` has it)

**MODULE: Bookings**
- [x] `POST /api/bookings/`
- [x] `GET /api/bookings/` (for user)
- [x] `GET /api/bookings/{id}`
- [x] `POST /api/bookings/{id}/cancel`
- [x] `PUT /api/bookings/{id}` (generic update)

**MODULE: Payments**
- [x] `POST /api/payments/process`
- [x] `GET /api/payments/history`
- [x] `GET /api/payments/verify/{transactionId}`

**MODULE: Reviews**
- [x] `POST /api/reviews/` (create)
- [x] `GET /api/reviews/vehicle/{id}` (list for vehicle)

**MODULE: Chat**
- [x] `GET /api/chat/sessions`
- [x] `POST /api/chat/sessions`
- [x] `GET /api/chat/sessions/{id}`
- [x] `POST /api/chat/sessions/{id}/send`
- [x] `POST /api/chat/sessions/{id}/close`

**MODULE: Admin Dashboard**
- [x] `GET /api/admin/stats`
- [x] `GET /api/admin/revenue-chart`
- [x] `GET /api/admin/booking-chart`
- [x] `GET /api/admin/users`
- [x] `GET /api/admin/vehicles`

🧩 **Missing backend APIs (grouped by module)**

**Auth**
- `POST /api/auth/logout`
- `GET /api/auth/verify`

**Users**
- `GET /api/users/{id}/stats`

**Vehicles**
- `POST /api/vehicles/search`
- `POST /api/vehicles/{id}/availability`

**Bookings**
- `PUT /api/bookings/{id}`

**Payments**
- `GET /api/payments/verify/{transactionId}`

🧪 **Example request/response for each new endpoint**

**`POST /api/auth/logout`**
- **Request:**
  ```json
  {
      "refresh": "your_refresh_token"
  }
  ```
- **Response:** `205 Reset Content`

**`GET /api/auth/verify`**
- **Request:** (No body, just authenticated header)
- **Response:**
  ```json
  {
      "valid": true
  }
  ```

**`GET /api/users/{id}/stats`**
- **Request:** (No body, just authenticated header)
- **Response:**
  ```json
  {
      "totalBookings": 5,
      "totalSpent": 1250.00,
      "activeRentals": 1,
      "completedRentals": 4
  }
  ```

**`POST /api/vehicles/search`**
- **Request:**
  ```json
  {
      "category": 1,
      "min_price": 100,
      "max_price": 500
  }
  ```
- **Response:** A list of vehicle objects.

**`POST /api/vehicles/{id}/availability`**
- **Request:**
  ```json
  {
      "startDate": "2024-12-20",
      "endDate": "2024-12-25"
  }
  ```
- **Response:**
  ```json
  {
      "available": true
  }
  ```

**`PUT /api/bookings/{id}`**
- **Request:**
  ```json
  {
      "status": "confirmed"
  }
  ```
- **Response:** The updated booking object.

**`GET /api/payments/verify/{transactionId}`**
- **Request:** (No body, just authenticated header)
- **Response:** The payment object.

📌 **Notes about frontend usage**

- The frontend `api.js` file needs to be updated to point to the correct backend endpoints. The mock data and logic should be removed.
- The base URL should be configured to `http://127.0.0.1:8000/api/` (or whatever the Django development server is running on).
- The user ID is required for some endpoints (e.g., `/api/users/{id}/stats`). The frontend should be able to get this from the logged-in user's data.
- The `PUT /api/bookings/{id}` endpoint was implemented to handle generic updates. The frontend can use this to update any field on the booking model that is exposed in the `BookingSerializer`.
- The `POST /api/vehicles/search` endpoint reuses the same filtering logic as the `GET /api/vehicles/` endpoint. The frontend can pass any of the filterable fields in the request body.
