import os
import random
from django.core.management.base import BaseCommand
from django.conf import settings
from vehicles.models import Vehicle, VehicleImage

class Command(BaseCommand):
    help = 'Assigns 3 images from media/vehicles/ to each vehicle, with the first as primary.'

    def handle(self, *args, **options):
        # 1. Collect all image files from media/vehicles/
        vehicle_images_dir = os.path.join(settings.MEDIA_ROOT, 'vehicles')
        if not os.path.exists(vehicle_images_dir):
            self.stdout.write(self.style.ERROR(f"Vehicle images directory not found: {vehicle_images_dir}"))
            return

        all_image_filenames = [
            f for f in os.listdir(vehicle_images_dir)
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'))
        ]

        if not all_image_filenames:
            self.stdout.write(self.style.WARNING("No image files found in media/vehicles/. Aborting."))
            return

        self.stdout.write(self.style.SUCCESS(f"Found {len(all_image_filenames)} image files."))

        # 2. Iterate over all Vehicle records
        vehicles = Vehicle.objects.all()
        if not vehicles.exists():
            self.stdout.write(self.style.WARNING("No Vehicle records found. Aborting."))
            return

        self.stdout.write(self.style.SUCCESS(f"Found {vehicles.count()} vehicle records."))

        for vehicle in vehicles:
            self.stdout.write(f"Processing vehicle: {vehicle.name} (ID: {vehicle.id})...")

            # Remove existing VehicleImage records for idempotency
            VehicleImage.objects.filter(vehicle=vehicle).delete()
            self.stdout.write(f"  Removed existing images for vehicle {vehicle.id}.")

            assigned_images = []
            # Ensure we always have 3 images by cycling if needed
            for i in range(3):
                # Use modulo to cycle through available images if there are fewer than 3
                selected_filename = all_image_filenames[i % len(all_image_filenames)]
                assigned_images.append(selected_filename)

            # Create new VehicleImage records
            for i, filename in enumerate(assigned_images):
                is_primary = (i == 0)
                # Construct the relative path from MEDIA_ROOT for the image field
                image_relative_path = os.path.join('vehicles', filename)
                
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=image_relative_path, # Django's ImageField will handle MEDIA_ROOT
                    is_primary=is_primary
                )
                self.stdout.write(f"  Assigned image: {filename} (Primary: {is_primary})")

        self.stdout.write(self.style.SUCCESS("Image assignment completed successfully!"))
