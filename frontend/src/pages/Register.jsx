import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    role: 'customer', // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const errorMessage = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setError(errorMessage);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const labelClasses = "block text-sm font-medium text-neutral-900 mb-1";

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-neutral-900">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Rentora</span>
          </Link>
          <h2 className="mt-4 text-xl font-semibold text-neutral-900">Create Your Account</h2>
          <p className="mt-1 text-neutral-600">Join us and start your journey today.</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className={labelClasses}>First Name</label>
                <Input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John" icon={User} />
              </div>
              <div>
                <label htmlFor="last_name" className={labelClasses}>Last Name</label>
                <Input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe" icon={User} />
              </div>
            </div>

            <div>
              <label htmlFor="username" className={labelClasses}>Username *</label>
              <Input type="text" id="username" name="username" required value={formData.username} onChange={handleChange} placeholder="john.doe" icon={User} />
            </div>

            <div>
              <label htmlFor="email" className={labelClasses}>Email *</label>
              <Input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" icon={Mail} />
            </div>

            <div className="relative">
              <label htmlFor="password" className={labelClasses}>Password *</label>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-neutral-500 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="password_confirm" className={labelClasses}>Confirm Password *</label>
              <Input
                type={showPassword ? 'text' : 'password'} // Keep consistent with password input
                id="password_confirm"
                name="password_confirm"
                required
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
              />
            </div>

            <div>
              <label htmlFor="role" className={labelClasses}>Register as</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm text-gray-900">
                <option value="customer">Customer (Rent vehicles)</option>
                <option value="vendor">Vendor (List your vehicles)</option>
              </select>
            </div>
            
            <Button type="submit" disabled={loading} className="w-full !mt-6">
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
