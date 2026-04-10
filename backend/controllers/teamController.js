import Team from '../models/Team.js';
import User from '../models/User.js';

const createTeam = async (req, res) => {
  try {
    const { name, description, leader, members = [], role, createdBy } = req.body;

    if (!role || role.toLowerCase() !== 'admin') {
      return res.status(403).json({ message: 'Admin role required to create a team' });
    }

    const leaderUser = await User.findById(leader);
    if (!leaderUser || leaderUser.role !== 'student') {
      return res.status(400).json({ message: 'Leader must be a valid student user' });
    }

    const validMembers = [];
    for (const memberId of [...new Set(members)]) {
      if (!memberId || memberId === leader) continue;
      const member = await User.findById(memberId);
      if (member && member.role === 'student') {
        validMembers.push(memberId);
      }
    }

    const team = await Team.create({ name, description, leader, members: validMembers, createdBy });
    const populatedTeam = await Team.findById(team._id).populate('leader', 'name email').populate('members', 'name email').populate('createdBy', 'name email');
    res.status(201).json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const { leaderId } = req.query;
    const filter = {};
    
    if (leaderId) {
      filter.leader = leaderId;
    }
    
    const teams = await Team.find(filter).populate('leader', 'name email').populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id).populate('leader', 'name email').populate('members', 'name email');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, leader, members } = req.body;

    const updateData = { name, description };

    if (leader) {
      const leaderUser = await User.findById(leader);
      if (!leaderUser || leaderUser.role !== 'student') {
        return res.status(400).json({ message: 'Leader must be a valid student user' });
      }
      updateData.leader = leader;
    }

    if (Array.isArray(members)) {
      const validMembers = [];
      for (const memberId of [...new Set(members)]) {
        if (!memberId || memberId === leader) continue;
        const member = await User.findById(memberId);
        if (member && member.role === 'student') {
          validMembers.push(memberId);
        }
      }
      updateData.members = validMembers;
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('leader', 'name email').populate('members', 'name email');

    if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
    res.json(updatedTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) return res.status(404).json({ message: 'Team not found' });
    res.json({ message: 'Team deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (!memberId || team.members.map((m) => m.toString()).includes(memberId) || team.leader?.toString() === memberId) {
      return res.status(400).json({ message: 'Member is already in the team or invalid memberId' });
    }

    const user = await User.findById(memberId);
    if (!user || user.role !== 'student') return res.status(400).json({ message: 'Member must be a valid student' });

    team.members.push(memberId);
    await team.save();

    const populatedTeam = await Team.findById(id).populate('leader', 'name email').populate('members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.members = team.members.filter((member) => member.toString() !== memberId);
    await team.save();

    const populatedTeam = await Team.findById(id).populate('leader', 'name email').populate('members', 'name email');
    res.json(populatedTeam);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export { createTeam, getTeams, getTeamById, updateTeam, deleteTeam, addMember, removeMember };
