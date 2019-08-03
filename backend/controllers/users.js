
const User = require('../models/User');


module.exports.allUsers = async (req, res) => {
    const users = await User.find();
    if(users) {
        res.status(200).json({
            users: users
        })
    } else {
        res.status(400).json({
            message: 'users not found'
        })
    }
}