```markdown
# 🚗 Rentora: Vehicle Rental Platform

## 🌟 Project Overview

**Rentora** is a comprehensive full-stack vehicle rental platform designed to streamline the process of renting and managing vehicles. It connects customers seeking rentals with vendors offering a diverse fleet, all supported by a robust backend and a modern, responsive frontend.

This project serves as both a **graduation project** and an **industry-style portfolio piece**, demonstrating best practices in software development.

## 🛠️ Tech Stack

### Backend
* **Framework:** Django 6.x
* **API:** Django REST Framework
* **Language:** Python 3.12
* **Database:** PostgreSQL (running on Docker)
* **Authentication:** Custom User Model, SimpleJWT for Token-based Authentication

### Frontend
* **Framework:** React
* **Styling:** Tailwind CSS

## ✨ Core Features

* **User Authentication & Authorization:** Secure registration, login, JWT token management, and role-based access control (Customer, Vendor, Admin).
* **Vehicle Management:** Vendors can list, update, and manage their vehicle fleet with detailed information and images.
* **Vehicle Search & Filtering:** Customers can browse and search for vehicles based on various criteria (category, price, transmission, fuel type, location, etc.).
* **Booking System:** Seamless booking process for customers, including date selection, pricing calculation, and status tracking.
* **Payment Gateway Integration:** Wallet system, promo code application, and integration with payment providers (e.g., Stripe webhook).
* **Review & Rating System:** Customers can submit reviews and ratings for rented vehicles.
* **AI Chat Assistant:** An integrated AI-powered chat assistant to help users with queries, vehicle recommendations, and rental process guidance.
* **Admin Panel:** Comprehensive Django Admin interface for managing users, vehicles, bookings, payments, and all other core data.

## 🚀 Quick Start (Local Development with Docker)

This guide assumes you have **Docker** and **Docker Compose** installed.

### 1. Clone the repository

```bash
git clone [https://github.com/Magdyowies/rentora.git](https://github.com/Magdyowies/rentora.git)
cd rentora

```

###2. Setup Environment VariablesCreate a `.env` file in the `rentora_backend` directory based on the template below. Replace placeholder values with your actual secrets.

```bash
# ================================================================
# rentora_backend/.env - Environment Variables for Django Backend
# ================================================================

# --- Core Django Settings ---
# A unique secret key for Django project. KEEP THIS SECURE!
DJANGO_SECRET_KEY='your-django-secret-key-CHANGE-ME-IN-PRODUCTION'
# Set to 'True' for development, 'False' for production.
DEBUG=True
# Comma-separated list of hosts/domains that this Django site can serve.
ALLOWED_HOSTS='127.0.0.1,localhost'

# --- Database Configuration (PostgreSQL) ---
DB_NAME='rentora'
DB_USER='postgres'
DB_PASSWORD='root'
# Hostname or IP of the PostgreSQL server. Use 'db' if running within Docker Compose.
DB_HOST='db'
# Port of the PostgreSQL server. Default for Docker's PostgreSQL is 5432.
DB_PORT='5432'

# --- JWT Authentication Settings (SimpleJWT) ---
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME_HOURS=24
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# --- OpenAI API (for Chat Assistant) ---
OPENAI_API_KEY='your-openai-api-key-CHANGE-ME'

# --- Stripe Payment Gateway ---
STRIPE_SECRET_KEY='your-stripe-secret-key-CHANGE-ME'
STRIPE_WEBHOOK_SECRET='your-stripe-webhook-secret-CHANGE-ME'

# --- CORS Headers (for Frontend Integration) ---
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOW_CREDENTIALS=True

```

###3. Start Docker Containers (Database)Navigate to the project root and start the PostgreSQL database container.

```bash
docker-compose up -d db

```

> **Note:** Ensure your `DB_PORT` in `.env` matches the port exposed by your Docker setup (e.g., 5432).

###4. Backend Setup (Django)```bash
# Navigate to the backend directory
cd rentora_backend

# Create and activate a Python virtual environment
python3 -m venv venv
# On Windows use: venv\Scripts\activate
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser for admin access
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver

```

The backend API will be available at `http://127.0.0.1:8000/api/`.

###5. Frontend Setup (React)```bash
# Navigate to the frontend directory
cd ../rentora_frontend

# Install Node.js dependencies
npm install

# Start the React development server
npm start

```

The frontend application will typically open in your browser at `http://localhost:3000/`.

##⚙️ Configuration**Environment Variables:** The backend uses environment variables for sensitive information. Refer to the `.env` section above for details.

**API Base URL:**

* All backend API endpoints are prefixed with `/api/`.
* Base URL: `http://127.0.0.1:8000/api/` (for local development)

##📂 Folder Structure```text
.
├── rentora_backend/
│   ├── manage.py
│   ├── accounts/           # User authentication, profiles
│   ├── bookings/           # Vehicle booking logic
│   ├── chat/               # AI assistant chat functionality
│   ├── core/               # Core utilities, health checks
│   ├── payments/           # Payment processing, wallets, promo codes
│   ├── reviews/            # Vehicle reviews and ratings
│   ├── vehicles/           # Vehicle listings and management
│   ├── rentora_backend/    # Main project settings, URLs
│   └── venv/               # Python virtual environment
├── rentora_frontend/       # (React App)
│   ├── public/
│   ├── src/
│   └── ...
└── docker-compose.yml      # Docker setup for PostgreSQL

```

##📸 Screenshots (Placeholder)* **Login/Registration Page:** <img width="347" height="443" alt="image" src="https://github.com/user-attachments/assets/03a64b52-e9bb-4959-aec8-f464c705095f" />

* **Vehicle Listing:** <img width="1043" height="437" alt="image" src="https://github.com/user-attachments/assets/42b0aa36-f1b3-42d1-866c-9ac9a856ecc1" />

* **Vehicle Detail Page:** <img width="696" height="572" alt="image" src="https://github.com/user-attachments/assets/ee0b272e-acdc-45c5-aec2-8c79bed0ff7f" />
* **User Profile:** <img width="693" height="250" alt="image" src="https://github.com/user-attachments/assets/0bdbc0ab-0a69-4a92-b3f0-ec426211f2ba" />
---

```

```
