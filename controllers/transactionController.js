import Transaction from '../models/Transaction.js';
import Employee from '../models/Employee.js';

// @desc    Add a new transaction (Advance or Deduction)
// @route   POST /api/transactions
// @access  Private/Operator/Admin
export const addTransaction = async (req, res) => {
    const { employeeId, type, amount, description, date } = req.body;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Create Transaction
        const transaction = new Transaction({
            employeeId,
            type,
            amount,
            description,
            date: date || Date.now(),
            processedBy: req.user._id
        });

        await transaction.save();

        // Update Employee Balance
        // ADVANCE: Balance INCREASES (Employee owes more)
        // DEDUCTION: Balance DECREASES (Employee pays back)
        if (type === 'ADVANCE') {
            employee.advanceBalance += Number(amount);
        } else if (type === 'DEDUCTION') {
            employee.advanceBalance -= Number(amount);
        }

        await employee.save();

        res.status(201).json({
            ...transaction._doc,
            newBalance: employee.advanceBalance
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get transactions for an employee (Ledger)
// @route   GET /api/transactions/:employeeId
// @access  Private (Admin/Operator/Owner Employee)
export const getEmployeeTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ employeeId: req.params.employeeId })
            .sort({ date: -1 }); // Newest first

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all transactions (Global Ledger - Admin only maybe?)
// @route   GET /api/transactions
// @access  Private/Admin
export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('employeeId', 'name')
            .populate('processedBy', 'username')
            .sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a transaction and reverse balance
// @route   DELETE /api/transactions/:id
// @access  Admin
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const employee = await Employee.findById(transaction.employeeId);

        if (employee) {
            // Reverse balance
            if (transaction.type === 'ADVANCE') {
                employee.advanceBalance -= Number(transaction.amount);
            } else if (transaction.type === 'DEDUCTION') {
                employee.advanceBalance += Number(transaction.amount);
            }
            await employee.save();
        }

        await transaction.deleteOne();

        res.json({ message: 'Transaction deleted and balance updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
