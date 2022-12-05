const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

const db = mongoose.Connection
