import { useState, useEffect } from 'react';
import { Plus, Calendar, CheckSquare, BarChart3, Users, Upload, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import AssignedTaskCard from '../components/AssignedTaskCard';
import CreateEventForm from '../components/CreateEventForm';
import CreateTaskForm from '../components/CreateTaskForm';
import EventMediaUpload from '../components/EventMediaUpload';
import api from '../services/api';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Arrange chairs', description: 'Prepare seating.', status: 'Pending', assignedTo: 'student123', assignedToName: 'John Doe', assignedToEmail: 'john@example.com' },
    { id: 't2', title: 'Send invites', description: 'Email to all students.', status: 'In Progress', assignedTo: 'student456', assignedToName: 'Jane Smith', assignedToEmail: 'jane@example.com' },
  ]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventForMedia, setSelectedEventForMedia] = useState(null);

  const handleEventCreated = (newEvent) => {
    const createdEvent = { ...newEvent, id: newEvent._id || newEvent.id || `e${events.length + 1}` };
    setEvents([...events, createdEvent]);
    setShowCreateEvent(false);
    setSelectedEventId(createdEvent._id || createdEvent.id);
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, { id: `t${tasks.length + 1}`, status: 'Pending', ...newTask }]);
    setShowCreateTask(false);
  };

  const handleMediaUpdated = (updatedEvent) => {
    setEvents(events.map(e => (e._id === updatedEvent._id || e.id === updatedEvent._id || e.id === updatedEvent.id) ? { ...e, images: updatedEvent.images, videos: updatedEvent.videos } : e));
  };

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data || []);
        if (response.data && response.data.length > 0) {
          setSelectedEventId(response.data[0]._id || response.data[0].id);
        }
      } catch (err) {
        console.error('Unable to load backend events:', err);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 shadow-lg">
          <h1 className="text-4xl font-extrabold mb-2">Admin Dashboard</h1>
          <p className="text-blue-100">Manage events, create tasks and assign them to students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-8 py-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 rounded-lg p-6 hover:border-blue-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-semibold">Total Events</p>
                <p className="text-4xl font-bold text-blue-100 mt-2">{events.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30 rounded-lg p-6 hover:border-purple-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-semibold">Pending Tasks</p>
                <p className="text-4xl font-bold text-purple-100 mt-2">{pendingTasks}</p>
              </div>
              <CheckSquare className="w-12 h-12 text-purple-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 rounded-lg p-6 hover:border-orange-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-semibold">In Progress</p>
                <p className="text-4xl font-bold text-orange-100 mt-2">{inProgressTasks}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-6 hover:border-green-400/60 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-semibold">Completed</p>
                <p className="text-4xl font-bold text-green-100 mt-2">{completedTasks}</p>
              </div>
              <CheckSquare className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowCreateEvent(!showCreateEvent)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/50"
            >
              <Plus className="w-5 h-5" />
              {showCreateEvent ? 'Cancel Event' : 'Create Event'}
            </button>
            <button
              onClick={() => setShowCreateTask(!showCreateTask)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-green-500/50"
            >
              <Plus className="w-5 h-5" />
              {showCreateTask ? 'Cancel Task' : 'Assign Task'}
            </button>
            <button
              onClick={() => setShowMediaUpload(!showMediaUpload)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/50"
            >
              <Upload className="w-5 h-5" />
              {showMediaUpload ? 'Cancel Upload' : 'Upload Media'}
            </button>
          </div>

          {/* Forms Section */}
          <div className="space-y-6">
            {showCreateEvent && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <CreateEventForm onEventCreated={handleEventCreated} />
              </div>
            )}
            {showCreateTask && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Select Event</label>
                  <select
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">-- Choose an event --</option>
                    {events.map(event => (
                      <option key={event._id || event.id} value={event._id || event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>
                {selectedEventId && <CreateTaskForm eventId={selectedEventId} onTaskCreated={handleTaskCreated} />}
              </div>
            )}
            {showMediaUpload && (
              <div className="space-y-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Upload Media to Event</h3>
                    <button
                      onClick={() => {
                        setShowMediaUpload(false);
                        setSelectedEventForMedia(null);
                      }}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {!selectedEventForMedia ? (
                    <div className="mb-6">
                      <label className="block text-gray-300 text-sm font-semibold mb-3">Select an Event</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map(event => (
                          <button
                            key={event._id || event.id}
                            onClick={() => setSelectedEventForMedia(event._id || event.id)}
                            className="bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-purple-500 rounded-lg p-4 text-left transition-all"
                          >
                            <h4 className="font-semibold text-white text-lg">{event.title}</h4>
                            <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                            <p className="text-gray-500 text-xs mt-2">📍 {event.location} • 📅 {event.date}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setSelectedEventForMedia(null)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-semibold mb-4 flex items-center gap-1"
                      >
                        ← Back to Event Selection
                      </button>
                      <EventMediaUpload
                        eventId={selectedEventForMedia}
                        eventTitle={events.find(e => (e._id || e.id) === selectedEventForMedia)?.title || 'Event'}
                        onMediaUpdated={handleMediaUpdated}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Tasks Section */}
        <div className="px-8 py-8 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Assigned Tasks to Students</h2>
            <span className="ml-auto bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-semibold">{tasks.length} tasks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <AssignedTaskCard
                  key={task.id}
                  task={task}
                  studentName={task.assignedToName}
                  studentEmail={task.assignedToEmail}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p>No tasks assigned yet. Create and assign tasks to students!</p>
              </div>
            )}
          </div>
        </div>

        {/* Events Section */}
        <div className="px-8 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard key={event._id || event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-400">
                <p>No events created yet. Create your first event!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;