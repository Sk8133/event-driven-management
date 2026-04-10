import Event from '../models/Event.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import { sendEmailToStudents, eventCreationEmailTemplate } from '../config/emailService.js';

const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, activityType, subEvents = [] } = req.body;

    const event = await Event.create({ title, description, date, location, activityType, subEvents });

    // Send email to all registered users
    const users = await User.find({}, 'email');
    const userEmails = users.map(u => u.email);
    
    if (userEmails.length > 0) {
      const emailHTML = eventCreationEmailTemplate(title, description, date, location);
      sendEmailToStudents(userEmails, `New Event: ${title}`, emailHTML);
    }

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate('createdBy', 'name email')
      .populate({ path: 'subEvents.assignedTeam', select: 'name leader members' });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addSubEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, coordinator, participantsLimit } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = {
      name,
      description,
      coordinator,
      assignedTeam: null,
      participantsLimit,
      participantsCount: 0,
      participants: [],
    };

    event.subEvents.push(subEvent);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const assignTeamToSubEvent = async (req, res) => {
  try {
    const { eventId, subEventId } = req.params;
    const { teamId, role } = req.body;

    if (!teamId) {
      return res.status(400).json({ message: 'teamId is required' });
    }

    if (!role || role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role required' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    subEvent.assignedTeam = teamId;
    await event.save();

    res.json({ subEvent, team });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const addParticipantToSubEvent = async (req, res) => {
  try {
    const { eventId, subEventId } = req.params;
    const { userId, performanceTitle, performanceType, role } = req.body;
    const assignedBy = req.user?.id;

    if (!role || role.toLowerCase() !== 'student') {
      return res.status(403).json({ message: 'Coordinator role required' });
    }

    if (!assignedBy) {
      return res.status(400).json({ message: 'Unauthorized coordinator' });
    }

    if (!userId || !performanceTitle || !performanceType) {
      return res.status(400).json({ message: 'userId, performanceTitle and performanceType are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    if (!subEvent.assignedTeam) {
      return res.status(400).json({ message: 'Sub-event has no assigned team' });
    }

    const team = await Team.findById(subEvent.assignedTeam).populate('leader', 'name role').populate('members', 'name role');
    if (!team) return res.status(404).json({ message: 'Assigned team not found' });

    if (team.leader?._id.toString() !== assignedBy) {
      return res.status(403).json({ message: 'Only the assigned team coordinator can add participants' });
    }

    const participantUser = await User.findById(userId);
    if (!participantUser || participantUser.role !== 'student') {
      return res.status(400).json({ message: 'Participant must be a valid student' });
    }

    const isTeamMember = team.members.some((member) => member._id.toString() === userId) || team.leader._id.toString() === userId;
    if (!isTeamMember) {
      return res.status(400).json({ message: 'Participant must belong to the assigned team' });
    }

    if (subEvent.participantsLimit > 0 && subEvent.participantsCount >= subEvent.participantsLimit) {
      return res.status(400).json({ message: 'Participant limit reached for this sub-event' });
    }

    const participant = {
      name: participantUser.name,
      userId,
      performanceTitle,
      performanceType,
      assignedBy,
      status: 'Registered',
    };

    subEvent.participants.push(participant);
    subEvent.participantsCount = subEvent.participants.length;
    await event.save();

    // Create a linked task for the student when the coordinator assigns them to the sub-event.
    await Task.create({
      title: `${subEvent.name}: ${performanceTitle}`,
      description: `Assigned to perform ${performanceTitle} in ${subEvent.name} of the event ${event.title}.`,
      event: eventId,
      assignedUser: userId,
      assignedTeam: team._id,
      assignedTarget: participantUser.name,
      location: event.location,
    });

    res.status(201).json({ participants: subEvent.participants, participantsCount: subEvent.participantsCount });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const registerParticipant = async (req, res) => {
  try {
    const { eventId, subEventId } = req.params;
    const { name, performanceTitle, performanceType, teamMembers = [] } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    if (subEvent.participantsLimit > 0 && subEvent.participantsCount >= subEvent.participantsLimit) {
      return res.status(400).json({ message: 'Participant limit reached for this sub-event' });
    }

    if (!name || !performanceTitle || !performanceType) {
      return res.status(400).json({ message: 'Name, performance title, and performance type are required' });
    }

    const participant = {
      name,
      performanceTitle,
      performanceType,
      teamMembers: Array.isArray(teamMembers)
        ? teamMembers.filter(Boolean)
        : String(teamMembers).split(',').map((member) => member.trim()).filter(Boolean),
      status: 'Registered',
    };

    subEvent.participants.push(participant);
    subEvent.participantsCount = subEvent.participants.length;
    await event.save();

    res.status(201).json({ participants: subEvent.participants, participantsCount: subEvent.participantsCount });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const getParticipants = async (req, res) => {
  try {
    const { eventId, subEventId } = req.params;
    const event = await Event.findById(eventId)
      .populate('subEvents.participants.userId', 'name email')
      .populate('subEvents.participants.assignedBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    res.json({ participants: subEvent.participants, participantsCount: subEvent.participants.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateParticipantStatus = async (req, res) => {
  try {
    const { eventId, subEventId, participantId } = req.params;
    const { status } = req.body;

    if (!['Registered', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid participant status' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    const participant = subEvent.participants.id(participantId);
    if (!participant) return res.status(404).json({ message: 'Participant not found' });

    participant.status = status;
    await event.save();

    res.json({ participant });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const updateSubEvent = async (req, res) => {
  try {
    const { id, subEventId } = req.params;
    const { name, description, coordinator, participantsLimit } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    subEvent.name = name ?? subEvent.name;
    subEvent.description = description ?? subEvent.description;
    subEvent.coordinator = coordinator ?? subEvent.coordinator;
    subEvent.participantsLimit = participantsLimit ?? subEvent.participantsLimit;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteSubEvent = async (req, res) => {
  try {
    const { id, subEventId } = req.params;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const subEvent = event.subEvents.id(subEventId);
    if (!subEvent) return res.status(404).json({ message: 'Sub-event not found' });

    event.subEvents.pull(subEventId);
    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createEvent, getEvents, getEventById, addSubEvent, updateSubEvent, deleteSubEvent, assignTeamToSubEvent, addParticipantToSubEvent, updateEvent, deleteEvent, registerParticipant, getParticipants, updateParticipantStatus };

