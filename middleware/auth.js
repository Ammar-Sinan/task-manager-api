const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // second argument in findOne() is to check if the token is still exist in the tokens array in the user document

        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        // Give the route handler access to the user we fetched. already fetchd to save resources & time
        // req.user can be accessed from the API
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please Authenticate.' })
    }
}

module.exports = auth