import { Users, ShieldCheck } from 'lucide-react';

const TeamCard = ({ team, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(team)}
      className="text-left bg-gray-900 border border-gray-700 rounded-3xl p-5 transition hover:border-blue-500 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{team.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{team.description || 'No description yet'}</p>
        </div>
        <ShieldCheck className="w-6 h-6 text-blue-400" />
      </div>

      <div className="flex flex-wrap gap-2 text-sm text-gray-300">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
          <Users className="w-4 h-4" />
          {team.members?.length || 0} members
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
          Leader: {team.leader?.name || 'TBA'}
        </span>
      </div>
    </button>
  );
};

export default TeamCard;
