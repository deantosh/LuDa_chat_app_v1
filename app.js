const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
  methods: ['GET', 'POST', 'OPTIONS'], // Allow the necessary HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

app.use(express.json());
app.use(router);
app.use(cookieParser());
app.options('*', cors());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
