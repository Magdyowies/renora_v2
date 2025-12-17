import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming this component exists or will be created
import { Mail, Lock } from 'lucide-react'; // Icons for input fields

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted!'); // Debug log
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      console.log('Login successful, navigating to dashboard.');
      navigate('/'); // Redirect to dashboard after successful login
    } catch (err) {
      console.error('Login error:', err); // Debug log for the actual error
      setError(err.response?.data?.detail || err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-sm"> {/* Max width adjusted for a tighter card */}
        <h1 className="text-3xl font-bold text-center mb-6 text-text-light dark:text-text-dark">
          Admin Login
        </h1>
        <Card className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                startIcon={<Mail className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                startIcon={<Lock className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              loading={loading} // Pass loading state to Button component
            >
              Login
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;