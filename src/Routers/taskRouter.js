const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const taskApp = new express.Router()

// Creating Task

taskApp.post('/tasks', auth ,async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })

    try {
        const createdtask = await task.save()
            res.status(201).send(createdtask)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Reading Tasks

taskApp.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
            res.send(tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Reading Singular Task by ID

taskApp.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findById({ _id })
            if (!task) {
                return res.status(404).send()
            }
            res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Updating Tasks

taskApp.patch('/tasks/:id' , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["desc" , "completed"]
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update) )

    if (!isValidOperation) {
        return res.status(404).send({error : "Invalid Input"})
    }
    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true})
        if (!task) {
            return res.status(404).send()
        }
        res.status(201).send(task)
    }
    catch(error) {
        res.status(500).send(error)
        console.log(error)
    }
})

// Deleting Tasks 

taskApp.delete('/tasks/:id' , async (req , res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task){
            return res.status(404).send({error : "Id Not Found"})
        }
        res.status(201).send({message : "Task Deleted Successfully"})
    }
    catch(error) {
        res.status(500).send()
    }
})


module.exports = taskApp