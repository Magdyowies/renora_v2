export function getVehiclePrimaryImage(vehicle) {
  if (!vehicle) return "https://via.placeholder.com/150?text=No+Image"; // Adjusted fallback size for admin table

  // Preferred: primary_image from the vehicle object itself (if serialized directly)
  if (vehicle.primary_image?.image_url) {
    return vehicle.primary_image.image_url;
  }
  // Fallback: first image from the 'images' array
  if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
    // Check if the image object in the array has an image_url
    if (vehicle.images[0].image_url) {
      return vehicle.images[0].image_url;
    }
  }

  // Final fallback
  return "https://via.placeholder.com/150?text=No+Image"; // Adjusted fallback size for admin table
}