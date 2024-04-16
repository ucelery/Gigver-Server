const mongoose = require('mongoose');

// Connection URI
const uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster.tse6s1g.mongodb.net/gigver?retryWrites=true&w=majority&appName=Cluster`;

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Error connecting to MongoDB:', error));

module.exports = mongoose;