import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const TaskCard = ({ task, onUpdateStatus }) => {
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
          {task.location && (
            <p className="text-gray-300 text-sm mt-2">Gather at: {task.location}</p>
          )}
        </div>
        <IconComponent className={`w-6 h-6 ${config.color} flex-shrink-0 ml-2`} />
      </div>

      <div className="flex flex-col gap-3 mb-5 pt-4 border-t border-gray-700/50 sm:flex-row sm:items-center sm:justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.badge} uppercase tracking-wide`}>
          {task.status}
        </span>
        {task.assignedTeam ? (
          <div className="space-y-1 text-xs text-gray-300 text-right sm:text-left">
            <div>Team: {task.assignedTeam.name}</div>
            <div>Leader: {task.assignedTeam.leader?.name || 'TBA'}</div>
            <div>Members: {task.assignedTeam.members?.length ?? 0}</div>
          </div>
        ) : task.assignedUser ? (
          <div className="space-y-1 text-xs text-gray-300 text-right sm:text-left">
            <div>Assigned to: {task.assignedUser.name}</div>
            {task.assignedUser.email && <div>Email: {task.assignedUser.email}</div>}
          </div>
        ) : task.assignedTarget ? (
          <span className="text-xs text-gray-300">Assigned to: {task.assignedTarget}</span>
        ) : null}
      </div>

      {onUpdateStatus && task.status !== 'Completed' && (
        <div className="space-y-2">
          {task.status === 'Pending' && (
            <button
              onClick={() => onUpdateStatus(task._id || task.id, 'In Progress')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              Start Task
            </button>
          )}
          <button
            onClick={() => onUpdateStatus(task._id || task.id, 'Completed')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      )}
      {onUpdateStatus && task.status === 'Completed' && (
        <div className="text-center py-2 text-green-400 font-semibold">
          ✓ Task Completed
        </div>
      )}
    </div>
  );
};

export default TaskCard;