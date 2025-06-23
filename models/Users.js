 const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is Required']
    },
    email: {
        type: String,
        required: [true, 'Email is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profileImage: {
    	type: String,
    	default: 'https://static-00.iconduck.com/assets.00/profile-circle-icon-512x512-dt9lf8um.png'
    }
});

module.exports = mongoose.model('User', userSchema);