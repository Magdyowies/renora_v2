Rentora: Vehicle Rental Platform

  Project Overview

  Rentora is a comprehensive full-stack vehicle rental platform designed to streamline the process of renting and
  managing vehicles. It connects customers seeking rentals with vendors offering a diverse fleet, all supported by a
  robust backend and a modern, responsive frontend. This project serves as both a graduation project and an
  industry-style portfolio piece, demonstrating best practices in software development.

  Tech Stack

  Backend:
   * Framework: Django 6.x
   * API: Django REST Framework
   * Language: Python 3.12
   * Database: PostgreSQL (running on Docker, typically on port 5431 for local development)
   * Authentication: Custom User Model, SimpleJWT for Token-based Authentication

  Frontend:
   * Framework: React
   * Styling: Tailwind CSS

  Core Features

   * User Authentication & Authorization: Secure registration, login, JWT token management, and role-based access
     control (Customer, Vendor, Admin).
   * Vehicle Management: Vendors can list, update, and manage their vehicle fleet with detailed information and
     images.
   * Vehicle Search & Filtering: Customers can browse and search for vehicles based on various criteria (category,
     price, transmission, fuel type, location, etc.).
   * Booking System: Seamless booking process for customers, including date selection, pricing calculation, and
     status tracking.
   * Payment Gateway Integration: Wallet system, promo code application, and integration with payment providers
     (e.g., Stripe webhook).
   * Review & Rating System: Customers can submit reviews and ratings for rented vehicles.
   * AI Chat Assistant: An integrated AI-powered chat assistant to help users with queries, vehicle recommendations,
     and rental process guidance.
   * Admin Panel: Comprehensive Django Admin interface for managing users, vehicles, bookings, payments, and all
     other core data.

  Quick Start (Local Development with Docker)

  This guide assumes you have Docker and Docker Compose installed.

   1. Clone the repository:

   1     git clone https://github.com/Magdyowies/rentora.git
   2     cd rentora

   2. Setup Environment Variables:
      Create a .env file in the rentora_backend directory based on the example below. Replace placeholder values with
  your actual secrets and configurations.

    1     # ================================================================
    2     # rentora_backend/.env - Environment Variables for Django Backend
    3     # ================================================================
    4 
    5     # --- Core Django Settings ---
    6     # A unique secret key for Django project. KEEP THIS SECURE!
    7     DJANGO_SECRET_KEY='your-django-secret-key-CHANGE-ME-IN-PRODUCTION-AND-NEVER-COMMIT'
    8     # Set to 'True' for development, 'False' for production.
    9     DEBUG=True
   10     # Comma-separated list of hosts/domains that this Django site can serve.
   11     ALLOWED_HOSTS='127.0.0.1,localhost'
   12 
   13     # --- Database Configuration (PostgreSQL) ---
   14     # Name of your PostgreSQL database.
   15     DB_NAME='rentora'
   16     # PostgreSQL username.
   17     DB_USER='postgres'
   18     # PostgreSQL password.
   19     DB_PASSWORD='root'
   20     # Hostname or IP of the PostgreSQL server. Use 'db' if running within Docker Compose.
   21     DB_HOST='db'
   22     # Port of the PostgreSQL server. Default for Docker's PostgreSQL is 5432.
   23     DB_PORT='5432'
   24 
   25     # --- JWT Authentication Settings (SimpleJWT) ---
   26     # Access token lifetime in hours (e.g., 24 for 24 hours).
   27     SIMPLE_JWT_ACCESS_TOKEN_LIFETIME_HOURS=24
   28     # Refresh token lifetime in days (e.g., 7 for 7 days).
   29     SIMPLE_JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
   30 
   31     # --- OpenAI API (for Chat Assistant) ---
   32     # Your OpenAI API Key.
   33     OPENAI_API_KEY='your-openai-api-key-CHANGE-ME'
   34 
   35     # --- Stripe Payment Gateway ---
   36     # Your Stripe Secret Key.
   37     STRIPE_SECRET_KEY='your-stripe-secret-key-CHANGE-ME'
   38     # Your Stripe Webhook Secret (for verifying incoming webhooks).
   39     STRIPE_WEBHOOK_SECRET='your-stripe-webhook-secret-CHANGE-ME'
   40 
   41     # --- CORS Headers (for Frontend Integration) ---
   42     # Set to 'True' for development if frontend is on a different origin.
   43     # In production, specify allowed origins explicitly (e.g., CORS_ALLOWED_ORIGINS="https://yourfrontend.com")
   44     CORS_ALLOW_ALL_ORIGINS=True
   45     # Set to 'True' if your frontend needs to send cookies/auth headers with cross-origin requests.
   46     CORS_ALLOW_CREDENTIALS=True

   3. Start Docker Containers (Database):
      Navigate to the project root and start the PostgreSQL database container.
   1     docker-compose up -d db
      Note: Ensure your `DB_PORT` in `.env` matches the port exposed by your Docker setup (e.g., 5432).

  4. Backend Setup (Django):

    1     # Navigate to the backend directory
    2     cd rentora_backend
    3 
    4     # Create and activate a Python virtual environment
    5     python3 -m venv venv
    6     source venv/bin/activate
    7 
    8     # Install Python dependencies
    9     pip install -r requirements.txt # Assuming requirements.txt exists
   10 
   11     # Apply database migrations
   12     python manage.py migrate
   13 
   14     # Create a superuser for admin access
   15     python manage.py createsuperuser
   16 
   17     # Start the Django development server
   18     python manage.py runserver
      The backend API will be available at http://127.0.0.1:8000/api/.

   5. Frontend Setup (React):

   1     # Navigate to the frontend directory (e.g., rentora_frontend)
   2     cd ../rentora_frontend # Adjust path as necessary
   3 
   4     # Install Node.js dependencies
   5     npm install
   6 
   7     # Start the React development server
   8     npm start
      The frontend application will typically open in your browser at http://localhost:3000/.

  Environment Variables

  The backend uses environment variables for sensitive information and configuration flexibility. Refer to the .env
  file in the rentora_backend directory for a complete list and their purposes.

  API Base URL

  All backend API endpoints are prefixed with /api/.
  Base URL: http://127.0.0.1:8000/api/ (for local development)

  Folder Structure

    1 .
    2 ├── rentora_backend/
    3 │   ├── manage.py
    4 │   ├── accounts/          # User authentication, profiles
    5 │   ├── bookings/          # Vehicle booking logic
    6 │   ├── chat/              # AI assistant chat functionality
    7 │   ├── core/              # Core utilities, health checks, admin dashboards
    8 │   ├── payments/          # Payment processing, wallets, promo codes
    9 │   ├── reviews/           # Vehicle reviews and ratings
   10 │   ├── vehicles/          # Vehicle listings and management
   11 │   ├── rentora_backend/   # Main project settings, URLs
   12 │   └── venv/              # Python virtual environment
   13 ├── rentora_frontend/      # (React App - not covered in detail here)
   14 │   ├── public/
   15 │   ├── src/
   16 │   └── ...
   17 └── docker-compose.yml     # Docker setup for PostgreSQL

  Screenshots (Placeholder)

   * Login/Registration Page: \[Screenshot of Login/Registration UI]
   * Vehicle Listing: \[Screenshot of Vehicle Search & List UI]
   * Vehicle Detail Page: \[Screenshot of a single Vehicle Details UI]
   * Booking Confirmation: \[Screenshot of Booking Confirmation UI]
   * User Profile: \[Screenshot of User Profile Management UI]
   * Chat Assistant: \[Screenshot of Chat Assistant Interface]
   * Django Admin: \[Screenshot of Django Admin Panel]

  ---
