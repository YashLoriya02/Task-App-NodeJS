const Task = require("./src/models/task")
// const User = require("./src/models/user")

// const asyncfunc = async (id , age) => {
//     const user = await User.findByIdAndUpdate(id,{ age : age })
//     const count = await User.countDocuments({ age })
//     // console.log(user)
//     return count
// }
// asyncfunc( "64f717134b15c520ad84bc57" , 23)


const asyncfunc = async (id) => {
    await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed : false })
    return count
}

asyncfunc("64f5f8c08db90b1af05e4277").then( (count) => {
    console.log(`${count} task is incompleted.`)
}).catch((e) => {
    console.log(e)
})