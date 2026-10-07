const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Store = require('../data/store');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'supersecretportfoliojwtkey_2026_dev';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = Store.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const existing = Store.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = Store.createUser({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    const token = generateToken(newUser._id);
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = Store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
