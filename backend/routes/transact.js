const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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


module.exports = router