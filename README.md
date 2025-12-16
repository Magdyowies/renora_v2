


# 🚗 Rentora — Vehicle Rental Platform

## 🌟 Project Overview

**Rentora** is a full-stack vehicle rental platform built as a graduation project and professional portfolio piece.  
It streamlines vehicle booking and fleet management by connecting customers with vendors through a secure, scalable backend and a modern, responsive frontend.

The system supports multi-role access (Customer, Vendor, Admin), real-time availability, secure payments, and an AI-powered chat assistant.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.x
- **API:** Django REST Framework (DRF)
- **Language:** Python 3.12
- **Database:** PostgreSQL (Dockerized)
- **Authentication:** Custom User Model + SimpleJWT (Access & Refresh Tokens)
- **Payments:** Stripe (Webhooks)
- **AI:** OpenAI API (configurable model)

### Frontend
- **Framework:** React
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **API Client:** Axios / Fetch

---

## ✨ Core Features

- 🔐 **Authentication & Authorization**
  - JWT-based login & registration
  - Role-based access control (Customer, Vendor, Admin)

- 🚙 **Vehicle Management**
  - Vendor-managed vehicle listings
  - Categories, images, pricing, availability

- 🔍 **Search & Filtering**
  - Filter by category, price, transmission, location, etc.

- 📅 **Booking System**
  - Date-based booking
  - Status lifecycle (Pending → Confirmed → Active → Completed / Cancelled)

- 💳 **Payments & Wallet**
  - Wallet balance & transactions
  - Promo codes & discounts
  - Stripe payment integration

- ⭐ **Reviews & Ratings**
  - Booking-linked reviews
  - Vehicle rating aggregation

- 🤖 **AI Chat Assistant**
  - User guidance & vehicle recommendations
  - Persistent chat sessions

- 🛠️ **Admin Panel**
  - Full Django Admin integration
  - Manage users, vehicles, bookings, payments, and chats

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Python 3.12
- Node.js 18+

---

### 1. Clone the Repository

```bash
git clone https://github.com/Magdyowies/rentora.git
cd rentora
````

---

### 2. Environment Variables

Create a `.env` file inside `rentora_backend/`:

```env
# ==============================
# Django Core Settings
# ==============================
DJANGO_SECRET_KEY=change-me-in-production
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# ==============================
# PostgreSQL Configuration
# ==============================
DB_NAME=rentora
DB_USER=postgres
DB_PASSWORD=root
DB_HOST=db
DB_PORT=5432

# ==============================
# JWT (SimpleJWT)
# ==============================
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME_HOURS=24
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME_DAYS=7

# ==============================
# External Services
# ==============================
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# ==============================
# CORS
# ==============================
CORS_ALLOW_ALL_ORIGINS=True
CORS_ALLOW_CREDENTIALS=True
```

---

### 3. Start PostgreSQL (Docker)

```bash
docker-compose up -d db
```

---

### 4. Backend Setup (Django)

```bash
cd rentora_backend

python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend API will be available at:
👉 `http://127.0.0.1:8000/api/`

---

### 5. Frontend Setup (React)

```bash
cd ../rentora_frontend

npm install
npm start
```

Frontend application:
👉 `http://localhost:3000`

---

## ⚙️ API Configuration

* All backend endpoints are prefixed with `/api/`

* Base URL (local):

  ```
  http://127.0.0.1:8000/api/
  ```

* Authentication:

  ```
  Authorization: Bearer <access_token>
  ```

---

## 📂 Project Structure

```text
.
├── rentora_backend/
│   ├── accounts/        # Users & authentication
│   ├── vehicles/        # Vehicle listings & images
│   ├── bookings/        # Booking lifecycle
│   ├── payments/        # Wallet, payments, promo codes
│   ├── reviews/         # Reviews & ratings
│   ├── chat/            # AI chat assistant
│   ├── core/            # Health checks & utilities
│   └── manage.py
├── rentora_frontend/
│   ├── public/
│   └── src/
└── docker-compose.yml
```

---

## 📸 Screenshots

### Login & Registration

<img src="https://github.com/user-attachments/assets/03a64b52-e9bb-4959-aec8-f464c705095f" width="420" />

### Vehicle Listing

<img src="https://github.com/user-attachments/assets/42b0aa36-f1b3-42d1-866c-9ac9a856ecc1" width="900" />

### Vehicle Details

<img src="https://github.com/user-attachments/assets/ee0b272e-acdc-45c5-aec2-8c79bed0ff7f" width="650" />

### User Profile

<img src="https://github.com/user-attachments/assets/0bdbc0ab-0a69-4a92-b3f0-ec426211f2ba" width="650" />

---

## 📚 Documentation

* `README.md` — Project overview & setup
* `BACKEND.md` — Backend architecture & design
* `FRONTEND.md` — Frontend architecture
* `API_REFERENCE.md` — Full API documentation
* `PROJECT_REPORT.md` — Graduation report
* `CHANGELOG.md` — Backend change history

---

## 🎓 Project Purpose

This project was developed as:

* A **graduation project**
* A **real-world backend-focused portfolio**
* A demonstration of **industry best practices** in full-stack development

---

## 📄 License

This project is for educational and portfolio purposes.

```
