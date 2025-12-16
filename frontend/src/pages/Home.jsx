import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Wallet, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { vehicleAPI } from '../services/api';
import VehicleCard from '../components/VehicleCard';
import Button from '../components/Button';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const response = await vehicleAPI.getAll({ limit: 3 });
      setFeaturedVehicles(response.data.results ? response.data.results.slice(0, 3) : response.data.slice(0, 3));
    } catch (error) {
      console.error('Could not load featured vehicles:', error);
    }
  };

  const features = [
    { icon: Award, title: 'Premium Selection', description: 'Choose from a wide range of luxury cars, SUVs, and sedans.' },
    { icon: ShieldCheck, title: 'Secure & Simple Booking', description: 'Your payments and data are always protected.' },
    { icon: Wallet, title: 'Flexible Payments', description: 'Use your wallet or other methods for easy payment.' },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen text-neutral-900">
      {/* Hero Section */}
      <section 
        className="relative min-h-[500px] flex items-center text-white"
        style={{ backgroundImage: "url('/attached_assets/modern_suv_on_coastal_highway_at_sunset.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-neutral-900/60"></div> {/* Dark overlay */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Find Your Perfect Drive
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 mb-8">
              Premium vehicle rentals for every journey. Experience the freedom of the open road with Rentora.
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
              <Button as={Link} to="/vehicles">
                Browse Vehicles
              </Button>
              <Button as={Link} to="/register" variant="secondary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900">Why Choose Rentora?</h2>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center p-6 bg-neutral-50 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      {featuredVehicles.length > 0 && (
        <section className="py-16 sm:py-24 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">Featured Vehicles</h2>
            </div>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button as={Link} to="/vehicles" variant="secondary">
                View All Vehicles
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 sm:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Hit the Road?</h2>
          <p className="text-lg text-neutral-100 mb-8">
            Join thousands of satisfied customers who trust Rentora for their vehicle rental needs.
          </p>
          <Button as={Link} to="/register" variant="secondary" className="bg-white text-primary hover:bg-neutral-100">
            Create Free Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Rentora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
