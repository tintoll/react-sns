const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('init')
});


app.listen(8080, () => {
  console.log('server is running on http://localhost:8080');
});