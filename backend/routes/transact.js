const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DeleteRequest = require('../models/DeleteRequest');

router.get('/points/:userId', async (req, res) => {
    try{
        const {userId} = req.params;

        // find user by their id
        const user = await User.findById(userId);
        console.log(user)
        // if user not found
        if (!user) {
            console.log('user not found')
            return res.status(404).json({message: 'User not found'})
        }
        // response
        res.json({ points: user.points });
    } catch (error) {
        console.error('Error fetching user points:', error);
        res.status(500).json({message: 'Server error'});
    }
  });

router.post('/update_points/:userId', async (req, res) => {
    try{
        const {userId} = req.params;
        const {newPoints} = req.body;

        // validate input
        if (!userId || newPoints == undefined) {
            return res.status(400).json({ message: 'UserId and newPoints required'});
        }

        if (typeof newPoints !== 'number' || newPoints < 0) {
            return res.status(400).json({ message: 'Invalid points value'});
        }

        // find user by their id
        const user = await User.findByIdAndUpdate(
            userId,
            {points: newPoints},
            {new: true}
        );

        // if user not found
        if (!user) {
            console.log('user not found')
            return res.status(404).json({message: 'User not found'})
        }
        // response
        res.json({ message: 'Points updated successfully', user });
    } catch (error) {
        console.error('Error fetching user points:', error);
        res.status(500).json({message: 'Server error'});
    }
  });

router.get('/obtain_record/pending_all', async (req, res) => {
  try {
    // Your logic to fetch all pending transactions
    const pendingTransactions = await Transaction.find({ status: 'Pending' });
    res.json(pendingTransactions);
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/obtain_record/processed_all', async (req, res) => {
  try {
    // Your logic to fetch all processed transactions
    const processedTransactions = await Transaction.find({ status: 'Processed' });
    res.json(processedTransactions);
  } catch (error) {
    console.error('Error fetching processed transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/obtain_record/delete_requests_all', async (req, res) => {
    try {
      // Your logic to fetch all delete requests
      const deleteRequests = await Transaction.find({ status: 'DeleteRequest' });
      res.json(deleteRequests);
    } catch (error) {
      console.error('Error fetching delete requests:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/submit_delete_request', async (req, res) => {
    const { transactionIds, userId } = req.body;
  
    try {
      const newRequest = new DeleteRequest({
        transactionIds,
        userId,
        request_date: new Date()
      });
  
      await newRequest.save();
      res.json({ message: 'Delete request submitted successfully' });
    } catch (error) {
      console.error('Error submitting delete request:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

router.post('/update_tier/:userId', async (req, res) => {
  const tiers = [
    'Bronze',
    'Silver',
    'Gold',
    'Platinum',
    'Emerald',
    'Diamond',
    'Conqueror',
    'Vanguard',
    'Titan'
  ];
  
  try {
    const { userId } = req.params;
    const { newTier } = req.body;

    // Validate input
    if (!userId || newTier === undefined) {
      return res.status(400).json({ message: 'UserId and newTier are required' });
    }

    if (typeof newTier !== 'number' || newTier < 0 || newTier >= tiers.length) {
      return res.status(400).json({ message: 'Invalid tier value' });
    }

    // Find user by ID and update tier
    const user = await User.findByIdAndUpdate(
      userId,
      { tier: newTier },
      { new: true }
    );

    // If user not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the updated user
    res.json({ message: 'Tier updated successfully', user });
  } catch (error) {
    console.error('Error updating user tier:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router