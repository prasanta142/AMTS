import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Transaction from './models/Transaction.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
    try {
        await User.deleteMany();
        await Employee.deleteMany();
        await Transaction.deleteMany();

        console.log('Data Destroyed...');

        const adminUser = await User.create({
            username: 'admin',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        console.log('Admin User Created');
        console.log('Username: admin');
        console.log('Password: password123');

        // Create a dummy employee and operator for testing
        const employee = await Employee.create({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            designation: 'Helper',
            department: 'Printing',
            salary: 20000,
            advanceBalance: 0
        });

        await User.create({
            username: 'operator',
            password: 'password123',
            role: 'operator'
        });

        await User.create({
            username: 'john',
            password: 'password123',
            role: 'employee',
            employeeId: employee._id
        });

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
