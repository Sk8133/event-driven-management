import express from 'express';
import { createUser, getUsers, getStudents } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/students', getStudents);

export default router;
