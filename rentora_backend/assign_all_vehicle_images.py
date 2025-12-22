import os
import random
from django.conf import settings
from vehicles.models import Vehicle, VehicleImage

IMAGES_DIR = os.path.join(settings.MEDIA_ROOT, "vehicles")

all_images = [
    f for f in os.listdir(IMAGES_DIR)
    if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
]

if not all_images:
    print("❌ No images found")
    exit()

random.shuffle(all_images)

vehicles = list(Vehicle.objects.all())
image_index = 0

# Clear old images
VehicleImage.objects.all().delete()
print("🧹 Old vehicle images cleared")

for vehicle in vehicles:
    images = []

    for i in range(3):
        img = all_images[image_index % len(all_images)]
        image_index += 1

        images.append(
            VehicleImage(
                vehicle=vehicle,
                image=f"vehicles/{img}",
                is_primary=(i == 0),
            )
        )

    VehicleImage.objects.bulk_create(images)

print("🎉 Images assigned successfully to all vehicles")
