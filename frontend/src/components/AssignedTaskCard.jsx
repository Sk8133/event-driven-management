import { User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const AssignedTaskCard = ({ task, studentName, studentEmail }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'from-yellow-500/20 to-yellow-600/20',
          border: 'border-yellow-400/30 hover:border-yellow-400/60',
          icon: AlertCircle,
          color: 'text-yellow-400',
          badge: 'bg-yellow-500/20 text-yellow-300'
        };
      case 'In Progress':
        return {
          bg: 'from-blue-500/20 to-blue-600/20',
          border: 'border-blue-400/30 hover:border-blue-400/60',
          icon: Clock,
          color: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300'
        };
      case 'Completed':
        return {
          bg: 'from-green-500/20 to-green-600/20',
          border: 'border-green-400/30 hover:border-green-400/60',
          icon: CheckCircle2,
          color: 'text-green-400',
          badge: 'bg-green-500/20 text-green-300'
        };
      default:
        return {
          bg: 'from-gray-500/20 to-gray-600/20',
          border: 'border-gray-400/30 hover:border-gray-400/60',
          icon: AlertCircle,
          color: 'text-gray-400',
          badge: 'bg-gray-500/20 text-gray-300'
        };
    }
  };

  const config = getStatusConfig(task.status);
  const IconComponent = config.icon;

  return (
    <div className={`bg-gradient-to-br ${config.bg} border ${config.border} rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{task.title}</h3>
          <p className="text-gray-400 text-sm mt-2">{task.description}</p>
        </div>
        <IconComponent className={`w-6 h-6 ${config.color} flex-shrink-0 ml-2`} />
      </div>

      {/* Student Assignment Card */}
      <div className="bg-black/30 backdrop-blur border border-gray-600/50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold">ASSIGNED TO</p>
            <p className="text-white font-bold">{studentName}</p>
            <p className="text-xs text-gray-500">{studentEmail}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.badge} uppercase tracking-wide`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default AssignedTaskCard;
