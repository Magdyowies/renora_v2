# Rentora - Vehicle Rental Management System

## Overview
Rentora is a full-stack vehicle rental platform inspired by Sixt Egypt. It enables customers to browse and rent vehicles, vendors to manage their fleets, and administrators to oversee platform operations.

## Tech Stack
- **Backend**: Django 5.2 + Django REST Framework
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Database**: PostgreSQL
- **Authentication**: JWT (Simple JWT)
- **AI Chatbot**: OpenAI GPT integration

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
│       ├── components/       # Reusable components (Navbar)
│       ├── pages/            # Page components
│       ├── context/          # React contexts (Auth)
│       └── services/         # API services
└── attached_assets/          # Brand assets & images
```

## User Roles
1. **Customer**: Browse vehicles, book, pay, review, chat
2. **Vendor**: View vehicles, manage bookings
3. **Admin**: Full system access, view stats, manage users

## Frontend Pages
- `/` - Home (hero, features, featured vehicles)
- `/login` - User login
- `/register` - User registration
- `/vehicles` - Vehicle listing with filters
- `/vehicles/:id` - Vehicle details
- `/bookings` - My bookings (customer)
- `/booking` - Booking form
- `/payment/:id` - Payment page
- `/wallet` - Wallet & transactions
- `/chat` - AI chatbot
- `/profile` - User profile management
- `/vendor` - Vendor dashboard (vendors/admins only)
- `/admin` - Admin dashboard (admins only)

## API Endpoints
- Auth: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/profile/`
- Vehicles: `/api/vehicles/`, `/api/vehicles/<id>/`
- Bookings: `/api/bookings/`, `/api/bookings/my/`, `/api/bookings/<id>/cancel/`
- Payments: `/api/payments/create/`, `/api/payments/wallet/`
- Chat: `/api/chat/sessions/create/`, `/api/chat/sessions/<id>/send/`
- Admin: `/api/admin/stats/`, `/api/admin/users/`, `/api/admin/vehicles/`

## Running the Application
The application runs with two workflows:
1. **Backend API** on port 8000
2. **Frontend** on port 5000 (exposed to users)

## Configuration Notes
- `frontend/postcss.config.js`: Uses `@tailwindcss/postcss` for Tailwind v4
- `frontend/vite.config.js`: Proxy /api to port 8000, server on 0.0.0.0:5000
- `rentora_backend/rentora_backend/settings.py`: PostgreSQL, JWT, CORS enabled

## Brand Colors
- Primary: Teal (#0d9488)
- Accent: Turquoise (#14b8a6)

## Key Features
- JWT authentication with role-based access control
- Vehicle browsing with filters (category, price, transmission)
- Booking with date selection and promo codes
- Wallet system for payments
- AI-powered chatbot for customer support
- Reviews and ratings for vehicles
- Vendor dashboard for fleet management
- Admin dashboard with statistics

## Notes
- OpenAI chatbot requires OPENAI_API_KEY secret (has fallback responses without it)
- Primary brand color: teal (#0d9488)
