const mongoose = require('mongoose')
const connectDB = async (callback) => {
    try {
        const conn = await mongoose
            .connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {
                console.log(`MongoDB Connected`)
                callback()
            })
            .catch((err) => console.log(err))
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
module.exports = connectDB