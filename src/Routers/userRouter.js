const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const multer = require('multer')

const userApp = new express.Router()

// Sign-Up User

userApp.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthTokens()
        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Sign-In User

userApp.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthTokens()
        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send()
        console.log(e)
    }
})

// Getting Logged-in User's Profile Detail

userApp.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Updating User

userApp.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "age", "email", "password"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({ error: "Invalid Input" })
    }
    try {
        const user = await User.findById(req.user._id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send({ message: "Data Updated Successfully" })
    }
    catch (error) {
        res.status(500).send(error)
        console.log(error)
    }
})

// Logging Out User

userApp.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({ message: "Logged Out Successfully." })
    } catch (e) {
        res.status(500).send()
    }
})

// Logging Out All instances of that User

userApp.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: "Logged Out All Users." })
    } catch (e) {
        res.status(500).send()
    }
})

// Deleting User

userApp.delete('/users/me', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id)
        await Task.deleteMany({ owner: req.user._id })
        res.status(201).send({ message: "User Deleted Successfully" })
    }
    catch (error) {
        res.status(500).send()
    }
})

// Adding Profile Picture

const upload = multer({
    fileFilter(req, file, callback) {
        if (!file.originalname.endsWith('.jpg')) {
            return callback(new Error("Please Upload Valid Image Extension."))
        }
        callback(undefined, true)
    }
})

userApp.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    // After these we can save it to Cloudinary or similar kinds of Cloud Database to access profile pic via URL.
    res.send({ message: "Profile Picture Saved Successfully" })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Deleting Profile Picture

userApp.delete('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({ message: "Profile Picture Deleted." })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

module.exports = userApp