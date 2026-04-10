import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import api from '../services/api';
import { Music, Disc3, Mic2, Zap, Activity } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Unable to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const activitySections = [
    { type: 'dance', label: 'Dance Events', icon: Disc3, color: 'from-pink-600 to-pink-500' },
    { type: 'singing', label: 'Singing Events', icon: Mic2, color: 'from-purple-600 to-purple-500' },
    { type: 'music', label: 'Music Events', icon: Music, color: 'from-indigo-600 to-indigo-500' },
    { type: 'sports', label: 'Sports & Games', icon: Zap, color: 'from-green-600 to-green-500' },
    { type: 'workshop', label: 'Workshops & Seminars', icon: Activity, color: 'from-blue-600 to-blue-500' },
    { type: 'other', label: 'Other Activities', icon: Activity, color: 'from-gray-600 to-gray-500' },
  ];

  const getEventsByType = (type) => {
    return events.filter(event => event.activityType === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="rounded-2xl border border-white/10 bg-gray-950 p-8 text-center shadow-2xl">
          <p className="text-lg font-semibold">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="rounded-2xl border border-red-500/20 bg-gray-950 p-8 text-center shadow-2xl">
          <p className="text-lg font-semibold text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 shadow-lg">
        <h1 className="text-4xl font-extrabold mb-2">Events & Activities</h1>
        <p className="text-blue-100 text-lg">Explore our diverse range of cultural, sports, and educational events</p>
      </div>

      {/* Events Sections */}
      <div className="px-8 py-12 space-y-16">
        {activitySections.map((section) => {
          const sectionEvents = getEventsByType(section.type);
          const IconComponent = section.icon;

          return sectionEvents.length > 0 ? (
            <div key={section.type}>
              {/* Section Header */}
              <div className="mb-8 flex items-center gap-4">
                <div className={`bg-gradient-to-r ${section.color} p-3 rounded-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{section.label}</h2>
                  <p className="text-gray-400 text-sm mt-1">{sectionEvents.length} event{sectionEvents.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Section Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {sectionEvents.map(event => (
                  <EventCard key={event._id || event.id} event={event} />
                ))}
              </div>

              {/* Divider */}
              {activitySections.indexOf(section) < activitySections.length - 1 && (
                <div className="border-t border-gray-700 mb-8"></div>
              )}
            </div>
          ) : null;
        })}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No events scheduled at the moment.</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="border-t border-gray-700 px-8 py-12 bg-gray-800/50">
        <h3 className="text-2xl font-bold text-white mb-8">Event Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {activitySections.map((section) => {
            const count = getEventsByType(section.type).length;
            return (
              <div key={section.type} className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-gray-400 text-xs mt-1 capitalize">{section.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;