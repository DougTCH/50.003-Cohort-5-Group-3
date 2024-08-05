const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/crypto');

// Registration route
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptedFirstName = encrypt(firstName);
  const encryptedLastName = encrypt(lastName);

  const newUser = new User({
    email,
    password: hashedPassword,
    firstName: encryptedFirstName,
    lastName: encryptedLastName,
    points: 1000,
    mobileNumber: '',
    tier: 0,
    membershipIDs: [],
    vouchers: []
  });
  await newUser.save();

  res.json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' }); // generate token

  user.lastLogin = new Date();
  await user.save();

  // Decrypt first name and last name before sending response
  const decryptedFirstName = decrypt(user.firstName);
  const decryptedLastName = decrypt(user.lastName);

  res.json({
    message: 'Login successful', token,
    user: {
      id: user._id,
      email: user.email,
      firstName: decryptedFirstName,
      lastName: decryptedLastName,
      points: user.points,
      mobileNumber: user.mobileNumber,
      tier: user.tier,
      membershipIDs: user.membershipIDs,
      vouchers: user.vouchers,
      lastLogin: user.lastLogin
    }
  });
});

// Delete user route
router.delete('/delete/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user details route
router.put('/users/:userId', async (req, res) => {
  try {
    const { email, firstName, lastName, password, points, mobileNumber, tier, membershipIDs, vouchers } = req.body;
    const updates = {};

    if (email) updates.email = email;
    if (firstName) updates.firstName = encrypt(firstName);
    if (lastName) updates.lastName = encrypt(lastName);
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (points !== undefined) updates.points = points;
    if (mobileNumber !== undefined) updates.mobileNumber = mobileNumber;
    if (tier !== undefined) updates.tier = tier;
    if (membershipIDs !== undefined) updates.membershipIDs = membershipIDs;
    if (vouchers !== undefined) updates.vouchers = vouchers;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch user details
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Decrypt first name and last name before sending response
    const decryptedFirstName = decrypt(user.firstName);
    const decryptedLastName = decrypt(user.lastName);

    res.json({
      ...user._doc,
      firstName: decryptedFirstName,
      lastName: decryptedLastName
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    const decryptedUsers = users.map(user => ({
      ...user._doc,
      firstName: decrypt(user.firstName),
      lastName: decrypt(user.lastName)
    }));
    res.json({ users: decryptedUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

router.post('/update_points/:userId', async (req, res) => {
  const { userId } = req.params;
  const { tierPoints = 0, bankPoints = 0, voucherInjections = 0 } = req.body.newPoints || {};

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.tier += tierPoints;
    user.points += bankPoints;
    user.vouchers.push(...Array(voucherInjections).fill('Voucher'));

    await user.save();

    res.json({ user });
  } catch (error) {
    console.error('Error updating user points:', error);
    res.status(500).json({ message: 'Error updating user points', error });
  }
});

module.exports = router;
