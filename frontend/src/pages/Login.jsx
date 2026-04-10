import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, UserPlus, Lock } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    try {
      const response = await api.post('/auth/login', formData);
      if (!response.data?.token) {
        throw new Error('Missing token');
      }

      // Verify the role matches selected role
      const returnedRole = response.data.role?.toLowerCase();
      if (returnedRole !== selectedRole?.toLowerCase()) {
        setError(`Invalid credentials for ${selectedRole} account`);
        return;
      }

      localStorage.setItem('token', response.data.token);
      if (response.data.role) {
        localStorage.setItem('role', response.data.role);
      } else {
        localStorage.removeItem('role');
      }
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
      }
      if (response.data.name) {
        localStorage.setItem('userName', response.data.name);
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setFormData({ email: '', password: '' });
    setError('');
  };

  // Role Selection Screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white mb-2">Event Manager</h1>
            <p className="text-gray-400 text-lg">Select your role to continue</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Student Button */}
            <button
              onClick={() => setSelectedRole('student')}
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg p-8 transition-all transform hover:scale-105 shadow-lg hover:shadow-indigo-500/50 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-indigo-500/20 p-3 rounded-full group-hover:bg-indigo-500/30 transition-all">
                  <LogIn className="w-8 h-8 text-indigo-200" />
                </div>
                <span className="text-lg font-bold">Student</span>
                <span className="text-sm text-indigo-200">Student Login</span>
              </div>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => setSelectedRole('admin')}
              className="bg-gradient-to-br from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg p-8 transition-all transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="bg-cyan-500/20 p-3 rounded-full group-hover:bg-cyan-500/30 transition-all">
                  <Lock className="w-8 h-8 text-cyan-200" />
                </div>
                <span className="text-lg font-bold">Admin</span>
                <span className="text-sm text-cyan-200">Admin Login</span>
              </div>
            </button>
          </div>

          {/* Footer Links */}
          <div className="text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Login Form Screen
  const isAdmin = selectedRole === 'admin';
  const bgColor = isAdmin ? 'from-cyan-600 to-cyan-700' : 'from-indigo-600 to-indigo-700';
  const buttonColor = isAdmin ? 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700' : 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={handleBackToRoleSelection}
            className="text-gray-400 hover:text-gray-300 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            ← Back to Role Selection
          </button>
        </div>

        {/* Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`bg-gradient-to-r ${bgColor} inline-block p-3 rounded-full mb-4`}>
              {isAdmin ? (
                <Lock className="w-6 h-6 text-white" />
              ) : (
                <LogIn className="w-6 h-6 text-white" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isAdmin ? 'Admin Login' : 'Student Login'}
            </h2>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r ${buttonColor} disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg mt-6`}
            >
              {loading ? 'Logging in...' : `Login as ${isAdmin ? 'Admin' : 'Student'}`}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">Support</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            {/* New Registration - Only show for students */}
            {!isAdmin && (
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white rounded-lg font-semibold transition-all"
              >
                <UserPlus className="w-5 h-5" />
                New Registration
              </Link>
            )}

            {/* Forgot Password - Only show for students */}
            {!isAdmin && (
              <button
                onClick={() => alert('Forgot Password feature coming soon!')}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-gray-500 text-white rounded-lg font-semibold transition-all"
              >
                <Lock className="w-5 h-5" />
                Forgot Password?
              </button>
            )}
          </div>

          {/* Back Button */}
          <button
            onClick={handleBackToRoleSelection}
            className="w-full mt-4 px-4 py-2 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-lg font-semibold transition-all"
          >
            ← Back to Role Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;