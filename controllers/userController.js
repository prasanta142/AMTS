import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user password (Admin reset)
// @route   PUT /api/users/:id/password
// @access  Admin
export const resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.password = req.body.password;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update own profile/password
// @route   PUT /api/users/profile/password
// @access  Private
export const updateUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (await user.matchPassword(req.body.currentPassword)) {
                user.password = req.body.newPassword;
                await user.save();
                res.json({ message: 'Password updated successfully' });
            } else {
                res.status(401).json({ message: 'Invalid current password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
