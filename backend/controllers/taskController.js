import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import { sendEmailToStudents, taskCreationEmailTemplate } from '../config/emailService.js';

const createTask = async (req, res) => {
  try {
    const { title, description, event, assignedUser, assignedTeam, assignedTarget, location } = req.body;
    const userRole = req.user?.role;

    if (!assignedUser && !assignedTeam && !assignedTarget) {
      return res.status(400).json({ message: 'Task must be assigned to a user, a team, or a typed target' });
    }

    const taskData = { title, description };
    if (event) taskData.event = event;
    if (assignedUser) taskData.assignedUser = assignedUser;
    if (assignedTeam) taskData.assignedTeam = assignedTeam;
    if (assignedTarget) taskData.assignedTarget = assignedTarget;
    if (location) taskData.location = location;

    const task = await Task.create(taskData);

    // Send email to all registered students if created by admin
    if (userRole === 'admin') {
      const students = await User.find({ role: 'student' }, 'email');
      const studentEmails = students.map(s => s.email);
      
      if (studentEmails.length > 0) {
        const emailHTML = taskCreationEmailTemplate(title, description, null);
        sendEmailToStudents(studentEmails, `New Task: ${title}`, emailHTML);
      }
    }

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { userId, teamId, eventId, status } = req.query;
    const filter = {};

    if (eventId) filter.event = eventId;
    if (status) filter.status = status;

    if (teamId) {
      filter.assignedTeam = teamId;
    }

    if (userId) {
      const teams = await Team.find({ members: userId }).select('_id');
      const teamIds = teams.map((team) => team._id);

      filter.$or = [
        { assignedUser: userId },
        { assignedTeam: { $in: teamIds } },
      ];
    } else if (req.user && req.user.role !== 'admin') {
      const teams = await Team.find({ members: req.user.id }).select('_id');
      const teamIds = teams.map((team) => team._id);
      filter.$or = [
        { assignedUser: req.user.id },
      ];
      if (teamIds.length > 0) {
        filter.$or.push({ assignedTeam: { $in: teamIds } });
      }
    }

    const tasks = await Task.find(filter)
      .populate('event', 'title date')
      .populate('assignedUser', 'name email')
      .populate({
        path: 'assignedTeam',
        select: 'name leader members',
        populate: [
          { path: 'leader', select: 'name email' },
          { path: 'members', select: 'name email' },
        ],
      });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createTask, getTasks, updateTask, deleteTask };
