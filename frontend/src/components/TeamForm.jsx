import { useState, useEffect } from 'react';
import api from '../services/api';

const TeamForm = ({ onTeamCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    leader: '',
    members: [],
  });
  const [users, setUsers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.filter((user) => user.role === 'student'));
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addMember = () => {
    if (!selectedMember || formData.members.includes(selectedMember)) return;
    setFormData({ ...formData, members: [...formData.members, selectedMember] });
    setSelectedMember('');
  };

  const removeMember = (memberId) => {
    setFormData({ ...formData, members: formData.members.filter((id) => id !== memberId) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/teams', { ...formData, role: 'admin', createdBy: 'admin' });
      onTeamCreated(response.data);
      setFormData({ name: '', description: '', leader: '', members: [] });
    } catch (err) {
      console.error('Failed to create team', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-white">Create Team</h2>
        <p className="text-gray-400 mt-2">Build your team with a leader and members.</p>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Team Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
          placeholder="Design, Marketing, Tech"
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"
          placeholder="Short summary about the team"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Team Leader</label>
        <select
          name="leader"
          value={formData.leader}
          onChange={handleChange}
          className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          required
        >
          <option value="">-- Select leader --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-gray-300 text-sm font-semibold mb-2">Team Members</label>
        <div className="flex gap-3">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="flex-1 rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="">-- Select member --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addMember}
            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 transition"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.members.map((memberId) => {
            const user = users.find((userItem) => userItem._id === memberId);
            return (
              <span key={memberId} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-gray-100">
                {user?.name || 'Unknown'}
                <button type="button" onClick={() => removeMember(memberId)} className="text-red-400 hover:text-red-200">×</button>
              </span>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating team...' : 'Create Team'}
      </button>
    </form>
  );
};

export default TeamForm;
