import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js'; // Import Employee model

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export const operatorOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'operator' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as operator' });
    }
};

// New middleware: Allow if Admin, Operator, OR if the logged-in user is the Employee being accessed
export const canViewEmployeeData = async (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'operator')) {
        return next();
    }

    // Check if the parameter passed is an Employee ID (often 'id' or 'employeeId')
    const resourceId = req.params.id || req.params.employeeId;

    // Check if the logged-in user is linked to an Employee
    if (req.user && req.user.employeeId && req.user.role === 'employee') {
        // We have a string employeeId in User model, need to compare
        if (req.user.employeeId.toString() === resourceId) {
            return next();
        }
    }

    res.status(401).json({ message: 'Not authorized to view this data' });
};
