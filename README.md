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
