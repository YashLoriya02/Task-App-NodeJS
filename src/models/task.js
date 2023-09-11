const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const Task = mongoose.model('Task' , {
    desc : {
        type : String,
        required : true,
    } , 
    completed : {
        type : Boolean,
        default : false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
})

module.exports = Task