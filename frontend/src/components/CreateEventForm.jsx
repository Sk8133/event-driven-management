import { useState } from 'react';
import api from '../services/api';

const CreateEventForm = ({ onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    activityType: 'other',
    subEvents: [
      { name: '', description: '', coordinator: '', participantsLimit: '' },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activityTypes = [
    { value: 'dance', label: '💃 Dance' },
    { value: 'singing', label: '🎤 Singing' },
    { value: 'music', label: '🎵 Music' },
    { value: 'sports', label: '⚽ Sports' },
    { value: 'workshop', label: '📚 Workshop' },
    { value: 'other', label: '✨ Other' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubEventChange = (index, field, value) => {
    const updatedSubEvents = formData.subEvents.map((subEvent, subIndex) =>
      subIndex === index ? { ...subEvent, [field]: value } : subEvent
    );
    setFormData({ ...formData, subEvents: updatedSubEvents });
  };

  const addSubEvent = () => {
    setFormData({
      ...formData,
      subEvents: [...formData.subEvents, { name: '', description: '', coordinator: '', participantsLimit: '' }],
    });
  };

  const removeSubEvent = (index) => {
    setFormData({
      ...formData,
      subEvents: formData.subEvents.filter((_, subIndex) => subIndex !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      activityType: formData.activityType,
      subEvents: formData.subEvents.map((subEvent) => ({
        name: subEvent.name,
        description: subEvent.description,
        coordinator: subEvent.coordinator,
        participantsLimit: Number(subEvent.participantsLimit) || 0,
      })),
    };

    try {
      const response = await api.post('/events', payload);
      onEventCreated(response.data);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        activityType: 'other',
        subEvents: [{ name: '', description: '', coordinator: '', participantsLimit: '' }],
      });
    } catch (err) {
      setError('Failed to create event. Please check your entries.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Event</h2>
          <p className="text-gray-400 text-sm">Add sub-events so each main event can host multiple activities.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter event title"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">Activity Type</label>
          <select
            name="activityType"
            value={formData.activityType}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            {activityTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter location"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
          rows="4"
          placeholder="Enter event description"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Sub-Events</h3>
          <button
            type="button"
            onClick={addSubEvent}
            className="text-sm font-semibold text-blue-300 hover:text-white"
          >
            + Add Sub-Event
          </button>
        </div>

        {formData.subEvents.map((subEvent, index) => (
          <div key={index} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white font-semibold">Sub-Event {index + 1}</p>
                <p className="text-gray-400 text-sm">Add a specific activity inside the main event.</p>
              </div>
              {formData.subEvents.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubEvent(index)}
                  className="text-sm text-red-400 hover:text-red-200"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Sub-Event Name</label>
                <input
                  type="text"
                  value={subEvent.name}
                  onChange={(e) => handleSubEventChange(index, 'name', e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Singing, Drama, Photography"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Coordinator</label>
                <input
                  type="text"
                  value={subEvent.coordinator}
                  onChange={(e) => handleSubEventChange(index, 'coordinator', e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Coordinator name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={subEvent.description}
                  onChange={(e) => handleSubEventChange(index, 'description', e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  rows="2"
                  placeholder="Describe this sub-event"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-semibold mb-2">Participants Limit</label>
                <input
                  type="number"
                  min="0"
                  value={subEvent.participantsLimit}
                  onChange={(e) => handleSubEventChange(index, 'participantsLimit', e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="20"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventForm;