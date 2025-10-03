
const express = require('express');
const cors = require('cors');
const dataRouter = require('./routes/data');

const app = express();
const port = 3001;

app.use(cors());
app.use('/api/data', dataRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
