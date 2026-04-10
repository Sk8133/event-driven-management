import { useState } from 'react';
import api from '../services/api';

const CreateTaskForm = ({ eventId, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    assignType: 'user',
    assignedTarget: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      description: formData.description,
      event: eventId,
      location: formData.location,
      assignedTarget: formData.assignedTarget,
    };

    try {
      const response = await api.post('/tasks', payload);
      onTaskCreated(response.data);
      setFormData({ title: '', description: '', location: '', assignType: 'user', assignedTarget: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Set up projectors"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe what needs to be done..."
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
          rows="4"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Gather / Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Library conference room, Main hall, Zoom"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Assign to</label>
        <div className="mb-3">
          <label className="inline-flex items-center gap-2 text-gray-300">
            <input
              type="radio"
              name="assignType"
              value="user"
              checked={formData.assignType === 'user'}
              onChange={handleChange}
              className="accent-blue-500"
            />
            Student / Branch
          </label>
          <label className="inline-flex items-center gap-2 ml-6 text-gray-300">
            <input
              type="radio"
              name="assignType"
              value="team"
              checked={formData.assignType === 'team'}
              onChange={handleChange}
              className="accent-blue-500"
            />
            Team / Group
          </label>
        </div>
        <input
          type="text"
          name="assignedTarget"
          value={formData.assignedTarget}
          onChange={handleChange}
          placeholder={
            formData.assignType === 'team'
              ? 'Type team name, branch, or group identifier'
              : 'Type student name, branch, or individual'
          }
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          required
        />
        <p className="text-gray-400 text-xs mt-2">
          Enter the name or branch to assign this task.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !formData.assignedTarget}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all shadow-lg"
      >
        {loading ? 'Assigning Task...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
