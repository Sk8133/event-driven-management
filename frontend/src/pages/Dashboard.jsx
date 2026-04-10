import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const role = localStorage.getItem('role')?.toLowerCase();
  return role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

export default Dashboard;