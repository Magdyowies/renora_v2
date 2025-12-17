import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Car,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { vehicleAPI, bookingAPI } from "../services/api";
import { format } from "date-fns";

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([
        vehicleAPI.getMyVehicles(),
        bookingAPI.getVendorBookings(),
      ]);

      const vehiclesData = Array.isArray(vehiclesRes.data)
        ? vehiclesRes.data
        : vehiclesRes.data?.results || [];
      const bookingsData = Array.isArray(bookingsRes.data)
        ? bookingsRes.data
        : bookingsRes.data?.results || [];

      setVehicles(vehiclesData);
      setBookings(bookingsData);

      const activeBookings = bookingsData.filter((b) =>
        ["confirmed", "active"].includes(b.status),
      ).length;
      const totalEarnings = bookingsData
        .filter((b) => b.status === "completed")
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

      setStats({
        totalVehicles: vehiclesData.length,
        activeBookings,
        totalEarnings,
      });
    } catch (error) {
      console.error("Failed to load vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`))
      return;
    try {
      await bookingAPI.updateStatus(id, status);
      loadData();
    } catch (error) {
      alert("Failed to update booking status");
    }
  };

  const getStatusPill = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-neutral-100 text-neutral-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wider uppercase ${styles[status] || styles.completed}`}
      >
        {status}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="rounded-lg bg-white p-5 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        </div>
        <div
          className={`bg-opacity-10 rounded-full p-3 ${colorClass.replace("text-", "bg-")}`}
        >
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Vendor Dashboard
          </h1>
        </header>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles}
            icon={Car}
            colorClass="text-primary"
          />
          <StatCard
            title="Active Bookings"
            value={stats.activeBookings}
            icon={Calendar}
            colorClass="text-blue-600"
          />
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            colorClass="text-green-600"
          />
        </div>

        <div className="rounded-lg bg-white shadow-md">
          <div className="border-b border-neutral-200">
            <nav className="-mb-px flex space-x-6 px-6">
              <button
                onClick={() => setActiveTab("vehicles")}
                className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "vehicles" ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"}`}
              >
                My Vehicles
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "bookings" ? "border-primary text-primary" : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"}`}
              >
                Manage Bookings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "vehicles" &&
              (vehicles.length === 0 ? (
                <div className="py-12 text-center">
                  <Car className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
                  <p className="text-neutral-600">No vehicles listed yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-xs text-neutral-700 uppercase">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Vehicle
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price/Day
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {vehicles.map((v) => (
                        <tr key={v.id} className="hover:bg-neutral-50">
                          <td className="px-6 py-4 font-medium text-neutral-900">
                            {v.brand} {v.model} ({v.year})
                          </td>
                          <td className="px-6 py-4">${v.price_per_day}</td>
                          <td className="px-6 py-4">
                            {getStatusPill(v.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/vehicles/${v.id}`}
                              className="hover:text-primary rounded-md p-2 text-neutral-500"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

            {activeTab === "bookings" &&
              (bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
                  <p className="text-neutral-600">No bookings to manage.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-lg border border-neutral-200 p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex flex-col items-start justify-between sm:flex-row">
                        <div>
                          <p className="font-bold text-neutral-800">
                            {b.vehicle_details?.brand}{" "}
                            {b.vehicle_details?.model}
                          </p>
                          <p className="text-sm text-neutral-500">
                            Customer: {b.customer_name} |{" "}
                            {format(new Date(b.pickup_date), "MMM dd")} -{" "}
                            {format(new Date(b.return_date), "MMM dd")}
                          </p>
                        </div>
                        <div className="mt-2 text-right sm:mt-0">
                          {getStatusPill(b.status)}
                          <p className="mt-1 text-lg font-bold text-neutral-800">
                            ${b.total_price}
                          </p>
                        </div>
                      </div>
                      {["pending", "confirmed"].includes(b.status) && (
                        <div className="mt-4 flex gap-2 border-t pt-4">
                          <button
                            onClick={() =>
                              handleUpdateBookingStatus(b.id, "confirmed")
                            }
                            className="flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateBookingStatus(b.id, "cancelled")
                            }
                            className="flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
