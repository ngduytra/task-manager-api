const mongoose= require('mongoose')
const bcypt = require('bcryptjs')

const taskSchema = new mongoose.Schema(
    {
        description: {  
            type:String,
            trim:true,
            required: true,
    
        },  
        completed: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }, {
        timestamps:true
    }
)

/*taskSchema.pre('save', async function(next) {
    const task = this

    if(task.isModified('description')) {
        task.description = await bcypt.hash(task.description,8)
    }
    next()
})*/

const tasks = mongoose.model('tasks',taskSchema)

module.exports = tasks