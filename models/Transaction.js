import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: {
        type: String,
        enum: ['ADVANCE', 'DEDUCTION'],
        required: true
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or Operator
}, { timestamps: true });

// Optional: Hooks to update Employee balance automatically could go here, 
// but often better handled in the controller to ensure atomic transactions or explicit logic.

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
