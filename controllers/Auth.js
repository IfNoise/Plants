import User from "../models/User";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";



const Register= async (req, res,next) => {
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
    next(error);
  }
}

const Login= async (req, res,next) => {
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
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });
    res.json({ token, user: user.id });
  } catch (error) {
    return res.status(500).json({ message: "Something wants wrong with auth middware" });
  }
}


const RefreshToken= async (req, res,next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(403).json({ message: "User not authorized" });
    }
    const user = await User.findOne({ refreshToken });
  
  }catch (error) {
    return res.status(500).json({ message: "Something wants wrong with auth middware" });
  }

const Me = async (req, res,next) => {
  try {
    const user=await User.findById(req.user)
    res.json(user)
    
    }
  catch (error) {
    next(error)
  }
}

export default {Register,Login,Logout,RefreshToken,Me}