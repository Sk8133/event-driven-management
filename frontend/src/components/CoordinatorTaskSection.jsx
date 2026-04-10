import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../services/api';

const CoordinatorTaskSection = ({ userId }) => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedTasks, setAssignedTasks] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    assignedUser: '',
  });

  // Fetch teams where current user is leader
  useEffect(() => {
    const fetchTeamsAsLeader = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/teams', { params: { leaderId: userId } });
        setTeams(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedTeam(response.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setError('Unable to fetch your teams');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTeamsAsLeader();
    }
  }, [userId]);

  // Fetch tasks assigned by current leader
  useEffect(() => {
    const fetchAssignedTasks = async () => {
      if (!selectedTeam) return;
      try {
        const response = await api.get('/tasks', { params: { teamId: selectedTeam } });
        setAssignedTasks(response.data || []);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchAssignedTasks();
  }, [selectedTeam]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignedUser) {
      setError('Please select a team member');
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        assignedUser: formData.assignedUser,
      };

      await api.post('/tasks', payload);
      
      // Reset form
      setFormData({ title: '', description: '', location: '', assignedUser: '' });
      setShowForm(false);
      
      // Refresh tasks
      const response = await api.get('/tasks', { params: { teamId: selectedTeam } });
      setAssignedTasks(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to assign task');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading your teams...</div>;
  }

  if (teams.length === 0) {
    return null; // No teams where user is leader
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Team Coordinator - Assign Tasks</h2>
      
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {/* Team Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-semibold mb-2">Select Team</label>
        <select
          value={selectedTeam || ''}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none cursor-pointer"
        >
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.name}</option>
          ))}
        </select>
      </div>

      {/* Team Members Info */}
      {selectedTeam && teams.find(t => t._id === selectedTeam) && (
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <p className="text-gray-300 text-sm font-semibold mb-2">Team Members:</p>
          <div className="flex flex-wrap gap-2">
            {teams.find(t => t._id === selectedTeam)?.members?.map(member => (
              <span key={member._id} className="bg-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-sm">
                {member.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Assign Task Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg mb-6"
      >
        <Plus className="w-5 h-5" />
        {showForm ? 'Cancel' : 'Assign Task to Member'}
      </button>

      {/* Task Assignment Form */}
      {showForm && (
        <div className="bg-gray-700 border border-gray-600 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Arrange seating"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task..."
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Location / Details</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Main hall, Conference room"
                className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Assign to Team Member</label>
              <select
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleChange}
                className="w-full p-3 bg-gray-600 border border-gray-500 rounded-lg text-white focus:border-cyan-500 focus:outline-none cursor-pointer"
                required
              >
                <option value="">-- Select Member --</option>
                {selectedTeam && teams.find(t => t._id === selectedTeam)?.members?.map(member => (
                  <option key={member._id} value={member._id}>{member.name} ({member.email})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
            >
              Assign Task
            </button>
          </form>
        </div>
      )}

      {/* Tasks Assigned by Coordinator */}
      {assignedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 text-white">Tasks You've Assigned</h3>
          <div className="space-y-4">
            {assignedTasks.map(task => (
              <div key={task._id} className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-white">{task.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                    task.status === 'In Progress' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                {task.location && <p className="text-gray-400 text-xs">📍 {task.location}</p>}
                {task.assignedUser && (
                  <p className="text-cyan-300 text-sm mt-2">Assigned to: {task.assignedUser.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorTaskSection;
