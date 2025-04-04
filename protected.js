import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!`, userId: req.user.id });
});

app.listen(4000, () => {
  console.log('Protected route server running on http://localhost:4000');
});
