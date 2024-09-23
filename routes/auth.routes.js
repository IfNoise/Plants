const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
router.post(
  "/register",
  [
    check("username", "User name  too short").isLength({ min: 6 }),
    check("password", "Password too short").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Data incorrect",
        });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        res.status(400).json({ message: "Polzovatel s imenem  suschestvuet" });
      }
      const hashedPassword = await bcrypt.hash(password, 14);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "User is registred" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/login",
  [
    check("username", "Введите корректный user name").exists(),
    check("password", "Введите пароль").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Data incorrect",
        });
      }
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "User not find" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Passwords dont match" });
      }
      const token = jwt.sign({ userId: user.id }, config.get("jwtSecret"), {
        expiresIn: "72h",
      });
      res.json({ token, user: user.id });
    } catch (error) {
      return res.status(500).json({ message: "Something wants wrong with auth middware" });
    }
  }
);
router.post("logout", async (req, res) => {
  try {
    
    res.json({ message: "User is logout" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
