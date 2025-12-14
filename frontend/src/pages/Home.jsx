import { Link } from 'react-router-dom';
import { Car, Shield, Clock, CreditCard, Star, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { vehicleAPI } from '../services/api';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll({ limit: 6 });
      setFeaturedVehicles(response.data.slice(0, 6));
    } catch (error) {
      console.log('Could not load featured vehicles');
    }
  };

  const features = [
    { icon: Car, title: 'Wide Selection', description: 'Choose from luxury cars, SUVs, sedans, and more' },
    { icon: Shield, title: 'Secure Booking', description: 'Your payments and data are fully protected' },
    { icon: Clock, title: 'Flexible Rentals', description: 'Daily, weekly, or monthly rental options' },
    { icon: CreditCard, title: 'Easy Payments', description: 'Multiple payment methods including wallet' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] bg-gradient-to-r from-primary-900 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Drive
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Premium vehicle rentals for every journey. From city streets to coastal roads,
              experience the freedom of the open road.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/vehicles"
                className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center"
              >
                Browse Vehicles
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Rentora?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featuredVehicles.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Vehicles</h2>
              <Link to="/vehicles" className="text-primary-600 hover:text-primary-700 flex items-center">
                View All <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  to={`/vehicles/${vehicle.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="h-48 bg-gray-200 relative">
                    {vehicle.primary_image ? (
                      <img
                        src={vehicle.primary_image.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <span className="capitalize">{vehicle.transmission}</span>
                      <span className="mx-2">•</span>
                      <span>{vehicle.seats} seats</span>
                      {vehicle.rating > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{vehicle.rating}</span>
                        </>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600">
                        ${vehicle.price_per_day}
                        <span className="text-sm text-gray-500 font-normal">/day</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Hit the Road?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of satisfied customers who trust Rentora for their vehicle rental needs.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Car className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">Rentora</span>
            </div>
            <p>&copy; 2024 Rentora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
