const User = require("../models/user.model")

const getUserProfile = async (req, res) => {
    try {
      const userId = req.params.id || req.user._id;
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      console.error('Get user profile error:', error.message);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };

  const updateProfile = async (req, res) => {
    try {
      const { name, email, bio, profilePicture, currentPassword, newPassword } = req.body;
      
      const user = await User.findById(req.user._id);
      
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }
      
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required' });
        }
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        user.password = newPassword;
      }
      
      if (name) user.name = name;
      if (email) user.email = email;
      if (bio !== undefined) user.bio = bio;
      if (profilePicture) user.profilePicture = profilePicture;
      
      await user.save();
      
      const updatedUser = await User.findById(req.user._id).select('-password');
      
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };


//   const updateProfile = async (req, res) => {
//   try {
//     const { name, email, bio, profilePicture } = req.body;
    
//     const user = await User.findById(req.user._id);
    
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the new email is different and already exists
//     if (email && email !== user.email) {
//       const emailExists = await User.findOne({ email });
//       if (emailExists) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }

//     // Update the fields
//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (bio !== undefined) user.bio = bio;
//     if (profilePicture) user.profilePicture = profilePicture;

//     await user.save();

//     const updatedUser = await User.findById(req.user._id).select('-password');

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Update profile error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


  const getUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      console.error('Get users error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {getUserProfile , updateProfile , getUsers}