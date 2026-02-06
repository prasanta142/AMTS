import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    designation: { type: String },
    department: { type: String },
    salary: { type: Number, required: true },
    // Positive balance means the company OWES the employee (unlikely for "advance system")
    // Or, let's track "advanceBalance" - positive means Employee OWES company.
    advanceBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
