import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role')?.toLowerCase();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Event Manager</Link>
        <div className="space-x-4">
          {token ? (
            <>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <Link to="/events" className="hover:underline">Events</Link>
              <Link to="/teams" className="hover:underline">Teams</Link>
              <Link to="/tasks" className="hover:underline">Tasks</Link>
              {role === 'admin' ? (
                <Link to="/admin" className="hover:underline">Admin</Link>
              ) : (
                <Link to="/student" className="hover:underline">Student</Link>
              )}
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;