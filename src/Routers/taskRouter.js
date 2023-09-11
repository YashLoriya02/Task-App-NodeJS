const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const taskApp = new express.Router()

// Creating Task

taskApp.post('/tasks', auth ,async (req, res) => {
    const task = new Task({...req.body, owner : req.user._id})

    try {
        const createdtask = await task.save()
        res.status(201).send(createdtask)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

// Reading Tasks

taskApp.get('/tasks', auth , async (req, res) => {
    try {
        const tasks = await Task.find({owner : req.user._id})
        if (!tasks) {
            return res.send({error: "No Tasks Found."})
        }
        res.send(tasks)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Reading Singular Task by ID

taskApp.get('/tasks/:id', auth , async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id , owner : req.user._id })
            if (!task) {
                return res.status(404).send({error : "Task Not Found"})
            }
            res.send(task)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

// Updating Tasks

taskApp.patch('/tasks/:id' , auth , async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["desc" , "completed"]
    const isValidOperation = updates.every( (update) => allowedUpdates.includes(update) )

    if (!isValidOperation) {
        return res.status(404).send({error : "Invalid Input"})
    }
    try {
        const task = await Task.findById({ _id: req.params.id , owner: req.user._id})

        if (!task) {
            return res.status(404).send("Task Not Found")
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(201).send(task)
    }
    catch(error) {
        res.status(500).send(error)
    }
})

// Deleting Tasks 

taskApp.delete('/tasks/:id' , auth , async (req , res) => {
    try {
        const task = await Task.findByIdAndDelete({ _id : req.params.id , owner : req.user._id})

        if(!task){
            return res.status(404).send({error : "Task Not Found"})
        }
        res.status(201).send({message : "Task Deleted Successfully"})
    }
    catch(error) {
        res.status(500).send()
    }
})


module.exports = taskApp