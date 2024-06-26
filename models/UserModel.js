const mongoose = require('mongoose');

// NOTE: this schema is highly unsecure
// - Separate the user data and user profile
// -- User Data will contain the login credentials (Encrypted)
// -- User Profile will contain all the necessary data of the profile
// -- User Profile ofcourse is linked with User Data
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactInfo: {
        mobile: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        telephone: {
            type: String,
            default: "",
        }
    },
    rating: {
        type: [
            {
                raterId: {
                    type: String,
                    required: true,
                },
                rate: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5,
                },
            }
        ],
        default: [],
    },
});

// Define model
const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;