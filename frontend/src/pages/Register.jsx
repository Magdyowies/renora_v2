import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";

const INITIAL_FORM = {
  username: "",
  email: "",
  password: "",
  password_confirm: "",
  first_name: "",
  last_name: "",
  role: "customer",
};

export default function Register() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const formatErrors = (errors) =>
    Object.entries(errors)
      .map(
        ([key, value]) =>
          `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
      )
      .join("\n");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      const apiErrors = err.response?.data;
      setError(
        apiErrors
          ? formatErrors(apiErrors)
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const labelClasses = "block text-sm font-medium text-neutral-900 mb-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        {/* ===== Header ===== */}
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-neutral-900"
          >
            <Car className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold">Rentora</span>
          </Link>
          <h2 className="mt-4 text-xl font-semibold">Create Your Account</h2>
          <p className="mt-1 text-neutral-600">
            Join us and start your journey today.
          </p>
        </div>

        {/* ===== Card ===== */}
        <Card className="p-8">
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm whitespace-pre-line text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>First Name</label>
                <Input
                  required
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  icon={User}
                />
              </div>

              <div>
                <label className={labelClasses}>Last Name</label>
                <Input
                  required
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  icon={User}
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className={labelClasses}>Username *</label>
              <Input
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john.doe"
                icon={User}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelClasses}>Email *</label>
              <Input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                icon={Mail}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className={labelClasses}>Password *</label>
              <Input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute top-9 right-3 text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClasses}>Confirm Password *</label>
              <Input
                required
                type={showPassword ? "text" : "password"}
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
              />
            </div>

            {/* Role */}
            <div>
              <label className={labelClasses}>Register as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="focus:ring-primary-light focus:border-primary w-full rounded-md border border-neutral-300 px-4 py-3 text-sm focus:ring-2"
              >
                <option value="customer">Customer (Rent vehicles)</option>
                <option value="vendor">Vendor (List your vehicles)</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} className="mt-6 w-full">
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#FF5F00] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
