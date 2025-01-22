const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const cors = require('cors');
const http = require('http');
const { setupSocket } = require('./socket');

const app = express();
const server = http.createServer(app);
setupSocket(server);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'], // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true,
  secure: false,
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);

// Middleware to log origin of requests
app.use((req, res, next) => {
  console.log('Request Origin:', req.get('Origin'));
  next();
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
