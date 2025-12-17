import { useState, useEffect } from "react";
import { vehicleAPI } from "../services/api";
import VehicleCard from "../components/VehicleCard";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import { Search, SlidersHorizontal, X, Car as CarIcon } from "lucide-react"; // Renamed Car to CarIcon to avoid conflict

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    transmission: "",
    min_price: "",
    max_price: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, categoriesRes] = await Promise.all([
        vehicleAPI.getAll(),
        vehicleAPI.getCategories(),
      ]);
      setVehicles(
        vehiclesRes.data.results ? vehiclesRes.data.results : vehiclesRes.data,
      );
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== ""),
      );
      const response = await vehicleAPI.getAll(activeFilters);
      setVehicles(
        response.data.results ? response.data.results : response.data,
      );
    } catch (error) {
      console.error("Error searching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      transmission: "",
      min_price: "",
      max_price: "",
    });
    loadInitialData(); // Re-fetch all vehicles after clearing
  };

  const labelClasses = "block text-sm font-medium text-neutral-900 mb-1";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Our Vehicles</h1>
          <p className="text-lg text-neutral-600">
            Find the perfect vehicle to fit your needs.
          </p>
        </header>

        {/* Filters and Search Bar */}
        <Card className="mb-8 p-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5"
          >
            <div className="lg:col-span-2">
              <label htmlFor="search" className={labelClasses}>
                Search
              </label>
              <Input
                id="search"
                name="search"
                placeholder="e.g., Toyota Camry, Location"
                value={filters.search}
                onChange={handleFilterChange}
                icon={Search}
              />
            </div>
            <div>
              <label htmlFor="category" className={labelClasses}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="focus:ring-primary-light focus:border-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-gray-900 transition-shadow focus:ring-2"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="transmission" className={labelClasses}>
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="focus:ring-primary-light focus:border-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-sm text-gray-900 transition-shadow focus:ring-2"
              >
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
              <Button
                type="button"
                onClick={clearFilters}
                variant="secondary"
                className="w-full"
                title="Clear Filters"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </Card>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="py-20 text-center">
            <SlidersHorizontal className="mx-auto mb-4 h-12 w-12 text-neutral-400" />
            <h3 className="mb-2 text-xl font-semibold text-neutral-900">
              No Vehicles Found
            </h3>
            <p className="text-neutral-600">
              Please try adjusting your search filters.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
