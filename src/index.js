const express = require('express')
const db = require('./db/mongoose')
const userRouters = require('./routes/user')
const taskRouters = require('./routes/task')

const app = express()

app.use(express.json())

const port = process.env.PORT

app.use(userRouters)
app.use(taskRouters)


app.listen(port, ()=>{
    console.log('App is running on '+ port)
})
