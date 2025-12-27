"""
Seed Vehicle Images to Cloudinary
=================================
• Uploads images from seed_images/
• Assigns 3 images per vehicle
• First image is primary
"""

print("\n🔥 CLOUDINARY VEHICLE SEED SCRIPT STARTED\n")

import os
import sys
import random
import django
import cloudinary
import cloudinary.uploader

# --------------------------------------------------
# 1️⃣ SET PROJECT ROOT & DJANGO
# --------------------------------------------------
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, PROJECT_ROOT)

print("🟡 PROJECT ROOT:", PROJECT_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rentora_backend.settings")

print("🟡 Initializing Django...")
django.setup()
print("🟢 Django ready\n")

# --------------------------------------------------
# 2️⃣ IMPORT MODELS
# --------------------------------------------------
from vehicles.models import Vehicle, VehicleImage

print("🟢 Models imported")

# --------------------------------------------------
# 3️⃣ IMAGE DIRECTORY
# --------------------------------------------------
IMAGES_DIR = os.path.join(PROJECT_ROOT, "seed_images")

print("🟡 Image directory:", IMAGES_DIR)

if not os.path.exists(IMAGES_DIR):
    raise Exception("❌ seed_images folder does NOT exist")

images = [
    f for f in os.listdir(IMAGES_DIR)
    if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
]

print(f"🟢 Found {len(images)} images")

if not images:
    raise Exception("❌ No images found inside seed_images")

random.shuffle(images)

# --------------------------------------------------
# 4️⃣ LOAD VEHICLES
# --------------------------------------------------
vehicles = list(Vehicle.objects.all())
print(f"🟢 Vehicles found: {len(vehicles)}")

if not vehicles:
    raise Exception("❌ No vehicles in database")

# --------------------------------------------------
# 5️⃣ CLEAR OLD IMAGES
# --------------------------------------------------
print("\n🧹 Deleting old VehicleImage records...")
VehicleImage.objects.all().delete()
print("🟢 Old images cleared\n")

# --------------------------------------------------
# 6️⃣ UPLOAD + ASSIGN
# --------------------------------------------------
img_index = 0
uploaded_count = 0

for vehicle in vehicles:
    records = []

    print(f"🚗 Vehicle {vehicle.id} → uploading images")

    for i in range(3):
        image_name = images[img_index % len(images)]
        img_index += 1

        image_path = os.path.join(IMAGES_DIR, image_name)

        print(f"   ⬆️ Uploading: {image_name}")

        try:
            upload = cloudinary.uploader.upload(
                image_path,
                folder="rentora/vehicles",
                resource_type="image",
                timeout=60
            )
        except Exception as e:
            print("❌ Cloudinary upload failed:", e)
            continue

        records.append(
            VehicleImage(
                vehicle=vehicle,
                image_url=upload["secure_url"],
                is_primary=(i == 0)
            )
        )

        uploaded_count += 1

    VehicleImage.objects.bulk_create(records)
    print(f"   ✅ {len(records)} images assigned\n")

# --------------------------------------------------
# 7️⃣ DONE
# --------------------------------------------------
print("🎉 SEEDING COMPLETE")
print(f"🖼️ Total images uploaded: {uploaded_count}")
print("✅ Cloudinary vehicle images ready\n")
