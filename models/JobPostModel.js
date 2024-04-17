const mongoose = require('mongoose');

// NOTE: this schema is highly unsecure
// - Separate the user data and user profile
// -- User Data will contain the login credentials (Encrypted)
// -- User Profile will contain all the necessary data of the profile
// -- User Profile ofcourse is linked with User Data
const schema = new mongoose.Schema({
    poster_id: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    rewards: {
        type: String,
        required: true
    }
});

// Define model
const WorkModel = mongoose.model('posts', schema);
module.exports = WorkModel;