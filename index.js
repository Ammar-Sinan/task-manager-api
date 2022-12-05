const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
require('./db/mongoose')
const app = express()
const port = process.env.PORT

// parse JSON objects 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})


