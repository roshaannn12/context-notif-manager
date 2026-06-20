import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../models/Auth.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required!" });
    }

    // Check if user exists
    if (email) {
      const emailExists = await Auth.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already registered!" });
      }
    }

    if (phone) {
      const phoneExists = await Auth.findOne({ phone });
      if (phoneExists) {
        return res
          .status(400)
          .json({ message: "Phone number already registered!" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Auth.create({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      currentContext: user.currentContext,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email or phone is required!" });
    }

    // Check if identifier is email or phone
    const isEmail = identifier.includes("@");
    const user = isEmail
      ? await Auth.findOne({ email: identifier })
      : await Auth.findOne({ phone: identifier });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      currentContext: user.currentContext,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await Auth.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update context
export const updateContext = async (req, res) => {
  try {
    const { context } = req.body;
    const user = await Auth.findByIdAndUpdate(
      req.user.id,
      { currentContext: context },
      { returnDocument: "after" },
    ).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
