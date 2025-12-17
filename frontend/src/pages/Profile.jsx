import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function Profile() {
  const { user, loadUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.profile?.address || "",
        city: user.profile?.city || "",
        country: user.profile?.country || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authAPI.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      });

      await authAPI.updateUserProfile({
        address: formData.address,
        city: formData.city,
        country: formData.country,
      });

      await loadUser();
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.profile?.address || "",
        city: user.profile?.city || "",
        country: user.profile?.country || "",
      });
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm";
  const labelClasses = "block text-sm font-medium text-neutral-700 mb-1";

  const InfoField = ({ icon: Icon, value }) => (
    <div className="flex items-center rounded-md bg-neutral-50 px-4 py-2 text-sm">
      <Icon className="mr-3 h-5 w-5 text-neutral-400" />
      <span className="text-neutral-800">{value || "Not set"}</span>
    </div>
  );

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
        </header>

        <div className="rounded-lg bg-white shadow-md">
          {/* Profile Header */}
          <div className="rounded-t-lg bg-gradient-to-r from-neutral-800 to-neutral-900 p-6">
            <div className="flex items-center">
              <div className="bg-primary flex h-20 w-20 items-center justify-center rounded-full">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="ml-5 text-white">
                <h2 className="text-2xl font-bold">
                  {user.first_name} {user.last_name || user.username}
                </h2>
                <p className="text-neutral-300 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {message.text && (
              <div
                className={`mb-6 rounded-md p-4 text-sm ${message.type === "success" ? "border border-green-200 bg-green-50 text-green-800" : "border border-red-200 bg-red-50 text-red-800"}`}
              >
                {message.text}
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-neutral-800">
                Profile Information
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-primary hover:text-primary-dark flex items-center text-sm font-semibold"
                >
                  <Edit2 className="mr-1 h-4 w-4" />
                  Edit
                </button>
              ) : (
                <button
                  onClick={cancelEdit}
                  className="flex items-center text-sm font-semibold text-neutral-600 hover:text-neutral-800"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                {/* Fields */}
                <div>
                  <label className={labelClasses}>First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={User} value={user.first_name} />
                  )}
                </div>
                <div>
                  <label className={labelClasses}>Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={User} value={user.last_name} />
                  )}
                </div>
                <div>
                  <label className={labelClasses}>Email</label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={Mail} value={user.email} />
                  )}
                </div>
                <div>
                  <label className={labelClasses}>Phone</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={Phone} value={user.phone} />
                  )}
                </div>
                <div>
                  <label className={labelClasses}>City</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={MapPin} value={user.profile?.city} />
                  )}
                </div>
                <div>
                  <label className={labelClasses}>Country</label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={MapPin} value={user.profile?.country} />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Address</label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows="2"
                      className={inputClasses}
                    />
                  ) : (
                    <InfoField icon={MapPin} value={user.profile?.address} />
                  )}
                </div>
              </div>

              {editing && (
                <div className="mt-6 text-right">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary hover:bg-primary-dark inline-flex items-center rounded-md px-6 py-2 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 border-t border-neutral-200 pt-6">
              <div className="flex items-center text-sm text-neutral-500">
                <Calendar className="mr-2 h-4 w-4" />
                <span>
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
