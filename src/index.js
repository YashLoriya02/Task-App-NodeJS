const express = require('express')
const userRouter = require('./Routers/userRouter.js')
const taskRouter = require('./Routers/taskRouter.js')
const User = require('./models/user.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log("Server Running on Port " + port)
})


const main = async () => {
    const user = await User.findById("64fb4211393a5b4bfc01451c").populate('tasks')
    console.log(user.tasks)
}

// main()