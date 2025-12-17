import { Link } from "react-router-dom";
import { ShieldCheck, Wallet, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { vehicleAPI } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import Button from "../components/Button";

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadFeaturedVehicles = async () => {
      try {
        const response = await vehicleAPI.getAll({ limit: 3 });
        setFeaturedVehicles(
          response.data.results
            ? response.data.results.slice(0, 3)
            : response.data.slice(0, 3),
        );
      } catch (error) {
        console.error("Could not load featured vehicles:", error);
      }
    };

    loadFeaturedVehicles();

    return () => controller.abort();
  }, []);

  const features = [
    {
      icon: Award,
      title: "Premium Selection",
      description: "Choose from a wide range of luxury cars, SUVs, and sedans.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Simple Booking",
      description: "Your payments and data are always protected.",
    },
    {
      icon: Wallet,
      title: "Flexible Payments",
      description: "Use your wallet or other methods for easy payment.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Hero Section */}
      <section className="relative flex min-h-125 items-center bg-[url(/hero-background.png)] bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-neutral-900/60"></div>{" "}
        {/* Dark overlay */}
        <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-4xl leading-tight font-extrabold md:text-5xl">
              Find Your Perfect Drive
            </h1>
            <p className="mb-8 text-lg text-neutral-200 md:text-xl">
              Premium vehicle rentals for every journey. Experience the freedom
              of the open road with Rentora.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="/vehicles"
                className="inline-flex items-center justify-center rounded-md bg-[#FF5F00] px-6 py-3 text-center font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-[#D45000] focus:ring-2 focus:ring-[#FF5F00] focus:ring-offset-2 focus:outline-none disabled:bg-neutral-300"
              >
                Browse Vehicles
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-neutral-200 px-6 py-3 text-center font-semibold text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              Why Choose Rentora?
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg bg-neutral-50 p-6 text-center shadow-sm"
              >
                <div className="bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                  <feature.icon className="text-primary h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      {featuredVehicles.length > 0 && (
        <section className="bg-neutral-50 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-900">
                Featured Vehicles
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button as={Link} to="/vehicles" variant="secondary">
                View All Vehicles
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold">Ready to Hit the Road?</h2>
          <p className="mb-8 text-lg">
            Join thousands of satisfied customers who trust Rentora for their
            vehicle rental needs.
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-neutral-200 px-6 py-3 text-center font-semibold text-neutral-800 transition-colors duration-300 ease-in-out hover:bg-neutral-300 focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            Create Free Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-12 text-neutral-400">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Rentora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
