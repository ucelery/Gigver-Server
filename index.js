require('dotenv').config();

// Require the Express module
const express = require('express');
const mongo = require('./mongo');
const UserModel = require('./models/UserModel');
const WorkModel = require('./models/JobPostModel');

const { hasUserRated } = require('./utils');

// Create an Express application
const app = express();

app.use(express.json());

// Users
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

// Posts
app.get('/posts/get', async (req, res) => {
  try {
    const data = await WorkModel.find();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/posts/add', async (req, res) => {
  try {
    // Check if the poster is a valid id
    const existingUser = await UserModel.findById(req.body.user_id);
    if (!existingUser) {
      return res.status(400).json({ error: 'User by passed ID does not exist!' });
    }

    const newWorkModel = new WorkModel({
      poster_id: req.body.user_id,
      subject: req.body.subject,
      description: req.body.description,
      rewards: req.body.rewards
    });

    await newWorkModel.save();

    res.status(201).json({ message: 'Post added successfully', post: newWorkModel });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Rating Functionality
// Sample URL http://localhost:3000/rating/add/?<insert-id-here>
app.post('/users/rating/add', async (req, res) => {
  try {
    // Check if the ids of the rated and the rater are valid
    const existingRater = await UserModel.findById(req.query.raterId);
    const existingRated = await UserModel.findById(req.query.id);

    if (!existingRated || !existingRater) {
      return res.status(400).json({ error: 'Either rater or rated ID does not exist!' });
    }

    if (await hasUserRated(req.query.id, req.query.raterId))
      return res.status(400).json({ error: 'User has already rated this user!' });

    const result = await UserModel.findByIdAndUpdate(req.query.id, {
      $push: {
        rating: {
          raterId: req.query.id,
          rate: req.body.rating
        }
      }
    }, { new: true }).exec();

    res.status(201).json({ message: 'Rate added successfully', post: result });
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
