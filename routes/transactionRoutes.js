import express from 'express';
import {
    addTransaction,
    getEmployeeTransactions,
    getAllTransactions,
    deleteTransaction
} from '../controllers/transactionController.js';
import { protect, admin, operatorOrAdmin, canViewEmployeeData } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, operatorOrAdmin, addTransaction)
    .get(protect, operatorOrAdmin, getAllTransactions);

router.route('/:id')
    .delete(protect, admin, deleteTransaction);

router.route('/:employeeId')
    .get(protect, canViewEmployeeData, getEmployeeTransactions);
// For now, I'll leave it as protect, but ideally check req.user.

export default router;
