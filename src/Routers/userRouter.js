const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const userApp = new express.Router()

// Sign-Up Users 

userApp.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthTokens()
        res.status(201).send({user , token})
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Sign-In Users

userApp.post('/users/login' , async (req , res) => {
    try {
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthTokens()
        res.status(201).send({user , token})
    }
    catch(e) {
        res.status(400).send()
        console.log(e)
    }
})

// Reading Users

userApp.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
})

// Updating Users

userApp.patch('/users/me' , auth , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name" , "age" , "email" , "password"]
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update) )

    if (!isValidOperation) {
        return res.status(404).send({error : "Invalid Input"})
    }
    try {
        const user = await User.findById(req.user._id)
        updates.forEach((update) => user[update] = req.body[update] )
        await user.save()
        if (!user) {
            return res.status(404).send()
        }
        res.status(201).send({message : "Data Updated Successfully"})
    }
    catch(error) {
        res.status(500).send(error)
        console.log(error)
    }
})

// Logging Out Single User

userApp.post('/users/logout' , auth , async (req , res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({message : "Logged Out Successfully."})
    } catch (e) {
        res.status(500).send()
    }
})

// Logging Out All Logged-in User

userApp.post('/users/logout/all' , auth , async (req , res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({message : "Logged Out All Users."})
    } catch (e) {
        res.status(500).send()
    }
})

// Deleting Users

userApp.delete('/users/me' , auth , async (req , res) => {
    try {
        await User.findByIdAndDelete(req.user._id)
        await Task.deleteMany({ owner : req.user._id })
        res.status(201).send({message : "User Deleted Successfully"})
    }
    catch(error) {
        res.status(500).send()
    }
})


module.exports = userApp