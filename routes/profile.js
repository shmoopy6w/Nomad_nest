const express = require('express');
const router = express.Router();
const {isLoggedIn} = require("../middleware.js");
const User = require('../models/user.js');


// Show current user's profile
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const profile = await User.findById(req.user._id);
    res.redirect(`/profile/${profile._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Show profile
router.get('/:id', isLoggedIn , async (req, res) => {
  try {
    const profile = await User.findById(req.params.id);
    res.render('./profile/profile', { profile });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Edit profile form
router.get('/edit/:id', isLoggedIn , async (req, res) => {
  try {
    const profile = await User.findById(req.params.id);
    res.render('./profile/editprofile', { profile });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update profile
router.post('/edit/:id', isLoggedIn ,  async (req, res) => {
  try {
    const { username , email , password } = req.body;
    const profile = await User.findByIdAndUpdate(req.params.id, { username , email , password }, { new: true });

    res.redirect(`/profile/${req.params.id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/password/:id', isLoggedIn ,  async (req, res) => {
    try {
        res.render('./profile/password');
      } catch (err) {
        res.status(500).send(err.message);
      }
});

router.post('/password/:id', isLoggedIn ,  async (req, res) => {
    try {
      } catch (err) {
        res.status(500).send(err.message);
      }
});

module.exports = router;