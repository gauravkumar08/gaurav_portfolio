const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/Messages';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.log('MongoDB connection error: ', err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newContactMessage = new Contact({ name, email, subject, message });
    await newContactMessage.save();
    return res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ message: 'Failed to send your message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
