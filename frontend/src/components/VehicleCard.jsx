import { Link } from "react-router-dom";
import { Car, Star, Users, Gauge, MapPin } from "lucide-react";
import Card from "./Card";
import Button from "./Button";

export default function VehicleCard({ vehicle }) {
  const {
    id,
    brand,
    model,
    price_per_day,
    primary_image,
    rating,
    transmission,
    seats,
    fuel_type,
    location,
  } = vehicle;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      <Link to={`/vehicles/${id}`} className="relative block flex-shrink-0">
        <div className="flex h-48 items-center justify-center overflow-hidden bg-neutral-100">
          {primary_image ? (
            <img
              src={primary_image.image}
              alt={`${brand} ${model}`}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <Car className="h-16 w-16 text-neutral-300" />
          )}
        </div>
      </Link>
      <div className="flex flex-grow flex-col p-5">
        <Link to={`/vehicles/${id}`} className="block">
          <h3 className="group-hover:text-primary mb-1 truncate text-xl font-bold text-neutral-900 transition-colors">
            {brand} {model}
          </h3>
          <p className="mb-3 text-sm text-neutral-600">{vehicle.year}</p>
        </Link>
        <div className="mb-4 grid grid-cols-2 gap-y-2 text-sm text-neutral-700">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-neutral-400" />
            <span>{seats} Seats</span>
          </div>
          <div className="flex items-center">
            <Gauge className="mr-2 h-4 w-4 text-neutral-400" />
            <span className="capitalize">{transmission}</span>
          </div>
          <div className="flex items-center">
            <Car className="mr-2 h-4 w-4 text-neutral-400" />
            <span className="capitalize">{fuel_type}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-neutral-400" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-grow items-end justify-between border-t border-neutral-100 pt-4">
          <div>
            <span className="text-2xl font-bold text-neutral-900">
              ${price_per_day}
            </span>
            <span className="text-sm text-neutral-600"> / day</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center text-yellow-500">
              <Star className="mr-1 h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <Button as={Link} to={`/vehicles/${id}`} className="w-full">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
