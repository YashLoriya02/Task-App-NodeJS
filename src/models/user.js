const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        unique: true,
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is Invalid")
            }
        }
    },

    age: {
        type: Number,
        // required: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Age Must be Greater than 0.")
            }
        }
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error("Enter Password of Length more than 6 Characters.")
            }
            if (value === "password") {
                throw new Error("Invalid Password Input.")
            }
        },
        trim: true,
    }
})

userSchema.methods.toJSON = function () {
    const user = this

    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.methods.generateAuthTokens = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, "ThisIsNodeCourse")

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (mail, pass) => {
    const user = await User.findOne({ email: mail })

    if (!user) {
        throw new Error("Unable to Login!")
    }

    const isMatch = await bcrypt.compare(pass, user.password)

    if (!isMatch) {
        throw new Error("Unable to Login!")
    }
    return user
}

userSchema.virtual('tasks' , {
    ref : 'Task',
    localField : '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User