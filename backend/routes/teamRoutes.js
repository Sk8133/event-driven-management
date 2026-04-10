import express from 'express';
import {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
} from '../controllers/teamController.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', requireAdmin, createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/:id/add-member', addMember);
router.post('/:id/remove-member', removeMember);

export default router;
