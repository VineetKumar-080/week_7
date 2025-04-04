import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const app = express();
app.use(express.json());

const users = [];

// Call this function once to create and add a user with hashed password
const createInitialUser = async () => {
  const email = 'user@example.com';
  const plainPassword = 'password123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  users.push({ id: 1, email, password: hashedPassword });
};
createInitialUser();

const generateToken = (userId, email) => {
  const payload = { id: userId, email };
  const secret = 'your_jwt_secret';
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secret, options);
};

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user.id, user.email);
  res.json({ message: 'Login successful', token });
});

app.listen(3000, () => {
  console.log('Login server running on http://localhost:3000');
});
