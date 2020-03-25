const express = require('express')
const tasks = require('../module/task')
const Auth = require('../middleware/auth')
const router = new express.Router()

router.get('/tasks',Auth, async(req,res) => {
    const match = {}

    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e){
        res.send(e)
    }
})

router.get('/tasks/:id',Auth, async(req,res)=>{
    const _id = req.params.id

    try {
        const Task = await tasks.findOne({_id,owner:req.user._id})
        if(!Task) {
            return res.status(404).send()
        }
        res.send(Task)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/tasks',Auth, async(req, res) => {
    const Task = new tasks({
        ...req.body,
        owner: req.user._id
    })
    try{
        await Task.save()
        res.status(201).send(Task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.patch('/tasks/:id',Auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowUpdate = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowUpdate.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({'error':'Invalid update'})
    }
    try {
        const task = await tasks.findOne({_id: req.params.id, owner:req.user._id})
        if(!task) {
            res.status(404).send()
        }
        updates.forEach((update)=>task[update]= req.body[update])
        await task.save()
        res.send(task)
    } catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',Auth,async(req,res)=>{
    try{
        const task = await tasks.findOneAndDelete({_id:req.params.id, owner: req.user._id})
        if(!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router