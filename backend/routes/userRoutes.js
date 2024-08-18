const express = require('express')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/AuthMiddleware')

const router = express.Router()

const avatar = [
    "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833554.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-93283.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100226.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid",
    "https://www.freepik.com/free-psd/3d-illustration-with-online-avatar_171612680.htm#query=avatar&position=26&from_view=keyword&track=ais_hybrid&uuid=9b791d48-7fe7-41a4-9713-a51d072aa1c9",
    "https://img.freepik.com/premium-photo/isolated-businessman-character-avatar-professional-branding_1029469-183667.jpg?size=626&ext=jpg&ga=GA1.1.1013454858.1723968449&semt=ais_hybrid"
]


router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.send(users);
    } catch (error) {
      console.error(error);
    }
  });

router.post("/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const randomAvatar = avatar[Math.floor(Math.random() * avatar.length)];
  
      if (!email || !password || !name) {
        return res.status(400).send({
          success: false,
          message: "Please provide all required fields.",
        });
      }
  
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).send({
          success: false,
          message: "The user already exists!",
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      
      const newUser = new User({
        email,
        password: hashPwd,
        name, 
        avatar: randomAvatar
      });
      
      await newUser.save();
  
      res.status(201).send({
        success: true,
        message: "You've successfully signed up, please login now!",
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }); 
  
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        res.send({
          success: false,
          message: "User does not exist. Please register",
        });
      }
  
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
  
      if (!validPassword) {
        res.send({
          success: false,
          message: "Sorry, invalid password entered!",
        });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.secret_key, {
        expiresIn: "1d",
      });
  
      res.send({
        success: true,
        message: "You've successfully logged in!",
        token: token,
        userId: user._id
      });
    } catch (error) {
      console.error(error);
    }
  });

  router.post('/logout', (req, res) => {
    res.send({
      success: true,
      message: 'You have successfully logged out!',
    });
});

  router.get('/:userId', authMiddleware, async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  

module.exports = router;