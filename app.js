const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'OPTIONS'], // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true,
  secure: false,
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use((req, res, next) => {
  console.log('Request Origin:', req.get('Origin'));
  next();
});
// app.options('*', cors()); // Remove to avoid overriding your specific CORS configuration

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
