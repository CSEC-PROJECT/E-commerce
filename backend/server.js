const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working ✅' });
}); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});