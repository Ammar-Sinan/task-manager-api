const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Task = require('../models/task')
const User = require('../models/user')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    // "..." will copy all the properties from body to the object that was passed in

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }

})

// GET /tasks?completed=true - Filtering
// GET /tasks?limit=10&skip=20 - Pagination
// GEt /tasks?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        // taking the first part of the parts array and sitting it as a property on sort 
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id, completed: true })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    // Object.keys converts req.body from an object to array with properties 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('Task not found!')
        }

        updates.forEach((update) => task[update] = req.body[update])
        //await req.user.save() // Dunno why i was trying to save the user - make sure why it was added
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const deletedTask = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!deletedTask) {
            return res.status(404).send()
        }

        res.send(deletedTask)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router