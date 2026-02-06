import express from 'express';
import {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee
} from '../controllers/employeeController.js';
import { protect, admin, operatorOrAdmin, canViewEmployeeData } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, operatorOrAdmin, getEmployees)
    .post(protect, operatorOrAdmin, createEmployee);

router.route('/:id')
    .get(protect, canViewEmployeeData, getEmployeeById)
    .put(protect, operatorOrAdmin, updateEmployee);

export default router;
