import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Trophy, Calendar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import EventCard from '../components/EventCard';
import CoordinatorTaskSection from '../components/CoordinatorTaskSection';
import api from '../services/api';

const StudentDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        if (!userId) {
          setError('No student identity found. Please log in again.');
          setTasks([]);
          setEvents([]);
          return;
        }
        
        // Fetch tasks
        const tasksResponse = await api.get('/tasks', { params: { userId } });
        setTasks(tasksResponse.data);
        
        // Fetch all events
        const eventsResponse = await api.get('/events');
        setEvents(eventsResponse.data || []);
        
        // Check if user is a coordinator (team leader)
        try {
          const teamsResponse = await api.get('/teams', { params: { leaderId: userId } });
          setIsCoordinator(teamsResponse.data && teamsResponse.data.length > 0);
        } catch (err) {
          setIsCoordinator(false);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((task) => ((task._id === taskId || task.id === taskId) ? response.data : task)));
    } catch (err) {
      console.error('Unable to update task', err);
    }
  };

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-8 shadow-lg">
          <h1 className="text-4xl font-extrabold mb-2">Student Dashboard</h1>
          <p className="text-indigo-100">Track events and manage your assigned tasks</p>
          {isCoordinator && <p className="text-cyan-200 mt-1">📌 You are a Team Coordinator</p>}
          {loading && <p className="text-indigo-200 mt-2">Loading your data...</p>}
          {!loading && error && <p className="text-red-300 mt-2">{error}</p>}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 py-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-lg p-6 hover:border-blue-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-semibold">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-100 mt-2">{tasks.length}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-6 hover:border-green-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-semibold">Completed</p>
                <p className="text-3xl font-bold text-green-100 mt-2">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 rounded-lg p-6 hover:border-orange-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-orange-100 mt-2">{inProgressCount}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-lg p-6 hover:border-purple-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold">Events</p>
                <p className="text-3xl font-bold text-purple-100 mt-2">{events.length}</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="px-8 pb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Task Progress</h3>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 transition-all rounded-full"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-3">{completedCount} of {tasks.length} tasks completed</p>
            </div>
          </div>
        )}

        {/* Coordinator Section */}
        {isCoordinator && userId && (
          <div className="px-8 pb-8">
            <CoordinatorTaskSection userId={userId} />
          </div>
        )}

        {/* Events Section */}
        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Upcoming Events</h2>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p>No events available.</p>
            </div>
          )}
        </div>

        {/* Tasks Grid */}
        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Your Assigned Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <TaskCard key={task._id || task.id} task={task} onUpdateStatus={handleUpdateStatus} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p>No tasks assigned yet. Check back later!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;