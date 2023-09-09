const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req , res , next) => {
    try {
        const token = req.header("Authorization").replace('Bearer ' , '')
        const decoded = jwt.verify(token , "ThisIsNodeCourse")
        const user = await User.findOne({ _id : decoded._id , "tokens.token" : token })
        if (!user) {
            return res.status(500).send({error : "No User Found."})
        }
        req.token = token
        req.user = user
        next()
    }
    catch (e) {
        res.status(401).send({error : "Please Authenticate."})
        console.log(e)
    }
}

module.exports = auth