import express from 'express';
import { getUsers, resetUserPassword, deleteUser, updateUserPassword } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, admin, getUsers);

router.route('/profile/password')
    .put(protect, updateUserPassword);

router.route('/:id/password')
    .put(protect, admin, resetUserPassword);

router.route('/:id')
    .delete(protect, admin, deleteUser);

export default router;
