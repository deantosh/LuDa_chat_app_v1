const express = require('express');
const router = require('./routes/index');

const app = express();

app.use(express.json());
app.use(router);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
