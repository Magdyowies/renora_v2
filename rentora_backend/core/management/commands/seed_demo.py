from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from faker import Faker
from decimal import Decimal
import random

from accounts.models import UserProfile
from payments.models import Wallet, WalletTransaction, Payment
from vehicles.models import Vehicle, VehicleCategory, VehicleImage
from bookings.models import Booking
from reviews.models import Review
from chat.models import ChatSession, ChatMessage
from payments.models import PromoCode
from core.models import AdminReport

User = get_user_model()
fake = Faker()


class Command(BaseCommand):
    help = "Seed demo data with Faker"

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing demo data before seeding",
        )

    def handle(self, *args, **options):
        reset = options["reset"]

        if reset:
            self.stdout.write(self.style.WARNING("⚠️ Resetting existing data..."))
            Review.objects.all().delete()
            Payment.objects.all().delete()
            Booking.objects.all().delete()
            VehicleImage.objects.all().delete()
            Vehicle.objects.all().delete()
            WalletTransaction.objects.all().delete()
            Wallet.objects.all().delete()
            UserProfile.objects.all().delete()
            User.objects.exclude(username="admin").delete()
            PromoCode.objects.all().delete()
            ChatMessage.objects.all().delete()
            ChatSession.objects.all().delete()
            AdminReport.objects.all().delete()
            self.stdout.write(self.style.SUCCESS("🧹 Database reset complete"))

        self.stdout.write(self.style.WARNING("🌱 Seeding demo data..."))
        # ... rest of your seeding logic ...

        # =========================
        # USERS
        # =========================
        admin, _ = User.objects.get_or_create(
            username="admin",
            defaults=dict(
                email="admin@example.com",
                first_name="Admin",
                last_name="User",
                role="admin",
                is_staff=True,
                is_superuser=True,
                is_active=True,
                phone="1111111111",
            ),
        )
        admin.set_password("admin123")
        admin.save()

        vendor, _ = User.objects.get_or_create(
            username="vendor",
            defaults=dict(
                email="vendor@example.com",
                first_name="Vendor",
                last_name="User",
                role="vendor",
                is_active=True,
                phone="2222222222",
            ),
        )
        vendor.set_password("vendor123")
        vendor.save()

        customer, _ = User.objects.get_or_create(
            username="customer",
            defaults=dict(
                email="customer@example.com",
                first_name="Customer",
                last_name="User",
                role="customer",
                is_active=True,
                phone="3333333333",
            ),
        )
        customer.set_password("customer123")
        customer.save()

        users = [admin, vendor, customer]

        # =========================
        # PROFILES & WALLETS
        # =========================
        for user in users:
            UserProfile.objects.get_or_create(
                user=user,
                defaults=dict(
                    address=fake.address(),
                    city=fake.city(),
                    country=fake.country(),
                    driver_license=fake.bothify(text="DL-#####"),
                    driver_license_expiry=fake.date_between(start_date="+1y", end_date="+5y"),
                ),
            )

            Wallet.objects.get_or_create(
                user=user,
                defaults=dict(balance=Decimal("5000.00")),
            )

        # =========================
        # VEHICLE CATEGORIES
        # =========================
        sedan, _ = VehicleCategory.objects.get_or_create(name="Sedan")
        suv, _ = VehicleCategory.objects.get_or_create(name="SUV")
        categories = [sedan, suv]

        # =========================
        # VEHICLES (BULK)
        # =========================
        vehicles = []
        for _ in range(20):
            vehicle = Vehicle.objects.create(
                name=fake.word().title(),
                brand=fake.company(),
                model=fake.word().title(),
                year=random.randint(2018, 2024),
                seats=random.choice([4, 5, 7]),
                doors=random.choice([2, 4]),
                transmission=random.choice(["Automatic", "Manual"]),
                fuel_type=random.choice(["Gasoline", "Diesel", "Hybrid"]),
                price_per_day=Decimal(random.randint(50, 200)),
                location=fake.city(),
                description=fake.text(max_nb_chars=120),
                features={"gps": True, "bluetooth": True},
                status="available",
                rating=round(random.uniform(3.5, 5.0), 1),
                total_reviews=random.randint(1, 100),
                vendor=vendor,
                category=random.choice(categories),
            )
            vehicles.append(vehicle)

            for i in range(random.randint(2, 4)):
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=fake.image_url(),
                    is_primary=(i == 0),
                )

        # =========================
        # PROMO CODE
        # =========================
        PromoCode.objects.get_or_create(
            code="WINTER2025",
            defaults=dict(
                discount_type="percentage",
                discount_value=15,
                min_booking_amount=100,
                max_discount=50,
                usage_limit=200,
                valid_from=timezone.now(),
                valid_until=timezone.now() + timezone.timedelta(days=90),
                is_active=True,
            ),
        )

        # =========================
        # BOOKINGS + PAYMENTS
        # =========================
        for _ in range(10):
            vehicle = random.choice(vehicles)
            days = random.randint(1, 7)
            total_price = vehicle.price_per_day * days

            booking = Booking.objects.create(
                customer=customer,
                vehicle=vehicle,
                pickup_date=timezone.now(),
                return_date=timezone.now() + timezone.timedelta(days=days),
                pickup_location=fake.city(),
                return_location=fake.city(),
                total_days=days,
                base_price=total_price,
                discount_amount=0,
                total_price=total_price,
                status="confirmed",
                notes=fake.sentence(),
            )

            Payment.objects.create(
                booking=booking,
                user=customer,
                amount=total_price,
                method="card",
                status="completed",
                transaction_id=f"txn_{booking.id}",
                payment_details={"provider": "visa", "last4": "4242"},
            )

            Review.objects.create(
                booking=booking,
                user=customer,
                vehicle=vehicle,
                rating=random.randint(4, 5),
                comment=fake.sentence(),
            )

        # =========================
        # CHAT
        # =========================
        session = ChatSession.objects.create(
            user=customer,
            status="open",
        )

        ChatMessage.objects.create(
            session=session,
            sender_type="customer",
            content=fake.sentence(),
        )
        ChatMessage.objects.create(
            session=session,
            sender_type="vendor",
            content=fake.sentence(),
        )

        # =========================
        # ADMIN REPORT
        # =========================
        AdminReport.objects.create(
            admin=admin,
            report_type="system",
            title="Demo Report",
            data={"users": 3, "vehicles": len(vehicles)},
            date_from=timezone.now() - timezone.timedelta(days=30),
            date_to=timezone.now(),
        )

        self.stdout.write(self.style.SUCCESS("✅ Demo data seeded successfully!"))
