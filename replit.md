# Rentora - Vehicle Rental Management System

## Overview
Rentora is a full-stack vehicle rental platform inspired by Sixt Egypt. It enables customers to browse and rent vehicles, vendors to manage their fleets, and administrators to oversee platform operations.

## Tech Stack
- **Backend**: Django 5.2 + Django REST Framework
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: PostgreSQL
- **Authentication**: JWT (Simple JWT)
- **AI Chatbot**: OpenAI GPT-5

## Project Structure
```
/
├── rentora_backend/          # Django backend
│   ├── accounts/             # User auth & profiles
│   ├── vehicles/             # Vehicle management
│   ├── bookings/             # Booking system
│   ├── payments/             # Payments & wallet
│   ├── reviews/              # Reviews & ratings
│   ├── chat/                 # AI chatbot
│   └── core/                 # Admin & reports
├── frontend/                 # React frontend
│   └── src/
│       ├── components/       # Reusable components
│       ├── pages/            # Page components
│       ├── context/          # React contexts
│       └── services/         # API services
└── attached_assets/          # Brand assets & images
```

## User Roles
1. **Customer**: Browse vehicles, book, pay, review, chat
2. **Vendor**: Add/edit vehicles, view bookings
3. **Admin**: Full system access, reports, promo codes

## API Endpoints
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/vehicles/` - List vehicles with filters
- `POST /api/bookings/` - Create booking
- `POST /api/payments/create/` - Process payment
- `POST /api/chat/sessions/create/` - Start AI chat

## Running the Application
The application runs with two workflows:
1. **Backend API** on port 8000
2. **Frontend** on port 5000 (exposed to users)

## Brand Colors
- Primary: Teal (#0d9488)
- Accent: Turquoise (#14b8a6)

## Key Features
- JWT authentication with role-based access
- Vehicle browsing with filters (category, price, transmission)
- Booking with date selection and promo codes
- Wallet system for payments
- AI-powered chatbot for customer support
- Reviews and ratings for vehicles
