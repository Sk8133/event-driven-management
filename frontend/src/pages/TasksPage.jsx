import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import api from '../services/api';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Unable to load tasks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleUpdateStatus = async (taskId, status) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, { status });
      setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
    } catch (err) {
      console.error('Unable to update task', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">Loading tasks...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-300">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task._id} task={task} onUpdateStatus={handleUpdateStatus} />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-white/10 bg-gray-900 p-8 text-center text-gray-400">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;