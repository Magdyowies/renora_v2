import { Link } from 'react-router-dom';
import { Car, Star, Users, Gauge, MapPin } from 'lucide-react';
import Card from './Card';
import Button from './Button';

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
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 ease-in-out hover:shadow-lg">
      <Link to={`/vehicles/${id}`} className="block relative flex-shrink-0">
        <div className="h-48 bg-neutral-100 flex items-center justify-center overflow-hidden">
          {primary_image ? (
            <img
              src={primary_image.image}
              alt={`${brand} ${model}`}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          ) : (
            <Car className="h-16 w-16 text-neutral-300" />
          )}
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/vehicles/${id}`} className="block">
          <h3 className="text-xl font-bold text-neutral-900 truncate mb-1 group-hover:text-primary transition-colors">
            {brand} {model}
          </h3>
          <p className="text-neutral-600 text-sm mb-3">{vehicle.year}</p>
        </Link>
        <div className="grid grid-cols-2 gap-y-2 text-sm text-neutral-700 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-neutral-400" />
            <span>{seats} Seats</span>
          </div>
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="capitalize">{transmission}</span>
          </div>
          <div className="flex items-center">
            <Car className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="capitalize">{fuel_type}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <div className="flex-grow flex items-end justify-between border-t border-neutral-100 pt-4 mt-auto">
          <div>
            <span className="text-2xl font-bold text-neutral-900">${price_per_day}</span>
            <span className="text-sm text-neutral-600"> / day</span>
          </div>
          {rating > 0 && (
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current mr-1" />
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
