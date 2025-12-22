# If you are a new developer joining this project...

Welcome to the team! This guide is designed to get you up and running with the Rentora project as smoothly as possible.

## 1. How to Run the Project Locally

The project consists of three parts: the Django backend, the user-facing frontend, and the admin dashboard. You'll need to run all three simultaneously for the full experience.

### Backend Setup (`rentora_backend`)

The backend uses `uv` for package and virtual environment management, which is a very fast alternative to `pip` and `venv`.

1.  **Set up the Virtual Environment**:
    From the project root, run:
    ```bash
    uv venv
    ```
    This creates a `.venv` directory.

2.  **Activate the Environment**:
    ```bash
    source .venv/bin/activate
    ```
    You should see `(.venv)` at the beginning of your shell prompt.

3.  **Install Dependencies**:
    ```bash
    uv pip install -r rentora_backend/requirements.txt
    ```

4.  **Configure Environment Variables**:
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Open the `.env` file and update the database credentials (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`) to match your local PostgreSQL setup.

5.  **Run Database Migrations**:
    This command sets up the database schema based on the Django models.
    ```bash
    python rentora_backend/manage.py migrate
    ```

6.  **Run the Backend Server**:
    ```bash
    python rentora_backend/manage.py runserver
    ```
    The backend API will now be running at `http://127.0.0.1:8000`.

### Frontend Setup (`frontend` and `admin-dashboard`)

Both frontend applications are standard Vite projects. The setup process is the same for both.

1.  **Navigate to the Directory**:
    Open a **new terminal window** and `cd` into the frontend you want to run.
    ```bash
    # For the main customer/vendor app
    cd frontend

    # OR for the admin panel
    cd admin-dashboard
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    -   The `frontend` app will likely run on `http://localhost:5173`.
    -   The `admin-dashboard` will run on a different port if the first one is occupied (e.g., `http://localhost:5174`).

Your terminal will show you the exact address. You should now have the backend and one or both frontends running.

---

## 2. Codebase Guide: Where to Start

### First Files to Read

To get a good grasp of the project, read these files in order:

1.  **`rentora_backend/rentora_backend/settings.py`**: This is the heart of the backend configuration. You'll see all installed apps, middleware, and the authentication setup (JWT).
2.  **`rentora_backend/accounts/models.py`**: Understand the custom `User` model and the `role` field, which is the foundation of our permission system.
3.  **`rentora_backend/bookings/models.py`**: This model contains the core business logic for calculating `total_price` in its `save()` method.
4.  **`rentora_backend/rentora_backend/urls.py`**: See how the API is structured at a high level and which app handles which URL prefix.
5.  **`frontend/src/App.jsx`**: See the main frontend routes and how protected routes are structured.
6.  **`admin-dashboard/src/context/AuthContext.jsx`**: This file (or its equivalent in `frontend`) shows how the user's login state and JWT tokens are managed globally.

### Safe vs. Dangerous Areas

-   🟢 **Safe Areas**:
    -   **Creating new UI components** in `components/` that don't have complex state.
    -   **Adding a new static page** (like an "About Us" page) and its route.
    -   **Fixing typos** or styling issues in the frontend.
    -   **Writing new tests.** Tests are always a safe and valuable contribution.
    -   **Adding a new, non-critical field** to a model (e.g., adding a `color` field to `Vehicle`), as long as you create a migration for it.

-   🔴 **Dangerous Areas**:
    -   **`payments/` app**: This entire app handles money. Do not touch it without senior supervision.
    -   **`bookings/models.py`**: The `save()` method has financial logic (`total_price` calculation). A mistake here could lead to incorrect billing.
    -   **Authentication Logic**: Any files in the `accounts` app related to login, registration, or token handling (`views.py`, `serializers.py`). A mistake can compromise system security.
    -   **Direct Database Changes**: Never alter the database schema manually. Always use Django migrations (`makemigrations`, `migrate`).

### Common Mistakes for Newcomers

-   **Forgetting to activate the backend virtual environment** (`source .venv/bin/activate`).
-   **Not running migrations** after changing a model, leading to database errors.
-   **Hardcoding URLs**: Always use environment variables for the API base URL in the frontend.
-   **Ignoring Roles**: Forgetting to check user roles (`customer`, `vendor`, `admin`) in the backend before allowing an action.
-   **Breaking State**: Modifying a shared component or context in React without understanding all the pages that use it.

---

## 3. Starter Tasks for a Junior Developer

Here are three safe, well-defined tasks to help you get started.

### Task 1: Add a "License Plate" Field to Vehicles

-   **What it does**: Adds a new piece of information to the `Vehicle` model and displays it in the admin dashboard.
-   **Files to Edit**:
    1.  `rentora_backend/vehicles/models.py`: Add `license_plate = models.CharField(max_length=20, blank=True)`.
    2.  `rentora_backend/vehicles/serializers.py`: Add `license_plate` to the `fields` list in `VehicleDetailSerializer` and `AdminVehicleSerializer`.
    3.  `admin-dashboard/src/pages/Vehicles.jsx`: Add a new column to the vehicle table to display the license plate.
-   **Process**:
    1.  Make the model change.
    2.  Run `python rentora_backend/manage.py makemigrations` and then `python rentora_backend/manage.py migrate`.
    3.  Update the serializers.
    4.  Update the frontend table to show the new data.
-   **What NOT to break**: Don't make the field required (`blank=False`), as existing vehicles in the database won't have it. Don't break the vehicle creation or update forms.

### Task 2: Create a Static "Terms of Service" Page

-   **What it does**: Adds a new, simple, read-only page to the main `frontend` application.
-   **Files to Edit**:
    1.  `frontend/src/pages/`: Create a new file `TermsOfService.jsx`.
    2.  `frontend/src/App.jsx` (or your router file): Add a new route `<Route path="/terms" element={<TermsOfService />} />`.
    3.  `frontend/src/components/Footer.jsx` (or wherever you have global links): Add a `<Link to="/terms">Terms of Service</Link>`.
-   **Process**:
    1.  Create the React component with your static text.
    2.  Add the route.
    3.  Add a link to it.
-   **What NOT to break**: The main routing of the application. Ensure you don't accidentally nest the route incorrectly or break the navigation for other pages.

### Task 3: Improve an Error Message

-   **What it does**: When a user tries to register with an email that already exists, the API sends a `400 Bad Request`. Make the frontend show a user-friendly error.
-   **Files to Edit**:
    1.  `frontend/src/pages/Register.jsx` (or wherever the registration form logic is).
-   **Process**:
    1.  Locate the `axios` or `fetch` call for registration.
    2.  In the `.catch()` block for the API call, inspect the `error.response.data`. The backend likely sends a JSON response like `{"email": ["user with this email already exists."]}`.
    3.  Use the `setError` function from `react-hook-form` or a similar state management function to display a clean message like "This email address is already in use." next to the email field.
-   **What NOT to break**: The success path for registration. Don't prevent new users from registering. Don't show raw error objects to the user.
