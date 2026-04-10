import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const getActivityColor = (activityType) => {
    const colors = {
      dance: { bg: 'from-pink-500 to-pink-600', text: 'text-pink-400', badge: 'bg-pink-500/20 text-pink-300' },
      singing: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300' },
      music: { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' },
      sports: { bg: 'from-green-500 to-green-600', text: 'text-green-400', badge: 'bg-green-500/20 text-green-300' },
      workshop: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' },
      other: { bg: 'from-gray-500 to-gray-600', text: 'text-gray-400', badge: 'bg-gray-500/20 text-gray-300' },
    };
    return colors[activityType] || colors.other;
  };

  const activity = event.activityType || 'other';
  const colors = getActivityColor(activity);

  return (
    <Link to={`/events/${event._id || event.id}`} className="block">
      <div className={`bg-gradient-to-br ${colors.bg} bg-opacity-20 border border-gray-700 hover:border-opacity-100 rounded-xl p-6 transition-all duration-300 hover:shadow-lg group`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{event.title}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{event.description}</p>
          </div>
        </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
          <span className="text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <MapPin className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
          <span className="text-sm">{event.location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <span className="text-sm font-medium">{event.subEvents?.length || 0} Sub-event{event.subEvents?.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${colors.badge}`}>
          {activity}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
      </div>
    </div>
  </Link>
  );
};

export default EventCard;