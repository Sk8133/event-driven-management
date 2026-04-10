import { useEffect, useState } from 'react';
import TeamCard from '../components/TeamCard';
import TeamForm from '../components/TeamForm';
import api from '../services/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (err) {
        setError('Unable to load teams.');
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, []);

  const handleTeamCreated = (team) => {
    setTeams([team, ...teams]);
    setSelectedTeam(team);
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setTeamTasks([]);
  };

  useEffect(() => {
    if (!selectedTeam) return;

    const loadTeamTasks = async () => {
      try {
        const response = await api.get(`/tasks?teamId=${selectedTeam._id}`);
        setTeamTasks(response.data);
      } catch (err) {
        console.error('Unable to load team tasks', err);
        setTeamTasks([]);
      }
    };

    loadTeamTasks();
  }, [selectedTeam]);

  const selectedTasks = teamTasks;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
              <h1 className="text-4xl font-extrabold">Team Management</h1>
              <p className="mt-2 text-gray-400">Create teams, assign leaders, and manage team-based tasks.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} onSelect={handleSelectTeam} />
              ))}
            </div>

            {teams.length === 0 && !loading && (
              <div className="rounded-3xl border border-dashed border-white/10 bg-gray-900 p-8 text-center text-gray-400">
                No teams exist yet. Use the form on the right to create one.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <TeamForm onTeamCreated={handleTeamCreated} />
            {selectedTeam && (
              <div className="rounded-3xl border border-white/10 bg-gray-900 p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4">Team Dashboard</h2>
                <p className="text-gray-400 mb-4">Team: {selectedTeam.name}</p>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-gray-950 border border-white/10 p-4">
                    <h3 className="text-lg font-semibold">Leader</h3>
                    <p className="text-gray-300 mt-2">{selectedTeam.leader?.name || 'TBA'}</p>
                    <p className="text-gray-500 text-sm">{selectedTeam.leader?.email || ''}</p>
                  </div>
                  <div className="rounded-3xl bg-gray-950 border border-white/10 p-4">
                    <h3 className="text-lg font-semibold">Members</h3>
                    <div className="mt-3 space-y-2">
                      {selectedTeam.members?.length > 0 ? (
                        selectedTeam.members.map((member) => (
                          <div key={member._id} className="rounded-2xl bg-gray-900 p-3 text-gray-200">
                            {member.name} <span className="text-gray-500">({member.email})</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">No members added yet.</p>
                      )}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-gray-950 border border-white/10 p-4">
                    <h3 className="text-lg font-semibold">Tasks assigned to team</h3>
                    <div className="mt-3 space-y-3">
                      {selectedTasks.length > 0 ? (
                        selectedTasks.map((task) => (
                          <div key={task._id || task.id} className="rounded-2xl bg-gray-900 p-3 text-gray-200">
                            <div className="font-semibold">{task.title}</div>
                            <div className="text-gray-400 text-sm">{task.description}</div>
                            <div className="text-xs text-gray-500 mt-1">Status: {task.status}</div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400">No tasks assigned to this team.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
