const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");



dotenv.config();

//REGISTER
router.post("/register", async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
      });

      await newUser.save();
      const saved_user = await User.findOne({
        username: req.body.username 
      })

      // generate jwt
      const token = jwt.sign({ userID:saved_user._id },
        process.env.JWT_S_K, { expiresIn: '5d'}
      )
  
      const user = await newUser.save();
      res.status(201).send({"status": "success","message": "success", "token": token})
      // res.status(200).json(user, {"token":token});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //LOGIN
  router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      !user && res.status(400).json("Wrong credentials!");
  
      const validated = await bcrypt.compare(req.body.password, user.password);
      !validated && res.status(400).json("Wrong credentials!");

            // generate jwt
            const token = jwt.sign({ userID:user._id },
              process.env.JWT_S_K, { expiresIn: '5d'}
            )
  
      const { password, ...others } = user._doc;
      res.status(200).send({"status": "success","message": "success", "token": token})
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;