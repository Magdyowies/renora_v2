# Rentora: Full-Stack Vehicle Rental System

## 1. Project Overview

### What is Rentora?

Rentora is a comprehensive, full-stack vehicle rental platform that connects vehicle owners (Vendors) with individuals looking to rent vehicles (Customers). It provides a seamless, end-to-end experience for booking, payment, and fleet management, all overseen by a central administrative team.

The system is composed of:
- **A Django REST Framework backend** that powers all business logic.
- **Two React front-end applications**: one for customers and vendors, and a separate, dedicated dashboard for administrators.
- **A PostgreSQL database** for data persistence.

### What Problem Does It Solve?

For vehicle owners, Rentora solves the problem of fleet management, booking coordination, and payment processing. It offers a centralized platform to list vehicles, manage availability, and securely receive payments.

For customers, Rentora simplifies the process of finding and booking rental vehicles. It provides a searchable, transparent marketplace with clear pricing and a straightforward booking and payment flow.

For administrators, it offers a powerful dashboard to manage users, oversee transactions, resolve disputes, and ensure the smooth operation of the entire platform.

### Who Are the Users?

The system is designed for three primary user roles:

1.  **Customer**: The end-user who browses, books, and pays for vehicle rentals. Customers can also manage their bookings and leave reviews after a rental is complete.
2.  **Vendor**: An individual or business that owns and lists vehicles for rent on the platform. Vendors can manage their vehicle listings, track earnings, and view bookings for their fleet.
3.  **Admin**: A superuser with complete oversight of the system. Admins use a dedicated dashboard to manage all users (customers and vendors), vehicles, bookings, payments, and other platform-wide settings.

### High-Level System Flow

1.  **Onboarding**: A user signs up and is assigned a role (typically `Customer` by default). An admin can later elevate a user to a `Vendor` or `Admin` role.
2.  **Listing**: A `Vendor` logs in, lists their vehicles, and sets details like pricing, availability, and vehicle specifications.
3.  **Discovery & Booking**: A `Customer` searches for vehicles, views details, and makes a booking for a specific date range.
4.  **Payment**: The customer proceeds to payment. The system calculates the total cost based on the daily rate and booking duration. The customer can pay using their wallet balance or a credit card (via Stripe). Promo codes can be applied for discounts.
5.  **Rental Period**: During the rental period, the vehicle's availability is updated.
6.  **Post-Rental**: After the booking is complete, the `Customer` can leave a review for the vehicle.
7.  **Management**: `Vendors` can track their revenue and booking history. `Admins` can monitor all activity, manage disputes, and view system-wide reports.
