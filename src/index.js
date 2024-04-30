const express = require('express')
const userRouter = require('./Routers/userRouter.js')
const taskRouter = require('./Routers/taskRouter.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})
