require('dotenv').config();

// Require the Express module
const express = require('express');
const mongo = require('./mongo');
const UserModel = require('./models/UserModel');

// Create an Express application
const app = express();

app.use(express.json());

app.get('/users/get', async (req, res) => {
  try {
    const data = await UserModel.find();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/users/add', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ 'contactInfo.email': req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const newUser = new UserModel({
      name: req.body.name,
      address: req.body.address,
      contactInfo: {
        mobile: req.body.mobile,
        email: req.body.email,
        telephone: req.body.telephone,
      },
      password: req.body.password,
    });

    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
