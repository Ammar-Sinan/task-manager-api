const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
require('./db/mongoose')
const app = express()

// parse JSON objects 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app

