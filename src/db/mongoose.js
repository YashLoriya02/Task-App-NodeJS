const mongoose = require('mongoose');
// const User = require('../models/user');
const Task = require('../models/task');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

Task.findByIdAndDelete("64f5d757ddcdad6a3f952cb6").then( (task) => {
    console.log(task)
    return Task.countDocuments({ completed: false })
}).then( (result) => {
    console.log(result)
}).catch((error) => {
    console.log(error)
})
