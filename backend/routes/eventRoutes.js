import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  addSubEvent,
  updateSubEvent,
  deleteSubEvent,
  assignTeamToSubEvent,
  addParticipantToSubEvent,
  registerParticipant,
  getParticipants,
  updateParticipantStatus,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import mediaRoutes from './mediaRoutes.js';

const router = express.Router();

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/:id/subevents', addSubEvent);
router.put('/:id/subevents/:subEventId', updateSubEvent);
router.delete('/:id/subevents/:subEventId', deleteSubEvent);
router.post('/:eventId/subevents/:subEventId/assign-team', assignTeamToSubEvent);
router.post('/:eventId/subevents/:subEventId/add-participant', addParticipantToSubEvent);
router.post('/:eventId/subevents/:subEventId/register', registerParticipant);
router.get('/:eventId/subevents/:subEventId/participants', getParticipants);
router.put('/:eventId/subevents/:subEventId/participant/:participantId', updateParticipantStatus);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Mount media routes for events (nested routes)
// Usage: /api/events/:id/upload, /api/events/:id/media, etc.
router.use('/:id', mediaRoutes);

export default router;
