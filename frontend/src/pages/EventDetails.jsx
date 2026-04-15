import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subEventForm, setSubEventForm] = useState({
    name: '',
    description: '',
    coordinator: '',
    participantsLimit: '',
  });
  const [selectedSubEvent, setSelectedSubEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantForm, setParticipantForm] = useState({
    name: '',
    performanceTitle: '',
    performanceType: 'Solo',
    teamMembers: '',
  });
  const [coordinatorForm, setCoordinatorForm] = useState({
    userId: '',
    performanceTitle: '',
    performanceType: 'Solo',
  });
  const [participantError, setParticipantError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [assignError, setAssignError] = useState('');
  const [coordinatorMessage, setCoordinatorMessage] = useState('');

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
    } catch (err) {
      setError('Unable to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    const loadTeams = async () => {
      try {
        const response = await api.get('/teams');
        setTeams(response.data);
      } catch (err) {
        console.error('Unable to load teams.', err);
      }
    };

    loadTeams();
  }, [id]);

  const handleSubEventChange = (field, value) => {
    setSubEventForm({ ...subEventForm, [field]: value });
  };

  const handleAddSubEvent = async (e) => {
    e.preventDefault();
    if (!subEventForm.name) return;

    try {
      const response = await api.post(`/events/${id}/subevents`, {
        name: subEventForm.name,
        description: subEventForm.description,
        coordinator: subEventForm.coordinator,
        participantsLimit: Number(subEventForm.participantsLimit) || 0,
      });
      setEvent(response.data);
      setSubEventForm({ name: '', description: '', coordinator: '', participantsLimit: '' });
    } catch (err) {
      setError('Unable to add sub-event.');
    }
  };

  const handleDeleteSubEvent = async (subEventId) => {
    try {
      const response = await api.delete(`/events/${id}/subevents/${subEventId}`);
      setEvent(response.data);
      if (selectedSubEvent && selectedSubEvent._id === subEventId) {
        setSelectedSubEvent(null);
        setParticipants([]);
      }
    } catch (err) {
      setError('Unable to delete sub-event.');
    }
  };

  const loadParticipants = async (subEventId) => {
    setParticipantsLoading(true);
    setParticipantError('');
    try {
      const response = await api.get(`/events/${id}/subevents/${subEventId}/participants`);
      setParticipants(response.data.participants);
    } catch (err) {
      setParticipantError('Unable to load participants.');
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleSelectSubEvent = async (subEvent) => {
    setSelectedSubEvent(subEvent);
    setSelectedTeamId(subEvent.assignedTeam?._id || subEvent.assignedTeam || '');
    setParticipantForm({ name: '', performanceTitle: '', performanceType: 'Solo', teamMembers: '' });
    setCoordinatorForm({ userId: '', performanceTitle: '', performanceType: 'Solo' });
    setAssignError('');
    setCoordinatorMessage('');
    setStatusMessage('');
    await loadParticipants(subEvent._id);
  };

  const getAssignedTeam = () => {
    if (!selectedSubEvent?.assignedTeam) return null;
    const assignedTeamId = typeof selectedSubEvent.assignedTeam === 'object'
      ? selectedSubEvent.assignedTeam._id
      : selectedSubEvent.assignedTeam;
    return teams.find((team) => team._id.toString() === String(assignedTeamId));
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/10 text-emerald-300';
      case 'Rejected':
        return 'bg-red-500/10 text-red-300';
      default:
        return 'bg-yellow-500/10 text-yellow-300';
    }
  };

  const getStatusLabel = (status) => (status === 'Registered' ? 'Pending approval' : status);

  const handleCoordinatorChange = (field, value) => {
    setCoordinatorForm({ ...coordinatorForm, [field]: value });
  };

  const handleAssignTeam = async (subEventId) => {
    if (!selectedTeamId) {
      setAssignError('Select a team before assigning.');
      return;
    }
    try {
      const response = await api.post(`/events/${id}/subevents/${subEventId}/assign-team`, {
        teamId: selectedTeamId,
        role: 'admin',
      });
      setAssignError('');
      await fetchEvent();
      setSelectedSubEvent(response.data.subEvent);
      setSelectedTeamId(response.data.subEvent.assignedTeam?._id || response.data.subEvent.assignedTeam || '');
    } catch (err) {
      setAssignError(err?.response?.data?.message || 'Unable to assign team.');
    }
  };

  const handleAddParticipantAsCoordinator = async (e) => {
    e.preventDefault();
    if (!selectedSubEvent) return;

    const assignedTeam = getAssignedTeam();
    if (!assignedTeam) {
      setParticipantError('Sub-event does not have an assigned team.');
      return;
    }

    const leaderId = assignedTeam.leader?._id || assignedTeam.leader;
    if (!leaderId) {
      setParticipantError('Assigned team has no coordinator.');
      return;
    }

    setParticipantError('');
    try {
      const response = await api.post(
        `/events/${id}/subevents/${selectedSubEvent._id}/add-participant`,
        {
          userId: coordinatorForm.userId,
          performanceTitle: coordinatorForm.performanceTitle,
          performanceType: coordinatorForm.performanceType,
          assignedBy: leaderId,
          role: 'student',
        }
      );
      setParticipants(response.data.participants);
      setCoordinatorForm({ userId: '', performanceTitle: '', performanceType: 'Solo' });
      setCoordinatorMessage('Participant added successfully.');
      setStatusMessage('');
      await fetchEvent();
    } catch (err) {
      setParticipantError(err?.response?.data?.message || 'Unable to add participant.');
      setCoordinatorMessage('');
      setStatusMessage('');
    }
  };

  const handleParticipantChange = (field, value) => {
    setParticipantForm({ ...participantForm, [field]: value });
  };

  const handleRegisterParticipant = async (e) => {
    e.preventDefault();
    if (!selectedSubEvent) return;

    setParticipantError('');
    setStatusMessage('');
    try {
      const response = await api.post(
        `/events/${id}/subevents/${selectedSubEvent._id}/register`,
        {
          name: participantForm.name,
          performanceTitle: participantForm.performanceTitle,
          performanceType: participantForm.performanceType,
          teamMembers: participantForm.teamMembers,
        }
      );

      setParticipants(response.data.participants);
      setParticipantForm({ name: '', performanceTitle: '', performanceType: 'Solo', teamMembers: '' });
      await fetchEvent();
    } catch (err) {
      setParticipantError(err?.response?.data?.message || 'Unable to register participant.');
    }
  };



  if (loading) {
    return <div className="p-8 text-white">Loading event details...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-300">{error}</div>;
  }

  if (!event) {
    return <div className="p-8 text-white">Event not found.</div>;
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const currentSubEvent = selectedSubEvent
    ? event.subEvents?.find((subEvent) => subEvent._id === selectedSubEvent._id) || selectedSubEvent
    : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl border border-white/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold">{event.title}</h1>
              <p className="mt-3 text-gray-200 max-w-2xl">{event.description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-100">
                <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <MapPin className="w-4 h-4" />
                  {event.location || 'No location set'}
                </span>
                <span className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  {event.subEvents?.length || 0} Sub-event{event.subEvents?.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Sub-Events</h2>
                  <p className="text-gray-400">View and manage the activities inside this main event.</p>
                </div>
                <span className="text-sm text-gray-400">{event.subEvents?.length || 0}</span>
              </div>
              <div className="grid gap-4">
                {event.subEvents && event.subEvents.length > 0 ? (
                  event.subEvents.map((subEvent) => (
                    <div key={subEvent._id} className="bg-gray-800 border border-white/10 rounded-3xl p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">{subEvent.name}</h3>
                          <p className="text-gray-400 mt-2">{subEvent.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectSubEvent(subEvent)}
                            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/10"
                          >
                            Manage Participants
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubEvent(subEvent._id)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3 text-gray-300 text-sm">
                        <span className="inline-flex items-center gap-2 bg-white/5 rounded-full px-3 py-2">
                          Coordinator: {subEvent.coordinator || 'TBA'}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-white/5 rounded-full px-3 py-2">
                          Limit: {subEvent.participantsLimit || 0}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-white/5 rounded-full px-3 py-2">
                          Registered: {subEvent.participantsCount || 0}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-emerald-500/10 rounded-full px-3 py-2 text-emerald-300">
                          Approved: {subEvent.participants?.filter((p) => p.status === 'Approved').length || 0}
                        </span>
                        <span className="inline-flex items-center gap-2 bg-yellow-500/10 rounded-full px-3 py-2 text-yellow-300">
                          Pending: {subEvent.participants?.filter((p) => p.status === 'Registered').length || 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-gray-900 p-8 text-center text-gray-400">
                    No sub-events added yet. Use the form to add the first sub-event.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add Sub-Event</h2>
              <form onSubmit={handleAddSubEvent} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Name</label>
                  <input
                    value={subEventForm.name}
                    onChange={(e) => handleSubEventChange('name', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Singing"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Coordinator</label>
                  <input
                    value={subEventForm.coordinator}
                    onChange={(e) => handleSubEventChange('coordinator', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="Coordinator name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Description</label>
                  <textarea
                    value={subEventForm.description}
                    onChange={(e) => handleSubEventChange('description', e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none resize-none"
                    rows="3"
                    placeholder="Solo singing, group dance, etc."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Participant Limit</label>
                  <input
                    value={subEventForm.participantsLimit}
                    onChange={(e) => handleSubEventChange('participantsLimit', e.target.value)}
                    type="number"
                    min="0"
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    placeholder="20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  <span className="inline-flex items-center gap-2 justify-center">
                    <Plus className="w-4 h-4" />
                    Add Sub-Event
                  </span>
                </button>
              </form>
            </div>
            {selectedSubEvent && (
              <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{currentSubEvent?.name}</h2>
                    <p className="text-gray-400 text-sm">Manage registrations for this sub-event.</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {currentSubEvent?.participantsCount || 0} / {currentSubEvent?.participantsLimit || '∞'} registered
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="rounded-3xl border border-white/10 bg-gray-950 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-sm text-gray-400">Assigned team</div>
                        <div className="text-lg font-semibold text-white">
                          {getAssignedTeam()?.name || 'No team assigned'}
                        </div>
                        {getAssignedTeam() && (
                          <div className="text-gray-400 text-sm mt-1">
                            Leader: {getAssignedTeam().leader?.name || getAssignedTeam().leader || 'TBA'} · Members: {getAssignedTeam().members?.length || 0}
                          </div>
                        )}
                      </div>
                      <div className="w-full sm:w-auto">
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Select team</label>
                        <div className="flex gap-2">
                          <select
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                            className="flex-1 rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                          >
                            <option value="">-- Choose a team --</option>
                            {teams.map((team) => (
                              <option key={team._id} value={team._id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignTeam(currentSubEvent._id)}
                            className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500 transition"
                          >
                            Assign
                          </button>
                        </div>
                        {assignError && <div className="mt-2 text-red-400 text-sm">{assignError}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gray-950 p-4">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Coordinator-managed registration</h3>
                        <p className="text-gray-400 text-sm">Only the assigned team coordinator may add participants for this sub-event.</p>
                      </div>
                      {coordinatorMessage && <div className="text-green-400 text-sm">{coordinatorMessage}</div>}
                    </div>
                    {getAssignedTeam() ? (
                      <form onSubmit={handleAddParticipantAsCoordinator} className="space-y-4">
                        {participantError && <div className="text-red-400 text-sm">{participantError}</div>}
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Select Member</label>
                          <select
                            value={coordinatorForm.userId}
                            onChange={(e) => handleCoordinatorChange('userId', e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                            required
                          >
                            <option value="">-- Select team member --</option>
                            <option value={getAssignedTeam().leader._id || getAssignedTeam().leader}>
                              {getAssignedTeam().leader?.name || getAssignedTeam().leader} (Leader)
                            </option>
                            {getAssignedTeam().members?.map((member) => (
                              <option key={member._id} value={member._id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Performance Title</label>
                          <input
                            value={coordinatorForm.performanceTitle}
                            onChange={(e) => handleCoordinatorChange('performanceTitle', e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Enter performance title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Performance Type</label>
                          <select
                            value={coordinatorForm.performanceType}
                            onChange={(e) => handleCoordinatorChange('performanceType', e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                          >
                            <option value="Solo">Solo</option>
                            <option value="Group">Group</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-600 hover:to-green-700"
                        >
                          Add Participant
                        </button>
                      </form>
                    ) : (
                      <div className="text-gray-400">Assign a team before adding coordinator-managed participants.</div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleRegisterParticipant} className="space-y-4 mb-6">
                  {participantError && <div className="text-red-400 text-sm">{participantError}</div>}
                  {statusMessage && <div className="text-green-400 text-sm">{statusMessage}</div>}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Participant Name or Team Name</label>
                    <input
                      value={participantForm.name}
                      onChange={(e) => handleParticipantChange('name', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Enter participant or team name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Performance Title</label>
                    <input
                      value={participantForm.performanceTitle}
                      onChange={(e) => handleParticipantChange('performanceTitle', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      placeholder="Shape of You"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Performance Type</label>
                    <select
                      value={participantForm.performanceType}
                      onChange={(e) => handleParticipantChange('performanceType', e.target.value)}
                      className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Group">Group</option>
                    </select>
                  </div>
                  {participantForm.performanceType === 'Group' && (
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Team Members</label>
                      <input
                        value={participantForm.teamMembers}
                        onChange={(e) => handleParticipantChange('teamMembers', e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                        placeholder="Comma-separated names"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all"
                  >
                    Register Participant
                  </button>
                </form>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold">Participants</h3>
                      {statusMessage && <div className="text-green-400 text-sm">{statusMessage}</div>}
                    </div>
                    <span className="text-sm text-gray-400">{participants.length} entries</span>
                  </div>
                  {participantsLoading ? (
                    <div className="text-gray-400">Loading participants...</div>
                  ) : participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div key={participant._id} className="bg-gray-950 border border-white/10 rounded-3xl p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-lg font-semibold">{participant.name}</div>
                              <div className="text-gray-400 text-sm">{participant.performanceTitle}</div>
                            </div>
                            <div className="text-sm text-gray-300">
                              {participant.performanceType}
                            </div>
                          </div>
                          {participant.teamMembers?.length > 0 && (
                            <div className="mt-3 text-gray-400 text-sm">
                              Team members: {participant.teamMembers.join(', ')}
                            </div>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 ${getStatusClass(participant.status)}`}>
                              Status: {getStatusLabel(participant.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-gray-900 p-5 text-gray-400">
                      No participants registered yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
